import type { MetadataRoute } from "next";
import { infoIds } from "@/lib/content";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

// To add a page (for example a blog article), add its path to this list.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...infoIds.map((id) => `/${id}`)];
  return paths.map((path) => ({ url: `${siteUrl}${path}`, lastModified: new Date() }));
}
