'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface RemoveWorkButtonProps {
  collectionId: string
  workId: number
  workTitle: string
}

export function RemoveWorkButton({ collectionId, workId, workTitle }: RemoveWorkButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleRemove() {
    if (!confirm(`Remove "${workTitle}" from this collection?`)) return

    setLoading(true)
    try {
      await fetch(`/api/collections/${collectionId}/works`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workId }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleRemove}
      disabled={loading}
      className="text-muted-foreground hover:text-destructive shrink-0"
      title={`Remove "${workTitle}"`}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
