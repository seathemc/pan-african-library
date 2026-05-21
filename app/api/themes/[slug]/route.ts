import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getThemeBySlug } from '@/lib/literature-data'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  try {
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
      id: theme.id,
      name: theme.name,
      slug: theme.slug,
      works: theme.works.map((themeWork) => ({
        id: themeWork.work.id,
        title: themeWork.work.title,
        author: themeWork.work.author,
        yearPublished: themeWork.work.yearPublished,
        region: themeWork.work.region,
        genre: themeWork.work.genre,
        era: themeWork.work.era,
        description: themeWork.work.description,
        accessLinks: themeWork.work.accessLinks.map((link) => ({ url: link.url, type: link.type })),
      })),
    })
  } catch {
    const theme = getThemeBySlug(slug)
    if (!theme) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 })
    }

    return NextResponse.json(theme)
  }
}
