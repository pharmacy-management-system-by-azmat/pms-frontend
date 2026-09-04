import { NextResponse } from "next/server";

const ACCESS_TOKEN_COOKIE = "mediflow_access_token";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hasAccessToken = Boolean(
    request.cookies.get(ACCESS_TOKEN_COOKIE)?.value,
  );

  if (pathname.startsWith("/dashboard") && !hasAccessToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/auth/login" && hasAccessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login"],
};
