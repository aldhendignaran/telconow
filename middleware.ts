import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  // /dashboard covers the root; /dashboard/:path* covers all sub-routes.
  // Both required — :path* does not match the root segment on its own.
  matcher: ["/dashboard", "/dashboard/:path*"],
};
