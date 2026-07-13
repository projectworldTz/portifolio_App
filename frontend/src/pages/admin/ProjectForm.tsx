import { useEffect, useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { TextField, TextareaField, SelectField, CheckboxField, FileField } from '@/components/admin/fields'
import GalleryUploader, { type ExistingImage, type NewImage } from '@/components/admin/GalleryUploader'
import { useToast } from '@/contexts/ToastContext'
import { useFetch } from '@/hooks/useFetch'
import { listCategories } from '@/services/categories'
import { listTechnologies } from '@/services/technologies'
import { getErrorMessage } from '@/utils/apiError'
import {
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProjectImage,
  type ProjectPayload,
} from '@/services/projects'

interface FormState {
  title: string
  category_id: string
  short_description: string
  description: string
  featuresText: string
  challenges: string
  solutions: string
  demo_url: string
  repo_url: string
  demo_video_url: string
  price: string
  is_purchasable: boolean
  is_featured: boolean
  status: 'draft' | 'published'
  sort_order: number
  technology_ids: number[]
  thumbnail: File | null
}

const EMPTY_FORM: FormState = {
  title: '',
  category_id: '',
  short_description: '',
  description: '',
  featuresText: '',
  challenges: '',
  solutions: '',
  demo_url: '',
  repo_url: '',
  demo_video_url: '',
  price: '',
  is_purchasable: false,
  is_featured: false,
  status: 'draft',
  sort_order: 0,
  technology_ids: [],
  thumbnail: null,
}

export default function ProjectForm() {
  const { slug } = useParams<{ slug?: string }>()
  const isEditing = !!slug
  const navigate = useNavigate()
  const { showToast } = useToast()

  const { data: categories } = useFetch(listCategories, [])
  const { data: technologies } = useFetch(listTechnologies, [])

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [currentThumbnail, setCurrentThumbnail] = useState<string | null>(null)
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([])
  const [newImages, setNewImages] = useState<NewImage[]>([])
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!slug) return
    setIsLoading(true)
    getProjectBySlug(slug)
      .then((project) => {
        setForm({
          title: project.title,
          category_id: project.category?.id ? String(project.category.id) : '',
          short_description: project.short_description,
          description: project.description ?? '',
          featuresText: (project.features ?? []).join('\n'),
          challenges: project.challenges ?? '',
          solutions: project.solutions ?? '',
          demo_url: project.demo_url ?? '',
          repo_url: project.repo_url ?? '',
          demo_video_url: project.demo_video_url ?? '',
          price: project.price ?? '',
          is_purchasable: project.is_purchasable,
          is_featured: project.is_featured,
          status: project.status,
          sort_order: 0,
          technology_ids: project.technologies.map((t) => t.id),
          thumbnail: null,
        })
        setCurrentThumbnail(project.thumbnail)
        setExistingImages(project.images)
      })
      .finally(() => setIsLoading(false))
  }, [slug])

  const toggleTechnology = (id: number) => {
    setForm((prev) => ({
      ...prev,
      technology_ids: prev.technology_ids.includes(id)
        ? prev.technology_ids.filter((t) => t !== id)
        : [...prev.technology_ids, id],
    }))
  }

  const handleDeleteExistingImage = async (imageId: number) => {
    if (!slug) return
    try {
      await deleteProjectImage(slug, imageId)
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
      showToast('Image deleted.')
    } catch {
      showToast('Could not delete image.', 'error')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const payload: ProjectPayload = {
      title: form.title,
      category_id: form.category_id ? Number(form.category_id) : null,
      short_description: form.short_description,
      description: form.description,
      features: form.featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
      challenges: form.challenges || undefined,
      solutions: form.solutions || undefined,
      demo_url: form.demo_url || undefined,
      repo_url: form.repo_url || undefined,
      demo_video_url: form.demo_video_url || undefined,
      price: form.price ? Number(form.price) : null,
      is_purchasable: form.is_purchasable,
      is_featured: form.is_featured,
      status: form.status,
      sort_order: form.sort_order,
      technology_ids: form.technology_ids,
      thumbnail: form.thumbnail,
      images: newImages.map((img) => ({ file: img.file, alt_text: img.alt_text || undefined })),
    }

    try {
      if (isEditing && slug) {
        await updateProject(slug, payload)
        showToast('Project updated.')
      } else {
        await createProject(payload)
        showToast('Project created.')
      }
      navigate('/admin/projects')
    } catch (err) {
      showToast(getErrorMessage(err, 'Something went wrong. Check required fields.'), 'error')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <p className="text-neutral-400">Loading…</p>
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Edit Project' : 'New Project'} | Admin</title>
      </Helmet>

      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
        {isEditing ? 'Edit Project' : 'New Project'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-3xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="title"
            label="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <SelectField
            id="category_id"
            label="Category"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <option value="">No category</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </SelectField>
        </div>

        <TextField
          id="short_description"
          label="Short Description"
          required
          value={form.short_description}
          onChange={(e) => setForm({ ...form, short_description: e.target.value })}
        />

        <TextareaField
          id="description"
          label="Full Description"
          required
          rows={5}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <TextareaField
          id="features"
          label="Features (one per line)"
          rows={4}
          value={form.featuresText}
          onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextareaField
            id="challenges"
            label="Challenges"
            rows={3}
            value={form.challenges}
            onChange={(e) => setForm({ ...form, challenges: e.target.value })}
          />
          <TextareaField
            id="solutions"
            label="Solutions"
            rows={3}
            value={form.solutions}
            onChange={(e) => setForm({ ...form, solutions: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            id="demo_url"
            label="Demo URL"
            type="url"
            value={form.demo_url}
            onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
          />
          <TextField
            id="repo_url"
            label="Repository URL"
            type="url"
            value={form.repo_url}
            onChange={(e) => setForm({ ...form, repo_url: e.target.value })}
          />
          <TextField
            id="demo_video_url"
            label="Demo Video URL"
            type="url"
            value={form.demo_video_url}
            onChange={(e) => setForm({ ...form, demo_video_url: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            id="price"
            label="Price (optional)"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <SelectField
            id="status"
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </SelectField>
          <TextField
            id="sort_order"
            label="Sort Order"
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
          />
        </div>

        <div className="flex gap-6">
          <CheckboxField
            id="is_purchasable"
            label="Purchasable"
            checked={form.is_purchasable}
            onChange={(checked) => setForm({ ...form, is_purchasable: checked })}
          />
          <CheckboxField
            id="is_featured"
            label="Featured"
            checked={form.is_featured}
            onChange={(checked) => setForm({ ...form, is_featured: checked })}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Technologies</label>
          <div className="flex flex-wrap gap-2">
            {technologies?.map((tech) => (
              <button
                key={tech.id}
                type="button"
                onClick={() => toggleTechnology(tech.id)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  form.technology_ids.includes(tech.id)
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-300'
                    : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800'
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>
        </div>

        <FileField
          id="thumbnail"
          label="Thumbnail"
          currentUrl={currentThumbnail}
          onChange={(file) => setForm({ ...form, thumbnail: file })}
        />

        <GalleryUploader
          existingImages={existingImages}
          onDeleteExisting={handleDeleteExistingImage}
          newImages={newImages}
          onChangeNewImages={setNewImages}
        />

        <div className="flex gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : 'Save Project'}
          </button>
        </div>
      </form>
    </>
  )
}
