import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/webhook/clerk',
  '/api/test',
  '/api/webhook/stripe',
  '/api/uploadthing',
  "/api/clerk/webhook",
  "/",
  "/admin/dashboard",
  "/admin/orders",
  "/admin/users",
  "/admin/menu",
  "/admin/sales",
  "/admin/analytics",
  "/admin/analytics/:path*",
])

const middleware = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
  
  const response = NextResponse.next()
  
  if (
    req.nextUrl.pathname.startsWith('/_next/static') ||
    req.nextUrl.pathname.startsWith('/_next/image') ||
    req.nextUrl.pathname.startsWith('/favicon.ico')
  ) {
    return response
  }
  
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, svix-id, svix-timestamp, svix-signature')
  
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: response.headers
    })
  }
  
  return response
})

export default middleware

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}