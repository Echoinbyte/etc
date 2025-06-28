import { notFound } from "next/navigation";
import PublishPageComponent from "@/app/publish/PublishPageComponent";
import {
  staticPages,
  isStaticPageSlug,
  type StaticPageKey,
} from "@/data/staticPages";

interface InitialTemplate {
  id?: string;
  slug?: string;
  title: string;
  description: string;
  htmlContent: string;
  tags: string[];
  isPublic: boolean;
  author?: {
    name: string;
    id: string;
  };
}

async function getTemplateBySlug(
  slug: string
): Promise<InitialTemplate | null> {
  try {
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      `http://localhost:${process.env.PORT || 3000}`;

    const response = await fetch(
      `${baseUrl}/api/templates?slug=${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      console.error(
        "Failed to fetch template:",
        response.status,
        response.statusText
      );
      return null;
    }

    const data = await response.json();
    console.log("API Response:", data);

    // API returns templates array, get the first one
    const template = data.templates?.[0];

    if (!template) {
      console.error("No template found in response");
      return null;
    }

    // Convert database template to InitialTemplate format
    const initialTemplate: InitialTemplate = {
      id: template._id?.toString(),
      slug: template.slug,
      title: template.title,
      description: template.description,
      htmlContent: template.htmlContent,
      tags: template.tags || [],
      isPublic: template.isPublic || false,
    };

    // Add author if available
    if (template.author && typeof template.author === "object") {
      initialTemplate.author = {
        name: template.author.name || "Unknown",
        id: template.author._id || template.author.id || "unknown",
      };
    }

    return initialTemplate;
  } catch (error) {
    console.error("Error fetching template:", error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PublishSlugPage({ params }: PageProps) {
  const { slug } = await params;

  // First, check if it's a static page using type-safe helper
  if (isStaticPageSlug(slug)) {
    const staticPage = staticPages[slug];
    const initialTemplate: InitialTemplate = {
      id: staticPage.id,
      slug: staticPage.slug,
      title: staticPage.title,
      description: staticPage.description,
      htmlContent: staticPage.htmlContent,
      tags: staticPage.tags,
      isPublic: staticPage.isPublic,
      author: staticPage.author,
    };

    return <PublishPageComponent initialTemplate={initialTemplate} />;
  }

  // If not a static page, fetch from database
  const template = await getTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  return <PublishPageComponent initialTemplate={template} />;
}
