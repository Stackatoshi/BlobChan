'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Board {
  id: string
  title: string
  description: string
  bannerUrl: string | null
}

export function BoardSidebar() {
  const [boards, setBoards] = useState<Board[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const currentBoard = params.boardId as string

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      const res = await fetch('/api/boards')
      if (res.ok) {
        const data = await res.json()
        setBoards(data)
      }
    } catch (error) {
      console.error('Failed to fetch boards:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-64 bg-card border-r border-border p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-64 bg-card border-r border-border p-4">
      <h2 className="text-lg font-semibold mb-4">Boards</h2>
      <nav className="space-y-1">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            className={`block px-3 py-2 rounded text-sm transition-colors ${
              currentBoard === board.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            <div className="font-medium">/{board.id}/</div>
            <div className="text-xs text-muted-foreground truncate">
              {board.title}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  )
}
