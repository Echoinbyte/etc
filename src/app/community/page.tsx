"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Heart, Copy, Calendar, Check, LogIn } from "lucide-react";
import { ExtendedButton } from "@/components/shared/ExtendedButton";
import { toast } from "sonner";
import { generateTemplatePreview } from "@/lib/preview-generator";
import {
  getPublicTemplates,
  toggleTemplateLike,
} from "@/lib/actions/templates";
import { getUserLikeStatus } from "@/lib/actions/users";
import type { EmailTemplate } from "@/data/mockTemplates";

export default function CommunityPage() {
  const { data: session, status } = useSession();
  console.log("🔍 Session status:", status);
  console.log("🔍 Session data:", session);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [likedTemplates, setLikedTemplates] = useState<Set<string>>(new Set());
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Load templates and user like status on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Get public templates
        const publicTemplates = await getPublicTemplates();
        setTemplates(publicTemplates);

        // If user is authenticated, get their like status
        if (session?.user) {
          const templateIds = publicTemplates.map((t) => t.id);
          const likeStatus = await getUserLikeStatus(templateIds);

          const likedIds = Object.keys(likeStatus).filter(
            (id) => likeStatus[id]
          );
          setLikedTemplates(new Set(likedIds));
        }
      } catch (error) {
        console.error("Failed to load templates:", error);
        toast.error("Failed to load templates");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session]);

  // Get all unique tags
  const allTags = Array.from(
    new Set(templates.flatMap((template) => template.tags))
  );

  // Filter templates based on search and selected tag
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || template.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleLike = async (templateId: string) => {
    if (!session?.user) {
      toast.error("Please sign in to like templates");
      return;
    }

    try {
      const result = await toggleTemplateLike(templateId);

      if (result.success) {
        setLikedTemplates((prev) => {
          const newSet = new Set(prev);
          if (result.isLiked) {
            newSet.add(templateId);
          } else {
            newSet.delete(templateId);
          }
          return newSet;
        });

        // Update the template's like count in local state
        setTemplates((prev) =>
          prev.map((template) =>
            template.id === templateId
              ? { ...template, likes: result.likesCount }
              : template
          )
        );

        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast.error("Failed to update like status");
    }
  };

  const handleCopy = async (template: EmailTemplate) => {
    try {
      await navigator.clipboard.writeText(template.htmlContent);
      setCopiedTemplate(template.id);
      toast.success("Template copied to clipboard!");

      // Reset copy state after 2 seconds
      setTimeout(() => {
        setCopiedTemplate(null);
      }, 2000);
    } catch {
      toast.error("Failed to copy template");
    }
  };

  const closePreview = () => {
    console.log("Closing preview");
    setPreviewTemplate(null);
  };

  // Simple iframe-based preview component
  const FastPreview = ({ template }: { template: EmailTemplate }) => {
    const previewUrl = generateTemplatePreview(template.htmlContent, {
      width: 600,
      height: 400,
      scale: 0.7,
      backgroundColor: template.backgroundColor || "#ffffff",
    });

    return (
      <div
        className="w-full h-[200px] rounded-xl border border-border/50 overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
        onClick={() => {
          console.log("🖱️ Preview clicked for template:", template.title);
          setPreviewTemplate(template);
        }}
      >
        <iframe
          src={previewUrl}
          className="w-full h-full border-0 pointer-events-none bg-white rounded-xl"
          title={`Preview of ${template.title}`}
          loading="lazy"
          scrolling="no"
          onError={() => {
            console.warn("Preview iframe failed to load for:", template.title);
          }}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            🔍 Preview full template
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Enhanced Preview Modal - Mobile Responsive */}
      {previewTemplate && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300"
          onClick={closePreview}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-300 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Mobile Responsive */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
                  {previewTemplate.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {previewTemplate.description}
                </p>
              </div>
              <button
                onClick={closePreview}
                className="ml-2 sm:ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group shrink-0"
                aria-label="Close preview"
              >
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content - Mobile Responsive */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Template Preview with iframe - Scrollable content */}
              <div className="flex-1 p-2 sm:p-4 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                  <div className="min-h-[400px] overflow-y-auto overflow-x-hidden">
                    <iframe
                      src={generateTemplatePreview(
                        previewTemplate.htmlContent,
                        {
                          width: 600,
                          height: 400,
                          scale: 1.0,
                          backgroundColor:
                            previewTemplate.backgroundColor || "#ffffff",
                        }
                      )}
                      className="w-full h-[400px] border-0 rounded-lg bg-white"
                      title={`Full preview of ${previewTemplate.title}`}
                      scrolling="yes"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Mobile Responsive */}
            <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
              <div className="flex flex-row items-center justify-between gap-4">
                <ExtendedButton
                  variant="primary"
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base flex-1 sm:flex-none"
                  link={`/publish/${previewTemplate.slug}`}
                >
                  Use Template
                </ExtendedButton>

                <div className="flex-row flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleCopy(previewTemplate)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                      copiedTemplate === previewTemplate.id
                        ? "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {copiedTemplate === previewTemplate.id ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy HTML
                      </>
                    )}
                  </button>

                  <button
                    onClick={closePreview}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm sm:text-base"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-background via-background to-muted/20 border-b">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Community Templates
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover and use beautiful email templates created by our
              community. Ready-to-use, customizable, and completely free.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2">
              <Badge
                variant={selectedTag === null ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => setSelectedTag(null)}
              >
                All
              </Badge>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Templates Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary/20 border-t-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">
              Loading templates...
            </p>
          </div>
        ) : (
          <>
            {/* Guest User Banner */}
            {!session?.user && (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <LogIn className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Join our community!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Sign in to like templates, create your own, and access
                        exclusive features.
                      </p>
                    </div>
                  </div>
                  <ExtendedButton
                    link="/auth/signin"
                    variant="primary"
                    className="px-6 py-2"
                  >
                    Sign In
                  </ExtendedButton>
                </div>
              </div>
            )}

            {/* No Templates State */}
            {filteredTemplates.length === 0 && !loading ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No templates found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || selectedTag
                    ? "Try adjusting your search or filters"
                    : "Be the first to create a template!"}
                </p>
                {searchTerm || selectedTag ? (
                  <ExtendedButton
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedTag(null);
                    }}
                  >
                    Clear Filters
                  </ExtendedButton>
                ) : (
                  <ExtendedButton link="/publish" variant="primary">
                    Create Template
                  </ExtendedButton>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="group hover:shadow-2xl transition-all duration-500 bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/30 overflow-hidden rounded-2xl shadow-lg"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors font-bold leading-tight">
                            {template.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {template.description}
                          </CardDescription>
                        </div>
                      </div>

                      {/* Enhanced Template Preview */}
                      <div className="mt-4">
                        <FastPreview template={template} />
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-4">
                      {/* Tags with better styling */}
                      <div className="flex flex-wrap gap-2">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs px-3 py-1 rounded-full border-primary/30 text-primary/90 hover:bg-primary/10 transition-all duration-200 cursor-pointer font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTag(tag);
                            }}
                          >
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge
                            variant="outline"
                            className="text-xs px-3 py-1 rounded-full text-muted-foreground"
                          >
                            +{template.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Enhanced Stats and Actions Row */}
                      <div className="flex items-center justify-between">
                        {/* Like Button with Counter - More prominent */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(template.id);
                          }}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                            likedTemplates.has(template.id)
                              ? "bg-gradient-to-r from-red-50 to-pink-50 text-red-600 border border-red-200 shadow-md dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-800"
                              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:shadow-md"
                          }`}
                        >
                          <Heart
                            className={`h-5 w-5 transition-all duration-300 ${
                              likedTemplates.has(template.id)
                                ? "fill-current scale-110"
                                : ""
                            }`}
                          />
                          <span className="font-semibold">
                            {template.likes}
                          </span>
                        </button>

                        {/* Copy Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(template);
                          }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                            copiedTemplate === template.id
                              ? "bg-green-50 text-green-600 border border-green-200 shadow-md dark:bg-green-900/20 dark:border-green-800"
                              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-md"
                          }`}
                        >
                          {copiedTemplate === template.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          <span className="text-sm font-medium">
                            {copiedTemplate === template.id
                              ? "Copied!"
                              : "Copy"}
                          </span>
                        </button>
                      </div>

                      {/* Author and Date Row */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="font-medium">
                          by{" "}
                          <span className="text-primary/70 font-semibold">
                            {template.author.name}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(template.createdAt)}
                        </span>
                      </div>

                      {/* Enhanced Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <ExtendedButton
                          variant="primary"
                          size="sm"
                          className="flex-1 hover:bg-primary/90 transition-all duration-300 font-semibold py-3 rounded-xl hover:shadow-lg bg-gradient-to-r from-primary to-primary/90"
                          link={`/publish/${template.slug}`}
                        >
                          Use Template
                        </ExtendedButton>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log(
                              "🖱️ Preview button clicked for:",
                              template.title
                            );
                            setPreviewTemplate(template);
                          }}
                          className="px-4 py-2 bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-all duration-300 text-sm font-medium hover:shadow-md"
                        >
                          Preview
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
