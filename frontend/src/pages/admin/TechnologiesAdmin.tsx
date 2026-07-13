import { useEffect, useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminTable, { type AdminColumn } from '@/components/admin/AdminTable'
import Modal from '@/components/admin/Modal'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { TextField } from '@/components/admin/fields'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessage } from '@/utils/apiError'
import {
  listTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  type TechnologyPayload,
} from '@/services/technologies'
import type { Technology } from '@/types'

const EMPTY_FORM: TechnologyPayload = { name: '', icon: '' }

export default function TechnologiesAdmin() {
  const { showToast } = useToast()
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Technology | null>(null)
  const [form, setForm] = useState<TechnologyPayload>(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState<Technology | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const reload = () => {
    setIsLoading(true)
    listTechnologies()
      .then(setTechnologies)
      .finally(() => setIsLoading(false))
  }

  useEffect(reload, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (technology: Technology) => {
    setEditing(technology)
    setForm({ name: technology.name, icon: technology.icon ?? '' })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      if (editing) {
        await updateTechnology(editing.id, form)
        showToast('Technology updated.')
      } else {
        await createTechnology(form)
        showToast('Technology created.')
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
      await deleteTechnology(deleteTarget.id)
      showToast('Technology deleted.')
      setDeleteTarget(null)
      reload()
    } catch (err) {
      showToast(getErrorMessage(err, 'Could not delete technology.'), 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: AdminColumn<Technology>[] = [
    { header: 'Name', render: (t) => <span className="font-medium text-neutral-900 dark:text-white">{t.name}</span> },
    { header: 'Slug', render: (t) => t.slug },
    { header: 'Icon', render: (t) => t.icon ?? '—' },
  ]

  return (
    <>
      <Helmet>
        <title>Technologies | Admin</title>
      </Helmet>

      <AdminPageHeader title="Technologies" onCreate={openCreate} />

      <div className="mt-6">
        <AdminTable columns={columns} rows={technologies} isLoading={isLoading} onEdit={openEdit} onDelete={setDeleteTarget} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Technology' : 'New Technology'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            id="name"
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            id="icon"
            label="Icon (optional identifier)"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
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
        title="Delete Technology"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </>
  )
}
