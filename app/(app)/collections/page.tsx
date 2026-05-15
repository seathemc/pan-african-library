import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bookmark, FolderOpen, Plus } from 'lucide-react'
import Link from 'next/link'
import { NewCollectionForm } from './new-collection-form'

export default async function CollectionsPage() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <Bookmark className="h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Your Collections</h1>
        <p className="text-muted-foreground text-center max-w-sm">
          Sign in to save collections of works you love and build your personal reading lists.
        </p>
        <Link href="/login">
          <Button>Sign in to save collections</Button>
        </Link>
      </div>
    )
  }

  // Audit pass XXII: removed Awaited<ReturnType<...>> type annotation —
  // it inferred the default return type (without `include._count`) so the
  // _count property was missing from the inferred type. Letting TypeScript
  // infer from the actual call resolves this.
  const fetchCollections = async () => {
    try {
      return await prisma.collection.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { works: true } } },
      })
    } catch {
      return []
    }
  }
  const collections = await fetchCollections()

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">My Collections</h1>
          </div>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* New Collection Form */}
      <NewCollectionForm />

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">No collections yet</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Start saving works you love. Browse the archive and add works to a collection.
          </p>
          <Link href="/browse">
            <Button variant="outline">Browse the Archive</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {collections.map((collection) => (
            <Card key={collection.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-snug">{collection.name}</CardTitle>
                  <Badge variant="secondary" className="shrink-0">
                    {collection._count.works} {collection._count.works === 1 ? 'work' : 'works'}
                  </Badge>
                </div>
                {collection.description && (
                  <CardDescription className="line-clamp-2">
                    {collection.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="mt-auto pt-2">
                <Link href={`/collections/${collection.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <FolderOpen className="h-4 w-4" />
                    View Collection
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
