// Sitemap generator.
// Audit pass XVI (2026-05-15): added because search engines had no map of
// our 561 works, dashboards, and themes. Generated at build time from the
// literature DB JSON.

import type { MetadataRoute } from 'next'
import db from '@/pan-african-literature-database.json'

const BASE_URL = 'https://wisdom.pan-african-library.example'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  // Static high-priority pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/africa-2050`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/africa-2050?view=goals`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/futures`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/audit`, lastModified, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/browse`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/search`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/themes`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/reading-lists`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/ask`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/developer`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/manifesto`, lastModified, changeFrequency: 'yearly', priority: 0.6 },
  ]

  // One URL per work (561 of them)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const works = (db as any).panAfricanLiterature.works as Array<{ id: number }>
  const workRoutes: MetadataRoute.Sitemap = works.map((w) => ({
    url: `${BASE_URL}/work/${w.id}`,
    lastModified,
    changeFrequency: 'yearly' as const,
    priority: 0.4,
  }))

  // Regional/era/genre browse routes — derived from unique values in the DB
  const regions = new Set<string>()
  const eras = new Set<string>()
  const genres = new Set<string>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const w of works as Array<any>) {
    if (w.region) regions.add(w.region)
    if (w.era) eras.add(w.era)
    if (w.genre) genres.add(w.genre)
  }
  const filterRoutes: MetadataRoute.Sitemap = [
    ...Array.from(regions).map((r) => ({
      url: `${BASE_URL}/browse/region/${encodeURIComponent(r.toLowerCase())}`,
      lastModified, changeFrequency: 'monthly' as const, priority: 0.5,
    })),
    ...Array.from(eras).map((e) => ({
      url: `${BASE_URL}/browse/era/${encodeURIComponent(e.toLowerCase())}`,
      lastModified, changeFrequency: 'monthly' as const, priority: 0.5,
    })),
    ...Array.from(genres).map((g) => ({
      url: `${BASE_URL}/browse/genre/${encodeURIComponent(g.toLowerCase())}`,
      lastModified, changeFrequency: 'monthly' as const, priority: 0.5,
    })),
  ]

  return [...staticRoutes, ...workRoutes, ...filterRoutes]
}
