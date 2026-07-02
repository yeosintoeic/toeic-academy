import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isAdmin = pathname.startsWith("/admin");
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/test") ||
    pathname.startsWith("/results") ||
    pathname.startsWith("/lectures");

  if (!token && (isAdmin || isProtected)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token) {
    const payload = await verifyToken(token);

    if (!payload && (isAdmin || isProtected)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (payload) {
      if (isAuthPage) {
        return NextResponse.redirect(
          new URL(payload.role === "ADMIN" ? "/admin" : "/dashboard", req.url)
        );
      }
      if (isAdmin && payload.role !== "ADMIN" && payload.role !== "VIEWER" && payload.role !== "MANAGER") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/test/:path*",
    "/results/:path*",
    "/lectures/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
