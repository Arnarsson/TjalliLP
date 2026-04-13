import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const CHARSET = "abcdefghjkmnpqrstuvwxyz23456789";

function generateCode(len = 5) {
  let code = "";
  for (let i = 0; i < len; i++) {
    code += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return code;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limit by IP
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";
  const rlKey = `ratelimit:${ip}`;
  const rlCount = await redis.incr(rlKey);
  if (rlCount === 1) await redis.expire(rlKey, 60);
  if (rlCount > 5) {
    return res.status(429).json({ error: "Too many requests. Please wait." });
  }

  const { name, email, referralCode } = req.body || {};

  const fallbackName = (email && typeof email === "string") ? email.split("@")[0] : "anonymous";
  const cleanName = (name && typeof name === "string" && name.trim()) ? name.trim() : fallbackName;
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: "Valid email is required." });
  }

  const cleanEmail = email.toLowerCase().trim();

  // Idempotent: return existing reservation
  const existing = await redis.get(`reservation:${cleanEmail}`);
  if (existing) {
    const total = (await redis.get("counter")) || 0;
    return res.status(200).json({
      position: existing.position,
      code: existing.code,
      totalReservations: total,
      existing: true,
    });
  }

  // Create new reservation
  const position = await redis.incr("counter");

  // Generate unique code
  let code;
  for (let attempt = 0; attempt < 10; attempt++) {
    code = generateCode();
    const taken = await redis.get(`code:${code}`);
    if (!taken) break;
  }

  const reservation = {
    name: cleanName,
    email: cleanEmail,
    code,
    position,
    createdAt: new Date().toISOString(),
  };

  // If referred, record it
  if (referralCode && typeof referralCode === "string") {
    const referrerEmail = await redis.get(`code:${referralCode}`);
    if (referrerEmail) {
      reservation.referredBy = referralCode;
      await redis.incr(`referrals:${referralCode}`);
    }
  }

  // Store reservation and code lookup
  await redis.set(`reservation:${cleanEmail}`, reservation);
  await redis.set(`code:${code}`, cleanEmail);

  const total = (await redis.get("counter")) || position;

  return res.status(200).json({
    position,
    code,
    totalReservations: total,
    existing: false,
  });
}
