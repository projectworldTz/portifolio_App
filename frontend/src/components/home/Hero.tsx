import { motion } from 'framer-motion'
import { FaArrowRight, FaDownload } from 'react-icons/fa6'
import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import { useSiteData } from '@/contexts/SiteDataContext'
import { getSocialIcon } from '@/utils/socialIcons'

export default function Hero() {
  const { settings, socialLinks, isLoading } = useSiteData()
  const name = settings?.site_name ?? 'Full-stack developer'
  const role = settings?.site_title ?? 'Full-stack software engineer'

  return (
    <section className="relative isolate overflow-hidden bg-white py-16 sm:py-24 lg:py-28">
      <div aria-hidden className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)] opacity-70" />
      <div aria-hidden className="absolute left-1/2 top-0 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-indigo-100/60 blur-3xl" />
      <Container className="grid items-center gap-14 lg:grid-cols-[1.2fr_.8fr]">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-medium text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.12)]" /> Open to opportunities
            </span>
            <span className="font-medium text-neutral-500">{isLoading ? 'Software engineer' : role}</span>
          </div>
          <h1 className="mt-7 max-w-4xl text-5xl font-bold leading-[.98] tracking-[-0.055em] text-neutral-950 sm:text-7xl lg:text-[5.25rem]">
            I turn complex ideas into <span className="text-indigo-600">clear digital products.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-600">
            {settings?.site_description ?? `${name} is a full-stack developer building fast, reliable web applications from interface to infrastructure.`}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button to="/projects">View selected work <FaArrowRight size={13} /></Button>
            {settings?.resume_url ? (
              <a href={settings.resume_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition-all hover:border-neutral-400 hover:shadow-md">Download resume <FaDownload size={13} /></a>
            ) : <Button to="/contact" variant="secondary">Contact me</Button>}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-neutral-200 pt-6">
            <p className="text-sm"><span className="font-semibold text-neutral-950">{name}</span><span className="ml-2 text-neutral-500">React · TypeScript · Laravel</span></p>
            {socialLinks.length > 0 && <div className="flex items-center gap-4">{socialLinks.slice(0, 4).map((link) => { const Icon = getSocialIcon(link.platform); return <a key={link.id} href={link.url} target="_blank" rel="noreferrer" aria-label={link.platform} className="text-neutral-400 transition-colors hover:text-indigo-600"><Icon size={17} /></a> })}</div>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="relative mx-auto w-full max-w-sm lg:ml-auto">
          <div className="absolute -inset-4 -z-10 rotate-3 rounded-[2.25rem] bg-indigo-600" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-4 border-white bg-neutral-100 shadow-2xl shadow-indigo-950/20">
            {settings?.photo ? <img src={settings.photo} alt={name} width="384" height="480" fetchPriority="high" decoding="async" className="h-full w-full object-cover" /> : <div className="flex h-full items-end bg-neutral-950 p-8"><p className="max-w-xs text-3xl font-semibold leading-tight text-white">Design.<br />Engineering.<br /><span className="text-indigo-300">Real outcomes.</span></p></div>}
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/30 bg-white/90 p-4 shadow-lg backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Currently focused on</p>
              <p className="mt-1 text-sm font-semibold text-neutral-950">Scalable full-stack web experiences</p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
