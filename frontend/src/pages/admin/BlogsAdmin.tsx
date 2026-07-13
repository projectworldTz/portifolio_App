import { useEffect, useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminTable, { type AdminColumn } from '@/components/admin/AdminTable'
import Modal from '@/components/admin/Modal'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { TextField, TextareaField, SelectField, CheckboxField, FileField } from '@/components/admin/fields'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessage } from '@/utils/apiError'
import { useFetch } from '@/hooks/useFetch'
import { listCategories } from '@/services/categories'
import { listBlogs, createBlog, updateBlog, deleteBlog, type BlogPayload } from '@/services/blogs'
import type { Blog } from '@/types'

interface FormState {
  category_id: string
  title: string
  excerpt: string
  content: string
  is_published: boolean
  published_at: string
  thumbnail: File | null
}

const EMPTY_FORM: FormState = {
  category_id: '',
  title: '',
  excerpt: '',
  content: '',
  is_published: false,
  published_at: '',
  thumbnail: null,
}

export default function BlogsAdmin() {
  const { showToast } = useToast()
  const { data: categories } = useFetch(listCategories, [])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Blog | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const reload = () => {
    setIsLoading(true)
    listBlogs()
      .then(setBlogs)
      .finally(() => setIsLoading(false))
  }

  useEffect(reload, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (blog: Blog) => {
    setEditing(blog)
    setForm({
      category_id: blog.category?.id ? String(blog.category.id) : '',
      title: blog.title,
      excerpt: blog.excerpt ?? '',
      content: blog.content ?? '',
      is_published: blog.is_published,
      published_at: blog.published_at ? blog.published_at.slice(0, 10) : '',
      thumbnail: null,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const payload: BlogPayload = {
      category_id: form.category_id ? Number(form.category_id) : null,
      title: form.title,
      excerpt: form.excerpt || undefined,
      content: form.content,
      is_published: form.is_published,
      published_at: form.published_at || undefined,
      thumbnail: form.thumbnail,
    }
    try {
      if (editing) {
        await updateBlog(editing.slug, payload)
        showToast('Blog post updated.')
      } else {
        await createBlog(payload)
        showToast('Blog post created.')
      }
      setModalOpen(false)
      reload()
    } catch (err) {
      showToast(getErrorMessage(err, 'Something went wrong.'), 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteBlog(deleteTarget.slug)
      showToast('Blog post deleted.')
      setDeleteTarget(null)
      reload()
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not delete blog post.'), 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: AdminColumn<Blog>[] = [
    { header: 'Title', render: (b) => <span className="font-medium text-neutral-900 dark:text-white">{b.title}</span> },
    { header: 'Category', render: (b) => b.category?.name ?? '—' },
    { header: 'Published', render: (b) => (b.is_published ? 'Yes' : 'No') },
  ]

  return (
    <>
      <Helmet>
        <title>Blog Posts | Admin</title>
      </Helmet>

      <AdminPageHeader title="Blog Posts" onCreate={openCreate} />

      <div className="mt-6">
        <AdminTable columns={columns} rows={blogs} isLoading={isLoading} onEdit={openEdit} onDelete={setDeleteTarget} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Blog Post' : 'New Blog Post'}>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <TextField
            id="excerpt"
            label="Excerpt"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
          <TextareaField
            id="content"
            label="Content"
            required
            rows={6}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <FileField
            id="thumbnail"
            label="Thumbnail"
            currentUrl={editing?.thumbnail}
            onChange={(file) => setForm({ ...form, thumbnail: file })}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              id="published_at"
              label="Publish Date"
              type="date"
              value={form.published_at}
              onChange={(e) => setForm({ ...form, published_at: e.target.value })}
            />
            <div className="flex items-end pb-2">
              <CheckboxField
                id="is_published"
                label="Published"
                checked={form.is_published}
                onChange={(checked) => setForm({ ...form, is_published: checked })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60"
            >
              {isSaving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </>
  )
}
