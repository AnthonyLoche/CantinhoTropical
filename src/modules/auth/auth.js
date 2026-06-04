import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const admin = await prisma.admin.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!admin) {
          return null;
        }

        const passwordValid = await bcrypt.compare(
          credentials.password,
          admin.password
        );

        if (!passwordValid) {
          return null;
        }

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});