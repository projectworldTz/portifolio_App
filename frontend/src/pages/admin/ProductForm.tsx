import { useEffect, useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { TextField, TextareaField, SelectField, CheckboxField, FileField } from '@/components/admin/fields'
import GalleryUploader, { type ExistingImage, type NewImage } from '@/components/admin/GalleryUploader'
import { useToast } from '@/contexts/ToastContext'
import {
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProductImage,
  type ProductPayload,
} from '@/services/products'

interface FormState {
  name: string
  short_description: string
  description: string
  featuresText: string
  price: string
  license: string
  documentation_url: string
  demo_url: string
  is_featured: boolean
  status: 'draft' | 'published'
  sort_order: number
  thumbnail: File | null
}

const EMPTY_FORM: FormState = {
  name: '',
  short_description: '',
  description: '',
  featuresText: '',
  price: '',
  license: '',
  documentation_url: '',
  demo_url: '',
  is_featured: false,
  status: 'draft',
  sort_order: 0,
  thumbnail: null,
}

export default function ProductForm() {
  const { slug } = useParams<{ slug?: string }>()
  const isEditing = !!slug
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [currentThumbnail, setCurrentThumbnail] = useState<string | null>(null)
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([])
  const [newImages, setNewImages] = useState<NewImage[]>([])
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!slug) return
    setIsLoading(true)
    getProductBySlug(slug)
      .then((product) => {
        setForm({
          name: product.name,
          short_description: product.short_description,
          description: product.description ?? '',
          featuresText: (product.features ?? []).join('\n'),
          price: product.price,
          license: product.license ?? '',
          documentation_url: product.documentation_url ?? '',
          demo_url: product.demo_url ?? '',
          is_featured: product.is_featured,
          status: product.status,
          sort_order: 0,
          thumbnail: null,
        })
        setCurrentThumbnail(product.thumbnail)
        setExistingImages(product.images)
      })
      .finally(() => setIsLoading(false))
  }, [slug])

  const handleDeleteExistingImage = async (imageId: number) => {
    if (!slug) return
    try {
      await deleteProductImage(slug, imageId)
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
      showToast('Image deleted.')
    } catch {
      showToast('Could not delete image.', 'error')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const payload: ProductPayload = {
      name: form.name,
      short_description: form.short_description,
      description: form.description,
      features: form.featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
      price: Number(form.price),
      license: form.license || undefined,
      documentation_url: form.documentation_url || undefined,
      demo_url: form.demo_url || undefined,
      is_featured: form.is_featured,
      status: form.status,
      sort_order: form.sort_order,
      thumbnail: form.thumbnail,
      images: newImages.map((img) => ({ file: img.file, alt_text: img.alt_text || undefined })),
    }

    try {
      if (isEditing && slug) {
        await updateProduct(slug, payload)
        showToast('Product updated.')
      } else {
        await createProduct(payload)
        showToast('Product created.')
      }
      navigate('/admin/products')
    } catch {
      showToast('Something went wrong. Check required fields.', 'error')
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
        <title>{isEditing ? 'Edit Product' : 'New Product'} | Admin</title>
      </Helmet>

      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
        {isEditing ? 'Edit Product' : 'New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-3xl space-y-6">
        <TextField
          id="name"
          label="Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

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
          <TextField
            id="license"
            label="License"
            value={form.license}
            onChange={(e) => setForm({ ...form, license: e.target.value })}
          />
          <TextField
            id="documentation_url"
            label="Documentation URL"
            type="url"
            value={form.documentation_url}
            onChange={(e) => setForm({ ...form, documentation_url: e.target.value })}
          />
        </div>

        <TextField
          id="demo_url"
          label="Demo URL"
          type="url"
          value={form.demo_url}
          onChange={(e) => setForm({ ...form, demo_url: e.target.value })}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            id="price"
            label="Price"
            type="number"
            step="0.01"
            required
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

        <CheckboxField
          id="is_featured"
          label="Featured"
          checked={form.is_featured}
          onChange={(checked) => setForm({ ...form, is_featured: checked })}
        />

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
            onClick={() => navigate('/admin/products')}
            className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : 'Save Product'}
          </button>
        </div>
      </form>
    </>
  )
}
