import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const themes = await prisma.theme.findMany({
    include: { _count: { select: { works: true } } },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(
    themes.map(t => ({ id: t.id, name: t.name, slug: t.slug, workCount: t._count.works }))
  )
}
