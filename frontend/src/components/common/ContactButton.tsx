import type { ReactNode } from 'react'
import Button from '@/components/ui/Button'
import { useSiteData } from '@/contexts/SiteDataContext'
import { getWhatsAppUrl } from '@/utils/whatsapp'

interface ContactButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
}

export default function ContactButton({ children, variant = 'primary', className = '' }: ContactButtonProps) {
  const { settings, socialLinks } = useSiteData()
  const whatsappUrl = getWhatsAppUrl(socialLinks, settings)

  if (whatsappUrl) {
    return <Button href={whatsappUrl} variant={variant} className={className}>{children}</Button>
  }

  return <Button to="/contact" variant={variant} className={className}>{children}</Button>
}
