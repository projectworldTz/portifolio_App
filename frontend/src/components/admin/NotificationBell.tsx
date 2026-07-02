import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FaBell, FaEnvelope } from 'react-icons/fa6'
import { listMessages } from '@/services/messages'
import { formatRelativeTime } from '@/utils/relativeTime'
import type { ContactMessage } from '@/types'

const POLL_INTERVAL_MS = 30_000

export default function NotificationBell() {
  const navigate = useNavigate()
  const [unread, setUnread] = useState<ContactMessage[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = () => {
      listMessages(true)
        .then(setUnread)
        .catch(() => {
          // silent — notification bell shouldn't surface transient errors
        })
    }

    load()
    const interval = setInterval(load, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const goToMessages = () => {
    setIsOpen(false)
    navigate('/admin/messages')
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={`Notifications${unread.length > 0 ? ` (${unread.length} unread)` : ''}`}
        className="relative flex h-11 w-11 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        <FaBell size={17} />
        {unread.length > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
            {unread.length > 9 ? '9+' : unread.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                Notifications {unread.length > 0 && `(${unread.length})`}
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {unread.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-neutral-400">You're all caught up.</p>
              ) : (
                unread.slice(0, 5).map((message) => (
                  <button
                    key={message.id}
                    type="button"
                    onClick={goToMessages}
                    className="flex w-full items-start gap-3 border-b border-neutral-100 px-4 py-3 text-left last:border-0 hover:bg-neutral-50 dark:border-neutral-800/60 dark:hover:bg-neutral-800"
                  >
                    <FaEnvelope size={14} className="mt-1 shrink-0 text-indigo-600 dark:text-indigo-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                        {message.name}
                      </p>
                      <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                        {message.subject || message.message}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">
                        {formatRelativeTime(message.created_at)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={goToMessages}
              className="block w-full border-t border-neutral-200 px-4 py-2.5 text-center text-sm font-semibold text-indigo-600 hover:bg-neutral-50 dark:border-neutral-800 dark:text-indigo-400 dark:hover:bg-neutral-800"
            >
              View All Messages
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
