export interface Package {
  id: string
  name: string
  description?: string
  image?: string
  original_price: number
  sale_price: number
  discount: number
  is_hot_sale: boolean
  product_ids?: string[]
  is_featured?: boolean
  created_at: string
  updated_at?: string
}

export interface PackageProduct {
  id: string
  name: string
  image?: string
  price: number
}

export interface PackageFormData {
  name: string
  description?: string
  image?: string
  original_price: number
  sale_price?: number
  product_ids: string[]
  is_featured: boolean
}

export type PackageItem = Package