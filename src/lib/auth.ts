// src/lib/auth.ts
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      // allowDangerousEmailAccountLinking: true, // optional
    }),
  ],

  // JWT strategy avoids JWE issues in dev when secrets change
  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Add id & role to JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role ?? "USER";
        const userFromDb = await db.user.findUnique({
          where: { id: user.id },
        });
        if (userFromDb) {
          token.role = userFromDb.isAdmin ? "ADMIN" : "USER";
        }
      }
      return token;
    },

    // Expose id & role on session.user
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id as string;
        // attach role (ts may require casting)
        (session.user as any).role = (token as any).role ?? "USER";
      }
d     return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
};
