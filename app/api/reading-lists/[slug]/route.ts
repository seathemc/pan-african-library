import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const list = await prisma.readingList.findUnique({
    where: { slug },
    include: {
      works: {
        orderBy: { position: 'asc' },
        include: {
          work: {
            include: {
              accessLinks: true,
              themes: { include: { theme: true } },
            },
          },
        },
      },
    },
  })

  if (!list) {
    return NextResponse.json({ error: 'Reading list not found' }, { status: 404 })
  }

  return NextResponse.json({
    id:          list.id,
    title:       list.title,
    slug:        list.slug,
    description: list.description,
    curatedBy:   list.curatedBy,
    works: list.works.map(rlw => ({
      position:     rlw.position,
      note:         rlw.note,
      id:           rlw.work.id,
      title:        rlw.work.title,
      author:       rlw.work.author,
      yearPublished: rlw.work.yearPublished,
      region:       rlw.work.region,
      genre:        rlw.work.genre,
      era:          rlw.work.era,
      description:  rlw.work.description,
      significance: rlw.work.significance,
      accessLinks:  rlw.work.accessLinks.map(l => ({ url: l.url, type: l.type })),
      themes:       rlw.work.themes.map(wt => ({ name: wt.theme.name, slug: wt.theme.slug })),
    })),
  })
}
