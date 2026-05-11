import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q      = searchParams.get('q')?.trim()
  const limit  = Math.min(Number(searchParams.get('limit') ?? 20), 100)

  if (!q || q.length < 2) {
    return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 })
  }

  // Use PostgreSQL full-text search across all text fields.
  // We rank by ts_rank so the most relevant results come first.
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
      id:           r.id,
      title:        r.title,
      author:       r.author,
      yearPublished: r.year_published,
      region:       r.region,
      genre:        r.genre,
      era:          r.era,
      description:  r.description,
      significance: r.significance,
    })),
    total: results.length,
  })
}
