import api from './api'
import type { Blog } from '@/types'
import { buildFormData } from '@/utils/formData'

export interface BlogPayload {
  category_id?: number | null
  title: string
  excerpt?: string
  content: string
  thumbnail?: File | null
  is_published?: boolean
  published_at?: string
}

export async function listBlogs(): Promise<Blog[]> {
  const { data } = await api.get<Blog[]>('/blogs')
  return data
}

export async function getBlogBySlug(slug: string): Promise<Blog> {
  const { data } = await api.get<Blog>(`/blogs/${slug}`)
  return data
}

export async function createBlog(payload: BlogPayload): Promise<Blog> {
  const { data } = await api.post<Blog>('/blogs', buildFormData(payload))
  return data
}

export async function updateBlog(slug: string, payload: BlogPayload): Promise<Blog> {
  const { data } = await api.post<Blog>(`/blogs/${slug}`, buildFormData(payload, 'PUT'))
  return data
}

export async function deleteBlog(slug: string): Promise<void> {
  await api.delete(`/blogs/${slug}`)
}
