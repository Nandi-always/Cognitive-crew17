import { auth } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export const middleware = auth((_req) => {
  const isLoggedIn = !!_req.auth;

  // Redirect to login if accessing protected routes without auth
  if (!isLoggedIn && _req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', _req.url));
  }

  if (!isLoggedIn && req.nextUrl.pathname.startsWith('/workspace')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/workspace/:path*', '/api/projects/:path*'],
};
