/**
 * Simplexport function generateTemplatePreview(
  htmlContent: string,
  options: TemplatePreviewOptions = {}
): string {
  const {
    scale = 0.5,
    backgroundColor = '#ffffff'
  } = options;view utilities for email templates
 * Uses lightweight data URL approach instead of image generation
 */

export interface TemplatePreviewOptions {
  width?: number;
  height?: number;
  scale?: number;
  backgroundColor?: string;
}

export function generateTemplatePreview(
  htmlContent: string,
  options: TemplatePreviewOptions = {}
): string {
  const {
    width = 600,
    height = 400,
    scale = 0.6,
    backgroundColor = "#ffffff",
  } = options;

  // Clean the HTML content
  const cleanContent = htmlContent
    .replace(/<script[^>]*>.*?<\/script>/gi, "") // Remove scripts
    .replace(/javascript:/gi, "") // Remove javascript: protocols
    .replace(/on\w+="[^"]*"/gi, ""); // Remove event handlers

  // Create a complete HTML document for the preview
  const previewHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.5;
              background: ${backgroundColor};
              transform-origin: top left;
              transform: scale(${scale});
              width: ${Math.round(100 / scale)}%;
              min-height: ${Math.round(100 / scale)}%;
              display: flex;
              align-items: flex-start;
              justify-content: center;
              padding: 20px;
              pointer-events: none;
              overflow-x: hidden;
              overflow-y: auto;
            }
            .email-container {
              max-width: 600px;
              width: 100%;
              margin: 0 auto;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            a {
              pointer-events: none;
              text-decoration: none;
            }
            table {
              max-width: 100%;
              table-layout: fixed;
            }
            td, th {
              word-wrap: break-word;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            ${cleanContent}
          </div>
        </body>
      </html>
    `;

  // Return as data URL for iframe src
  return `data:text/html;charset=utf-8,${encodeURIComponent(previewHtml)}`;
}

export function generateSimpleFallback(templateTitle: string): string {
  const fallbackHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
              color: white;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              text-align: center;
            }
            .icon {
              width: 64px;
              height: 64px;
              background: rgba(255,255,255,0.2);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
              font-size: 24px;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 10px;
              font-weight: bold;
            }
            p {
              font-size: 16px;
              opacity: 0.9;
            }
          </style>
        </head>
        <body>
          <div class="icon">📧</div>
          <h1>${templateTitle}</h1>
          <p>Click to view full template</p>
        </body>
      </html>
    `;

  return `data:text/html;charset=utf-8,${encodeURIComponent(fallbackHtml)}`;
}
