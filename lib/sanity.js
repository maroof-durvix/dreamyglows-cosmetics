function _optionalChain(ops) {
  let lastAccessLHS = void 0;
  let value = ops[0];
  let i = 1;
  while (i < ops.length) {
    const op = ops[i];
    const fn = ops[i + 1];
    i += 2;
    if ((op === "optionalAccess" || op === "optionalCall") && value == null) {
      return void 0;
    }
    if (op === "access" || op === "optionalAccess") {
      lastAccessLHS = value;
      value = fn(value);
    } else if (op === "call" || op === "optionalCall") {
      value = fn((...args) => value.call(lastAccessLHS, ...args));
      lastAccessLHS = void 0;
    }
  }
  return value;
}
import { createClient } from "@sanity/client";
import { officialProducts } from "./products";
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "o9db6b0a",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-08-30",
  useCdn: false,
  ...typeof window === "undefined" ? { token: process.env.SANITY_API_TOKEN || "skNarasi77pxUewm96uLeNwHaSrmpkcOal68R7i1ukno1JJyh6Py67Aq2H6aUt7jTsYqir6BphcY9LfVGKTwOURXfQysyp7F2z8iH00GPSYJKIM7ZKZQ4tTyZj0Iq7AdNPGGYST7WF5lIVSDL5pwvHN9GCXBVW41gwB1YbbulmnwLsyzXy72" } : {}
});
;
export function normalizeSanityProduct(doc) {
  let resolvedImages = [];
  if (Array.isArray(doc.resolvedImages) && doc.resolvedImages.length > 0) {
    resolvedImages = doc.resolvedImages.filter(Boolean);
  } else if (Array.isArray(doc.images) && doc.images.length > 0) {
    resolvedImages = doc.images.map((img) => typeof img === "string" ? img : _optionalChain([img, "optionalAccess", (_) => _.asset, "optionalAccess", (_2) => _2.url]) || _optionalChain([img, "optionalAccess", (_3) => _3.url]) || "").filter(Boolean);
  } else if (doc.imageUrl) {
    resolvedImages = [doc.imageUrl];
  } else if (_optionalChain([doc, "access", (_4) => _4.image, "optionalAccess", (_5) => _5.asset, "optionalAccess", (_6) => _6.url])) {
    resolvedImages = [doc.image.asset.url];
  }
  if (resolvedImages.length === 0) {
    const s = (_optionalChain([doc, "access", (_7) => _7.slug, "optionalAccess", (_8) => _8.current]) || doc.slug || doc.title || "").toLowerCase();
    if (s.includes("oliv") || s.includes("whitening")) {
      resolvedImages = ["/products/dr-ar-oliv-e-c.jpg", "/products/dr-ar-oliv-e-c-full.jpg"];
    } else if (s.includes("mak") || s.includes("mandelic")) {
      resolvedImages = ["/products/dr-ar-mak.jpg", "/products/dr-ar-mak-full.jpg"];
    } else if (s.includes("eye-s") || s.includes("eye") || s.includes("shampoo") || s.includes("cleansing")) {
      resolvedImages = ["/products/dr-ar-eye-s.jpg", "/products/dr-ar-eye-s-full.jpg"];
    } else {
      resolvedImages = ["/products/dr-ar-oliv-e-c.jpg"];
    }
  }
  return {
    _id: doc._id || `sanity-${Date.now()}`,
    title: doc.title || "Untitled Product",
    slug: _optionalChain([doc, "access", (_9) => _9.slug, "optionalAccess", (_10) => _10.current]) || doc.slug || doc._id,
    category: doc.category || "Skin Care",
    gender: doc.gender || "Unisex",
    concern: Array.isArray(doc.concern) ? doc.concern : [doc.concern || "All Skin Types"],
    description: doc.description || "",
    benefits: Array.isArray(doc.benefits) ? doc.benefits : typeof doc.benefits === "string" ? doc.benefits.split("\n").filter(Boolean) : [],
    ingredients: Array.isArray(doc.ingredients) ? doc.ingredients : typeof doc.ingredients === "string" ? doc.ingredients.split(",").map((s) => s.trim()).filter(Boolean) : [],
    howToUse: Array.isArray(doc.howToUse) ? doc.howToUse : typeof doc.howToUse === "string" ? doc.howToUse.split("\n").filter(Boolean) : [],
    specs: Array.isArray(doc.specs) ? doc.specs : [
      { key: "Category", value: doc.category || "Skin Care" },
      { key: "Gender", value: doc.gender || "Unisex" },
      { key: "Origin", value: "Formulated in Pakistan" },
      { key: "Cruelty Free", value: "100% Yes" }
    ],
    variants: Array.isArray(doc.variants) && doc.variants.length > 0 ? doc.variants.map((v) => ({
      sku: v.sku || `${doc._id}-V1`,
      title: v.title || "Standard (30ml)",
      price: Number(v.price) || Number(doc.price) || 2450,
      compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : doc.compareAtPrice ? Number(doc.compareAtPrice) : void 0,
      inStock: v.inStock !== false
    })) : [
      {
        sku: `${doc._id}-STD`,
        title: "Standard (30ml)",
        price: Number(doc.price) || 2450,
        compareAtPrice: doc.compareAtPrice ? Number(doc.compareAtPrice) : void 0,
        inStock: doc.inStock !== false
      }
    ],
    images: resolvedImages,
    rating: Number(doc.rating) || 4.9,
    reviewCount: Number(doc.reviewCount) || 28,
    featured: Boolean(doc.featured),
    faqs: Array.isArray(doc.faqs) ? doc.faqs : []
  };
}
export async function getSanityProducts() {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.products) && data.products.length > 0) {
          return data.products;
        }
      }
    } catch (e) {
    }
    return officialProducts;
  }
  try {
    const query = `*[_type == "product" && !(slug.current match "*rosemary*") && !(title match "*rosemary*")] {
      ...,
      "slug": coalesce(slug.current, slug, _id),
      "imageUrl": coalesce(imageUrl, image.asset->url, images[0].asset->url),
      "resolvedImages": coalesce(
        images[].asset->url,
        images[].url,
        [imageUrl],
        [image.asset->url]
      )
    } | order(_createdAt desc)`;
    const rawProducts = await sanityClient.fetch(query);
    if (Array.isArray(rawProducts) && rawProducts.length > 0) {
      const normalized = rawProducts.map(normalizeSanityProduct).filter((p) => {
        const s = `${p.slug} ${p.title} ${p._id}`.toLowerCase();
        return !s.includes("rosemary") && !s.includes("niacinamide") && p._id !== "product-1788606749913";
      });
      const existingSlugs = new Set(normalized.map((p) => p.slug));
      const existingIds = new Set(normalized.map((p) => p._id));
      for (const off of officialProducts) {
        if (!existingSlugs.has(off.slug) && !existingIds.has(off._id)) {
          normalized.push(off);
        }
      }
      return normalized;
    }
  } catch (error) {
  }
  return officialProducts;
}
export async function getSanityProductBySlug(slug) {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/products?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          return data.product;
        }
      }
    } catch (e2) {
    }
    return officialProducts.find((p) => p.slug === slug || p._id === slug) || null;
  }
  try {
    const query = `*[_type == "product" && (slug.current == $slug || slug == $slug || _id == $slug)][0] {
      ...,
      "slug": coalesce(slug.current, slug, _id),
      "imageUrl": coalesce(imageUrl, image.asset->url, images[0].asset->url),
      "resolvedImages": coalesce(
        images[].asset->url,
        images[].url,
        [imageUrl],
        [image.asset->url]
      )
    }`;
    const doc = await sanityClient.fetch(query, { slug });
    if (doc) {
      return normalizeSanityProduct(doc);
    }
  } catch (error) {
  }
  return officialProducts.find((p) => p.slug === slug || p._id === slug) || null;
}
export async function getSanityBanners() {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/banners");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.banners) && data.banners.length > 0) {
          return data.banners;
        }
      }
    } catch (e3) {
    }
    return [];
  }
  try {
    const query = `*[_type == "banner"] {
      ...,
      "imageUrl": coalesce(imageUrl, image.asset->url)
    } | order(order asc, _createdAt desc)`;
    const rawBanners = await sanityClient.fetch(query);
    if (Array.isArray(rawBanners) && rawBanners.length > 0) {
      return rawBanners.map((b) => ({
        _id: b._id,
        title: b.title || "Promotion Banner",
        imageUrl: b.imageUrl || "",
        link: b.link || "/shop",
        order: b.order || 1
      }));
    }
  } catch (error) {
  }
  return [];
}
