import Seo from '@/components/common/Seo'
import Hero from '@/components/home/Hero'
import FeaturedProjects from '@/components/home/FeaturedProjects'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import AboutPreview from '@/components/home/AboutPreview'
import ContactCta from '@/components/home/ContactCta'

export default function Home() {
  return (
    <>
      <Seo title="Home" />
      <Hero />
      <FeaturedProjects />
      <TestimonialsSection />
      <AboutPreview />
      <ContactCta />
    </>
  )
}
