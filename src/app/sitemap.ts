import type { MetadataRoute } from "next";
import { DEFAULT_CONTENT } from "@/lib/content";

const BASE = "https://www.altraware.co.tz";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/platforms`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/process`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/pricing`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/impact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const posts: MetadataRoute.Sitemap = DEFAULT_CONTENT.blog.posts
    .filter((p) => p.published)
    .map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticPages, ...posts];
}
