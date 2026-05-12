import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAllWorks } from '@/lib/literature-data'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q      = searchParams.get('q')?.trim()
  const limit  = Math.min(Number(searchParams.get('limit') ?? 20), 100)

  if (!q || q.length < 2) {
    return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 })
  }

  // Try PostgreSQL full-text search first; fall back to in-memory JSON search
  // so the feature works even before the database is seeded.
  try {
    const results = await prisma.$queryRaw<Array<{
      id: number
      title: string
      author: string
      year_published: number
      region: string
      genre: string
      era: string
      description: string
      significance: string | null
      rank: number
    }>>`
      SELECT
        id,
        title,
        author,
        "yearPublished"   AS year_published,
        region,
        genre,
        era,
        description,
        significance,
        ts_rank(
          to_tsvector('english', title || ' ' || author || ' ' || description || ' ' || COALESCE(significance, '')),
          plainto_tsquery('english', ${q})
        ) AS rank
      FROM "Work"
      WHERE
        to_tsvector('english', title || ' ' || author || ' ' || description || ' ' || COALESCE(significance, ''))
        @@ plainto_tsquery('english', ${q})
      ORDER BY rank DESC
      LIMIT ${limit}
    `

    return NextResponse.json({
      query: q,
      results: results.map(r => ({
        id:            r.id,
        title:         r.title,
        author:        r.author,
        yearPublished: r.year_published,
        region:        r.region,
        genre:         r.genre,
        era:           r.era,
        description:   r.description,
        significance:  r.significance,
      })),
      total: results.length,
      source: 'db',
    })
  } catch {
    // Database unavailable or not seeded — fall back to keyword search over the JSON
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
    const all = getAllWorks()
    const scored = all
      .map(w => {
        const corpus = `${w.title} ${w.author} ${w.description} ${w.significance ?? ''} ${w.region} ${w.genre} ${w.era}`.toLowerCase()
        const score = terms.reduce((s, t) => {
          const count = (corpus.match(new RegExp(t, 'g')) ?? []).length
          // Title/author matches count double
          const titleScore = (`${w.title} ${w.author}`.toLowerCase().includes(t) ? 2 : 0)
          return s + count + titleScore
        }, 0)
        return { work: w, score }
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return NextResponse.json({
      query: q,
      results: scored.map(x => ({
        id:            x.work.id,
        title:         x.work.title,
        author:        x.work.author,
        yearPublished: x.work.yearPublished,
        region:        x.work.region,
        genre:         x.work.genre,
        era:           x.work.era,
        description:   x.work.description,
        significance:  x.work.significance ?? null,
      })),
      total: scored.length,
      source: 'json',
    })
  }
}
