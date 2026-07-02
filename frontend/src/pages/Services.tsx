import { motion } from 'framer-motion'
import { FaLayerGroup } from 'react-icons/fa6'
import Seo from '@/components/common/Seo'
import Container from '@/components/common/Container'
import SectionHeading from '@/components/common/SectionHeading'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import { useFetch } from '@/hooks/useFetch'
import { listServices } from '@/services/serviceCatalog'

export default function Services() {
  const { data: services, isLoading } = useFetch(listServices, [])

  return (
    <>
      <Seo title="Services" description="From a single feature to a full product build, here's what I offer." />

      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="How I can help"
            description="From a single feature to a full product build, here's what I offer."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)
              : services?.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                      <FaLayerGroup size={20} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">{service.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-neutral-600 dark:text-neutral-400">
                      {service.description}
                    </p>

                    {service.benefits && service.benefits.length > 0 && (
                      <ul className="mt-4 space-y-1.5">
                        {service.benefits.map((benefit) => (
                          <li
                            key={benefit}
                            className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    )}

                    <Button to="/contact" variant="secondary" className="mt-6 w-full">
                      Get Started
                    </Button>
                  </motion.div>
                ))}
          </div>
        </Container>
      </section>
    </>
  )
}
