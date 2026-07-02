import api from './api'
import type { Project, ProjectFilters } from '@/types'
import { buildFormData } from '@/utils/formData'

export interface ProjectImageInput {
  file: File
  alt_text?: string
}

export interface ProjectPayload {
  category_id?: number | null
  title: string
  short_description: string
  description: string
  features?: string[]
  challenges?: string
  solutions?: string
  thumbnail?: File | null
  demo_url?: string
  repo_url?: string
  demo_video_url?: string
  price?: number | null
  is_purchasable?: boolean
  is_featured?: boolean
  status: 'draft' | 'published'
  sort_order?: number
  technology_ids?: number[]
  images?: ProjectImageInput[]
}

export async function listProjects(filters: ProjectFilters = {}): Promise<Project[]> {
  const { data } = await api.get<Project[]>('/projects', { params: filters })
  return data
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return listProjects({ featured: true })
}

export async function getProjectBySlug(slug: string): Promise<Project> {
  const { data } = await api.get<Project>(`/projects/${slug}`)
  return data
}

export async function createProject(payload: ProjectPayload): Promise<Project> {
  const { data } = await api.post<Project>('/projects', buildFormData(payload))
  return data
}

export async function updateProject(slug: string, payload: ProjectPayload): Promise<Project> {
  const { data } = await api.post<Project>(`/projects/${slug}`, buildFormData(payload, 'PUT'))
  return data
}

export async function deleteProject(slug: string): Promise<void> {
  await api.delete(`/projects/${slug}`)
}

export async function deleteProjectImage(slug: string, imageId: number): Promise<void> {
  await api.delete(`/projects/${slug}/images/${imageId}`)
}
