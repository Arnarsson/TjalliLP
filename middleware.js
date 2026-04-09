export default function middleware(request) {
  const url = new URL(request.url);
  if (url.hostname === 'theagent.hekla.cc') {
    return fetch(new URL('/theagent.html', request.url));
  }
}

export const config = {
  matcher: '/',
};
