import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const user = auth?.user;

      if (pathname.startsWith("/admin")) {
        if (pathname === "/admin/login") {
          return true;
        }

        if (!user) {
          return Response.redirect(new URL("/admin/login", request.nextUrl));
        }

        if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
          return Response.redirect(new URL("/login", request.nextUrl));
        }

        return true;
      }

      if (pathname.startsWith("/conta") || pathname.startsWith("/checkout")) {
        return Boolean(user);
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
