// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXT_SECRET,
  session: {
    strategy: 'jwt', // Use JWT strategy for session
  },
  callbacks: {
    async session({ session, token }) {
      // Add the access token to the session
      session.accessToken = token.accessToken; // Ensure you access the accessToken
      return session;
    },
    async jwt({ token, account }) {
      // If account is available, it means this is the first time the user is logging in
      if (account) {
        token.accessToken = account.access_token; // Set the access token when the account is created
      }
      return token; // Always return the token
    },
  },
};

export default NextAuth(authOptions);
