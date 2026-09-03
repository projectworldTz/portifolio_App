import { FaCode, FaLayerGroup, FaRocket } from 'react-icons/fa6'
import { motion } from 'framer-motion'
import Container from '@/components/common/Container'

const HIGHLIGHTS = [
  { icon: FaLayerGroup, title: 'End-to-end ownership', description: 'From product requirements and interface decisions to APIs, data, and deployment.' },
  { icon: FaCode, title: 'Maintainable engineering', description: 'Clear architecture, reusable components, and code that teams can confidently extend.' },
  { icon: FaRocket, title: 'Production mindset', description: 'Performance, accessibility, responsive behavior, and real users are part of the build.' },
]

export default function RecruiterHighlights() {
  return (
    <section className="border-b border-neutral-200 bg-[#fafafa]">
      <Container>
        <div className="grid divide-y divide-neutral-200 md:grid-cols-3 md:divide-x md:divide-y-0">
          {HIGHLIGHTS.map(({ icon: Icon, title, description }, index) => (
            <motion.div key={title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.08 }} className="group flex gap-4 py-7 md:px-7 md:first:pl-0 md:last:pr-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-indigo-600 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:shadow-md"><Icon size={15} /></div>
              <div><h2 className="text-sm font-semibold text-neutral-950">{title}</h2><p className="mt-1 text-sm leading-6 text-neutral-500">{description}</p></div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
