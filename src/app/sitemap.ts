import type { MetadataRoute } from "next";

const SITE_URL = "https://studygenie-ai-one.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/login`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/signup`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/dashboard`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/library`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/quiz`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/flashcards`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/analytics`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/chat`, lastModified, changeFrequency: "weekly", priority: 0.7 },
  ];
}
