import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "o9db6b0a";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-08-30";
const token = process.env.SANITY_API_TOKEN || "skNarasi77pxUewm96uLeNwHaSrmpkcOal68R7i1ukno1JJyh6Py67Aq2H6aUt7jTsYqir6BphcY9LfVGKTwOURXfQysyp7F2z8iH00GPSYJKIM7ZKZQ4tTyZj0Iq7AdNPGGYST7WF5lIVSDL5pwvHN9GCXBVW41gwB1YbbulmnwLsyzXy72";
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) {
      return NextResponse.json({ success: false, error: "No image file provided" }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    try {
      const sanityUploadUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/assets/images/${dataset}?filename=${encodeURIComponent(file.name)}`;
      const sanityRes = await fetch(sanityUploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": file.type || "image/jpeg",
          Authorization: `Bearer ${token}`
        },
        body: buffer
      });
      const sanityData = await sanityRes.json();
      if (sanityRes.ok && sanityData.document && sanityData.document.url) {
        return NextResponse.json({
          success: true,
          url: sanityData.document.url,
          assetId: sanityData.document._id
        });
      }
    } catch (sanityErr) {
      console.warn("Sanity asset upload fallback to local storage:", sanityErr);
    }
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const ext = path.extname(file.name) || ".jpg";
    const cleanFileName = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, cleanFileName);
    fs.writeFileSync(filePath, buffer);
    const localUrl = `/uploads/${cleanFileName}`;
    return NextResponse.json({
      success: true,
      url: localUrl
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
