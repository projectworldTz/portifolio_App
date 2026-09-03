import { motion } from 'framer-motion'
import { FaArrowRight, FaDownload } from 'react-icons/fa6'
import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import { useSiteData } from '@/contexts/SiteDataContext'
import { getSocialIcon } from '@/utils/socialIcons'

export default function Hero() {
  const { settings, socialLinks, isLoading } = useSiteData()

  return (
    <section className="relative overflow-hidden border-b border-neutral-200/70 py-16 dark:border-neutral-800/70 sm:py-24">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.13),transparent_38%),radial-gradient(circle_at_85%_10%,rgba(139,92,246,0.11),transparent_35%)]" />
      <Container className="grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Full-stack developer
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-neutral-950 dark:text-white sm:text-6xl lg:text-7xl">
            {isLoading ? 'Building useful digital products.' : settings?.site_title ?? 'Building useful digital products.'}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
            {settings?.site_description ?? `I'm ${settings?.site_name ?? 'a software developer'}, turning complex ideas into fast, accessible web experiences.`}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/projects">Explore selected work <FaArrowRight size={13} /></Button>
            {settings?.resume_url ? (
              <a href={settings.resume_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">
                Résumé <FaDownload size={13} />
              </a>
            ) : <Button to="/contact" variant="secondary">Work with me</Button>}
          </div>
          {socialLinks.length > 0 && (
            <div className="mt-8 flex items-center gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">Find me on</span>
              {socialLinks.slice(0, 4).map((link) => {
                const Icon = getSocialIcon(link.platform)
                return <a key={link.id} href={link.url} target="_blank" rel="noreferrer" aria-label={link.platform} className="text-neutral-500 transition-colors hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"><Icon size={18} /></a>
              })}
            </div>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative mx-auto aspect-[4/5] w-full max-w-sm lg:ml-auto">
          <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 to-violet-500/5 blur-2xl" />
          {settings?.photo ? (
            <div className="h-full overflow-hidden rounded-[2rem] border border-white/60 bg-neutral-100 shadow-2xl shadow-neutral-950/10 dark:border-neutral-800 dark:bg-neutral-900">
              <img src={settings.photo} alt={settings.site_name ?? 'Profile photo'} width="384" height="480" fetchPriority="high" decoding="async" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex h-full items-end overflow-hidden rounded-[2rem] border border-neutral-200 bg-neutral-950 p-8 shadow-2xl dark:border-neutral-800">
              <div><p className="font-mono text-sm text-indigo-300">Design. Build. Improve.</p><p className="mt-3 text-3xl font-semibold leading-tight text-white">Clear software for real-world problems.</p></div>
            </div>
          )}
        </motion.div>
      </Container>
    </section>
  )
}
