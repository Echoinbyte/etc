"use server";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { User, EmailTemplate } from "@/lib/models";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  provider: string;
  createdAt: string;
  templatesCount: number;
  likesReceived: number;
}

interface UserResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
  error?: string;
}

// Get current user profile with stats
export async function getCurrentUserProfile(): Promise<UserResponse> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return {
        success: false,
        message: "Not authenticated",
        error: "UNAUTHORIZED",
      };
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) {
      return {
        success: false,
        message: "User not found",
        error: "USER_NOT_FOUND",
      };
    }

    // Get user templates count
    const templatesCount = await EmailTemplate.countDocuments({
      author: (user as any)._id,
    });

    // Get total likes received on user's templates
    const userTemplates = await EmailTemplate.find({
      author: (user as any)._id,
    }).select("likes");

    const likesReceived = userTemplates.reduce(
      (total, template) => total + template.likes.length,
      0
    );

    const userProfile: UserProfile = {
      id: (user as any)._id.toString(),
      name: (user as any).name,
      email: (user as any).email,
      image: (user as any).image,
      provider: (user as any).provider,
      createdAt: (user as any).createdAt.toISOString(),
      templatesCount,
      likesReceived,
    };

    return {
      success: true,
      message: "User profile retrieved successfully",
      user: userProfile,
    };
  } catch (error) {
    console.error("❌ Get user profile error:", error);
    return {
      success: false,
      message: "Failed to retrieve user profile",
      error: "FETCH_FAILED",
    };
  }
}

// Get user's liked templates
export async function getUserLikedTemplates() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return [];
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return [];
    }

    // Find all templates that this user has liked
    const likedTemplates = await EmailTemplate.find({
      likes: user._id,
      isPublic: true,
    })
      .populate("author", "name email image")
      .sort({ createdAt: -1 })
      .lean();

    return likedTemplates.map((template: any) => ({
      id: template._id.toString(),
      slug: template.slug,
      title: template.title,
      description: template.description,
      htmlContent: template.htmlContent,
      tags: template.tags,
      author: {
        name: template.author.name,
        id: template.author._id.toString(),
      },
      likes: template.likes.length,
      views: template.views,
      isPublic: template.isPublic,
      createdAt: template.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("❌ Get user liked templates error:", error);
    return [];
  }
}

// Check if current user has liked specific templates
export async function getUserLikeStatus(templateIds: string[]) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return {};
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return {};
    }

    // Find templates that user has liked
    const likedTemplates = await EmailTemplate.find({
      _id: { $in: templateIds },
      likes: user._id,
    }).select("_id");

    // Convert to a lookup object
    const likeStatus: Record<string, boolean> = {};
    templateIds.forEach((id) => {
      likeStatus[id] = likedTemplates.some(
        (template) => template._id.toString() === id
      );
    });

    return likeStatus;
  } catch (error) {
    console.error("❌ Get user like status error:", error);
    return {};
  }
}

// Update user profile (name only for now)
export async function updateUserProfile(data: {
  name: string;
}): Promise<UserResponse> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return {
        success: false,
        message: "Not authenticated",
        error: "UNAUTHORIZED",
      };
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return {
        success: false,
        message: "User not found",
        error: "USER_NOT_FOUND",
      };
    }

    // Update user name
    user.name = data.name.trim();
    await user.save();

    console.log("✅ User profile updated:", user.email);

    return {
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        provider: user.provider,
        createdAt: user.createdAt.toISOString(),
        templatesCount: 0, // Will be calculated if needed
        likesReceived: 0, // Will be calculated if needed
      },
    };
  } catch (error) {
    console.error("❌ Update user profile error:", error);
    return {
      success: false,
      message: "Failed to update profile",
      error: "UPDATE_FAILED",
    };
  }
}

// Get user statistics
export async function getUserStats() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return null;
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return null;
    }

    // Get comprehensive stats
    const [
      totalTemplates,
      publicTemplates,
      totalLikesReceived,
      totalTemplatesLiked,
    ] = await Promise.all([
      EmailTemplate.countDocuments({ author: user._id }),
      EmailTemplate.countDocuments({ author: user._id, isPublic: true }),
      EmailTemplate.aggregate([
        { $match: { author: user._id } },
        { $group: { _id: null, totalLikes: { $sum: { $size: "$likes" } } } },
      ]),
      EmailTemplate.countDocuments({ likes: user._id }),
    ]);

    return {
      totalTemplates,
      publicTemplates,
      privateTemplates: totalTemplates - publicTemplates,
      totalLikesReceived: totalLikesReceived[0]?.totalLikes || 0,
      totalTemplatesLiked,
    };
  } catch (error) {
    console.error("❌ Get user stats error:", error);
    return null;
  }
}
