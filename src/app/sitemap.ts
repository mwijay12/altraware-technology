import type { MetadataRoute } from "next";
import { DEFAULT_CONTENT } from "@/lib/content";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://altra.tanzaniareach.com";
const IMG = DEFAULT_CONTENT.images;

/* Collect all portfolio & showcase images (Cloudinary) */
const PROJECT_IMAGES = DEFAULT_CONTENT.projects.flatMap((p) =>
  p.media.filter((m) => m.type === "image").map((m) => m.url)
);

/* Key site images with SEO keywords — Google indexes sitemap images,
   so descriptive URLs here help photos surface in image search. */
const HOME_IMAGES = [
  IMG.heroDar,
  IMG.streetTz,
  IMG.community,
  IMG.liveDemoPoster,
  `${BASE}/logo.png`,
  `${BASE}/logo.jpg`,
  `${BASE}/faidahq.png`,
  ...PROJECT_IMAGES.slice(0, 4),
];

const ABOUT_IMAGES = [
  IMG.streetTz,
  IMG.community,
  IMG.webPreview,
  IMG.heroDar,
  `${BASE}/logo.jpg`,
];

const SERVICES_IMAGES = [
  IMG.webPreview,
  IMG.sectorSchool,
  IMG.sectorRetail,
  IMG.sectorNgo,
];

const PLATFORMS_IMAGES = [
  IMG.liveDemoPoster,
  `${BASE}/faidahq.png`,
  ...PROJECT_IMAGES,
];

const IMPACT_IMAGES = DEFAULT_CONTENT.impact.sectors.map((s) => s.image);

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1, images: HOME_IMAGES },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.8, images: ABOUT_IMAGES },
    { url: `${BASE}/services`, changeFrequency: "monthly", priority: 0.9, images: SERVICES_IMAGES },
    { url: `${BASE}/platforms`, changeFrequency: "monthly", priority: 0.9, images: PLATFORMS_IMAGES },
    { url: `${BASE}/process`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/pricing`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/impact`, changeFrequency: "monthly", priority: 0.8, images: IMPACT_IMAGES },
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
      images: p.cover ? [p.cover] : [],
    }));

  return [...staticPages, ...posts];
}
