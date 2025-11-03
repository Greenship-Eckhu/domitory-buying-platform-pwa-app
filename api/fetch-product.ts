import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Vercel Serverless Function
 * 쿠팡 상품 페이지의 HTML을 가져와서 반환
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS 허용
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const { url } = req.query

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' })
  }

  // 쿠팡 URL인지 확인
  if (!url.includes('coupang.com')) {
    return res.status(400).json({ error: 'Only Coupang URLs are supported' })
  }

  try {
    console.log('Fetching URL:', url)

    // 브라우저처럼 요청 (User-Agent 포함)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      },
      redirect: 'follow'
    })

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch: ${response.statusText}`
      })
    }

    const html = await response.text()

    console.log('HTML fetched successfully, length:', html.length)

    // HTML 반환
    return res.status(200).send(html)

  } catch (error) {
    console.error('Error fetching product:', error)
    return res.status(500).json({
      error: 'Failed to fetch product page',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
