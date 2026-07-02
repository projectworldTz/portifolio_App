import { useEffect, useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminTable, { type AdminColumn } from '@/components/admin/AdminTable'
import Modal from '@/components/admin/Modal'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { TextField, TextareaField } from '@/components/admin/fields'
import { useToast } from '@/contexts/ToastContext'
import { listServices, createService, updateService, deleteService } from '@/services/serviceCatalog'
import type { Service } from '@/types'

interface FormState {
  title: string
  icon: string
  description: string
  benefitsText: string
  sort_order: number
}

const EMPTY_FORM: FormState = { title: '', icon: '', description: '', benefitsText: '', sort_order: 0 }

export default function ServicesAdmin() {
  const { showToast } = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const reload = () => {
    setIsLoading(true)
    listServices()
      .then(setServices)
      .finally(() => setIsLoading(false))
  }

  useEffect(reload, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (service: Service) => {
    setEditing(service)
    setForm({
      title: service.title,
      icon: service.icon ?? '',
      description: service.description,
      benefitsText: (service.benefits ?? []).join('\n'),
      sort_order: service.sort_order,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const payload = {
      title: form.title,
      icon: form.icon,
      description: form.description,
      benefits: form.benefitsText.split('\n').map((b) => b.trim()).filter(Boolean),
      sort_order: form.sort_order,
    }
    try {
      if (editing) {
        await updateService(editing.id, payload)
        showToast('Service updated.')
      } else {
        await createService(payload)
        showToast('Service created.')
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
      await deleteService(deleteTarget.id)
      showToast('Service deleted.')
      setDeleteTarget(null)
      reload()
    } catch {
      showToast('Could not delete service.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: AdminColumn<Service>[] = [
    { header: 'Title', render: (s) => <span className="font-medium text-neutral-900 dark:text-white">{s.title}</span> },
    { header: 'Description', render: (s) => <span className="line-clamp-1">{s.description}</span> },
    { header: 'Order', render: (s) => s.sort_order },
  ]

  return (
    <>
      <Helmet>
        <title>Services | Admin</title>
      </Helmet>

      <AdminPageHeader title="Services" onCreate={openCreate} />

      <div className="mt-6">
        <AdminTable columns={columns} rows={services} isLoading={isLoading} onEdit={openEdit} onDelete={setDeleteTarget} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Service' : 'New Service'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            id="title"
            label="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextareaField
            id="description"
            label="Description"
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextareaField
            id="benefits"
            label="Benefits (one per line)"
            rows={4}
            value={form.benefitsText}
            onChange={(e) => setForm({ ...form, benefitsText: e.target.value })}
          />
          <TextField
            id="sort_order"
            label="Sort Order"
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
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
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </>
  )
}
