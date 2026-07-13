import { useEffect, useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminTable, { type AdminColumn } from '@/components/admin/AdminTable'
import Modal from '@/components/admin/Modal'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { TextField, TextareaField } from '@/components/admin/fields'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessage } from '@/utils/apiError'
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryPayload,
} from '@/services/categories'
import type { Category } from '@/types'

const EMPTY_FORM: CategoryPayload = { name: '', description: '' }

export default function CategoriesAdmin() {
  const { showToast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<CategoryPayload>(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const reload = () => {
    setIsLoading(true)
    listCategories()
      .then(setCategories)
      .finally(() => setIsLoading(false))
  }

  useEffect(reload, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditing(category)
    setForm({ name: category.name, description: category.description ?? '' })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      if (editing) {
        await updateCategory(editing.id, form)
        showToast('Category updated.')
      } else {
        await createCategory(form)
        showToast('Category created.')
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
      await deleteCategory(deleteTarget.id)
      showToast('Category deleted.')
      setDeleteTarget(null)
      reload()
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not delete category.'), 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: AdminColumn<Category>[] = [
    { header: 'Name', render: (c) => <span className="font-medium text-neutral-900 dark:text-white">{c.name}</span> },
    { header: 'Slug', render: (c) => c.slug },
    { header: 'Description', render: (c) => c.description ?? '—' },
  ]

  return (
    <>
      <Helmet>
        <title>Categories | Admin</title>
      </Helmet>

      <AdminPageHeader title="Categories" onCreate={openCreate} />

      <div className="mt-6">
        <AdminTable columns={columns} rows={categories} isLoading={isLoading} onEdit={openEdit} onDelete={setDeleteTarget} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'New Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            id="name"
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextareaField
            id="description"
            label="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
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
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </>
  )
}
