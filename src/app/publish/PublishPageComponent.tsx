"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Editor from "@monaco-editor/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ExtendedButton } from "@/components/shared/ExtendedButton";
import { Eye, Code, Save, Share2, Monitor } from "lucide-react";
import { toast } from "sonner";

interface EmailTemplate {
  title: string;
  description: string;
  htmlContent: string;
  tags: string[];
  isPublic: boolean;
}

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

interface PublishPageComponentProps {
  initialTemplate?: InitialTemplate | null;
}

// Single default template with embedded CSS
const defaultTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            margin: 0;
            // padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 20px;
        }

        p {
            color: #666;
            line-height: 1.6;
            text-align: center;
            margin-bottom: 30px;
        }

        .cta-section {
            text-align: center;
        }

        .cta-button {
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            display: inline-block;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }

        .cta-button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to ETC!</h1>
        <p>Start building your amazing email template here.</p>
        <div class="cta-section">
            <a href="#" class="cta-button">Get Started</a>
        </div>
    </div>
</body>
</html>`;

export default function PublishPageComponent({
  initialTemplate,
}: PublishPageComponentProps) {
  const router = useRouter();
  const [htmlContent, setHtmlContent] = useState(
    initialTemplate?.htmlContent || defaultTemplate
  );
  const [currentView, setCurrentView] = useState<"editor" | "preview">(
    "editor"
  );
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [template, setTemplate] = useState<EmailTemplate>({
    title: initialTemplate?.title || "",
    description: initialTemplate?.description || "",
    htmlContent: initialTemplate?.htmlContent || defaultTemplate,
    tags: initialTemplate?.tags || [],
    isPublic: initialTemplate?.isPublic ?? true, // Default to true to encourage open source contributions
  });
  const [newTag, setNewTag] = useState("");

  // Get actual session data
  const { data: session, status } = useSession();

  console.log("🔍 Publish page - Session status:", status);
  console.log("🔍 Publish page - Session data:", session);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    // Update state when initialTemplate changes
    if (initialTemplate) {
      setHtmlContent(initialTemplate.htmlContent);
      setTemplate({
        title: initialTemplate.title,
        description: initialTemplate.description,
        htmlContent: initialTemplate.htmlContent,
        tags: initialTemplate.tags,
        isPublic: initialTemplate.isPublic,
      });
    }
  }, [initialTemplate]);

  useEffect(() => {
    setTemplate((prev) => ({
      ...prev,
      htmlContent,
    }));
  }, [htmlContent]);

  // For preview, use iframe to isolate styles
  const createPreviewFrame = (content: string) => {
    return `data:text/html;charset=utf-8,${encodeURIComponent(content)}`;
  };

  const handlePublish = async () => {
    if (status === "loading") {
      toast.error("Please wait while we verify your session");
      return;
    }

    if (status === "unauthenticated" || !session) {
      toast.error("Please sign in to publish templates");
      return;
    }

    if (!template.title.trim() || !template.description.trim()) {
      toast.error("Please fill in title and description");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      });

      console.log("🔍 API Response status:", response.status);

      if (response.ok) {
        const publishedTemplate = await response.json();
        toast.success("Template published successfully!");
        setIsPublishDialogOpen(false);
        router.push("/community");
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to publish template");
      }
    } catch {
      toast.error("Failed to publish template");
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !template.tags.includes(newTag.trim())) {
      setTemplate((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTemplate((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-background scrollbar-gutter-stable">
      {/* Header */}
      <div className="flex items-center justify-between p-2 sm:p-4 border-b border-border/50 dark:border-border/30 bg-card dark:bg-card/50 min-h-[60px]">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {initialTemplate && (
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground dark:text-muted-foreground/80">
              <span>Editing:</span>
              <span className="font-medium text-foreground dark:text-foreground/90">
                {initialTemplate.title}
              </span>
            </div>
          )}
          {isMobile && (
            <div className="flex items-center space-x-1">
              <Button
                variant={currentView === "editor" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("editor")}
                className="w-10 h-10 p-0"
              >
                <Code className="h-4 w-4" />
              </Button>
              <Button
                variant={currentView === "preview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentView("preview")}
                className="w-10 h-10 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          {isMobile ? (
            <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
              <Save className="h-4 w-4" />
            </Button>
          ) : (
            <ExtendedButton
              variant="outline"
              size="sm"
              iconLeft={<Save className="h-4 w-4" />}
            >
              Save Draft
            </ExtendedButton>
          )}

          <Dialog
            open={isPublishDialogOpen}
            onOpenChange={setIsPublishDialogOpen}
          >
            <DialogTrigger asChild>
              {isMobile ? (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={
                    status === "loading" || status === "unauthenticated"
                  }
                  className="w-10 h-10 p-0"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              ) : (
                <ExtendedButton
                  size="sm"
                  disabled={
                    status === "loading" || status === "unauthenticated"
                  }
                  iconLeft={<Share2 className="h-4 w-4" />}
                >
                  {status === "loading"
                    ? "Loading..."
                    : status === "unauthenticated"
                    ? "Sign in to Publish"
                    : initialTemplate
                    ? "Save as New"
                    : "Publish"}
                </ExtendedButton>
              )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] mx-4 max-h-[90vh] overflow-y-auto bg-card dark:bg-card/95 border-border/50 dark:border-border/30">
              <DialogHeader>
                <DialogTitle className="text-xl text-foreground dark:text-foreground/90">
                  {initialTemplate
                    ? "Save as New Template"
                    : "Publish Template"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground dark:text-muted-foreground/80 sm:block hidden">
                  {initialTemplate
                    ? "Create a new template based on your modifications."
                    : "Share your email template with the community and help others create beautiful emails."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 sm:gap-6 py-4">
                <div className="grid gap-2 sm:gap-3">
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-primary sm:block hidden"
                  >
                    Template Title *
                  </Label>
                  <Input
                    id="title"
                    value={template.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTemplate((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Template Title *"
                    className="focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 bg-background dark:bg-background border-border/50 dark:border-border/30"
                  />
                </div>
                <div className="grid gap-2 sm:gap-3">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-primary sm:block hidden"
                  >
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={template.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setTemplate((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Description *"
                    rows={3}
                    className="resize-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 bg-background dark:bg-background border-border/50 dark:border-border/30"
                  />
                </div>
                <div className="grid gap-2 sm:gap-3">
                  <Label className="text-sm font-medium text-primary sm:block hidden">
                    Tags
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewTag(e.target.value)
                      }
                      placeholder="Tags (e.g., newsletter)"
                      onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                        e.key === "Enter" && addTag()
                      }
                      className="flex-1 focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 bg-background dark:bg-background border-border/50 dark:border-border/30"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                    >
                      Add
                    </Button>
                  </div>
                  {template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {template.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80 dark:hover:bg-secondary/60 transition-colors px-3 py-1.5 text-sm bg-secondary/60 dark:bg-secondary/40 border border-border/30 dark:border-border/20"
                          onClick={() => removeTag(tag)}
                        >
                          {tag}
                          <span className="ml-2 text-muted-foreground hover:text-foreground transition-colors">
                            ×
                          </span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div
                  className="flex items-center space-x-3 p-3 sm:p-4 rounded-lg bg-muted/50 dark:bg-muted/30 border border-border/50 dark:border-border/30 cursor-pointer hover:bg-muted/60 dark:hover:bg-muted/40 transition-colors"
                  onClick={() =>
                    setTemplate((prev) => ({
                      ...prev,
                      isPublic: !prev.isPublic,
                    }))
                  }
                >
                  <Checkbox
                    id="isPublic"
                    checked={template.isPublic}
                    onCheckedChange={(checked) =>
                      setTemplate((prev) => ({ ...prev, isPublic: !!checked }))
                    }
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="grid gap-1.5 leading-none flex-1">
                    <Label
                      htmlFor="isPublic"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Make template public
                    </Label>
                    <p className="text-xs text-muted-foreground sm:block hidden">
                      Allow others to discover and use your template
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsPublishDialogOpen(false)}
                  disabled={isLoading}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <ExtendedButton
                  type="submit"
                  onClick={handlePublish}
                  disabled={
                    isLoading ||
                    !template.title.trim() ||
                    !template.description.trim()
                  }
                  loading={isLoading}
                  className="w-full sm:w-auto sm:min-w-[120px] order-1 sm:order-2"
                >
                  {initialTemplate ? "Save as New" : "Publish Template"}
                </ExtendedButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {isMobile ? (
          <div className="h-full">
            {currentView === "editor" ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-2 border-b border-border/50 dark:border-border/30 bg-muted/50 dark:bg-muted/30">
                  <span className="text-sm font-medium text-foreground dark:text-foreground/90">
                    HTML Template
                  </span>
                  <Code className="h-4 w-4 text-muted-foreground dark:text-muted-foreground/80" />
                </div>
                <div className="flex-1">
                  <Editor
                    height="100%"
                    language="html"
                    value={htmlContent}
                    onChange={(value) => setHtmlContent(value || "")}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: true,
                      fontSize: 14,
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-2 border-b border-border/50 dark:border-border/30 bg-muted/50 dark:bg-muted/30">
                  <span className="text-sm font-medium text-foreground dark:text-foreground/90">
                    Preview
                  </span>
                  <Monitor className="h-4 w-4 text-muted-foreground dark:text-muted-foreground/80" />
                </div>
                <div className="w-full h-full overflow-hidden bg-muted/20 dark:bg-muted/10">
                  <iframe
                    src={createPreviewFrame(htmlContent)}
                    className="w-full h-full border-0"
                    title="Email Template Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          // Desktop: Split view with resizable panels
          <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-64px)]">
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-2 border-b border-border/50 dark:border-border/30 bg-muted/50 dark:bg-muted/30">
                  <span className="text-sm font-medium text-foreground dark:text-foreground/90">
                    HTML Template
                  </span>
                  <Code className="h-4 w-4 text-muted-foreground dark:text-muted-foreground/80" />
                </div>
                <div className="flex-1">
                  <Editor
                    height="100%"
                    language="html"
                    value={htmlContent}
                    onChange={(value) => setHtmlContent(value || "")}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: true },
                      scrollBeyondLastLine: true,
                      fontSize: 14,
                    }}
                  />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-2 border-b border-border/50 dark:border-border/30 bg-muted/50 dark:bg-muted/30">
                  <span className="text-sm font-medium text-foreground dark:text-foreground/90">
                    Live Preview
                  </span>
                  <Eye className="h-4 w-4 text-muted-foreground dark:text-muted-foreground/80" />
                </div>
                <div className="flex-1 w-full overflow-hidden bg-muted/20 dark:bg-muted/10">
                  <iframe
                    src={createPreviewFrame(htmlContent)}
                    className="w-full h-full border-0"
                    title="Email Template Live Preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
}
