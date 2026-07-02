import { useEffect, useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminTable, { type AdminColumn } from '@/components/admin/AdminTable'
import Modal from '@/components/admin/Modal'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { TextField, TextareaField, CheckboxField, FileField } from '@/components/admin/fields'
import { useToast } from '@/contexts/ToastContext'
import {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type TestimonialPayload,
} from '@/services/testimonials'
import type { Testimonial } from '@/types'

const EMPTY_FORM: TestimonialPayload = {
  client_name: '',
  company: '',
  review: '',
  rating: 5,
  is_featured: false,
  sort_order: 0,
  client_photo: null,
}

export default function TestimonialsAdmin() {
  const { showToast } = useToast()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState<TestimonialPayload>(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const reload = () => {
    setIsLoading(true)
    listTestimonials()
      .then(setTestimonials)
      .finally(() => setIsLoading(false))
  }

  useEffect(reload, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (testimonial: Testimonial) => {
    setEditing(testimonial)
    setForm({
      client_name: testimonial.client_name,
      company: testimonial.company ?? '',
      review: testimonial.review,
      rating: testimonial.rating,
      is_featured: testimonial.is_featured,
      sort_order: 0,
      client_photo: null,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      if (editing) {
        await updateTestimonial(editing.id, form)
        showToast('Testimonial updated.')
      } else {
        await createTestimonial(form)
        showToast('Testimonial created.')
      }
      setModalOpen(false)
      reload()
    } catch {
      showToast('Something went wrong.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteTestimonial(deleteTarget.id)
      showToast('Testimonial deleted.')
      setDeleteTarget(null)
      reload()
    } catch {
      showToast('Could not delete testimonial.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: AdminColumn<Testimonial>[] = [
    {
      header: 'Client',
      render: (t) => <span className="font-medium text-neutral-900 dark:text-white">{t.client_name}</span>,
    },
    { header: 'Company', render: (t) => t.company ?? '—' },
    { header: 'Rating', render: (t) => `${t.rating}/5` },
    { header: 'Featured', render: (t) => (t.is_featured ? 'Yes' : 'No') },
  ]

  return (
    <>
      <Helmet>
        <title>Testimonials | Admin</title>
      </Helmet>

      <AdminPageHeader title="Testimonials" onCreate={openCreate} />

      <div className="mt-6">
        <AdminTable columns={columns} rows={testimonials} isLoading={isLoading} onEdit={openEdit} onDelete={setDeleteTarget} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Testimonial' : 'New Testimonial'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextField
              id="client_name"
              label="Client Name"
              required
              value={form.client_name}
              onChange={(e) => setForm({ ...form, client_name: e.target.value })}
            />
            <TextField
              id="company"
              label="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <TextareaField
            id="review"
            label="Review"
            required
            rows={4}
            value={form.review}
            onChange={(e) => setForm({ ...form, review: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              id="rating"
              label="Rating (1-5)"
              type="number"
              min={1}
              max={5}
              required
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
            />
            <TextField
              id="sort_order"
              label="Sort Order"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            />
          </div>
          <FileField
            id="client_photo"
            label="Client Photo"
            currentUrl={editing?.client_photo}
            onChange={(file) => setForm({ ...form, client_photo: file })}
          />
          <CheckboxField
            id="is_featured"
            label="Featured"
            checked={!!form.is_featured}
            onChange={(checked) => setForm({ ...form, is_featured: checked })}
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
        title="Delete Testimonial"
        message={`Are you sure you want to delete this testimonial from "${deleteTarget?.client_name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </>
  )
}
