import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      works: {
        orderBy: { addedAt: 'desc' },
        include: {
          work: {
            select: {
              id: true,
              title: true,
              author: true,
              yearPublished: true,
              region: true,
              genre: true,
              era: true,
            },
          },
        },
      },
    },
  })

  if (!collection) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
  }

  if (collection.userId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    createdAt: collection.createdAt,
    works: collection.works.map((cw) => ({
      collectionWorkId: cw.id,
      addedAt: cw.addedAt,
      ...cw.work,
    })),
  })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const collection = await prisma.collection.findUnique({ where: { id } })

  if (!collection) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
  }

  if (collection.userId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.collection.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
