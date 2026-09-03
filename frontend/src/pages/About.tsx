import { motion } from 'framer-motion'
import { FaArrowRight, FaDownload } from 'react-icons/fa6'
import Seo from '@/components/common/Seo'
import Container from '@/components/common/Container'
import Skills from '@/components/home/Skills'
import Button from '@/components/ui/Button'
import { useSiteData } from '@/contexts/SiteDataContext'

const PRINCIPLES = [
  { number: '01', title: 'Start with the problem', description: 'I clarify the user need and business goal before choosing tools or writing code.' },
  { number: '02', title: 'Keep complexity useful', description: 'Simple architecture, clear interfaces, and maintainable decisions make products easier to improve.' },
  { number: '03', title: 'Ship and learn', description: 'I value working software, honest feedback, and focused iteration over unnecessary polish.' },
]

export default function About() {
  const { settings } = useSiteData()
  return (
    <>
      <Seo title="About" description={settings?.site_description ?? 'Learn about how I approach product design and software development.'} />
      <section className="py-16 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[.75fr_1.25fr]">
          {settings?.photo ? <img src={settings.photo} alt={settings.site_name ?? 'Profile'} width="448" height="560" decoding="async" className="aspect-[4/5] w-full max-w-md rounded-3xl border border-neutral-200 object-cover dark:border-neutral-800" /> : <div className="aspect-[4/5] w-full max-w-md rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950 dark:to-violet-950" />}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">About me</p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-neutral-950 dark:text-white sm:text-6xl">I care about the details that make software useful.</h1>
            <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-300">{settings?.site_description ?? 'I am a full-stack developer focused on building clear, reliable, and maintainable digital products.'}</p>
            <div className="mt-8 flex flex-wrap gap-3"><Button to="/projects">See my work <FaArrowRight size={13} /></Button>{settings?.resume_url && <a href={settings.resume_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">Résumé <FaDownload size={13} /></a>}</div>
          </motion.div>
        </Container>
      </section>
      <section className="border-y border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-900/40">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">How I work</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">A practical approach from idea to release.</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 md:grid-cols-3">{PRINCIPLES.map((item) => <div key={item.number} className="bg-white p-7 dark:bg-neutral-900"><span className="font-mono text-xs text-indigo-600 dark:text-indigo-400">{item.number}</span><h3 className="mt-5 text-lg font-semibold text-neutral-950 dark:text-white">{item.title}</h3><p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{item.description}</p></div>)}</div>
        </Container>
      </section>
      <Skills />
      <section className="py-20 text-center"><Container><h2 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">Want to work together?</h2><p className="mx-auto mt-3 max-w-xl text-neutral-600 dark:text-neutral-400">Tell me about the role, product, or problem you have in mind.</p><div className="mt-7"><Button to="/contact">Start a conversation</Button></div></Container></section>
    </>
  )
}
