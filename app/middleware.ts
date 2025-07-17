import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (pathname === '/auth/signin' || pathname === '/auth/error') {
    return NextResponse.next();
  }

  // Allow the API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow the dashboard if they have a token
  if (pathname === '/dashboard' && token) {
    return NextResponse.next();
  }

  // Redirect them to signin if they don't have token AND are trying to access a protected route
  if (!token && pathname === '/dashboard') {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/signin';
    url.searchParams.set('callbackUrl', '/dashboard');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard']
};
