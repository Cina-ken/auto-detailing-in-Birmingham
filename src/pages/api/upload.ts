// src/pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { IncomingForm, Fields, Files } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ message: "Upload error" });
    }
    // Get section, category, title, description, tags
    const section = Array.isArray(fields.section)
      ? fields.section[0]
      : fields.section || "gallery";
    const category = Array.isArray(fields.category)
      ? fields.category[0]
      : fields.category || "exterior";
    const title = Array.isArray(fields.title)
      ? fields.title[0]
      : fields.title || "";
    const description = Array.isArray(fields.description)
      ? fields.description[0]
      : fields.description || "";
    const tagsRaw = Array.isArray(fields.tags)
      ? fields.tags[0]
      : fields.tags || "";
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Handle before/after images
    const beforeFile = Array.isArray(files.beforeImage)
      ? files.beforeImage[0]
      : files.beforeImage;
    const afterFile = files.afterImage
      ? Array.isArray(files.afterImage)
        ? files.afterImage[0]
        : files.afterImage
      : null;
    if (!beforeFile) {
      return res.status(400).json({ message: "No before image uploaded" });
    }
    const beforeFilename = path.basename(beforeFile.filepath);
    const afterFilename = afterFile ? path.basename(afterFile.filepath) : "";

    // Prepare new entry
    const newEntry = {
      section,
      category,
      title,
      description,
      tags,
      beforeImage: `/uploads/${beforeFilename}`,
      afterImage: afterFilename ? `/uploads/${afterFilename}` : "",
      createdAt: new Date().toISOString(),
    };

    // Save to uploads/metadata.json
    const metaPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "metadata.json"
    );
  let data: unknown[] = [];
    if (fs.existsSync(metaPath)) {
      try {
        data = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      } catch {
        data = [];
      }
    }
    data.unshift(newEntry); // Add new entry to the start
    fs.writeFileSync(metaPath, JSON.stringify(data, null, 2));

    return res
      .status(200)
      .json({ message: "File(s) uploaded", entry: newEntry });
  });
}
