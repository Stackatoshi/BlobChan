import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }
    
    // Basic URL validation
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }
    
    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BlobChan/1.0)',
      },
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 400 })
    }
    
    const html = await response.text()
    
    // Extract Open Graph metadata
    const title = extractMetaContent(html, 'og:title') || extractMetaContent(html, 'title')
    const description = extractMetaContent(html, 'og:description') || extractMetaContent(html, 'description')
    const image = extractMetaContent(html, 'og:image')
    
    return NextResponse.json({
      title: title?.trim(),
      description: description?.trim(),
      image: image?.trim(),
      url,
    })
  } catch (error) {
    console.error('OG scrape error:', error)
    return NextResponse.json({ error: 'Failed to scrape metadata' }, { status: 500 })
  }
}

function extractMetaContent(html: string, property: string): string | null {
  const regex = new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i')
  const match = html.match(regex)
  return match ? match[1] : null
}
