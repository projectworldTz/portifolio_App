import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaArrowUpRightFromSquare } from 'react-icons/fa6'
import type { Project } from '@/types'

export default function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <motion.article initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className={`premium-card group relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white transition-all duration-500 hover:-translate-y-1.5 hover:border-indigo-200 ${featured ? 'sm:col-span-2 lg:grid lg:grid-cols-[1.35fr_.65fr]' : 'flex flex-col'}`}>
      <Link to={`/projects/${project.slug}`} className="relative block overflow-hidden bg-neutral-100" aria-label={`Read ${project.title} case study`}>
        {project.thumbnail ? (
          <><img src={project.thumbnail} alt="" loading="lazy" decoding="async" className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${featured ? 'aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]' : 'aspect-[16/10]'}`} /><span className="absolute inset-0 bg-gradient-to-t from-indigo-950/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" /></>
        ) : (
          <div className="flex aspect-[16/10] items-end bg-gradient-to-br from-indigo-100 to-violet-100 p-6 text-sm font-medium text-indigo-900 dark:from-indigo-950 dark:to-violet-950 dark:text-indigo-200">{project.title}</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-400">{project.category?.name ?? 'Case study'}</p>
          {project.is_featured && <span className="text-xs text-neutral-400">Selected work</span>}
        </div>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-neutral-950 dark:text-white"><Link to={`/projects/${project.slug}`} className="after:absolute after:inset-0">{project.title}</Link></h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{project.short_description}</p>
        {project.technologies?.length > 0 && <p className="mt-5 text-xs font-medium text-neutral-500 dark:text-neutral-400">{project.technologies.slice(0, 3).map((tech) => tech.name).join(' · ')}</p>}
        <div className="relative z-10 mt-6 flex items-center justify-between border-t border-neutral-100 pt-5 dark:border-neutral-800">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900">Read case study <FaArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" /></span>
          {project.demo_url && <a href={project.demo_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400">Live site <FaArrowUpRightFromSquare size={10} /></a>}
        </div>
      </div>
    </motion.article>
  )
}
