import mongoose, { Document, Schema } from "mongoose";

// User Schema for authentication
export interface IUser extends Document {
  _id: string;
  email: string;
  name: string;
  image?: string;
  provider: "google" | "github" | "email";
  providerId?: string;
  emailVerified?: Date;
  role?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  githubUsername?: string;
  twitterUsername?: string;
  linkedinUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    provider: {
      type: String,
      required: true,
      enum: ["google", "github", "email"],
      default: "email",
    },
    providerId: {
      type: String,
    },
    emailVerified: {
      type: Date,
    },
    role: {
      type: String,
      default: "user",
    },
    bio: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    githubUsername: {
      type: String,
      trim: true,
    },
    twitterUsername: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Email Template Schema
export interface IEmailTemplate extends Document {
  _id: string;
  title: string;
  slug: string;
  description: string;
  htmlContent: string;
  author: mongoose.Types.ObjectId;
  isPublic: boolean;
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const EmailTemplateSchema = new Schema<IEmailTemplate>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    htmlContent: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Account Schema for NextAuth
export interface IAccount extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

const AccountSchema = new Schema<IAccount>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  providerAccountId: {
    type: String,
    required: true,
  },
  refresh_token: String,
  access_token: String,
  expires_at: Number,
  token_type: String,
  scope: String,
  id_token: String,
  session_state: String,
});

// Session Schema for NextAuth
export interface ISession extends Document {
  _id: string;
  sessionToken: string;
  userId: mongoose.Types.ObjectId;
  expires: Date;
}

const SessionSchema = new Schema<ISession>({
  sessionToken: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
});

// Create models
export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export const EmailTemplate =
  mongoose.models.EmailTemplate ||
  mongoose.model<IEmailTemplate>("EmailTemplate", EmailTemplateSchema);
export const Account =
  mongoose.models.Account || mongoose.model<IAccount>("Account", AccountSchema);
export const Session =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);
