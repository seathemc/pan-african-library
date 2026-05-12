import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const workId = Number(id)
  if (isNaN(workId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const work = await prisma.work.findUnique({
    where: { id: workId },
    include: {
      accessLinks: true,
      themes: { include: { theme: true } },
      relatedFrom: {
        include: { toWork: { include: { themes: { include: { theme: true } } } } },
      },
      relatedTo: {
        include: { fromWork: { include: { themes: { include: { theme: true } } } } },
      },
      readingLists: {
        include: { readingList: true },
      },
    },
  })

  if (!work) {
    return NextResponse.json({ error: 'Work not found' }, { status: 404 })
  }

  return NextResponse.json({
    id:               work.id,
    title:            work.title,
    subtitle:         work.subtitle,
    author:           work.author,
    yearPublished:    work.yearPublished,
    language:         work.language,
    originalLanguage: work.originalLanguage,
    translator:       work.translator,
    region:           work.region,
    country:          work.country,
    genre:            work.genre,
    era:              work.era,
    description:      work.description,
    significance:     work.significance,
    coverImageUrl:    work.coverImageUrl,
    accessLinks:      work.accessLinks.map(l => ({ url: l.url, type: l.type })),
    themes:           work.themes.map(wt => ({ name: wt.theme.name, slug: wt.theme.slug })),
    relations: [
      ...work.relatedFrom.map(r => ({
        type:      r.type,
        direction: 'outgoing' as const,
        work:      { id: r.toWork.id, title: r.toWork.title, author: r.toWork.author },
      })),
      ...work.relatedTo.map(r => ({
        type:      r.type,
        direction: 'incoming' as const,
        work:      { id: r.fromWork.id, title: r.fromWork.title, author: r.fromWork.author },
      })),
    ],
    readingLists: work.readingLists.map(rl => ({
      id:    rl.readingList.id,
      title: rl.readingList.title,
      slug:  rl.readingList.slug,
    })),
  })
}
