import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bookmark, BookOpen, FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { RemoveWorkButton } from './remove-work-button'

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  let collection = null
  try {
    collection = await prisma.collection.findUnique({
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
  } catch {
    // DB unavailable
  }

  if (!collection) {
    notFound()
  }

  if (collection.userId !== user.id) {
    redirect('/collections')
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/collections" className="hover:underline">
            My Collections
          </Link>
          <span>/</span>
          <span>{collection.name}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Bookmark className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">{collection.name}</h1>
            </div>
            {collection.description && (
              <p className="text-muted-foreground">{collection.description}</p>
            )}
          </div>
          <Badge variant="secondary" className="shrink-0 text-sm">
            {collection.works.length} {collection.works.length === 1 ? 'work' : 'works'}
          </Badge>
        </div>
      </div>

      {/* Works List */}
      {collection.works.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">No works yet</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Browse the archive and add works to this collection.
          </p>
          <Link href="/browse">
            <Button variant="outline">Browse the Archive</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {collection.works.map((cw) => (
            <Card key={cw.id}>
              <CardContent className="flex items-start gap-4 py-4">
                <BookOpen className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/work/${cw.work.id}`}
                        className="font-semibold hover:underline line-clamp-1"
                      >
                        {cw.work.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {cw.work.author} &middot; {cw.work.yearPublished}
                      </p>
                    </div>
                    <RemoveWorkButton
                      collectionId={collection.id}
                      workId={cw.work.id}
                      workTitle={cw.work.title}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {cw.work.region}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {cw.work.genre}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {cw.work.era}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
