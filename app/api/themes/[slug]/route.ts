import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const theme = await prisma.theme.findUnique({
    where: { slug },
    include: {
      works: {
        include: {
          work: {
            include: { accessLinks: true },
          },
        },
        orderBy: { work: { yearPublished: 'asc' } },
      },
    },
  })

  if (!theme) {
    return NextResponse.json({ error: 'Theme not found' }, { status: 404 })
  }

  return NextResponse.json({
    id:    theme.id,
    name:  theme.name,
    slug:  theme.slug,
    works: theme.works.map(wt => ({
      id:           wt.work.id,
      title:        wt.work.title,
      author:       wt.work.author,
      yearPublished: wt.work.yearPublished,
      region:       wt.work.region,
      genre:        wt.work.genre,
      era:          wt.work.era,
      description:  wt.work.description,
      accessLinks:  wt.work.accessLinks.map(l => ({ url: l.url, type: l.type })),
    })),
  })
}
