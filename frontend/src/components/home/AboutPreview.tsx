import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa6'
import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import { useSiteData } from '@/contexts/SiteDataContext'

export default function AboutPreview() {
  const { settings } = useSiteData()
  return (
    <section className="relative overflow-hidden border-y border-indigo-100 bg-[#f7f6ff] py-20 sm:py-28">
      <span aria-hidden className="section-number absolute -left-8 top-4 text-[12rem] font-black leading-none text-white sm:text-[18rem]">02</span>
      <Container className="relative">
        <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="grid items-stretch overflow-hidden rounded-[2rem] border border-indigo-100 bg-white shadow-[0_30px_90px_rgba(79,70,229,.12)] lg:grid-cols-[.85fr_1.15fr]">
          <div className="relative overflow-hidden bg-indigo-600 p-8 text-white sm:p-12">
            <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[42px] border-white/10" />
            <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">The mindset</p>
            <h2 className="relative mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.045em] sm:text-5xl">Thoughtful code.<br /><span className="text-indigo-200">Useful outcomes.</span></h2>
            <div className="relative mt-10 flex flex-wrap gap-2"><span className="rounded-full border border-white/20 px-3 py-1.5 text-xs">Clarity</span><span className="rounded-full border border-white/20 px-3 py-1.5 text-xs">Performance</span><span className="rounded-full border border-white/20 px-3 py-1.5 text-xs">Ownership</span></div>
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="text-xl leading-9 text-neutral-700 sm:text-2xl sm:leading-10">{settings?.site_description ?? 'I design and build production-ready web applications with a focus on clarity, performance, and maintainability.'}</p>
            <div className="mt-8"><Button to="/about" variant="secondary">Discover my approach <FaArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" /></Button></div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
