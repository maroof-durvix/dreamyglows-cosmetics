export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/account", "/checkout"]
      }
    ],
    sitemap: "https://dreamyglows.com/sitemap.xml"
  };
}
