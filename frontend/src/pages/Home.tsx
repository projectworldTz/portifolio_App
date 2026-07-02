import Seo from '@/components/common/Seo'
import Hero from '@/components/home/Hero'
import AboutPreview from '@/components/home/AboutPreview'
import Skills from '@/components/home/Skills'
import FeaturedProjects from '@/components/home/FeaturedProjects'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import ServicesSection from '@/components/home/ServicesSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import ContactCta from '@/components/home/ContactCta'

export default function Home() {
  return (
    <>
      <Seo title="Home" />
      <Hero />
      <AboutPreview />
      <Skills />
      <FeaturedProjects />
      <FeaturedProducts />
      <ServicesSection />
      <TestimonialsSection />
      <ContactCta />
    </>
  )
}
