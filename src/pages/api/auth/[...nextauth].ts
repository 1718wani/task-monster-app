import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import type { NextAuthOptions, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "~/server/db";
import type { ClientType, EmailClientType } from "~/types/ClientType";
import { env } from "process";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    } as ClientType),
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
    } as EmailClientType),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  
  callbacks: {
    session({ session, user }: { session: Session; user: User }) {
      session.user.userId = user.id;
      session.user.image = user.image;
      return session;
    },
    
    redirect({ baseUrl }) {
      console.log("baseUrlが呼び出されました", baseUrl)
      return baseUrl;
    },
    
  },
};
export default NextAuth(authOptions);
