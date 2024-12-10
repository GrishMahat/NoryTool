import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/terms",
  "/privacy",
  "/tools/json(.*)",
  "/tools/uuid",
  "/tools/base64",
  "/tools/css-filt",
  "/tools/text",
]);

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/forum(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const isProtected = isProtectedRoute(request);
  const isPublic = isPublicRoute(request);

  console.log("Middleware check for URL:", request.url);

  if (isProtected || (!isPublic && !request.url.includes('_next') && !request.url.startsWith("blob:"))) {
    console.log("Authenticating request...");
    await auth.protect();
  } else {
    console.log("Request allowed without authentication.");
  }
});

export const config = {
  matcher: [
    // Target protected API and specific routes
    "/(api|dashboard|forum|tools)(.*)",
    // Exclude static files and `_next` internals
    "/(_next/static/:path*)",
    "/(_next/image/:path*)", 
    "/(favicon.ico)",
  ],
};
