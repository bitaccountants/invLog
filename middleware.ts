import { clerkMiddleware } from "@clerk/nextjs/server";

// Protecting dashboard, making other routes public
export default clerkMiddleware({
  publicRoutes: ["/", "/login", "/register"], // Public pages
  ignoredRoutes: ["/api/health"], // APIs that don’t need auth
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
