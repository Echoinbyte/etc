import { IEmailTemplate } from "@/lib/models";

// Define the specific static page keys for better type safety
export type StaticPageKey = "overview" | "about" | "contact" | "contribute";

// Enhanced type for static pages with better structure
export interface StaticPageData {
  id: `static-${StaticPageKey}`;
  slug: StaticPageKey;
  title: string;
  description: string;
  htmlContent: string;
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
  category: "platform" | "information" | "community";
  isEditable: boolean;
  priority: number;
}

// Type-safe static pages interface
type StaticPagesMap = {
  [K in StaticPageKey]: StaticPageData;
};

// Helper functions for type safety
export function isStaticPageSlug(slug: string): slug is StaticPageKey {
  return slug in staticPages;
}

export function getStaticPageKeys(): StaticPageKey[] {
  return Object.keys(staticPages) as StaticPageKey[];
}

export function getStaticPageBySlug(slug: StaticPageKey): StaticPageData {
  return staticPages[slug];
}

export const staticPages: StaticPagesMap = {
  overview: {
    id: "static-overview",
    slug: "overview",
    title: "Platform Overview",
    description:
      "Learn about our email template platform and how it can help you create stunning emails.",
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    htmlContent: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="margin: 0 0 20px 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Welcome to ETC</h1>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">Email Template Community</p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.8; margin-bottom: 30px; opacity: 0.95;">
          Discover how our platform makes creating beautiful email templates effortless. Whether you're a designer, developer, or business owner, we have the tools you need to craft professional emails that convert.
        </p>
        
        <div style="background: rgba(255,255,255,0.15); padding: 25px; margin: 30px 0; border-radius: 10px; backdrop-filter: blur(10px);">
          <h3 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">✨ Key Features</h3>
          <div style="display: grid; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 18px;">🎨</span>
              <span style="font-size: 15px;">Visual drag-and-drop editor with real-time preview</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 18px;">📱</span>
              <span style="font-size: 15px;">Mobile-responsive templates that work everywhere</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 18px;">🚀</span>
              <span style="font-size: 15px;">One-click publishing and sharing</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 18px;">👥</span>
              <span style="font-size: 15px;">Community-driven template library</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 18px;">⚡</span>
              <span style="font-size: 15px;">Lightning-fast template generation</span>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin: 35px 0;">
          <a href="/community" style="background: rgba(255,255,255,0.25); color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: 600; font-size: 16px; transition: all 0.3s ease; border: 2px solid rgba(255,255,255,0.3);">
            Explore Templates →
          </a>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 14px; opacity: 0.9; line-height: 1.6;">
            🌟 Join thousands of creators who trust ETC for their email needs<br/>
            Ready to get started? Browse our community templates or create your own masterpiece!
          </p>
        </div>
      </div>
    `,
    tags: ["platform", "overview", "features"],
    author: { name: "Platform Team", id: "static" },
    likes: 42,
    views: 156,
    isPublic: true,
    createdAt: "2024-01-15T10:00:00Z",
    category: "platform",
    isEditable: true,
    priority: 1,
  },
  about: {
    id: "static-about",
    slug: "about",
    title: "About Our Platform",
    description:
      "Learn about our mission, team, and the story behind our email template platform.",
    backgroundColor: "#2c3e50",
    htmlContent: `
      <div style="font-family: 'Inter', 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
        <header style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: white; padding: 40px 30px; text-align: center; position: relative;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"white\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg></div>
          <div style="position: relative; z-index: 1;">
            <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: 700;">About ETC</h1>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">Building the future of email design</p>
          </div>
        </header>
        
        <div style="padding: 40px 30px;">
          <div style="margin-bottom: 35px;">
            <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 15px 0; border-bottom: 3px solid #3498db; padding-bottom: 8px; display: inline-block;">🎯 Our Mission</h2>
            <p style="line-height: 1.7; color: #555; font-size: 16px; margin: 0;">
              We believe that creating beautiful email templates should be accessible to everyone. Our platform democratizes email design by providing powerful, professional tools wrapped in an intuitive interface that anyone can master.
            </p>
          </div>
          
          <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; margin: 30px 0; border-radius: 12px; border-left: 5px solid #3498db;">
            <h3 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 20px; display: flex; align-items: center; gap: 8px;">
              <span>💡</span> Why We Started
            </h3>
            <p style="margin: 0; color: #666; line-height: 1.6; font-size: 15px;">
              After years of wrestling with complex email builders and coding templates from scratch, we knew there had to be a better way. So we built it. ETC was born from the frustration of designers and developers who wanted to create beautiful emails without the headaches.
            </p>
          </div>
          
          <div style="margin: 35px 0;">
            <h2 style="color: #2c3e50; font-size: 24px; margin: 0 0 20px 0; border-bottom: 3px solid #3498db; padding-bottom: 8px; display: inline-block;">⭐ Our Values</h2>
            <div style="display: grid; gap: 15px;">
              <div style="display: flex; align-items: flex-start; gap: 12px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <span style="font-size: 20px;">🎨</span>
                <div>
                  <strong style="color: #2c3e50; font-size: 16px;">Simplicity:</strong>
                  <span style="color: #666; font-size: 15px; margin-left: 8px;">Complex tools shouldn't require complex workflows</span>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 12px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <span style="font-size: 20px;">🤝</span>
                <div>
                  <strong style="color: #2c3e50; font-size: 16px;">Community:</strong>
                  <span style="color: #666; font-size: 15px; margin-left: 8px;">Great ideas come from collaboration and shared knowledge</span>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 12px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <span style="font-size: 20px;">💎</span>
                <div>
                  <strong style="color: #2c3e50; font-size: 16px;">Quality:</strong>
                  <span style="color: #666; font-size: 15px; margin-left: 8px;">Every template should look professional and perform flawlessly</span>
                </div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 12px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <span style="font-size: 20px;">🚀</span>
                <div>
                  <strong style="color: #2c3e50; font-size: 16px;">Innovation:</strong>
                  <span style="color: #666; font-size: 15px; margin-left: 8px;">We're always pushing the boundaries of what's possible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <footer style="background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%); color: white; padding: 25px 30px; text-align: center;">
          <p style="margin: 0; font-size: 16px; font-weight: 500;">Ready to join our community? Start creating today! 🎉</p>
        </footer>
      </div>
    `,
    tags: ["about", "mission", "team"],
    author: { name: "Platform Team", id: "static" },
    likes: 28,
    views: 89,
    isPublic: true,
    createdAt: "2024-01-12T14:30:00Z",
    category: "information",
    isEditable: true,
    priority: 2,
  },
  contact: {
    id: "static-contact",
    slug: "contact",
    title: "Contact Us",
    description:
      "Get in touch with our team. We're here to help with questions, feedback, and support.",
    backgroundColor: "#ff6b6b",
    htmlContent: `
      <div style="font-family: 'Inter', 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 40px rgba(255,107,107,0.3);">
        <div style="padding: 50px 30px; text-align: center; position: relative;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"dots\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><circle cx=\"10\" cy=\"10\" r=\"1.5\" fill=\"white\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23dots)\"/></svg></div>
          
          <div style="position: relative; z-index: 1;">
            <div style="font-size: 48px; margin-bottom: 20px;">📬</div>
            <h1 style="font-size: 36px; margin: 0 0 15px 0; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">Get In Touch</h1>
            <p style="font-size: 18px; margin: 0 0 40px 0; opacity: 0.95;">We'd love to hear from you!</p>
            
            <div style="background: rgba(255,255,255,0.95); color: #ff6b6b; margin: 0 auto; padding: 35px; border-radius: 16px; max-width: 450px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
              <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 600; color: #ff6b6b;">Contact Information</h2>
              
              <div style="text-align: left; margin: 25px 0;">
                <div style="display: flex; align-items: center; margin: 15px 0; padding: 12px; background: #fff5f5; border-radius: 8px;">
                  <span style="font-size: 20px; margin-right: 12px;">📧</span>
                  <div>
                    <strong style="color: #ff6b6b; font-size: 14px;">Email:</strong><br/>
                    <span style="color: #666; font-size: 15px;">hello@etc-platform.com</span>
                  </div>
                </div>
                
                <div style="display: flex; align-items: center; margin: 15px 0; padding: 12px; background: #fff5f5; border-radius: 8px;">
                  <span style="font-size: 20px; margin-right: 12px;">💬</span>
                  <div>
                    <strong style="color: #ff6b6b; font-size: 14px;">Support:</strong><br/>
                    <span style="color: #666; font-size: 15px;">support@etc-platform.com</span>
                  </div>
                </div>
                
                <div style="display: flex; align-items: center; margin: 15px 0; padding: 12px; background: #fff5f5; border-radius: 8px;">
                  <span style="font-size: 20px; margin-right: 12px;">🐦</span>
                  <div>
                    <strong style="color: #ff6b6b; font-size: 14px;">Twitter:</strong><br/>
                    <span style="color: #666; font-size: 15px;">@etc_platform</span>
                  </div>
                </div>
                
                <div style="display: flex; align-items: center; margin: 15px 0; padding: 12px; background: #fff5f5; border-radius: 8px;">
                  <span style="font-size: 20px; margin-right: 12px;">💼</span>
                  <div>
                    <strong style="color: #ff6b6b; font-size: 14px;">LinkedIn:</strong><br/>
                    <span style="color: #666; font-size: 15px;">/company/etc-platform</span>
                  </div>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 25px;">
                <a href="mailto:hello@etc-platform.com" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; box-shadow: 0 4px 15px rgba(255,107,107,0.3); transition: all 0.3s ease;">
                  Send Email 📩
                </a>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: rgba(255,255,255,0.15); border-radius: 10px; backdrop-filter: blur(10px);">
              <p style="font-size: 14px; opacity: 0.95; margin: 0; line-height: 1.6;">
                ⚡ We typically respond within 24 hours<br/>
                🕐 Business hours: 9 AM - 6 PM EST, Monday - Friday<br/>
                🌍 Supporting creators worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    `,
    tags: ["contact", "support", "help"],
    author: { name: "Support Team", id: "static" },
    likes: 67,
    views: 203,
    isPublic: true,
    createdAt: "2024-01-10T09:15:00Z",
    category: "information",
    isEditable: true,
    priority: 4,
  },
  contribute: {
    id: "static-contribute",
    slug: "contribute",
    title: "Contribute to Our Platform",
    description:
      "Join our community of creators! Learn how you can contribute templates, provide feedback, and help grow our platform.",
    backgroundColor: "#8b5cf6",
    htmlContent: `
      <div style="font-family: 'Inter', 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 25px 50px rgba(139,92,246,0.3);">
        <div style="padding: 60px 40px; text-align: center; position: relative;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"stars\" width=\"25\" height=\"25\" patternUnits=\"userSpaceOnUse\"><polygon points=\"12.5,2 15.3,8.8 22.5,8.8 16.8,13.4 19.6,20.2 12.5,15.6 5.4,20.2 8.2,13.4 2.5,8.8 9.7,8.8\" fill=\"white\" opacity=\"0.08\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23stars)\"/></svg></div>
          
          <div style="position: relative; z-index: 1;">
            <div style="background: rgba(255,255,255,0.15); border-radius: 50%; width: 90px; height: 90px; margin: 0 auto 30px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
              <span style="font-size: 40px;">🤝</span>
            </div>
            
            <h1 style="font-size: 36px; margin: 0 0 15px 0; font-weight: 700; letter-spacing: -0.5px;">Join Our Community</h1>
            <p style="font-size: 18px; margin: 0 0 40px 0; opacity: 0.95; line-height: 1.6;">
              Help us build the best email template platform by contributing your creativity, feedback, and expertise to our growing community.
            </p>
            
            <div style="background: rgba(255,255,255,0.95); color: #8b5cf6; padding: 40px 35px; border-radius: 20px; margin: 40px 0; box-shadow: 0 15px 35px rgba(0,0,0,0.1); backdrop-filter: blur(10px);">
              <h3 style="margin: 0 0 25px 0; font-size: 26px; font-weight: 700; background: linear-gradient(135deg, #8b5cf6, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                🚀 How You Can Help
              </h3>
              
              <div style="text-align: left; display: grid; gap: 15px;">
                <div style="display: flex; align-items: flex-start; gap: 15px; padding: 15px; background: #f8fafc; border-radius: 12px; border-left: 4px solid #8b5cf6;">
                  <span style="font-size: 22px; margin-top: 2px;">🎨</span>
                  <div>
                    <strong style="color: #8b5cf6; font-size: 16px; display: block; margin-bottom: 4px;">Submit Templates</strong>
                    <span style="color: #64748b; font-size: 14px; line-height: 1.5;">Share your own email templates and help others create beautiful designs</span>
                  </div>
                </div>
                
                <div style="display: flex; align-items: flex-start; gap: 15px; padding: 15px; background: #f8fafc; border-radius: 12px; border-left: 4px solid #8b5cf6;">
                  <span style="font-size: 22px; margin-top: 2px;">🐛</span>
                  <div>
                    <strong style="color: #8b5cf6; font-size: 16px; display: block; margin-bottom: 4px;">Report & Improve</strong>
                    <span style="color: #64748b; font-size: 14px; line-height: 1.5;">Report bugs and suggest improvements to make the platform better</span>
                  </div>
                </div>
                
                <div style="display: flex; align-items: flex-start; gap: 15px; padding: 15px; background: #f8fafc; border-radius: 12px; border-left: 4px solid #8b5cf6;">
                  <span style="font-size: 22px; margin-top: 2px;">📝</span>
                  <div>
                    <strong style="color: #8b5cf6; font-size: 16px; display: block; margin-bottom: 4px;">Create Content</strong>
                    <span style="color: #64748b; font-size: 14px; line-height: 1.5;">Write tutorials, documentation, and guides for the community</span>
                  </div>
                </div>
                
                <div style="display: flex; align-items: flex-start; gap: 15px; padding: 15px; background: #f8fafc; border-radius: 12px; border-left: 4px solid #8b5cf6;">
                  <span style="font-size: 22px; margin-top: 2px;">💡</span>
                  <div>
                    <strong style="color: #8b5cf6; font-size: 16px; display: block; margin-bottom: 4px;">Share Ideas</strong>
                    <span style="color: #64748b; font-size: 14px; line-height: 1.5;">Propose new features and help shape the future of email design</span>
                  </div>
                </div>
                
                <div style="display: flex; align-items: flex-start; gap: 15px; padding: 15px; background: #f8fafc; border-radius: 12px; border-left: 4px solid #8b5cf6;">
                  <span style="font-size: 22px; margin-top: 2px;">⭐</span>
                  <div>
                    <strong style="color: #8b5cf6; font-size: 16px; display: block; margin-bottom: 4px;">Engage & Review</strong>
                    <span style="color: #64748b; font-size: 14px; line-height: 1.5;">Rate, review, and provide feedback on community templates</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style="margin: 35px 0;">
              <a href="/community" style="background: rgba(255,255,255,0.2); color: white; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: 600; display: inline-block; margin: 0 10px 15px; box-shadow: 0 8px 25px rgba(0,0,0,0.15); backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.3); transition: all 0.3s ease;">
                🎨 Start Contributing
              </a>
              <br/>
              <a href="https://github.com/etc-community" style="background: rgba(255,255,255,0.1); color: white; padding: 12px 24px; text-decoration: none; border-radius: 30px; font-weight: 500; display: inline-block; margin: 0 10px; font-size: 14px; border: 1px solid rgba(255,255,255,0.2);">
                📚 View on GitHub
              </a>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 12px; backdrop-filter: blur(10px);">
              <p style="margin: 0; font-size: 15px; opacity: 0.95; line-height: 1.7;">
                🌟 <strong>Join 1000+ contributors</strong> who are making email design accessible worldwide!<br/>
                Together, we're building something amazing. Every contribution matters! 🎉
              </p>
            </div>
          </div>
        </div>
      </div>
    `,
    tags: ["contribute", "community", "collaboration"],
    author: { name: "Community Team", id: "static" },
    likes: 89,
    views: 267,
    isPublic: true,
    createdAt: "2024-01-08T16:45:00Z",
    category: "community",
    isEditable: true,
    priority: 3,
  },
};
