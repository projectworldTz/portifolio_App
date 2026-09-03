import Container from '@/components/common/Container'
import SectionHeading from '@/components/common/SectionHeading'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import ProjectCard from '@/components/projects/ProjectCard'
import { useFetch } from '@/hooks/useFetch'
import { getFeaturedProjects } from '@/services/projects'

export default function FeaturedProjects() {
  const { data: projects, isLoading } = useFetch(getFeaturedProjects, [])

  if (!isLoading && (!projects || projects.length === 0)) {
    return null
  }

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <Container>
        <span aria-hidden className="section-number absolute right-4 top-8 -z-10 text-[10rem] font-black leading-none text-neutral-100 sm:right-10 sm:text-[15rem]">01</span>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Selected work" title="Projects built to solve real problems" description="A focused look at the thinking, engineering, and decisions behind my work." />
          <Button to="/projects" variant="secondary">
            See all work
          </Button>
        </div>

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80" />)
            : projects?.map((project, index) => <ProjectCard key={project.id} project={project} featured={index === 0} />)}
        </div>
      </Container>
    </section>
  )
}
