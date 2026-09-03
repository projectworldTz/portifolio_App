import { Link } from 'react-router-dom'
import { FaEnvelope } from 'react-icons/fa6'
import { useSiteData } from '@/contexts/SiteDataContext'
import { getSocialIcon } from '@/utils/socialIcons'

const NAV_LINKS = [
  { to: '/projects', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  const { settings, socialLinks } = useSiteData()
  const year = new Date().getFullYear()

  return (
    <footer className="safe-bottom border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="safe-left safe-right mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div>
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              {settings?.site_name ?? 'Portfolio'}
            </p>
            {settings?.site_description && (
              <p className="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
                {settings.site_description}
              </p>
            )}
            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                className="mt-4 inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-indigo-600 dark:text-neutral-300 dark:hover:text-indigo-400"
              >
                <FaEnvelope size={14} />
                {settings.email}
              </a>
            )}
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {socialLinks.length > 0 && (
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.platform)
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.platform}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-indigo-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-indigo-400"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          )}
        </div>

        <p className="mt-10 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          &copy; {year} {settings?.site_name ?? 'Portfolio'}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
