// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  const refreshToken = req.cookies.get('refreshToken')?.value;

  // Public routes
  if (
    pathname.startsWith('/auth') ||
    pathname.startsWith('/product') ||
    (pathname.startsWith('/auction') && pathname !== '/auction/create')
  ) {
    return NextResponse.next();
  }

  // If protected route, but no token — redirect to login
  if (!refreshToken) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }

  // Make fetch request to your backend using the token
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_QUIC_GEAR2_API}/user/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    const { data: user } = await response.json();
    console.log("check user")
    console.log(user)

    // Check role for /admin/*
    if (pathname.startsWith('/admin') && user.role !== 'ROLE.ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Allow /auction/create for any authenticated user
    if (pathname === '/auction/create') {
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (err) {
    // If token is invalid or backend failed
    return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/auction/create',
    '/auth/:path*',
    '/product/:path*',
    '/auction/:path*',
  ],
};
