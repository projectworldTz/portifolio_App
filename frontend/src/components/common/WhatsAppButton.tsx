import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa6'
import { useSiteData } from '@/contexts/SiteDataContext'
import { getWhatsAppUrl } from '@/utils/whatsapp'

export default function WhatsAppButton() {
  const { settings, socialLinks } = useSiteData()
  const url = getWhatsAppUrl(socialLinks, settings)

  if (!url) return null

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with me on WhatsApp"
      title="Chat on WhatsApp"
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="group fixed bottom-5 right-5 z-40 flex h-14 items-center rounded-full bg-[#25D366] px-4 text-white shadow-[0_14px_38px_rgba(37,211,102,.35)] sm:bottom-7 sm:right-7"
    >
      <FaWhatsapp size={25} />
      <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-32 group-hover:opacity-100">Chat with me</span>
      <span aria-hidden className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/25 [animation-duration:2.5s]" />
    </motion.a>
  )
}
