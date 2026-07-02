import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaArrowUpRightFromSquare, FaBook } from 'react-icons/fa6'
import Seo from '@/components/common/Seo'
import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import NotFound from '@/pages/NotFound'
import { useFetch } from '@/hooks/useFetch'
import { getProductBySlug } from '@/services/products'

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading, error } = useFetch(() => getProductBySlug(slug!), [slug])

  const gallery = product ? (product.thumbnail ? [product.thumbnail] : []).concat(product.images.map((i) => i.url)) : []
  const [activeImage, setActiveImage] = useState(0)

  if (isLoading) {
    return (
      <Container className="py-16">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="mt-6 h-8 w-1/2" />
        <Skeleton className="mt-4 h-24 w-full" />
      </Container>
    )
  }

  if (error || !product) {
    return <NotFound />
  }

  return (
    <>
      <Seo title={product.name} description={product.short_description} image={product.thumbnail} />

      <section className="py-12">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800"
              >
                {gallery[activeImage] ? (
                  <img src={gallery[activeImage]} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-400">No image</div>
                )}
              </motion.div>

              {gallery.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto">
                  {gallery.map((url, index) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${
                        index === activeImage ? 'border-indigo-600' : 'border-transparent'
                      }`}
                    >
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">{product.name}</h1>
              <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">{product.short_description}</p>

              <p className="mt-6 text-3xl font-bold text-neutral-900 dark:text-white">${product.price}</p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button variant="primary" className="sm:flex-1">
                  Buy Now
                </Button>
                {product.demo_url && (
                  <a
                    href={product.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                  >
                    Live Demo <FaArrowUpRightFromSquare size={12} />
                  </a>
                )}
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                {product.license && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      License
                    </dt>
                    <dd className="mt-1 text-sm text-neutral-900 dark:text-white">{product.license}</dd>
                  </div>
                )}
                {product.documentation_url && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                      Documentation
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={product.documentation_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                      >
                        <FaBook size={12} /> View Docs
                      </a>
                    </dd>
                  </div>
                )}
              </dl>

              <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
                <p className="whitespace-pre-line text-neutral-700 dark:text-neutral-300">{product.description}</p>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Features</h2>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {product.features.map((feature) => (
                      <li
                        key={feature}
                        className="rounded-lg bg-neutral-50 px-4 py-2 text-sm text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
