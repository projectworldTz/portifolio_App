import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FaGauge,
  FaDiagramProject,
  FaBoxOpen,
  FaFolder,
  FaCode,
  FaLayerGroup,
  FaQuoteLeft,
  FaShareNodes,
  FaEnvelope,
  FaGear,
  FaNewspaper,
  FaBars,
  FaXmark,
  FaArrowRightFromBracket,
  FaHouse,
} from 'react-icons/fa6'
import { useAuth } from '@/contexts/AuthContext'
import NotificationBell from '@/components/admin/NotificationBell'

const NAV_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: FaGauge, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FaDiagramProject },
  { to: '/admin/products', label: 'Products', icon: FaBoxOpen },
  { to: '/admin/categories', label: 'Categories', icon: FaFolder },
  { to: '/admin/technologies', label: 'Technologies', icon: FaCode },
  { to: '/admin/services', label: 'Services', icon: FaLayerGroup },
  { to: '/admin/testimonials', label: 'Testimonials', icon: FaQuoteLeft },
  { to: '/admin/blogs', label: 'Blog Posts', icon: FaNewspaper },
  { to: '/admin/social-links', label: 'Social Links', icon: FaShareNodes },
  { to: '/admin/messages', label: 'Messages', icon: FaEnvelope },
  { to: '/admin/settings', label: 'Settings', icon: FaGear },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
            }`
          }
        >
          <link.icon size={16} />
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-svh bg-neutral-50 dark:bg-neutral-950">
      <aside className="safe-top safe-left safe-bottom hidden w-64 shrink-0 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 lg:flex">
        <div className="flex items-center gap-2 border-b border-neutral-200 px-6 py-5 dark:border-neutral-800">
          <span className="text-lg font-semibold text-neutral-900 dark:text-white">Admin</span>
        </div>
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="safe-top safe-bottom absolute inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5 dark:border-neutral-800">
              <span className="text-lg font-semibold text-neutral-900 dark:text-white">Admin</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center"
              >
                <FaXmark size={18} />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="safe-top flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-11 w-11 items-center justify-center text-neutral-600 dark:text-neutral-300 lg:hidden"
          >
            <FaBars size={18} />
          </button>

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <NotificationBell />
            <NavLink
              to="/"
              className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            >
              <FaHouse size={14} /> View Site
            </NavLink>
            <span className="hidden text-sm text-neutral-500 dark:text-neutral-400 sm:inline">{user?.email}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <FaArrowRightFromBracket size={14} /> Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
