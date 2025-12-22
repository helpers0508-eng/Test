import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route mapping - redirects to HTML files via rewrites
// Actual serving is handled by Next.js rewrites in next.config.js
export function middleware(request: NextRequest) {
  // This middleware just passes through
  // HTML files are served via rewrites in next.config.js
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

