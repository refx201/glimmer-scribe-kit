export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FAQFormData {
  question: string
  answer: string
  category: string
  order_index: number
  is_active: boolean
}

export type FAQInsert = {
  question: string
  answer: string
  category?: string
  order_index?: number
  is_active?: boolean
}

export type FAQUpdate = Partial<FAQ>