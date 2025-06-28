import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth/next";

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  events: {
    async createUser({ user }: any) {
      // This runs after a user is created by the adapter
      console.log("✅ User created by adapter:", user.email);

      // You can add additional logic here if needed
      // The adapter has already created the user in the database
    },
  },
  callbacks: {
    async signIn({ user, account, profile, email }: any) {
      // Allow sign in for OAuth providers
      if (account?.provider === "google" || account?.provider === "github") {
        return true;
      }
      return true;
    },
    async session({ session, user }: any) {
      // Add user data to session from the database user object
      if (user && session.user) {
        session.user._id = user.id;
        session.user.isVerified = !!user.emailVerified;
        session.user.role = user.role || "user";
        session.user.bio = user.bio;
        session.user.location = user.location;
        session.user.website = user.website;
        session.user.company = user.company;
        session.user.githubUsername = user.githubUsername;
        session.user.twitterUsername = user.twitterUsername;
        session.user.linkedinUrl = user.linkedinUrl;
        session.user.createdAt = user.createdAt;
        session.user.updatedAt = user.updatedAt;
      }
      return session;
    },
  },
  session: {
    strategy: "database" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};

// Export function to get server session
export const auth = () => getServerSession(authOptions);
