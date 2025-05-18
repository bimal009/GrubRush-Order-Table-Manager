import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define the structure of session claims
interface SessionClaims {
  metadata?: {
    role?: string;
  };
}

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

  // Protect admin routes requiring admin role
  if (isAdminRoute(req)) {
    const claims = authObj.sessionClaims as any;

    // Debug: log the full session claims
    console.log('Full session claims:', claims);

    // Check all possible locations for the role
    const role =
      claims?.metadata?.role ||
      claims?.privateMetadata?.role ||
      claims?.publicMetadata?.role ||
      claims?.role;

    // Debug: log the role being checked
    console.log('Role in session claims:', role);

    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  }

  // For other routes (non-public, non-admin) require authentication
  if (!authObj.userId) {
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
