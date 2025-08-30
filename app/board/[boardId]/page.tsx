'use client'

import { useEffect, useState } from 'react'
import { BoardSidebar } from '@/components/BoardSidebar'
import { ThreadCard } from '@/components/ThreadCard'
import { PostForm } from '@/components/PostForm'
import { WalletConnect } from '@/components/WalletConnect'
import { useParams } from 'next/navigation'

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

interface BoardData {
  threads: Thread[]
  page: number
  threadsPerPage: number
  hasMore: boolean
}

export default function BoardPage() {
  const params = useParams()
  const boardId = params.boardId as string
  const [boardData, setBoardData] = useState<BoardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchThreads()
  }, [boardId, currentPage])

  const fetchThreads = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/threads/${boardId}?page=${currentPage}`)
      if (res.ok) {
        const data = await res.json()
        setBoardData(data)
      }
    } catch (error) {
      console.error('Failed to fetch threads:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewThread = () => {
    // Refresh threads after creating a new one
    fetchThreads()
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

  return (
    <div className="flex h-screen">
      <BoardSidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-card border-b border-border p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">/{boardId}/</h1>
            <WalletConnect />
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <PostForm boardId={boardId} onSuccess={handleNewThread} />
            
            {boardData?.threads.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No threads yet. Be the first to post!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {boardData?.threads.map((thread) => (
                  <ThreadCard key={thread.id} thread={thread} boardId={boardId} />
                ))}
              </div>
            )}
            
            {boardData && (
              <div className="flex justify-center gap-2 mt-8">
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
                  >
                    Previous
                  </button>
                )}
                {boardData.hasMore && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
