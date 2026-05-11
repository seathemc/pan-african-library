'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BookmarkCheck, Bookmark, Plus } from 'lucide-react'
import Link from 'next/link'

interface Collection {
  id: string
  name: string
  description: string | null
  workCount: number
  createdAt: string
}

interface AddToCollectionProps {
  workId: number
}

export function AddToCollection({ workId }: AddToCollectionProps) {
  const router = useRouter()
  const [collections, setCollections] = useState<Collection[] | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'added' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/collections')
      .then(async (res) => {
        if (res.status === 401) {
          setIsLoggedIn(false)
          return
        }
        const data: Collection[] = await res.json()
        setIsLoggedIn(true)
        setCollections(data)
        if (data.length > 0) {
          setSelectedCollectionId(data[0].id)
        }
      })
      .catch(() => {
        setIsLoggedIn(false)
      })
  }, [])

  async function addToCollection(collectionId: string) {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/collections/${collectionId}/works`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workId }),
      })
      if (!res.ok) {
        const data = await res.json()
        setErrorMsg(data.error || 'Failed to add to collection')
        setStatus('error')
      } else {
        setStatus('added')
        router.refresh()
        setTimeout(() => setStatus('idle'), 2500)
      }
    } catch {
      setErrorMsg('Something went wrong')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  async function createDefaultAndAdd() {
    setLoading(true)
    setErrorMsg(null)
    try {
      // Create the default collection
      const createRes = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'My Reading List' }),
      })
      if (!createRes.ok) {
        setErrorMsg('Failed to create collection')
        setStatus('error')
        return
      }
      const newCollection = await createRes.json()

      // Add the work
      const addRes = await fetch(`/api/collections/${newCollection.id}/works`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workId }),
      })
      if (!addRes.ok) {
        setErrorMsg('Failed to add to collection')
        setStatus('error')
        return
      }

      setCollections([{ ...newCollection, workCount: 1 }])
      setSelectedCollectionId(newCollection.id)
      setStatus('added')
      router.refresh()
      setTimeout(() => setStatus('idle'), 2500)
    } catch {
      setErrorMsg('Something went wrong')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  // Still loading
  if (isLoggedIn === null) {
    return (
      <div className="h-9 w-40 bg-muted animate-pulse rounded-md" />
    )
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <p className="text-sm text-muted-foreground">
        <Link href="/login" className="underline underline-offset-4 hover:text-foreground">
          Sign in
        </Link>{' '}
        to save this work to a collection.
      </p>
    )
  }

  // Logged in, added confirmation
  if (status === 'added') {
    return (
      <div className="flex items-center gap-2 text-sm text-primary font-medium">
        <BookmarkCheck className="h-4 w-4" />
        Added to collection
      </div>
    )
  }

  // Logged in, no collections yet
  if (collections && collections.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          onClick={createDefaultAndAdd}
          disabled={loading}
          className="self-start"
        >
          <Bookmark className="h-4 w-4" />
          {loading ? 'Saving…' : 'Save to collection'}
        </Button>
        {status === 'error' && errorMsg && (
          <p className="text-sm text-destructive">{errorMsg}</p>
        )}
      </div>
    )
  }

  // Logged in with collections
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <select
          value={selectedCollectionId}
          onChange={(e) => setSelectedCollectionId(e.target.value)}
          disabled={loading}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:opacity-50"
        >
          {collections?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Button
          variant="outline"
          onClick={() => selectedCollectionId && addToCollection(selectedCollectionId)}
          disabled={loading || !selectedCollectionId}
        >
          <Plus className="h-4 w-4" />
          {loading ? 'Adding…' : 'Add'}
        </Button>
      </div>
      {status === 'error' && errorMsg && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}
    </div>
  )
}
