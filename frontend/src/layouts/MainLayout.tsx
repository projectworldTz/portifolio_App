import { Outlet } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/common/WhatsAppButton'

export default function MainLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-white dark:bg-neutral-950">
      <a
        href="#main-content"
        className="skip-link rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
