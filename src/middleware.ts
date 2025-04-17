import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

const adminRoutes = ["/studio/:path*"];
const isAdminRoute = createRouteMatcher(adminRoutes);

const protectedRoutes = ["/orders"];
const isProtectedRoute = createRouteMatcher(protectedRoutes);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const { sessionClaims, userId } = await auth();
    if (
      !userId ||
      !sessionClaims ||
      (sessionClaims.metadata as { role: string }).role !== "admin"
    ) {
      return notFound();
    }
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/studio/:path*",
  ],
};
