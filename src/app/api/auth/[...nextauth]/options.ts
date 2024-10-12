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

  callbacks: {
    async session({ session, token }) {
      // You can add token information to the session object here if needed
      
      session.accessToken = token.accessToken
      return session;
    },
    async jwt ({token,account}){
      if(account){
        
        token.accessToken = account.access_token
      }
      return token 
    }
  },
};

export default NextAuth(authOptions);
