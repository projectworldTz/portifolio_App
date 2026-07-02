import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminTable, { type AdminColumn } from '@/components/admin/AdminTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { useToast } from '@/contexts/ToastContext'
import { listProjects, deleteProject } from '@/services/projects'
import type { Project } from '@/types'

export default function ProjectsAdmin() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const reload = () => {
    setIsLoading(true)
    listProjects()
      .then(setProjects)
      .finally(() => setIsLoading(false))
  }

  useEffect(reload, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await deleteProject(deleteTarget.slug)
      showToast('Project deleted.')
      setDeleteTarget(null)
      reload()
    } catch {
      showToast('Could not delete project.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: AdminColumn<Project>[] = [
    { header: 'Title', render: (p) => <span className="font-medium text-neutral-900 dark:text-white">{p.title}</span> },
    { header: 'Category', render: (p) => p.category?.name ?? '—' },
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
        <title>Projects | Admin</title>
      </Helmet>

      <AdminPageHeader title="Projects" onCreate={() => navigate('/admin/projects/new')} />

      <div className="mt-6">
        <AdminTable
          columns={columns}
          rows={projects}
          isLoading={isLoading}
          onEdit={(p) => navigate(`/admin/projects/${p.slug}/edit`)}
          onDelete={setDeleteTarget}
        />
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </>
  )
}
