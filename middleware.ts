/** @format */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/terms",  
  "/privacy",
  "/tools/json(.*)"
]);

// Define protected routes that always require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)", 
  "/forum(.*)",
  // "/tools(.*)"     // Added tools route based on your original issue
]);

export default clerkMiddleware(async (auth, request) => {
  // Check if the current route is protected
  const isProtected = isProtectedRoute(request);
  const isPublic = isPublicRoute(request);

  if (isProtected || (!isPublic && !request.url.includes('_next'))) {
    // Protect all routes except public ones
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
    
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};