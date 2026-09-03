import type { Setting, SocialLink } from '@/types'

export function getWhatsAppUrl(socialLinks: SocialLink[], settings: Setting | null): string | null {
  const whatsappLink = socialLinks.find((link) => link.platform.trim().toLowerCase() === 'whatsapp')
  if (whatsappLink) return whatsappLink.url

  const phone = settings?.phone?.replace(/\D/g, '')
  return phone ? `https://wa.me/${phone}` : null
}
