import { MetadataRoute } from "next";
import { siteConfig } from "@/content/site.config";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.meta.name,
    short_name: "Kushbhawanpur Foundation",
    description: siteConfig.meta.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#FFF9EF",
    theme_color: "#FFF9EF",
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
