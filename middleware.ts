import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const middleware = (req: NextRequest) => {
  const role = req.cookies.get('role')?.value;

  if (role === 'User' || !role) {
    return NextResponse.redirect(new URL('/', req.url));
  }
};

export const config = {
  matcher: ['/admin/:path*', '/preview'],
};
