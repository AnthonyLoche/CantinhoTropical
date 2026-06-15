export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/login",
        ],
      },
    ],

    sitemap: "https://www.cantinhotropical.pt/sitemap.xml",

    host: "https://www.cantinhotropical.pt",
  };
}