import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "../../public/uploads");

/**
 * Maps mime types to standard image file extensions.
 */
const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

/**
 * Validates an image URL, downloads it, and saves it to the local uploads directory.
 * @param url The external image URL
 * @returns The relative path to the downloaded image (e.g., /uploads/xyz.jpg)
 */
export async function downloadAndSaveImage(url: string): Promise<string> {
  try {
    // 1. Basic URL validation
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new Error("Invalid URL protocol. Only HTTP and HTTPS are supported.");
    }

    // 2. Fetch the image
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image. Status: ${response.status}`);
    }

    // 3. Validate content-type
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      throw new Error(`The URL does not resolve to an image. Content-Type: ${contentType}`);
    }

    // 4. Determine extension
    let ext = MIME_EXTENSION_MAP[contentType.toLowerCase()] || "";
    if (!ext) {
      // Fallback: try to get extension from URL path
      const pathname = parsedUrl.pathname;
      const urlExt = path.extname(pathname).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(urlExt)) {
        ext = urlExt;
      } else {
        ext = ".jpg"; // Ultimate fallback
      }
    }

    // 5. Ensure uploads folder exists
    await fs.mkdir(uploadsDir, { recursive: true });

    // 6. Generate a unique name and write file
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    const destinationPath = path.join(uploadsDir, uniqueName);

    const arrayBuffer = await response.arrayBuffer();
    await fs.writeFile(destinationPath, Buffer.from(arrayBuffer));

    return `/uploads/${uniqueName}`;
  } catch (error: any) {
    throw new Error(`Image validation and download failed: ${error.message}`);
  }
}

/**
 * Deletes a local image file by its relative path.
 * @param imagePath The relative path (e.g., /uploads/xyz.jpg)
 */
export async function deleteImageFile(imagePath: string): Promise<void> {
  if (!imagePath || !imagePath.startsWith("/uploads/")) {
    return;
  }

  try {
    const fileName = imagePath.replace("/uploads/", "");
    // Prevent directory traversal attacks
    if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
      return;
    }
    const fullPath = path.join(uploadsDir, fileName);
    await fs.unlink(fullPath);
    console.log(`Deleted local image file: ${fullPath}`);
  } catch (error: any) {
    // If the file doesn't exist, we don't care, otherwise log it
    if (error.code !== "ENOENT") {
      console.error(`Failed to delete local image file ${imagePath}:`, error);
    }
  }
}
