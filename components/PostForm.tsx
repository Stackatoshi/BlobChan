'use client'

import { useState, useRef } from 'react'
import { useWalletStore } from '@/lib/store'
import Image from 'next/image'

interface PostFormProps {
  boardId?: string
  threadId?: string
  onSuccess?: () => void
  placeholder?: string
}

export function PostForm({ boardId, threadId, onSuccess, placeholder = "What's on your mind?" }: PostFormProps) {
  const { user } = useWalletStore()
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (file: File) => {
    try {
      setUploadProgress(0)
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await fetch('/api/blob/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (res.ok) {
        const data = await res.json()
        setImageUrl(data.url)
        setUploadProgress(100)
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) return
    
    try {
      setIsSubmitting(true)
      
      const endpoint = threadId ? '/api/reply/create' : '/api/thread/create'
      const body = threadId 
        ? { threadId, content, imageUrl, linkUrl }
        : { boardId, content, imageUrl, linkUrl }
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      
      if (res.ok) {
        setContent('')
        setImageUrl('')
        setLinkUrl('')
        onSuccess?.()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Post creation error:', error)
      alert('Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  // Temporarily disabled subscription check for testing
  // if (!user?.subscriptionExpiresAt || new Date(user.subscriptionExpiresAt).getTime() < new Date().getTime()) {
  //   return (
  //     <div className="bg-card border border-border rounded-lg p-4">
  //       <p className="text-center text-muted-foreground">
  //         Active subscription required to post
  //       </p>
  //     </div>
  //   )
  // }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-4">
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="w-full h-32 p-3 bg-background border border-input rounded resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>
      
      <div className="mb-4 space-y-2">
        <input
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="Optional: Add a link"
          className="w-full p-2 bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
        />
        
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
          >
            Add Image
          </button>
          {imageUrl && (
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
            >
              Remove
            </button>
          )}
        </div>
        
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
        
        {imageUrl && (
          <div className="relative">
            <Image
              src={imageUrl}
              alt="Uploaded image"
              width={200}
              height={200}
              className="rounded object-cover"
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Posting as: {user.username || 'Anonymous'}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : (threadId ? 'Reply' : 'Create Thread')}
        </button>
      </div>
    </form>
  )
}
