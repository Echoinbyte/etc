import {
  staticPages,
  type StaticPageKey,
  type StaticPageData,
} from "@/data/staticPages";

/**
 * Utility functions for working with static pages
 */

export function getAllStaticPages(): StaticPageData[] {
  return Object.values(staticPages);
}

export function getStaticPagesByCategory(
  category: "platform" | "information" | "community"
): StaticPageData[] {
  return getAllStaticPages().filter((page) => page.category === category);
}

export function getStaticPagesSortedByPriority(): StaticPageData[] {
  return getAllStaticPages().sort((a, b) => a.priority - b.priority);
}

export function getStaticPageMetadata(slug: StaticPageKey) {
  const page = staticPages[slug];
  return {
    title: page.title,
    description: page.description,
    category: page.category,
    isEditable: page.isEditable,
    priority: page.priority,
  };
}

export function isEditableStaticPage(slug: string): boolean {
  if (slug in staticPages) {
    return staticPages[slug as StaticPageKey].isEditable;
  }
  return false;
}

export function getStaticPageNavigation() {
  return getStaticPagesSortedByPriority().map((page) => ({
    slug: page.slug,
    title: page.title,
    href: `/publish/${page.slug}`,
    category: page.category,
  }));
}
