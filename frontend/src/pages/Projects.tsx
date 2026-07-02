import { useMemo, useState } from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import Seo from '@/components/common/Seo'
import Container from '@/components/common/Container'
import SectionHeading from '@/components/common/SectionHeading'
import Skeleton from '@/components/ui/Skeleton'
import ProjectCard from '@/components/projects/ProjectCard'
import { useFetch } from '@/hooks/useFetch'
import { useDebounce } from '@/hooks/useDebounce'
import { listProjects } from '@/services/projects'
import { listCategories } from '@/services/categories'
import { listTechnologies } from '@/services/technologies'
import type { ProjectFilters } from '@/types'

const SORT_OPTIONS: { value: NonNullable<ProjectFilters['sort']>; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'featured', label: 'Featured First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export default function Projects() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [technology, setTechnology] = useState('')
  const [sort, setSort] = useState<NonNullable<ProjectFilters['sort']>>('latest')

  const debouncedSearch = useDebounce(search, 300)

  const { data: categories } = useFetch(listCategories, [])
  const { data: technologies } = useFetch(listTechnologies, [])

  const filters = useMemo<ProjectFilters>(
    () => ({
      search: debouncedSearch || undefined,
      category: category || undefined,
      technology: technology || undefined,
      sort,
    }),
    [debouncedSearch, category, technology, sort],
  )

  const { data: projects, isLoading } = useFetch(() => listProjects(filters), [
    filters.search,
    filters.category,
    filters.technology,
    filters.sort,
  ])

  const selectClass =
    'rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-indigo-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200'

  return (
    <>
      <Seo title="Projects" description="A collection of software projects I've designed and built." />

      <section className="py-16">
        <Container>
          <SectionHeading eyebrow="Portfolio" title="Projects" description="A collection of things I've built." />

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <FaMagnifyingGlass
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects…"
                className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm text-neutral-700 focus:border-indigo-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
              />
            </div>

            <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
              <option value="">All Categories</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            <select value={technology} onChange={(e) => setTechnology(e.target.value)} className={selectClass}>
              <option value="">All Technologies</option>
              {technologies?.map((t) => (
                <option key={t.id} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as NonNullable<ProjectFilters['sort']>)}
              className={selectClass}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80" />)
            ) : projects && projects.length > 0 ? (
              projects.map((project) => <ProjectCard key={project.id} project={project} />)
            ) : (
              <p className="col-span-full py-12 text-center text-neutral-500 dark:text-neutral-400">
                No projects match your filters.
              </p>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
