import { Helmet } from 'react-helmet-async'
import { useSiteData } from '@/contexts/SiteDataContext'

interface SeoProps {
  title: string
  description?: string
  image?: string | null
}

export default function Seo({ title, description, image }: SeoProps) {
  const { settings } = useSiteData()

  const siteName = settings?.site_name ?? 'Portfolio'
  const fullTitle = `${title} | ${siteName}`
  const metaDescription = description ?? settings?.meta_description ?? settings?.site_description ?? ''
  const ogImage = image ?? settings?.logo ?? undefined

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      {metaDescription && <meta property="og:site_name" content={siteName} />}
      {metaDescription && <meta property="og:description" content={metaDescription} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {metaDescription && <meta name="twitter:description" content={metaDescription} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  )
}
