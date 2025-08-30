import { NextRequest, NextResponse } from 'next/server'

const mockThreads = [
  {
    id: 'thread1',
    opUsername: 'Anonymous',
    content: 'Welcome to SolChan! This is a 4chan-style imageboard built on Solana with USDC subscriptions.',
    imageUrl: null,
    linkUrl: null,
    linkTitle: null,
    linkImageUrl: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    bumpedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: 'thread2',
    opUsername: 'CryptoAnon',
    content: 'What do you think about the current state of DeFi? Are we in a bear market or just a correction?',
    imageUrl: null,
    linkUrl: 'https://coinmarketcap.com',
    linkTitle: 'CoinMarketCap: Cryptocurrency Prices, Charts And Market Capitalizations',
    linkImageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    bumpedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
  },
  {
    id: 'thread3',
    opUsername: 'TechGuy',
    content: 'Just deployed my first Solana dApp! The development experience is so much better than Ethereum. Gas fees are basically non-existent.',
    imageUrl: null,
    linkUrl: null,
    linkTitle: null,
    linkImageUrl: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    bumpedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
  },
]

export async function GET(
  req: NextRequest,
  { params }: { params: { boardId: string } }
) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  
  // Mock pagination
  const threadsPerPage = 15
  const offset = (page - 1) * threadsPerPage
  const paginatedThreads = mockThreads.slice(offset, offset + threadsPerPage)
  
  return NextResponse.json({
    threads: paginatedThreads,
    page,
    threadsPerPage,
    hasMore: page === 1, // Only show "hasMore" on first page for demo
  })
}
