import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

async function getCollectionForUser(collectionId: string, userId: string) {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
  })
  if (!collection) return null
  if (collection.userId !== userId) return null
  return collection
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: collectionId } = await params
  const collection = await getCollectionForUser(collectionId, user.id)
  if (!collection) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
  }

  const body = await req.json()
  const workId = Number(body.workId)
  if (isNaN(workId)) {
    return NextResponse.json({ error: 'Invalid workId' }, { status: 400 })
  }

  const collectionWork = await prisma.collectionWork.upsert({
    where: { collectionId_workId: { collectionId, workId } },
    update: {},
    create: { collectionId, workId },
  })

  return NextResponse.json(collectionWork, { status: 201 })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: collectionId } = await params
  const collection = await getCollectionForUser(collectionId, user.id)
  if (!collection) {
    return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
  }

  const body = await req.json()
  const workId = Number(body.workId)
  if (isNaN(workId)) {
    return NextResponse.json({ error: 'Invalid workId' }, { status: 400 })
  }

  await prisma.collectionWork.deleteMany({
    where: { collectionId, workId },
  })

  return NextResponse.json({ success: true })
}
