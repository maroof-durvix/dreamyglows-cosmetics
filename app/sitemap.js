import { officialProducts } from "@/lib/products";
export default async function sitemap() {
  const baseUrl = "https://dreamyglows.com";
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: /* @__PURE__ */ new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: /* @__PURE__ */ new Date(),
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${baseUrl}/about`,
      lastModified: /* @__PURE__ */ new Date(),
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: /* @__PURE__ */ new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${baseUrl}/order-tracking`,
      lastModified: /* @__PURE__ */ new Date(),
      changeFrequency: "weekly",
      priority: 0.6
    },
    {
      url: `${baseUrl}/policies/shipping`,
      lastModified: /* @__PURE__ */ new Date(),
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: `${baseUrl}/policies/returns`,
      lastModified: /* @__PURE__ */ new Date(),
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: `${baseUrl}/policies/privacy`,
      lastModified: /* @__PURE__ */ new Date(),
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: `${baseUrl}/policies/terms`,
      lastModified: /* @__PURE__ */ new Date(),
      changeFrequency: "monthly",
      priority: 0.5
    }
  ];
  const productRoutes = officialProducts.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: /* @__PURE__ */ new Date(),
    changeFrequency: "weekly",
    priority: 0.85
  }));
  return [...staticRoutes, ...productRoutes];
}
