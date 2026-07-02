import { useMemo, useState } from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import Seo from '@/components/common/Seo'
import Container from '@/components/common/Container'
import SectionHeading from '@/components/common/SectionHeading'
import Skeleton from '@/components/ui/Skeleton'
import ProductCard from '@/components/products/ProductCard'
import { useFetch } from '@/hooks/useFetch'
import { useDebounce } from '@/hooks/useDebounce'
import { listProducts } from '@/services/products'
import type { ProductFilters } from '@/types'

const SORT_OPTIONS: { value: NonNullable<ProductFilters['sort']>; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'featured', label: 'Featured First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export default function Products() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<NonNullable<ProductFilters['sort']>>('latest')
  const debouncedSearch = useDebounce(search, 300)

  const filters = useMemo<ProductFilters>(
    () => ({ search: debouncedSearch || undefined, sort }),
    [debouncedSearch, sort],
  )

  const { data: products, isLoading } = useFetch(() => listProducts(filters), [filters.search, filters.sort])

  return (
    <>
      <Seo title="Products" description="Ready-to-use software products available for purchase." />

      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="Marketplace"
            title="Products"
            description="Ready-to-use software products available for purchase."
          />

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <FaMagnifyingGlass
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm text-neutral-700 focus:border-indigo-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
              />
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as NonNullable<ProductFilters['sort']>)}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 focus:border-indigo-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
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
            ) : products && products.length > 0 ? (
              products.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <p className="col-span-full py-12 text-center text-neutral-500 dark:text-neutral-400">
                No products match your search.
              </p>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
