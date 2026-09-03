import { motion } from 'framer-motion'
import Container from '@/components/common/Container'
import ContactButton from '@/components/common/ContactButton'

export default function ContactCta() {
  return (
    <section className="py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="premium-card relative overflow-hidden rounded-[2rem] bg-neutral-950 px-8 py-16 text-center sm:px-16 sm:py-20"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.55),transparent_38%),radial-gradient(circle_at_85%_90%,rgba(168,85,247,0.35),transparent_40%)]"
          />
          <motion.div aria-hidden animate={{ y: [0, -12, 0], rotate: [0, 4, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/10 bg-white/5" />
          <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Have an opportunity?</p>
          <h2 className="relative mt-4 text-3xl font-bold tracking-[-0.035em] text-white sm:text-5xl">Let&apos;s make something useful.</h2>
          <p className="relative mx-auto mt-5 max-w-xl leading-7 text-neutral-300">
            Hiring, collaborating, or starting a new project? Tell me what you&apos;re working on.
          </p>
          <div className="relative mt-8">
            <ContactButton variant="secondary" className="!border-white/20 !bg-white !text-neutral-950 hover:!border-white hover:!bg-indigo-50">
              Start a conversation
            </ContactButton>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
