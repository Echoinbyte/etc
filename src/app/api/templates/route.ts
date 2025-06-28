import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { EmailTemplate } from "@/lib/models";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    console.log("🔍 API - Session data:", session);

    if (!session?.user?._id && !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { title, description, htmlContent, tags, isPublic } = body;

    // Validate required fields
    if (!title?.trim() || !description?.trim() || !htmlContent?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a unique slug
    let slug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const existingTemplate = await EmailTemplate.findOne({ slug });
    if (existingTemplate) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    // Use _id or id depending on what's available
    const userId = session.user._id || session.user.id;

    // Create new template
    const template = new EmailTemplate({
      title: title.trim(),
      slug,
      description: description.trim(),
      htmlContent,
      author: userId,
      isPublic: isPublic || false,
      tags: tags || [],
      likes: [],
      views: 0,
    });

    const savedTemplate = await template.save();

    return NextResponse.json(
      {
        id: savedTemplate._id,
        message: "Template published successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error publishing template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const tags = searchParams.get("tags")?.split(",") || [];
    const slug = searchParams.get("slug");

    // If fetching by slug, return single template
    if (slug) {
      const session = await auth();

      // Build query - public templates OR user's own templates
      const query: any = { slug };
      if (!session?.user?._id && !session?.user?.id) {
        // Not authenticated - only public templates
        query.isPublic = true;
      } else {
        // Authenticated - public templates OR user's own templates
        const userId = session.user._id || session.user.id;
        query.$or = [{ isPublic: true }, { author: userId }];
      }

      const template = await EmailTemplate.findOne(query)
        .populate("author", "name email image")
        .lean();

      if (!template) {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        templates: [template],
        pagination: { page: 1, limit: 1, total: 1, pages: 1 },
      });
    }

    // Build filter query for general listing
    const filter: Record<string, unknown> = { isPublic: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (tags.length > 0) {
      filter.tags = { $in: tags };
    }

    const skip = (page - 1) * limit;

    const templates = await EmailTemplate.find(filter)
      .populate("author", "name email image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await EmailTemplate.countDocuments(filter);

    return NextResponse.json({
      templates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
