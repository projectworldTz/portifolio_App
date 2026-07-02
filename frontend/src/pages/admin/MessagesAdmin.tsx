import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminTable, { type AdminColumn } from '@/components/admin/AdminTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import Modal from '@/components/admin/Modal'
import { useToast } from '@/contexts/ToastContext'
import { listMessages, markMessageAsRead, deleteMessage } from '@/services/messages'
import type { ContactMessage } from '@/types'

export default function MessagesAdmin() {
  const { showToast } = useToast()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewing, setViewing] = useState<ContactMessage | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const reload = () => {
    setIsLoading(true)
    listMessages()
      .then(setMessages)
      .finally(() => setIsLoading(false))
  }

  useEffect(reload, [])

  const openMessage = async (message: ContactMessage) => {
    setViewing(message)
    if (!message.is_read) {
      try {
        await markMessageAsRead(message.id)
        reload()
      } catch {
        // non-fatal
      }
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteMessage(deleteTarget.id)
      showToast('Message deleted.')
      setDeleteTarget(null)
      reload()
    } catch {
      showToast('Could not delete message.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: AdminColumn<ContactMessage>[] = [
    {
      header: '',
      className: 'w-2',
      render: (m) => (!m.is_read ? <span className="block h-2 w-2 rounded-full bg-indigo-600" /> : null),
    },
    {
      header: 'From',
      render: (m) => (
        <button type="button" onClick={() => openMessage(m)} className="text-left hover:underline">
          <span className={`block ${!m.is_read ? 'font-semibold text-neutral-900 dark:text-white' : ''}`}>
            {m.name}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">{m.email}</span>
        </button>
      ),
    },
    { header: 'Subject', render: (m) => m.subject ?? '—' },
    { header: 'Received', render: (m) => new Date(m.created_at).toLocaleDateString() },
  ]

  return (
    <>
      <Helmet>
        <title>Messages | Admin</title>
      </Helmet>

      <AdminPageHeader title="Messages" />

      <div className="mt-6">
        <AdminTable
          columns={columns}
          rows={messages}
          isLoading={isLoading}
          onDelete={setDeleteTarget}
          emptyMessage="No messages yet."
        />
      </div>

      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title={viewing?.subject || 'Message'}>
        {viewing && (
          <div className="space-y-3 text-sm">
            <p className="text-neutral-500 dark:text-neutral-400">
              From <span className="font-medium text-neutral-900 dark:text-white">{viewing.name}</span> (
              <a href={`mailto:${viewing.email}`} className="text-indigo-600 dark:text-indigo-400">
                {viewing.email}
              </a>
              )
            </p>
            <p className="whitespace-pre-line text-neutral-700 dark:text-neutral-300">{viewing.message}</p>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Message"
        message={`Delete the message from "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </>
  )
}
