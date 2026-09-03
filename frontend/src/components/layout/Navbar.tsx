import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FaBars, FaXmark } from 'react-icons/fa6'
import { useSiteData } from '@/contexts/SiteDataContext'
import { getWhatsAppUrl } from '@/utils/whatsapp'

const NAV_LINKS = [
  { to: '/projects', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { settings, socialLinks } = useSiteData()
  const [isOpen, setIsOpen] = useState(false)
  const whatsappUrl = getWhatsAppUrl(socialLinks, settings)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-indigo-600 after:transition-transform ${
      isActive
        ? 'text-indigo-600 after:scale-x-100'
        : 'text-neutral-600 after:scale-x-0 hover:text-neutral-950 hover:after:scale-x-100'
    }`

  const mobileLinkClass = (args: { isActive: boolean }) => `block py-2.5 ${linkClass(args)}`

  return (
    <header className="safe-top sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_8px_32px_rgba(15,23,42,.06)] backdrop-blur-xl">
      <nav className="safe-left safe-right mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          onClick={() => setIsOpen(false)}
          className="group flex min-w-0 items-center gap-2.5"
          aria-label="ProjectWorldTZ home"
        >
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-[0_8px_24px_rgba(14,165,233,.2)] transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_10px_28px_rgba(14,165,233,.3)]">
            <img
              src="/branding/projectworldtz-mark.webp"
              alt=""
              width="256"
              height="256"
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="min-w-0 leading-none">
            <span className="block whitespace-nowrap text-[1.05rem] font-extrabold tracking-[-0.045em] text-slate-900 sm:text-xl">
              project<span className="text-sky-600">world</span>Tz
            </span>
            <span className="mt-1 hidden whitespace-nowrap text-[0.52rem] font-semibold uppercase tracking-[0.18em] text-slate-400 lg:block">
              Software · Systems · Success
            </span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 md:hidden"
          >
            {isOpen ? <FaXmark size={18} /> : <FaBars size={18} />}
          </button>
          <a
            href={whatsappUrl ?? '/contact'}
            target={whatsappUrl ? '_blank' : undefined}
            rel={whatsappUrl ? 'noreferrer' : undefined}
            className="hidden rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 dark:bg-white dark:text-neutral-950 dark:hover:bg-indigo-400 sm:inline-flex"
          >
            Let&apos;s talk
          </a>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-neutral-200 dark:border-neutral-800 md:hidden"
          >
            <div className="flex flex-col px-4 py-2 sm:px-6">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={mobileLinkClass}
                  end={link.to === '/'}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
