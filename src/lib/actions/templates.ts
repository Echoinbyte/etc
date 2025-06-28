"use server";

import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { EmailTemplate, User } from "@/lib/models";
import { revalidatePath } from "next/cache";

// Interface for creating email templates
interface CreateTemplateData {
  title: string;
  description: string;
  htmlContent: string;
  tags: string[];
  isPublic: boolean;
}

interface TemplateResponse {
  success: boolean;
  message: string;
  template?: any;
  error?: string;
}

interface LikeResponse {
  success: boolean;
  message: string;
  isLiked: boolean;
  likesCount: number;
  error?: string;
}

// Generate unique slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}

// Create a new email template
export async function createTemplate(
  data: CreateTemplateData
): Promise<TemplateResponse> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return {
        success: false,
        message: "You must be signed in to create templates",
        error: "UNAUTHORIZED",
      };
    }

    await connectDB();

    // Get user from database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return {
        success: false,
        message: "User not found",
        error: "USER_NOT_FOUND",
      };
    }

    // Generate unique slug
    const baseSlug = generateSlug(data.title);
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug is unique
    while (await EmailTemplate.findOne({ slug: slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create the template
    const template = await EmailTemplate.create({
      title: data.title.trim(),
      slug,
      description: data.description.trim(),
      htmlContent: data.htmlContent,
      tags: data.tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean),
      isPublic: data.isPublic,
      author: user._id,
      likes: [],
      views: 0,
    });

    await template.populate("author", "name email image");

    console.log("✅ Template created successfully:", template.title);

    // Revalidate relevant pages
    revalidatePath("/community");
    revalidatePath("/publish");

    return {
      success: true,
      message: "Template created successfully!",
      template: {
        id: (template._id as any).toString(),
        slug: template.slug,
        title: template.title,
        description: template.description,
        htmlContent: template.htmlContent,
        tags: template.tags,
        isPublic: template.isPublic,
        author: {
          name: (template.author as any).name,
          id: (template.author as any)._id.toString(),
        },
        likes: template.likes.length,
        views: template.views,
        createdAt: template.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("❌ Create template error:", error);
    return {
      success: false,
      message: "Failed to create template. Please try again.",
      error: "CREATE_FAILED",
    };
  }
}

// Get all public templates for community page
export async function getPublicTemplates() {
  try {
    await connectDB();

    const templates = await EmailTemplate.find({ isPublic: true })
      .populate("author", "name email image")
      .sort({ createdAt: -1 })
      .lean();

    return templates.map((template: any) => ({
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
    console.error("❌ Get templates error:", error);
    return [];
  }
}

// Get templates by user (for dashboard)
export async function getUserTemplates() {
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

    const templates = await EmailTemplate.find({ author: user._id })
      .populate("author", "name email image")
      .sort({ createdAt: -1 })
      .lean();

    return templates.map((template: any) => ({
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
    console.error("❌ Get user templates error:", error);
    return [];
  }
}

// Get single template by slug
export async function getTemplateBySlug(slug: string) {
  try {
    await connectDB();

    const template = await EmailTemplate.findOne({ slug })
      .populate("author", "name email image")
      .lean();

    if (!template) {
      return null;
    }

    return {
      id: (template as any)._id.toString(),
      slug: (template as any).slug,
      title: (template as any).title,
      description: (template as any).description,
      htmlContent: (template as any).htmlContent,
      tags: (template as any).tags,
      author: {
        name: (template as any).author.name,
        id: (template as any).author._id.toString(),
      },
      likes: (template as any).likes.length,
      views: (template as any).views,
      isPublic: (template as any).isPublic,
      createdAt: (template as any).createdAt.toISOString(),
    };
  } catch (error) {
    console.error("❌ Get template by slug error:", error);
    return null;
  }
}

// Toggle like on a template
export async function toggleTemplateLike(
  templateId: string
): Promise<LikeResponse> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return {
        success: false,
        message: "You must be signed in to like templates",
        isLiked: false,
        likesCount: 0,
        error: "UNAUTHORIZED",
      };
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return {
        success: false,
        message: "User not found",
        isLiked: false,
        likesCount: 0,
        error: "USER_NOT_FOUND",
      };
    }

    const template = await EmailTemplate.findById(templateId);
    if (!template) {
      return {
        success: false,
        message: "Template not found",
        isLiked: false,
        likesCount: 0,
        error: "TEMPLATE_NOT_FOUND",
      };
    }

    const isCurrentlyLiked = template.likes.includes(user._id);

    if (isCurrentlyLiked) {
      // Remove like
      template.likes = template.likes.filter((id: any) => !id.equals(user._id));
    } else {
      // Add like
      template.likes.push(user._id);
    }

    await template.save();

    console.log(
      `✅ Template ${isCurrentlyLiked ? "unliked" : "liked"}:`,
      template.title
    );

    // Revalidate community page
    revalidatePath("/community");

    return {
      success: true,
      message: isCurrentlyLiked
        ? "Template removed from favorites"
        : "Template added to favorites",
      isLiked: !isCurrentlyLiked,
      likesCount: template.likes.length,
    };
  } catch (error) {
    console.error("❌ Toggle like error:", error);
    return {
      success: false,
      message: "Failed to update like status",
      isLiked: false,
      likesCount: 0,
      error: "TOGGLE_FAILED",
    };
  }
}

// Delete template (author only)
export async function deleteTemplate(
  templateId: string
): Promise<TemplateResponse> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return {
        success: false,
        message: "You must be signed in to delete templates",
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

    const template = await EmailTemplate.findById(templateId);
    if (!template) {
      return {
        success: false,
        message: "Template not found",
        error: "TEMPLATE_NOT_FOUND",
      };
    }

    // Check if user is the author
    if (!template.author.equals(user._id)) {
      return {
        success: false,
        message: "You can only delete your own templates",
        error: "FORBIDDEN",
      };
    }

    await EmailTemplate.findByIdAndDelete(templateId);

    console.log("✅ Template deleted successfully:", template.title);

    // Revalidate relevant pages
    revalidatePath("/community");
    revalidatePath("/publish");

    return {
      success: true,
      message: "Template deleted successfully!",
    };
  } catch (error) {
    console.error("❌ Delete template error:", error);
    return {
      success: false,
      message: "Failed to delete template. Please try again.",
      error: "DELETE_FAILED",
    };
  }
}
