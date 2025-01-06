import { NextRequest, NextResponse } from "next/server";

export default function Middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/expense")
  ) {
    const group_id = request.cookies.has("group_id");
    const user_id = request.cookies.has("user_id");

    if (!group_id || !user_id) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("group_id");
      response.cookies.delete("user_id");
      return response;
    }
  }

  if (
    request.nextUrl.pathname.startsWith("/group") ||
    request.nextUrl.pathname.startsWith("/invite")
  ) {
    const group_id = request.cookies.has("group_id");
    const user_id = request.cookies.has("user_id");
    if (group_id || user_id) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [{ type: "header", key: "x-present" }],
      missing: [{ type: "header", key: "x-missing", value: "prefetch" }],
    },
  ],
};
