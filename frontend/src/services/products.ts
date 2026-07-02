import api from './api'
import type { Product, ProductFilters } from '@/types'
import { buildFormData } from '@/utils/formData'

export interface ProductImageInput {
  file: File
  alt_text?: string
}

export interface ProductPayload {
  name: string
  short_description: string
  description: string
  features?: string[]
  thumbnail?: File | null
  price: number
  license?: string
  documentation_url?: string
  demo_url?: string
  is_featured?: boolean
  status: 'draft' | 'published'
  sort_order?: number
  images?: ProductImageInput[]
}

export async function listProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products', { params: filters })
  return data
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return listProducts({ featured: true })
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${slug}`)
  return data
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const { data } = await api.post<Product>('/products', buildFormData(payload))
  return data
}

export async function updateProduct(slug: string, payload: ProductPayload): Promise<Product> {
  const { data } = await api.post<Product>(`/products/${slug}`, buildFormData(payload, 'PUT'))
  return data
}

export async function deleteProduct(slug: string): Promise<void> {
  await api.delete(`/products/${slug}`)
}

export async function deleteProductImage(slug: string, imageId: number): Promise<void> {
  await api.delete(`/products/${slug}/images/${imageId}`)
}
