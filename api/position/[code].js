import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.query;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Code is required." });
  }

  const email = await redis.get(`code:${code}`);
  if (!email) {
    return res.status(404).json({ error: "Reservation not found." });
  }

  const reservation = await redis.get(`reservation:${email}`);
  if (!reservation) {
    return res.status(404).json({ error: "Reservation not found." });
  }

  const referralCount = (await redis.get(`referrals:${code}`)) || 0;
  const total = (await redis.get("counter")) || 0;
  const effectivePosition = Math.max(1, reservation.position - referralCount);

  // Tier calculation
  let tier, tierName, nextTier, referralsToNext;
  if (referralCount >= 10) {
    tier = 3;
    tierName = "Founding Member";
    nextTier = null;
    referralsToNext = 0;
  } else if (referralCount >= 5) {
    tier = 2;
    tierName = "Inner Circle";
    nextTier = "Founding Member";
    referralsToNext = 10 - referralCount;
  } else {
    tier = 1;
    tierName = "Reserved";
    nextTier = "Inner Circle";
    referralsToNext = 5 - referralCount;
  }

  return res.status(200).json({
    position: effectivePosition,
    originalPosition: reservation.position,
    referralCount,
    totalReservations: total,
    name: reservation.name,
    code: reservation.code,
    tier,
    tierName,
    nextTier,
    referralsToNext,
  });
}
