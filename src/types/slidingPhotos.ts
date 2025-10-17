export interface SlidingPhoto {
  id: string
  title: string
  description?: string
  image_url: string
  link?: string
  link_url?: string
  button1_text?: string
  button1_link?: string
  button2_text?: string
  button2_link?: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SlidingPhotoFormData {
  title: string
  description?: string
  image_url: string
  link_url?: string
  order_index: number
  is_active: boolean
}