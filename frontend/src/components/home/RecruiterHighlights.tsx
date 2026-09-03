import { FaCode, FaLayerGroup, FaRocket } from 'react-icons/fa6'
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
          {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4 py-7 md:px-7 md:first:pl-0 md:last:pr-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-indigo-600 shadow-sm"><Icon size={15} /></div>
              <div><h2 className="text-sm font-semibold text-neutral-950">{title}</h2><p className="mt-1 text-sm leading-6 text-neutral-500">{description}</p></div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
