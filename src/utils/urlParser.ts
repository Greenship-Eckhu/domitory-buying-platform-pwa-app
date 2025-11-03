/**
 * URL에서 플랫폼 식별
 */
export function detectPlatform(url: string): 'coupang' | 'unknown' {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()

    if (hostname.includes('coupang.com')) {
      return 'coupang'
    }
    return 'unknown'
  } catch {
    return 'unknown'
  }
}

/**
 * URL 정규화 (추적 파라미터 제거 등)
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)

    // 쿠팡 URL 정규화
    if (urlObj.hostname.includes('coupang.com')) {
      // 불필요한 쿼리 파라미터 제거 (추적 파라미터 등)
      // 제품 ID만 유지
      const paramsToKeep = ['itemId', 'vendorItemId']
      const newSearchParams = new URLSearchParams()

      paramsToKeep.forEach(param => {
        const value = urlObj.searchParams.get(param)
        if (value) {
          newSearchParams.set(param, value)
        }
      })

      urlObj.search = newSearchParams.toString()
    }

    return urlObj.toString()
  } catch {
    return url
  }
}

/**
 * URL이 유효한 쿠팡 상품 링크인지 검증
 */
export function isValidProductUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()

    // 쿠팡 상품 URL 검증
    if (hostname.includes('coupang.com')) {
      // 짧은 링크 (link.coupang.com) 허용
      if (hostname.includes('link.coupang.com')) {
        return true
      }
      // /vp/products/ 또는 /products/ 경로 확인
      return urlObj.pathname.includes('/products/') || urlObj.searchParams.has('itemId')
    }

    return false
  } catch {
    return false
  }
}
