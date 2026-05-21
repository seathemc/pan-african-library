import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getEnrichedWorkData, getRelatedIndicatorsForWork, getWorkById } from '@/lib/literature-data'
import { getWorkContentData } from '@/lib/work-content'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const workId = Number(id)
  if (isNaN(workId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }
  try {
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

    const fallbackContent = getWorkContentData({
      id: work.id,
      title: work.title,
      author: work.author,
      description: work.description,
      significance: work.significance ?? "",
      accessLinks: work.accessLinks.map((link) => link.url),
    })

    let content = fallbackContent
    try {
      const storedContent = await prisma.workContent.findUnique({
        where: { workId },
        include: {
          blocks: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      })

      if (storedContent) {
        content = {
          status: storedContent.status as
            | 'metadata-only'
            | 'excerpt-available'
            | 'full-text-available'
            | 'research-queued',
          statusLabel:
            storedContent.status === 'full-text-available'
              ? 'Full text available'
              : storedContent.status === 'excerpt-available'
                ? 'Excerpt available'
                : storedContent.status === 'research-queued'
                  ? 'Research queued'
                  : 'Catalog context only',
          summary: storedContent.summary ?? fallbackContent.summary,
          availabilityNote: storedContent.availabilityNote ?? fallbackContent.availabilityNote,
          blocks: storedContent.blocks.map((block) => ({
            id: String(block.id),
            title: block.title ?? 'Untitled block',
            kind: block.kind as 'editorial-summary' | 'excerpt' | 'full-text' | 'research-note',
            text: block.text,
            sourceLabel: block.sourceLabel ?? 'Wisdom archive record',
            sourceUrl: block.sourceUrl ?? null,
            isVerbatim: block.isVerbatim,
          })),
          lastUpdated: storedContent.updatedAt.toISOString().slice(0, 10),
        }
      }
    } catch {
      content = fallbackContent
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
      indicators:       getRelatedIndicatorsForWork(work.id),
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
      content,
    })
  } catch {
    const work = getWorkById(workId)
    if (!work) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 })
    }

    const enriched = getEnrichedWorkData(workId)
    const content = getWorkContentData(work)
    return NextResponse.json({
      id: work.id,
      title: work.title,
      subtitle: null,
      author: work.author,
      yearPublished: work.yearPublished,
      language: work.language,
      originalLanguage: null,
      translator: null,
      region: work.region,
      country: work.country,
      genre: work.genre,
      era: work.era,
      description: work.description,
      significance: work.significance ?? null,
      coverImageUrl: null,
      accessLinks: work.accessLinks.map((url) => ({
        url,
        type: url.includes("archive.org") ? "archive" : url.includes(".pdf") ? "pdf" : "web",
      })),
      themes: enriched.themes,
      indicators: enriched.indicators,
      relations: enriched.relations,
      readingLists: [],
      content,
    })
  }
}
