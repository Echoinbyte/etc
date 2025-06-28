import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      provider?: string;
      role?: string;
      bio?: string;
      location?: string;
      website?: string;
      company?: string;
      githubUsername?: string;
      twitterUsername?: string;
      linkedinUrl?: string;
      createdAt?: Date;
      updatedAt?: Date;
    } & DefaultSession["user"];
  }

  interface User {
    _id?: string;
    isVerified?: boolean;
    provider?: string;
    role?: string;
    bio?: string;
    location?: string;
    website?: string;
    company?: string;
    githubUsername?: string;
    twitterUsername?: string;
    linkedinUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    provider?: string;
    role?: string;
    bio?: string;
    location?: string;
    website?: string;
    company?: string;
    githubUsername?: string;
    twitterUsername?: string;
    linkedinUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
}
