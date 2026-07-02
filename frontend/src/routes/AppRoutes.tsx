import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import AdminLayout from '@/layouts/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import Home from '@/pages/Home'

const About = lazy(() => import('@/pages/About'))
const Projects = lazy(() => import('@/pages/Projects'))
const ProjectDetails = lazy(() => import('@/pages/ProjectDetails'))
const Products = lazy(() => import('@/pages/Products'))
const ProductDetails = lazy(() => import('@/pages/ProductDetails'))
const Services = lazy(() => import('@/pages/Services'))
const Contact = lazy(() => import('@/pages/Contact'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const AdminLogin = lazy(() => import('@/pages/admin/Login'))
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
const ProjectsAdmin = lazy(() => import('@/pages/admin/ProjectsAdmin'))
const ProjectForm = lazy(() => import('@/pages/admin/ProjectForm'))
const ProductsAdmin = lazy(() => import('@/pages/admin/ProductsAdmin'))
const ProductForm = lazy(() => import('@/pages/admin/ProductForm'))
const CategoriesAdmin = lazy(() => import('@/pages/admin/CategoriesAdmin'))
const TechnologiesAdmin = lazy(() => import('@/pages/admin/TechnologiesAdmin'))
const ServicesAdmin = lazy(() => import('@/pages/admin/ServicesAdmin'))
const TestimonialsAdmin = lazy(() => import('@/pages/admin/TestimonialsAdmin'))
const BlogsAdmin = lazy(() => import('@/pages/admin/BlogsAdmin'))
const SocialLinksAdmin = lazy(() => import('@/pages/admin/SocialLinksAdmin'))
const MessagesAdmin = lazy(() => import('@/pages/admin/MessagesAdmin'))
const SettingsAdmin = lazy(() => import('@/pages/admin/SettingsAdmin'))

function PageFallback() {
  return <div className="flex min-h-[50vh] items-center justify-center text-neutral-400">Loading…</div>
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/:slug/edit" element={<ProjectForm />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:slug/edit" element={<ProductForm />} />
            <Route path="categories" element={<CategoriesAdmin />} />
            <Route path="technologies" element={<TechnologiesAdmin />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="testimonials" element={<TestimonialsAdmin />} />
            <Route path="blogs" element={<BlogsAdmin />} />
            <Route path="social-links" element={<SocialLinksAdmin />} />
            <Route path="messages" element={<MessagesAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}
