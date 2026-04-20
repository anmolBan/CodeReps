import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github";
import prisma from "@repo/db";

export const authOptions = {
  // Configure one or more authentication providers
  pages: {
    signIn: "/signin"
  },

  providers: [
    CredentialsProvider({
    name: "Email and Password",
    credentials: {
      email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
        if(!credentials?.email || !credentials.password){
            return null
        }
        return {
            id: "1",
            name: "Anmol Bansal"
        }

    }
  })
  ],
}

export default NextAuth(authOptions)