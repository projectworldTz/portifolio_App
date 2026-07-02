import { motion } from 'framer-motion'
import { FaBriefcase, FaGraduationCap, FaCertificate } from 'react-icons/fa6'
import Seo from '@/components/common/Seo'
import Container from '@/components/common/Container'
import SectionHeading from '@/components/common/SectionHeading'
import Skills from '@/components/home/Skills'
import { useSiteData } from '@/contexts/SiteDataContext'
import { useFetch } from '@/hooks/useFetch'
import { listProjects } from '@/services/projects'

const STATS = [
  { label: 'Happy Clients', value: '20+' },
  { label: 'Years Experience', value: '5+' },
]

const EXPERIENCE = [
  {
    role: 'Senior Full-Stack Developer',
    org: 'Freelance / Contract',
    period: '2022 — Present',
    description: 'Designing and building custom web applications, APIs, and SaaS products for clients.',
  },
  {
    role: 'Full-Stack Developer',
    org: 'Software Agency',
    period: '2020 — 2022',
    description: 'Built and maintained production Laravel + React applications for a portfolio of clients.',
  },
]

const EDUCATION = [
  {
    degree: 'B.Sc. Computer Science',
    school: 'University',
    period: '2016 — 2020',
  },
]

const CERTIFICATIONS = ['AWS Certified Developer', 'Laravel Certified Developer']

export default function About() {
  const { settings } = useSiteData()
  const { data: projects } = useFetch(() => listProjects(), [])
  const projectCount = projects?.length ?? 0

  return (
    <>
      <Seo
        title="About"
        description={settings?.site_description ?? "Learn more about my background, experience, and skills."}
      />

      <section className="py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              About Me
            </p>
            <h1 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
              {settings?.site_name ?? 'Hi, I build software.'}
            </h1>
            <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
              {settings?.site_description ??
                "I'm a full-stack developer who designs, builds, and sells production-ready software."}
            </p>
          </motion.div>

          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">{projectCount}+</p>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Projects</p>
            </div>
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Skills />

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="Journey" title="Experience & Education" />

          <div className="mt-10 grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                <FaBriefcase size={16} className="text-indigo-600 dark:text-indigo-400" /> Experience
              </h3>
              <div className="mt-6 space-y-6 border-l border-neutral-200 pl-6 dark:border-neutral-800">
                {EXPERIENCE.map((item) => (
                  <div key={item.role} className="relative">
                    <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-600" />
                    <p className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                      {item.period}
                    </p>
                    <p className="mt-1 font-semibold text-neutral-900 dark:text-white">{item.role}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.org}</p>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                <FaGraduationCap size={16} className="text-indigo-600 dark:text-indigo-400" /> Education
              </h3>
              <div className="mt-6 space-y-6 border-l border-neutral-200 pl-6 dark:border-neutral-800">
                {EDUCATION.map((item) => (
                  <div key={item.degree} className="relative">
                    <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-600" />
                    <p className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                      {item.period}
                    </p>
                    <p className="mt-1 font-semibold text-neutral-900 dark:text-white">{item.degree}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.school}</p>
                  </div>
                ))}
              </div>

              <h3 className="mt-10 flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                <FaCertificate size={16} className="text-indigo-600 dark:text-indigo-400" /> Certifications
              </h3>
              <ul className="mt-4 space-y-2">
                {CERTIFICATIONS.map((cert) => (
                  <li
                    key={cert}
                    className="rounded-lg bg-neutral-50 px-4 py-2.5 text-sm text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                  >
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
