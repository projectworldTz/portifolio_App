import type { Category } from './category'
import type { Technology } from './technology'

export type PublishStatus = 'draft' | 'published'

export interface ProjectImage {
  id: number
  url: string
  alt_text: string | null
  sort_order: number
}

export interface Project {
  id: number
  title: string
  slug: string
  short_description: string
  description?: string
  features: string[] | null
  challenges: string | null
  solutions: string | null
  thumbnail: string | null
  demo_url: string | null
  has_demo_credentials: boolean
  demo_email?: string | null
  demo_password?: string | null
  repo_url: string | null
  demo_video_url: string | null
  price: string | null
  is_purchasable: boolean
  is_featured: boolean
  status: PublishStatus
  category: Category | null
  technologies: Technology[]
  images: ProjectImage[]
  created_at: string
  updated_at: string
}

export interface ProjectFilters {
  category?: string
  technology?: string
  search?: string
  sort?: 'latest' | 'oldest' | 'featured' | 'price_asc' | 'price_desc'
  featured?: boolean
}
