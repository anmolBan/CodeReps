import NextAuth, { type AuthOptions, type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@repo/db";
import { userSignInSchema } from "@repo/zod-types";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
    };
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  pages: {
    signIn: "/signin",
  },

  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // console.log("Anmol Bansal");
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const parsedBody = userSignInSchema.safeParse(credentials);
        if (!parsedBody.success) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: parsedBody.data.email,
            },
          });

          if (!user?.hashedPassword) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            parsedBody.data.password,
            user.hashedPassword,
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name
          };
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          email: token.email,
          name: token.name,
        };
      }
      return session;
    },
  },
};

// export default NextAuth(authOptions);
