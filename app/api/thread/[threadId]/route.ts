import { NextRequest, NextResponse } from 'next/server'

const mockThread = {
  id: 'thread1',
  username: 'Anonymous',
          content: 'Welcome to BlobChan! This is a 4chan-style imageboard built on Solana with USDC subscriptions. Connect your wallet to start posting!',
  imageUrl: null,
  linkUrl: null,
  linkTitle: null,
  linkImageUrl: null,
  createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
}

const mockReplies = [
  {
    id: 'reply1',
    username: 'CryptoAnon',
    content: 'This is amazing! I love the Solana integration. Much better than traditional imageboards.',
    imageUrl: null,
    linkUrl: null,
    linkTitle: null,
    linkImageUrl: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
  },
  {
    id: 'reply2',
    username: 'TechGuy',
    content: 'The wallet authentication is so smooth. No more captchas!',
    imageUrl: null,
    linkUrl: null,
    linkTitle: null,
    linkImageUrl: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: 'reply3',
    username: 'Anonymous',
    content: 'Can\'t wait to see more features. The USDC subscription model is interesting.',
    imageUrl: null,
    linkUrl: null,
    linkTitle: null,
    linkImageUrl: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
  },
]

export async function GET(
  req: NextRequest,
  { params }: { params: { threadId: string } }
) {
  return NextResponse.json({
    thread: mockThread,
    replies: mockReplies,
  })
}
