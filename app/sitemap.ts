import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date();

  return [
    { url: site.url, lastModified: updated, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${site.url}/work/${project.slug}/`,
      lastModified: updated,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
