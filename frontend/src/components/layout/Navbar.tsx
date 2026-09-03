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
    <header className="safe-top sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 shadow-[0_1px_0_rgba(0,0,0,.02)] backdrop-blur-xl">
      <nav className="safe-left safe-right mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="text-lg font-bold tracking-tight text-neutral-950">
          {settings?.site_name ?? 'Portfolio'}<span className="text-indigo-600">.</span>
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
