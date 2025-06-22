import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
interface RoleJWT {
  publicMetadata?: {
    role?: string;
  };
}
// Public routes accessible without login
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook/clerk',
  '/api/test',
  '/api/uploadthing',
  '/api/clerk/webhook',
]);

// Admin routes requiring admin role
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const authObj = await auth();

  // Allow public routes without auth
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect admin routes with admin role
  if (isAdminRoute(req)) {
    const token = await authObj.getToken({ template: 'with-role' });
    if (token) {
      const decoded = jwtDecode<RoleJWT>(token);
      const role = decoded?.publicMetadata?.role;
      if (process.env.NODE_ENV === 'development') {
      }

      if (role === 'admin') {
        return NextResponse.next();
      }
    }

    // No token or not an admin — redirect
    return NextResponse.redirect(new URL('/', req.url));
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
