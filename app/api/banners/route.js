import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSanityBanners } from "@/lib/sanity";
const dataDir = path.join(process.cwd(), "data");
const bannersFilePath = path.join(dataDir, "banners.json");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "o9db6b0a";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-08-30";
const token = process.env.SANITY_API_TOKEN || "skNarasi77pxUewm96uLeNwHaSrmpkcOal68R7i1ukno1JJyh6Py67Aq2H6aUt7jTsYqir6BphcY9LfVGKTwOURXfQysyp7F2z8iH00GPSYJKIM7ZKZQ4tTyZj0Iq7AdNPGGYST7WF5lIVSDL5pwvHN9GCXBVW41gwB1YbbulmnwLsyzXy72";
const defaultBanners = [
  {
    _id: "banner-dr-ar-oliv-e-c",
    title: "Dr. AR OLIV-E-C Whitening Active Concentrate",
    imageUrl: "/banners/banner-oliv-e-c.jpg",
    link: "/product/dr-ar-oliv-e-c-whitening-serum",
    order: 1
  },
  {
    _id: "banner-dr-ar-mak",
    title: "Dr. AR Mak Mandelic Acid Serum",
    imageUrl: "/banners/banner-mak.jpg",
    link: "/product/dr-ar-mak-mandelic-acid-serum",
    order: 2
  },
  {
    _id: "banner-dr-ar-eye-s",
    title: "Dr. AR EYE-S Eye Protect Shampoo",
    imageUrl: "/banners/banner-eye-s.jpg",
    link: "/product/dr-ar-eye-s-eye-protect-shampoo",
    order: 3
  }
];
function getLocalBanners() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (fs.existsSync(bannersFilePath)) {
      const content = fs.readFileSync(bannersFilePath, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    fs.writeFileSync(bannersFilePath, JSON.stringify(defaultBanners, null, 2), "utf-8");
    return defaultBanners;
  } catch (err) {
    console.error("Error reading banners.json:", err);
    return defaultBanners;
  }
}
function saveLocalBanners(banners) {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(bannersFilePath, JSON.stringify(banners, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving banners.json:", err);
  }
}
export async function GET() {
  try {
    const local = getLocalBanners();
    let sanityBanners = [];
    try {
      sanityBanners = await getSanityBanners();
    } catch (e2) {
      sanityBanners = [];
    }
    const bannerMap = /* @__PURE__ */ new Map();
    for (const b of local) {
      bannerMap.set(b._id, b);
    }
    for (const b of sanityBanners) {
      if (!bannerMap.has(b._id)) {
        bannerMap.set(b._id, b);
      }
    }
    const merged = Array.from(bannerMap.values()).sort((a, b) => (a.order || 1) - (b.order || 1));
    return NextResponse.json({ success: true, banners: merged.length > 0 ? merged : defaultBanners });
  } catch (error) {
    return NextResponse.json({ success: true, banners: defaultBanners });
  }
}
export async function POST(req) {
  try {
    const body = await req.json();
    const { _id, title, imageUrl, link, order } = body;
    const bannerId = _id || `banner-${Date.now()}`;
    const doc = {
      _id: bannerId,
      title: title || "Homepage Hero Banner",
      imageUrl: imageUrl || "/banners/banner-oliv-e-c.jpg",
      link: link || "/shop",
      order: Number(order) || 1
    };
    const current = getLocalBanners();
    const existingIndex = current.findIndex((b) => b._id === bannerId);
    if (existingIndex >= 0) {
      current[existingIndex] = doc;
    } else {
      current.push(doc);
    }
    current.sort((a, b) => (a.order || 1) - (b.order || 1));
    saveLocalBanners(current);
    try {
      const sanityDoc = {
        _type: "banner",
        _id: bannerId,
        title: doc.title,
        imageUrl: doc.imageUrl,
        link: doc.link,
        order: doc.order
      };
      const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ mutations: [{ createOrReplace: sanityDoc }] })
      });
    } catch (e) {
      console.warn("Sanity banner sync notice:", e);
    }
    return NextResponse.json({ success: true, banner: doc });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Banner ID required" }, { status: 400 });
    }
    const current = getLocalBanners();
    const filtered = current.filter((b) => b._id !== id);
    saveLocalBanners(filtered);
    try {
      const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ mutations: [{ delete: { id } }] })
      });
    } catch (e) {
      console.warn("Sanity banner delete notice:", e);
    }
    return NextResponse.json({ success: true, message: "Banner removed" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
