import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowUpRightFromSquare, FaGithub } from 'react-icons/fa6'
import Seo from '@/components/common/Seo'
import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import NotFound from '@/pages/NotFound'
import { useFetch } from '@/hooks/useFetch'
import { getProjectBySlug } from '@/services/projects'

function getYoutubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([\w-]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

export default function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>()
  const { data: project, isLoading, error } = useFetch(() => getProjectBySlug(slug!), [slug])

  if (isLoading) {
    return (
      <Container className="py-16">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="mt-6 h-8 w-1/2" />
        <Skeleton className="mt-4 h-24 w-full" />
      </Container>
    )
  }

  if (error || !project) {
    return <NotFound />
  }

  const embedUrl = project.demo_video_url ? getYoutubeEmbedUrl(project.demo_video_url) : null

  return (
    <>
      <Seo title={project.title} description={project.short_description} image={project.thumbnail} />

      <section className="py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            {project.category && <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">{project.category.name}</p>}
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-neutral-950 dark:text-white sm:text-6xl">{project.title}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">{project.short_description}</p>
          </div>

          {project.thumbnail && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-12 aspect-video w-full overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800"
            >
              <img src={project.thumbnail} alt={`${project.title} overview`} decoding="async" fetchPriority="high" className="h-full w-full object-contain" />
            </motion.div>
          )}

          <div className="mt-8 grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech.id}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">Overview</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">The project</h2>
                <p className="mt-4 whitespace-pre-line text-base leading-8 text-neutral-700 dark:text-neutral-300">{project.description}</p>
              </div>

              {project.features && project.features.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">What I built</h2>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {project.features.map((feature) => (
                      <li
                        key={feature}
                        className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(project.challenges || project.solutions) && (
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  {project.challenges && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">The challenge</p>
                      <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">{project.challenges}</p>
                    </div>
                  )}
                  {project.solutions && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">The solution</p>
                      <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">{project.solutions}</p>
                    </div>
                  )}
                </div>
              )}

              {project.images.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">A closer look</h2>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    {project.images.map((image) => (
                      <img
                        key={image.id}
                        src={image.url}
                        alt={image.alt_text ?? project.title}
                        loading="lazy"
                        decoding="async"
                        className="aspect-video w-full rounded-xl border border-neutral-200 bg-neutral-50 object-contain dark:border-neutral-800 dark:bg-neutral-900"
                      />
                    ))}
                  </div>
                </div>
              )}

              {embedUrl && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Demo Video</h2>
                  <div className="mt-3 aspect-video w-full overflow-hidden rounded-xl">
                    <iframe
                      src={embedUrl}
                      title="Demo video"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            <aside className="h-fit rounded-2xl border border-neutral-200 p-6 shadow-sm dark:border-neutral-800 lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Project links</p>
              {project.is_purchasable && (
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {project.price ? `$${project.price}` : 'Contact for pricing'}
                </p>
              )}
              <div className="mt-4 flex flex-col gap-3">
                {project.is_purchasable && (
                  <Button to="/contact" variant="primary" className="w-full">
                    Buy Now
                  </Button>
                )}
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                  >
                    Live Demo <FaArrowUpRightFromSquare size={12} />
                  </a>
                )}
                {project.repo_url && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                  >
                    <FaGithub size={14} /> Source Code
                  </a>
                )}
                <Button to="/contact" variant="ghost" className="w-full">
                  Contact Me
                </Button>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  )
}
