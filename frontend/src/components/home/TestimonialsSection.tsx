import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaStar, FaChevronLeft, FaChevronRight, FaUser } from 'react-icons/fa6'
import Container from '@/components/common/Container'
import SectionHeading from '@/components/common/SectionHeading'
import Skeleton from '@/components/ui/Skeleton'
import { useFetch } from '@/hooks/useFetch'
import { listTestimonials } from '@/services/testimonials'

export default function TestimonialsSection() {
  const { data: testimonials, isLoading } = useFetch(() => listTestimonials(true), [])
  const [index, setIndex] = useState(0)

  if (!isLoading && (!testimonials || testimonials.length === 0)) {
    return null
  }

  const total = testimonials?.length ?? 0
  const current = testimonials?.[index]

  const goTo = (next: number) => setIndex((next + total) % total)

  return (
    <section className="border-y border-neutral-200 bg-[#fafafa] py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Testimonials" title="What clients say" center />

        <div className="relative mx-auto mt-12 max-w-2xl">
          {isLoading ? (
            <Skeleton className="h-56" />
          ) : (
            <>
              <AnimatePresence mode="wait">
                {current && (
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="premium-card relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-8 text-center sm:p-10"
                  >
                    <span aria-hidden className="absolute left-6 top-2 font-serif text-8xl leading-none text-indigo-100">“</span>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10">
                      {current.client_photo ? (
                        <img src={current.client_photo} alt={current.client_name} className="h-full w-full object-cover" />
                      ) : (
                        <FaUser size={22} />
                      )}
                    </div>

                    <div className="mt-4 flex justify-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          size={14}
                          className={i < current.rating ? 'text-amber-400' : 'text-neutral-300 dark:text-neutral-700'}
                        />
                      ))}
                    </div>

                    <p className="mt-4 text-base text-neutral-700 dark:text-neutral-300">&ldquo;{current.review}&rdquo;</p>

                    <p className="mt-6 text-sm font-semibold text-neutral-900 dark:text-white">
                      {current.client_name}
                    </p>
                    {current.company && (
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{current.company}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {total > 1 && (
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => goTo(index - 1)}
                    aria-label="Previous testimonial"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    <FaChevronLeft size={14} />
                  </button>
                  <div className="flex gap-2">
                    {testimonials?.map((t, i) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Go to testimonial ${i + 1}`}
                        className="flex h-8 w-8 items-center justify-center"
                      >
                        <span
                          className={`h-2 w-2 rounded-full transition-colors ${
                            i === index ? 'bg-indigo-600' : 'bg-neutral-300 dark:bg-neutral-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => goTo(index + 1)}
                    aria-label="Next testimonial"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    <FaChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </section>
  )
}
