import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminTable, { type AdminColumn } from '@/components/admin/AdminTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { useToast } from '@/contexts/ToastContext'
import { listProducts, deleteProduct } from '@/services/products'
import type { Product } from '@/types'

export default function ProductsAdmin() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const reload = () => {
    setIsLoading(true)
    listProducts()
      .then(setProducts)
      .finally(() => setIsLoading(false))
  }

  useEffect(reload, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteProduct(deleteTarget.slug)
      showToast('Product deleted.')
      setDeleteTarget(null)
      reload()
    } catch {
      showToast('Could not delete product.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: AdminColumn<Product>[] = [
    { header: 'Name', render: (p) => <span className="font-medium text-neutral-900 dark:text-white">{p.name}</span> },
    { header: 'Price', render: (p) => `$${p.price}` },
    {
      header: 'Status',
      render: (p) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            p.status === 'published'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
              : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
          }`}
        >
          {p.status}
        </span>
      ),
    },
    { header: 'Featured', render: (p) => (p.is_featured ? 'Yes' : 'No') },
  ]

  return (
    <>
      <Helmet>
        <title>Products | Admin</title>
      </Helmet>

      <AdminPageHeader title="Products" onCreate={() => navigate('/admin/products/new')} />

      <div className="mt-6">
        <AdminTable
          columns={columns}
          rows={products}
          isLoading={isLoading}
          onEdit={(p) => navigate(`/admin/products/${p.slug}/edit`)}
          onDelete={setDeleteTarget}
        />
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </>
  )
}
