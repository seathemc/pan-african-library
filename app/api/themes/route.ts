import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getThemeCatalog } from '@/lib/literature-data'

export async function GET() {
  try {
    const themes = await prisma.theme.findMany({
      include: { _count: { select: { works: true } } },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(
      themes.map((theme) => ({
        id: theme.id,
        name: theme.name,
        slug: theme.slug,
        workCount: theme._count.works,
      }))
    )
  } catch {
    return NextResponse.json(getThemeCatalog())
  }
}
