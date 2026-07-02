import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLocationDot, FaMapLocationDot } from 'react-icons/fa6'
import Seo from '@/components/common/Seo'
import Container from '@/components/common/Container'
import SectionHeading from '@/components/common/SectionHeading'
import Button from '@/components/ui/Button'
import { useSiteData } from '@/contexts/SiteDataContext'
import { useToast } from '@/contexts/ToastContext'
import { submitContactMessage } from '@/services/contact'
import { getSocialIcon } from '@/utils/socialIcons'
import type { ContactMessagePayload } from '@/types'

const EMPTY_FORM: ContactMessagePayload = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const { settings, socialLinks } = useSiteData()
  const { showToast } = useToast()
  const [form, setForm] = useState<ContactMessagePayload>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactMessagePayload, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof ContactMessagePayload, string>> = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required'
    if (!form.email.trim()) nextErrors.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email'
    if (!form.message.trim()) nextErrors.message = 'Message is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await submitContactMessage(form)
      showToast("Message sent — I'll get back to you soon.", 'success')
      setForm(EMPTY_FORM)
    } catch {
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 focus:border-indigo-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-white'

  return (
    <>
      <Seo title="Contact" description="Have a project or question? Get in touch." />

      <section className="py-16">
        <Container>
          <SectionHeading eyebrow="Contact" title="Let's work together" description="Have a project or question? Send a message." />

          <div className="mt-12 grid gap-12 lg:grid-cols-3">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5 lg:col-span-2"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={inputClass}
                />
                {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
              </div>

              <Button type="submit" variant="primary" disabled={isSubmitting} className="disabled:opacity-60">
                {isSubmitting ? 'Sending…' : 'Send Message'}
              </Button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-6"
            >
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 text-sm text-neutral-700 hover:border-indigo-300 dark:border-neutral-800 dark:text-neutral-300"
                >
                  <FaEnvelope size={16} className="text-indigo-600 dark:text-indigo-400" />
                  {settings.email}
                </a>
              )}
              {settings?.address && (
                <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 text-sm text-neutral-700 dark:border-neutral-800 dark:text-neutral-300">
                  <FaLocationDot size={16} className="text-indigo-600 dark:text-indigo-400" />
                  {settings.address}
                </div>
              )}

              {socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.platform)
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={link.platform}
                        className="rounded-full border border-neutral-200 p-3 text-neutral-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-neutral-800 dark:text-neutral-300 dark:hover:text-indigo-400"
                      >
                        <Icon size={16} />
                      </a>
                    )
                  })}
                </div>
              )}

              <div className="flex aspect-video w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-400 dark:border-neutral-700">
                <FaMapLocationDot size={18} />
                Map placeholder
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  )
}
