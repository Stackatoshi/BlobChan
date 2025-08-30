'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

interface Thread {
  id: string
  opUsername: string | null
  content: string
  imageUrl: string | null
  linkUrl: string | null
  linkTitle: string | null
  linkImageUrl: string | null
  createdAt: string
  bumpedAt: string
}

interface ThreadCardProps {
  thread: Thread
  boardId: string
}

export function ThreadCard({ thread, boardId }: ThreadCardProps) {
  const displayName = thread.opUsername || 'Anonymous'
  const timeAgo = formatDistanceToNow(new Date(thread.bumpedAt), { addSuffix: true })
  
  // Extract first few lines of content for preview
  const preview = thread.content.length > 200 
    ? thread.content.substring(0, 200) + '...'
    : thread.content

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
      <div className="flex gap-4">
        {thread.imageUrl && (
          <div className="flex-shrink-0">
            <Image
              src={thread.imageUrl}
              alt="Thread image"
              width={150}
              height={150}
              className="rounded object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-primary">{displayName}</span>
            <span className="text-sm text-muted-foreground">{timeAgo}</span>
          </div>
          
          <p className="text-sm mb-3 whitespace-pre-wrap">{preview}</p>
          
          {thread.linkUrl && thread.linkTitle && (
            <div className="mb-3 p-3 bg-muted rounded border">
              <div className="flex gap-3">
                {thread.linkImageUrl && (
                  <Image
                    src={thread.linkImageUrl}
                    alt="Link preview"
                    width={80}
                    height={60}
                    className="rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm mb-1">{thread.linkTitle}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {thread.linkUrl}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Link
            href={`/board/${boardId}/thread/${thread.id}`}
            className="text-sm text-primary hover:underline"
          >
            View thread →
          </Link>
        </div>
      </div>
    </div>
  )
}
