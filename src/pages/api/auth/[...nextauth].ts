import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email";
import { prisma } from "~/server/db";
import { ClientType, EmailClientType } from "~/types/ClientType";
import { env } from "process";
export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }as ClientType),
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
    }as EmailClientType),
    // ...add more providers here
  ],
}
export default NextAuth(authOptions)