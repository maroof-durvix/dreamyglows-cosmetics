import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSanityProducts } from "@/lib/sanity";
const dataDir = path.join(process.cwd(), "data");
const productsFilePath = path.join(dataDir, "products.json");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "o9db6b0a";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-08-30";
const token = process.env.SANITY_API_TOKEN || "skNarasi77pxUewm96uLeNwHaSrmpkcOal68R7i1ukno1JJyh6Py67Aq2H6aUt7jTsYqir6BphcY9LfVGKTwOURXfQysyp7F2z8iH00GPSYJKIM7ZKZQ4tTyZj0Iq7AdNPGGYST7WF5lIVSDL5pwvHN9GCXBVW41gwB1YbbulmnwLsyzXy72";
function getLocalProducts() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (fs.existsSync(productsFilePath)) {
      const data = fs.readFileSync(productsFilePath, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("Error reading local products.json:", err);
  }
  return [];
}
function saveLocalProducts(products) {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving local products.json:", err);
  }
}
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    let sanityList = [];
    try {
      sanityList = await getSanityProducts();
    } catch (e) {
      sanityList = [];
    }
    const localList = getLocalProducts();
    const mergedMap = /* @__PURE__ */ new Map();
    for (const p of sanityList) {
      const s = `${p.slug} ${p.title} ${p._id}`.toLowerCase();
      if (!s.includes("rosemary") && !s.includes("niacinamide") && p._id !== "product-1788606749913") {
        mergedMap.set(p.slug, p);
      }
    }
    for (const p of localList) {
      const s = `${p.slug} ${p.title} ${p._id}`.toLowerCase();
      if (!s.includes("rosemary") && !s.includes("niacinamide") && p._id !== "product-1788606749913") {
        mergedMap.set(p.slug, p);
      }
    }
    const allProducts = Array.from(mergedMap.values());
    if (slug) {
      const found = allProducts.find((p) => p.slug === slug || p._id === slug);
      return NextResponse.json({ success: true, product: found || null });
    }
    return NextResponse.json({ success: true, products: allProducts });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      _id,
      title,
      slug,
      category,
      gender,
      concern,
      description,
      benefits,
      ingredients,
      howToUse,
      price,
      compareAtPrice,
      imageUrl,
      inStock,
      featured
    } = body;
    const formattedSlug = (slug || title || "product").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const docId = _id || `product-${Date.now()}`;
    const parsedBenefits = Array.isArray(benefits) ? benefits : typeof benefits === "string" ? benefits.split("\n").map((s) => s.trim()).filter(Boolean) : [];
    const parsedIngredients = Array.isArray(ingredients) ? ingredients : typeof ingredients === "string" ? ingredients.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const parsedHowToUse = Array.isArray(howToUse) ? howToUse : typeof howToUse === "string" ? howToUse.split("\n").map((s) => s.trim()).filter(Boolean) : [];
    const parsedConcern = Array.isArray(concern) ? concern : typeof concern === "string" ? concern.split(",").map((s) => s.trim()).filter(Boolean) : ["All Skin Types"];
    const resolvedImageUrl = imageUrl || "/hero-oliv-c.png";
    const newProduct = {
      _id: docId,
      title: title || "New Clinical Formula",
      slug: formattedSlug,
      category: category || "Skin Care",
      gender: gender || "Unisex",
      concern: parsedConcern,
      description: description || "",
      benefits: parsedBenefits,
      ingredients: parsedIngredients,
      howToUse: parsedHowToUse,
      variants: [
        {
          sku: `${formattedSlug.toUpperCase().slice(0, 10)}-30ML`,
          title: "30ml Dropper Bottle",
          price: Number(price) || 2450,
          compareAtPrice: compareAtPrice ? Number(compareAtPrice) : void 0,
          stock: 50,
          inStock: inStock !== false
        }
      ],
      images: [resolvedImageUrl],
      rating: 5,
      reviewCount: 1,
      featured: Boolean(featured),
      specs: [
        { key: "Volume", value: "30ml (1.0 fl. oz)" },
        { key: "Skin Type", value: "All Skin Types" }
      ],
      faqs: []
    };
    const localProducts = getLocalProducts();
    const existingIndex = localProducts.findIndex((p) => p._id === docId || p.slug === formattedSlug);
    if (existingIndex >= 0) {
      localProducts[existingIndex] = newProduct;
    } else {
      localProducts.unshift(newProduct);
    }
    saveLocalProducts(localProducts);
    try {
      const sanityDoc = {
        _type: "product",
        _id: docId,
        title: newProduct.title,
        slug: { _type: "slug", current: formattedSlug },
        category: newProduct.category,
        gender: newProduct.gender,
        concern: newProduct.concern,
        description: newProduct.description,
        benefits: newProduct.benefits,
        ingredients: newProduct.ingredients,
        howToUse: newProduct.howToUse,
        variants: newProduct.variants.map((v, i) => ({
          _key: `var-${i + 1}`,
          ...v
        })),
        imageUrl: resolvedImageUrl,
        rating: 5,
        reviewCount: 1,
        featured: Boolean(featured)
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
    } catch (sanityErr) {
      console.warn("Sanity cloud mutation note (local save succeeded):", sanityErr);
    }
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("API Error saving product:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
    }
    const localProducts = getLocalProducts();
    const updated = localProducts.filter((p) => p._id !== id && p.slug !== id);
    saveLocalProducts(updated);
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
    } catch (sanityErr) {
      console.warn("Sanity cloud delete note:", sanityErr);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
