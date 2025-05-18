import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Public routes accessible without login
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook/clerk',
  '/api/webhook/stripe',
  '/api/test',
  '/api/uploadthing',
  '/api/clerk/webhook',
]);

// Admin routes requiring admin role
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const authObj = await auth();

  const url = new URL(req.url);

  // Allow public routes without auth
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect admin routes with admin role
  if (isAdminRoute(req)) {
    const role = authObj.sessionClaims?.metadata?.role;
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  // For other routes (non-public, non-admin) require authentication
  if (!authObj.userId) {
    // redirect to sign-in if not authenticated
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
