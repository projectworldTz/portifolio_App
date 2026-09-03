import { motion } from 'framer-motion'
import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'

export default function ContactCta() {
  return (
    <section className="py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-16 text-center sm:px-16"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_60%)]"
          />
          <h2 className="relative text-3xl font-bold text-white sm:text-4xl">Let&apos;s make something useful.</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-indigo-100">
            Hiring, collaborating, or starting a new project? Tell me what you&apos;re working on.
          </p>
          <div className="relative mt-8">
            <Button to="/contact" variant="secondary" className="!border-white !text-white hover:!bg-white/10">
              Start a conversation
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
