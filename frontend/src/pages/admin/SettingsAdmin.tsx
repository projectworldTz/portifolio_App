import { useEffect, useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { TextField, TextareaField, FileField } from '@/components/admin/fields'
import { useToast } from '@/contexts/ToastContext'
import { useSiteData } from '@/contexts/SiteDataContext'
import { getSettings, updateSettings, type SettingPayload } from '@/services/settings'

const EMPTY_FORM: SettingPayload = {
  site_name: '',
  site_title: '',
  site_description: '',
  email: '',
  phone: '',
  address: '',
  resume_url: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
}

export default function SettingsAdmin() {
  const { showToast } = useToast()
  const { refresh } = useSiteData()
  const [form, setForm] = useState<SettingPayload>(EMPTY_FORM)
  const [currentLogo, setCurrentLogo] = useState<string | null>(null)
  const [currentFavicon, setCurrentFavicon] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    getSettings()
      .then((data) => {
        setForm({
          site_name: data.site_name,
          site_title: data.site_title ?? '',
          site_description: data.site_description ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
          address: data.address ?? '',
          resume_url: data.resume_url ?? '',
          meta_title: data.meta_title ?? '',
          meta_description: data.meta_description ?? '',
          meta_keywords: data.meta_keywords ?? '',
        })
        setCurrentLogo(data.logo)
        setCurrentFavicon(data.favicon)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateSettings(form)
      showToast('Settings saved.')
      refresh()
    } catch {
      showToast('Something went wrong.', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <p className="text-neutral-400">Loading…</p>
  }

  return (
    <>
      <Helmet>
        <title>Settings | Admin</title>
      </Helmet>

      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Settings</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Site-wide information shown across the portfolio.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="site_name"
            label="Site Name"
            required
            value={form.site_name}
            onChange={(e) => setForm({ ...form, site_name: e.target.value })}
          />
          <TextField
            id="site_title"
            label="Professional Title"
            value={form.site_title}
            onChange={(e) => setForm({ ...form, site_title: e.target.value })}
          />
        </div>

        <TextareaField
          id="site_description"
          label="Short Introduction"
          rows={3}
          value={form.site_description}
          onChange={(e) => setForm({ ...form, site_description: e.target.value })}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FileField id="logo" label="Logo" currentUrl={currentLogo} onChange={(file) => setForm({ ...form, logo: file })} />
          <FileField
            id="favicon"
            label="Favicon"
            currentUrl={currentFavicon}
            onChange={(file) => setForm({ ...form, favicon: file })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            id="phone"
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="address"
            label="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <TextField
            id="resume_url"
            label="Resume URL"
            type="url"
            value={form.resume_url}
            onChange={(e) => setForm({ ...form, resume_url: e.target.value })}
          />
        </div>

        <div className="border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            SEO
          </h2>
          <div className="mt-4 space-y-4">
            <TextField
              id="meta_title"
              label="Meta Title"
              value={form.meta_title}
              onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
            />
            <TextareaField
              id="meta_description"
              label="Meta Description"
              rows={2}
              value={form.meta_description}
              onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
            />
            <TextField
              id="meta_keywords"
              label="Meta Keywords"
              value={form.meta_keywords}
              onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60"
        >
          {isSaving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </>
  )
}
