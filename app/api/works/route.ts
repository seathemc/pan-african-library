import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAllWorks } from '@/lib/literature-data'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const region = searchParams.get('region')
  const era    = searchParams.get('era')
  const genre  = searchParams.get('genre')
  const theme  = searchParams.get('theme')
  const q      = searchParams.get('q')
  const limit  = Math.min(Number(searchParams.get('limit') ?? 50), 200)
  const offset = Number(searchParams.get('offset') ?? 0)

  try {
    const where: Parameters<typeof prisma.work.findMany>[0]['where'] = {}

    if (region) where.region = { equals: region, mode: 'insensitive' }
    if (era)    where.era    = { equals: era,    mode: 'insensitive' }
    if (genre)  where.genre  = { equals: genre,  mode: 'insensitive' }
    if (theme)  where.themes = { some: { theme: { slug: theme } } }

    if (q) {
      where.OR = [
        { title:        { contains: q, mode: 'insensitive' } },
        { author:       { contains: q, mode: 'insensitive' } },
        { description:  { contains: q, mode: 'insensitive' } },
        { significance: { contains: q, mode: 'insensitive' } },
        { country:      { contains: q, mode: 'insensitive' } },
      ]
    }

    const [works, total] = await Promise.all([
      prisma.work.findMany({
        where,
        include: {
          accessLinks: true,
          themes: { include: { theme: true } },
        },
        orderBy: { yearPublished: 'asc' },
        take: limit,
        skip: offset,
      }),
      prisma.work.count({ where }),
    ])

    return NextResponse.json({
      works: works.map(normalizeWork),
      total,
      limit,
      offset,
    })
  } catch {
    // Database unavailable — fall back to JSON file
    let all = getAllWorks()
    if (region) all = all.filter(w => w.region.toLowerCase().includes(region.toLowerCase()))
    if (era)    all = all.filter(w => w.era.toLowerCase() === era.toLowerCase())
    if (genre)  all = all.filter(w => w.genre.toLowerCase() === genre.toLowerCase())
    if (q) {
      const lq = q.toLowerCase()
      all = all.filter(w =>
        w.title.toLowerCase().includes(lq) ||
        w.author.toLowerCase().includes(lq) ||
        w.description.toLowerCase().includes(lq) ||
        (w.significance ?? '').toLowerCase().includes(lq)
      )
    }
    // theme filter not available without DB; skip silently
    const total = all.length
    const sliced = all.slice(offset, offset + limit)
    return NextResponse.json({
      works: sliced.map(w => ({
        id: w.id, title: w.title, subtitle: null, author: w.author,
        yearPublished: w.yearPublished, language: w.language,
        originalLanguage: null, translator: null, region: w.region,
        country: w.country, genre: w.genre, era: w.era,
        description: w.description, significance: w.significance ?? null,
        coverImageUrl: null, accessLinks: [], themes: [],
      })),
      total, limit, offset,
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeWork(w: any) {
  return {
    id:               w.id,
    title:            w.title,
    subtitle:         w.subtitle,
    author:           w.author,
    yearPublished:    w.yearPublished,
    language:         w.language,
    originalLanguage: w.originalLanguage,
    translator:       w.translator,
    region:           w.region,
    country:          w.country,
    genre:            w.genre,
    era:              w.era,
    description:      w.description,
    significance:     w.significance,
    coverImageUrl:    w.coverImageUrl,
    accessLinks:      w.accessLinks?.map((l: { url: string; type: string }) => ({ url: l.url, type: l.type })) ?? [],
    themes:           w.themes?.map((wt: { theme: { name: string; slug: string } }) => ({ name: wt.theme.name, slug: wt.theme.slug })) ?? [],
  }
}
