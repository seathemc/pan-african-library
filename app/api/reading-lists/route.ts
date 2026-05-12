import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const lists = await prisma.readingList.findMany({
    include: { _count: { select: { works: true } } },
    orderBy: { title: 'asc' },
  })

  return NextResponse.json(
    lists.map(rl => ({
      id:          rl.id,
      title:       rl.title,
      slug:        rl.slug,
      description: rl.description,
      curatedBy:   rl.curatedBy,
      workCount:   rl._count.works,
    }))
  )
}
