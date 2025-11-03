import { ParsedQuantity } from '@/types/product'

/**
 * 상품명에서 수량 정보를 추출
 * 예: "맛있는 사과 12개입", "고급 쌀 10kg", "우유 500ml x 24팩"
 */
export function parseQuantityFromText(text: string): ParsedQuantity | null {
  // 다양한 수량 패턴 정규식
  const patterns = [
    // 12개입, 24입, 500개
    /(\d+(?:\.\d+)?)\s*(개입|개|입)/i,
    // 1kg, 500g, 2.5kg
    /(\d+(?:\.\d+)?)\s*(kg|g|그램|킬로그램)/i,
    // 500ml, 1L, 1.5l
    /(\d+(?:\.\d+)?)\s*(ml|l|리터|밀리리터)/i,
    // 100매, 200장
    /(\d+(?:\.\d+)?)\s*(매|장|팩|개)/i,
    // x 24팩, x24개
    /x\s*(\d+(?:\.\d+)?)\s*(팩|개|입|병|캔)/i,
    // 24팩, 12병
    /(\d+(?:\.\d+)?)\s*(팩|병|캔|통|박스)/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const quantity = parseFloat(match[1])
      let unit = match[2].toLowerCase()

      // 단위 정규화
      unit = normalizeUnit(unit)

      return {
        quantity,
        unit,
        original: match[0]
      }
    }
  }

  return null
}

/**
 * 단위 정규화
 */
function normalizeUnit(unit: string): string {
  const unitMap: Record<string, string> = {
    '개입': '개',
    '입': '개',
    '그램': 'g',
    '킬로그램': 'kg',
    '리터': 'L',
    '밀리리터': 'ml',
    '장': '매',
  }

  return unitMap[unit] || unit
}

/**
 * 수량 정보를 읽기 쉬운 문자열로 변환
 */
export function formatQuantity(quantity: number, unit: string): string {
  // 소수점이 있는 경우 적절히 표시
  const formattedQuantity = quantity % 1 === 0 ? quantity.toString() : quantity.toFixed(1)
  return `${formattedQuantity}${unit}`
}

/**
 * 여러 수량 정보 추출 (예: "500ml x 24팩" -> [500ml, 24팩])
 */
export function parseMultipleQuantities(text: string): ParsedQuantity[] {
  const results: ParsedQuantity[] = []

  // x로 구분된 여러 수량 추출
  const xPattern = /(\d+(?:\.\d+)?)\s*(ml|l|g|kg|개|팩|병|캔)\s*x\s*(\d+(?:\.\d+)?)\s*(팩|개|입|병|캔)/i
  const xMatch = text.match(xPattern)

  if (xMatch) {
    results.push({
      quantity: parseFloat(xMatch[1]),
      unit: normalizeUnit(xMatch[2]),
      original: `${xMatch[1]}${xMatch[2]}`
    })
    results.push({
      quantity: parseFloat(xMatch[3]),
      unit: normalizeUnit(xMatch[4]),
      original: `${xMatch[3]}${xMatch[4]}`
    })
    return results
  }

  // 단일 수량 추출
  const single = parseQuantityFromText(text)
  if (single) {
    results.push(single)
  }

  return results
}
