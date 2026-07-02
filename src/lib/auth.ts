import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findCustomerByEmail, findCustomerById } from "@/lib/mock-db";
import type { TCustomerPublic } from "@/types";
import { checkLoginRateLimit } from "@/lib/rate-limit";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const allowed = await checkLoginRateLimit(credentials.email);
        if (!allowed) return null;

        const customer = await findCustomerByEmail(credentials.email);
        if (!customer) return null;

        const valid = await bcrypt.compare(credentials.password, customer.passwordHash);
        if (!valid) return null;

        const { passwordHash: _passwordHash, ...safeCustomer } = customer;
        return safeCustomer;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.customer = user as TCustomerPublic;
        return token;
      }
      if (token.customer?.id) {
        const fresh = await findCustomerById(token.customer.id);
        if (!fresh) return { ...token, customer: undefined as unknown as TCustomerPublic };
        const { passwordHash: _passwordHash, ...safeCustomer } = fresh;
        token.customer = safeCustomer;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.customer) session.user = token.customer;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
