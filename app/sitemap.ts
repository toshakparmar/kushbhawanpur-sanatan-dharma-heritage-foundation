import { MetadataRoute } from "next";
import { siteConfig } from "@/content/site.config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.meta.siteUrl;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
