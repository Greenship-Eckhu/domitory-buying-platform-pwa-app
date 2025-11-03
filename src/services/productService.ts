import { ProductMetadata } from '@/types/product'

/**
 * JSON-LD 스키마 타입 정의
 */
interface ProductJsonLd {
  '@context'?: string
  '@type'?: string
  name?: string
  image?: string | string[]
  offers?: {
    price?: string | number
    priceCurrency?: string
    priceSpecification?: {
      price?: string | number
    }
  }
  description?: string
}

/**
 * HTML 가져오기
 * 1순위: 자체 Vercel API (배포 환경)
 * 2순위: CORS 프록시 (외부 서비스)
 * 3순위: 직접 요청 (CORS 에러 가능)
 */
async function fetchWithProxy(url: string): Promise<string> {
  // 1. 자체 API 사용 (배포 환경에서 /api/fetch-product 사용)
  try {
    const apiUrl = `/api/fetch-product?url=${encodeURIComponent(url)}`
    console.log('Trying API:', apiUrl)

    const response = await fetch(apiUrl)
    if (response.ok) {
      const html = await response.text()
      console.log('✅ Fetched via API successfully')
      return html
    }
  } catch (error) {
    console.warn('⚠️ API fetch failed, trying fallback proxies:', error)
  }

  // 2. CORS 프록시 옵션들 (fallback)
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
  ]

  for (const proxyUrl of proxies) {
    try {
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml',
        },
      })

      if (response.ok) {
        console.log('✅ Fetched via proxy:', proxyUrl)
        return await response.text()
      }
    } catch (error) {
      console.warn(`Failed to fetch with proxy: ${proxyUrl}`, error)
      continue
    }
  }

  // 3. 프록시 실패 시 직접 시도 (CORS 에러 발생 가능)
  console.log('Trying direct fetch...')
  const response = await fetch(url)
  return await response.text()
}

/**
 * HTML에서 메타 태그 파싱
 */
function parseMetaTags(html: string): ProductMetadata {
  const metadata: ProductMetadata = {}

  // DOMParser 사용 (브라우저 환경)
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // 쿠팡: JSON-LD 구조화 데이터 우선 파싱
  if (html.includes('coupang.com')) {
    const jsonLdData = parseJsonLd(doc)
    if (jsonLdData) {
      metadata.title = jsonLdData.name
      metadata.image = Array.isArray(jsonLdData.image) ? jsonLdData.image[0] : jsonLdData.image
      metadata.description = jsonLdData.description
      metadata.price = jsonLdData.offers?.price?.toString()

      // JSON-LD에서 가져온 데이터가 있으면 바로 반환
      if (metadata.title && metadata.image) {
        console.log('✅ 쿠팡 JSON-LD 파싱 성공:', metadata)
        return metadata
      }
    }
  }

  // JSON-LD 파싱 실패 시 또는 다른 플랫폼의 경우 Open Graph 파싱
  const ogTitle = doc.querySelector('meta[property="og:title"]')
  const ogImage = doc.querySelector('meta[property="og:image"]')
  const ogDescription = doc.querySelector('meta[property="og:description"]')

  // 일반 메타 태그 파싱
  const title = doc.querySelector('title')
  const metaDescription = doc.querySelector('meta[name="description"]')

  // 우선순위: Open Graph > 일반 태그
  metadata.title =
    metadata.title ||
    ogTitle?.getAttribute('content') ||
    title?.textContent ||
    undefined

  metadata.image =
    metadata.image ||
    ogImage?.getAttribute('content') ||
    undefined

  metadata.description =
    metadata.description ||
    ogDescription?.getAttribute('content') ||
    metaDescription?.getAttribute('content') ||
    undefined

  // 가격이 없으면 DOM에서 추출 시도 (쿠팡 전용)
  if (!metadata.price && html.includes('coupang.com')) {
    metadata.price = parseCoupangPriceFromDOM(doc)
  }

  console.log('📋 메타 태그 파싱 결과:', metadata)
  return metadata
}

/**
 * DOM에서 쿠팡 가격 추출 (JSON-LD 실패 시 fallback)
 */
function parseCoupangPriceFromDOM(doc: Document): string | undefined {
  // 우선순위 1: final-price-amount (최종 판매가)
  const finalPriceElement = doc.querySelector('.final-price-amount')
  if (finalPriceElement?.textContent) {
    const price = finalPriceElement.textContent.replace(/[^0-9]/g, '')
    if (price) {
      console.log('✅ DOM에서 최종가격 추출:', price)
      return price
    }
  }

  // 우선순위 2: sales-price-amount (할인가)
  const salesPriceElement = doc.querySelector('.sales-price-amount')
  if (salesPriceElement?.textContent) {
    const price = salesPriceElement.textContent.replace(/[^0-9]/g, '')
    if (price) {
      console.log('✅ DOM에서 할인가격 추출:', price)
      return price
    }
  }

  // 우선순위 3: original-price-amount (정상가)
  const originalPriceElement = doc.querySelector('.original-price-amount')
  if (originalPriceElement?.textContent) {
    const price = originalPriceElement.textContent.replace(/[^0-9]/g, '')
    if (price) {
      console.log('⚠️ DOM에서 정상가격만 추출 (할인가 없음):', price)
      return price
    }
  }

  console.warn('⚠️ DOM에서 가격 추출 실패')
  return undefined
}

/**
 * JSON-LD 구조화 데이터 파싱
 */
function parseJsonLd(doc: Document): ProductJsonLd | null {
  const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]')

  for (const script of jsonLdScripts) {
    try {
      const jsonText = script.textContent || ''
      if (!jsonText) continue

      const data: ProductJsonLd = JSON.parse(jsonText)

      // Product 타입인지 확인
      if (data['@type'] === 'Product' && data.name) {
        console.log('🔍 JSON-LD Product 발견:', data)
        return data
      }
    } catch (error) {
      console.warn('JSON-LD 파싱 실패:', error)
      continue
    }
  }

  return null
}

/**
 * URL에서 상품 정보 추출
 */
export async function extractProductInfo(url: string): Promise<ProductMetadata> {
  try {
    console.log('Fetching product info from:', url)
    const html = await fetchWithProxy(url)
    const metadata = parseMetaTags(html)

    // 이미지 URL이 상대 경로인 경우 절대 경로로 변환
    if (metadata.image && !metadata.image.startsWith('http')) {
      const urlObj = new URL(url)
      metadata.image = new URL(metadata.image, urlObj.origin).toString()
    }

    console.log('Extracted metadata:', metadata)
    return metadata
  } catch (error) {
    console.error('Failed to extract product info:', error)
    throw new Error('상품 정보를 가져오는데 실패했습니다. URL을 확인해주세요.')
  }
}

/**
 * 상품 정보 유효성 검사
 */
export function validateProductMetadata(metadata: ProductMetadata): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!metadata.title) {
    errors.push('상품명을 찾을 수 없습니다.')
  }

  if (!metadata.image) {
    errors.push('상품 이미지를 찾을 수 없습니다.')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
