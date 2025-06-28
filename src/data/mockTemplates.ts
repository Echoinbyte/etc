export interface EmailTemplate {
  id: string;
  slug: string;
  title: string;
  description: string;
  htmlContent: string;
  previewImage?: string;
  backgroundColor?: string;
  tags: string[];
  author: {
    name: string;
    id: string;
  };
  likes: number;
  views: number;
  isPublic: boolean;
  createdAt: string;
}