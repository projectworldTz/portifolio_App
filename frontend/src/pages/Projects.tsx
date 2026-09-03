import { useMemo, useState } from 'react'
import Seo from '@/components/common/Seo'
import Container from '@/components/common/Container'
import Skeleton from '@/components/ui/Skeleton'
import ProjectCard from '@/components/projects/ProjectCard'
import { useFetch } from '@/hooks/useFetch'
import { listProjects } from '@/services/projects'

export default function Projects() {
  const [category, setCategory] = useState('All')
  const { data: projects, isLoading } = useFetch(() => listProjects({ sort: 'featured' }), [])
  const categories = useMemo(() => ['All', ...new Set(projects?.map((project) => project.category?.name).filter((name): name is string => Boolean(name)) ?? [])], [projects])
  const visibleProjects = category === 'All' ? projects : projects?.filter((project) => project.category?.name === category)

  return (
    <>
      <Seo title="Selected Work" description="Case studies of digital products I've designed and built." />
      <section className="border-b border-neutral-200 py-16 dark:border-neutral-800 sm:py-24">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">Portfolio</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-[-0.04em] text-neutral-950 dark:text-white sm:text-6xl">Selected work and the thinking behind it.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">A collection of practical products, technical decisions, and problems solved.</p>
        </Container>
      </section>
      <section className="py-16 sm:py-20">
        <Container>
          {categories.length > 2 && <div className="mb-10 flex flex-wrap gap-2" aria-label="Filter projects by category">{categories.map((name) => <button key={name} type="button" onClick={() => setCategory(name)} aria-pressed={category === name} className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${category === name ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-950 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:text-white'}`}>{name}</button>)}</div>}
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[28rem] rounded-3xl" />) : visibleProjects?.length ? visibleProjects.map((project) => <ProjectCard key={project.id} project={project} />) : <div className="col-span-full rounded-2xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-700"><p className="text-neutral-500 dark:text-neutral-400">No published work in this category yet.</p></div>}
          </div>
        </Container>
      </section>
    </>
  )
}
