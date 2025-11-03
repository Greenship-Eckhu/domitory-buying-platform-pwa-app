export interface Product {
  id?: string
  name: string
  thumbnail: string
  price?: number
  quantity?: string
  unit?: string
  originalUrl: string
  platform: 'coupang' | 'unknown'
  createdAt?: string
}

export interface ParsedQuantity {
  quantity: number
  unit: string
  original: string
}

export interface ProductMetadata {
  title?: string
  image?: string
  price?: string
  description?: string
}
