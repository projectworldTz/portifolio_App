import type { IconType } from 'react-icons'
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaDribbble,
  FaWhatsapp,
  FaGlobe,
} from 'react-icons/fa6'

const ICONS: Record<string, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaXTwitter,
  x: FaXTwitter,
  facebook: FaFacebook,
  instagram: FaInstagram,
  youtube: FaYoutube,
  dribbble: FaDribbble,
  whatsapp: FaWhatsapp,
}

export function getSocialIcon(platform: string): IconType {
  return ICONS[platform.toLowerCase()] ?? FaGlobe
}
