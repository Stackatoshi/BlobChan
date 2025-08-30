'use client'

import { useEffect, useState } from 'react'
import { BoardSidebar } from '@/components/BoardSidebar'
import { PostForm } from '@/components/PostForm'
import { WalletConnect } from '@/components/WalletConnect'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface Post {
  id: string
  username: string | null
  content: string
  imageUrl: string | null
  linkUrl: string | null
  linkTitle: string | null
  linkImageUrl: string | null
  createdAt: string
}

interface ThreadData {
  thread: Post
  replies: Post[]
}

export default function ThreadPage() {
  const params = useParams()
  const router = useRouter()
  const boardId = params.boardId as string
  const threadId = params.threadId as string
  const [threadData, setThreadData] = useState<ThreadData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchThread()
  }, [threadId])

  const fetchThread = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/thread/${threadId}`)
      if (res.ok) {
        const data = await res.json()
        setThreadData(data)
      } else {
        router.push(`/board/${boardId}`)
      }
    } catch (error) {
      console.error('Failed to fetch thread:', error)
      router.push(`/board/${boardId}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewReply = () => {
    // Refresh thread after creating a new reply
    fetchThread()
  }

  const PostComponent = ({ post, isOP = false }: { post: Post; isOP?: boolean }) => {
    const displayName = post.username || 'Anonymous'
    const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

    return (
      <div className={`bg-card border border-border rounded-lg p-4 ${isOP ? 'border-primary/50' : ''}`}>
        <div className="flex gap-4">
          {post.imageUrl && (
            <div className="flex-shrink-0">
              <Image
                src={post.imageUrl}
                alt="Post image"
                width={200}
                height={200}
                className="rounded object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-primary">{displayName}</span>
              <span className="text-sm text-muted-foreground">{timeAgo}</span>
              {isOP && <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">OP</span>}
            </div>
            
            <p className="text-sm mb-3 whitespace-pre-wrap">{post.content}</p>
            
            {post.linkUrl && post.linkTitle && (
              <div className="mb-3 p-3 bg-muted rounded border">
                <div className="flex gap-3">
                  {post.linkImageUrl && (
                    <Image
                      src={post.linkImageUrl}
                      alt="Link preview"
                      width={80}
                      height={60}
                      className="rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1">{post.linkTitle}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {post.linkUrl}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <BoardSidebar />
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!threadData) {
    return (
      <div className="flex h-screen">
        <BoardSidebar />
        <div className="flex-1 p-6">
          <p className="text-center text-muted-foreground">Thread not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <BoardSidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href={`/board/${boardId}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to /{boardId}/
              </Link>
              <h1 className="text-2xl font-bold">Thread #{threadId.slice(0, 8)}</h1>
            </div>
            <WalletConnect />
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Original Post */}
            <PostComponent post={threadData.thread} isOP={true} />
            
            {/* Replies */}
            {threadData.replies.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Replies ({threadData.replies.length})</h2>
                {threadData.replies.map((reply) => (
                  <PostComponent key={reply.id} post={reply} />
                ))}
              </div>
            )}
            
            {/* Reply Form */}
            <PostForm 
              threadId={threadId} 
              onSuccess={handleNewReply}
              placeholder="Write a reply..."
            />
          </div>
        </main>
      </div>
    </div>
  )
}
