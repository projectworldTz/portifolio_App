import { motion } from 'framer-motion'
import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import { useSiteData } from '@/contexts/SiteDataContext'

export default function AboutPreview() {
  const { settings } = useSiteData()
  return (
    <section className="border-y border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-900/40">
      <Container>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.4 }} className="grid items-start gap-8 md:grid-cols-[.7fr_1.3fr]">
          <div><p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">About me</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">Thoughtful code.<br />Useful outcomes.</h2></div>
          <div><p className="text-lg leading-8 text-neutral-600 dark:text-neutral-300">{settings?.site_description ?? 'I design and build production-ready web applications with a focus on clarity, performance, and maintainability.'}</p><div className="mt-7"><Button to="/about" variant="secondary">More about my approach</Button></div></div>
        </motion.div>
      </Container>
    </section>
  )
}
