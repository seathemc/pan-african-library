// Robots directive.
// Audit pass XVI (2026-05-15): added because we had no crawl directives at all.
// Defaults to "everything indexable" since we want search engines finding the
// archive. /api routes blocked because they're for the app, not crawlers.

import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/'],
      },
    ],
    sitemap: 'https://wisdom.pan-african-library.example/sitemap.xml',
  }
}
