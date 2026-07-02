import { useEffect, useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminTable, { type AdminColumn } from '@/components/admin/AdminTable'
import Modal from '@/components/admin/Modal'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { TextField, CheckboxField } from '@/components/admin/fields'
import { useToast } from '@/contexts/ToastContext'
import {
  listSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  type SocialLinkPayload,
} from '@/services/socialLinks'
import type { SocialLink } from '@/types'

const EMPTY_FORM: SocialLinkPayload = { platform: '', url: '', is_active: true, sort_order: 0 }

export default function SocialLinksAdmin() {
  const { showToast } = useToast()
  const [links, setLinks] = useState<SocialLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<SocialLink | null>(null)
  const [form, setForm] = useState<SocialLinkPayload>(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState<SocialLink | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const reload = () => {
    setIsLoading(true)
    listSocialLinks()
      .then(setLinks)
      .finally(() => setIsLoading(false))
  }

  useEffect(reload, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (link: SocialLink) => {
    setEditing(link)
    setForm({ platform: link.platform, url: link.url, is_active: link.is_active, sort_order: 0 })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      if (editing) {
        await updateSocialLink(editing.id, form)
        showToast('Social link updated.')
      } else {
        await createSocialLink(form)
        showToast('Social link created.')
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
      await deleteSocialLink(deleteTarget.id)
      showToast('Social link deleted.')
      setDeleteTarget(null)
      reload()
    } catch {
      showToast('Could not delete social link.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: AdminColumn<SocialLink>[] = [
    {
      header: 'Platform',
      render: (l) => <span className="font-medium capitalize text-neutral-900 dark:text-white">{l.platform}</span>,
    },
    { header: 'URL', render: (l) => <span className="truncate">{l.url}</span> },
    { header: 'Active', render: (l) => (l.is_active ? 'Yes' : 'No') },
  ]

  return (
    <>
      <Helmet>
        <title>Social Links | Admin</title>
      </Helmet>

      <AdminPageHeader title="Social Links" onCreate={openCreate} />

      <div className="mt-6">
        <AdminTable columns={columns} rows={links} isLoading={isLoading} onEdit={openEdit} onDelete={setDeleteTarget} />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Social Link' : 'New Social Link'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            id="platform"
            label="Platform (e.g. github, linkedin, twitter)"
            required
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
          />
          <TextField
            id="url"
            label="URL"
            type="url"
            required
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />
          <TextField
            id="sort_order"
            label="Sort Order"
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
          />
          <CheckboxField
            id="is_active"
            label="Active"
            checked={!!form.is_active}
            onChange={(checked) => setForm({ ...form, is_active: checked })}
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
        title="Delete Social Link"
        message={`Are you sure you want to delete "${deleteTarget?.platform}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </>
  )
}
