import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost'

interface BaseProps {
  variant?: Variant
  children: ReactNode
  className?: string
}

interface ButtonAsLink extends BaseProps {
  to: string
}

interface ButtonAsButton extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  to?: undefined
}

type ButtonProps = ButtonAsLink | ButtonAsButton

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'premium-shine bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/25',
  secondary:
    'border border-neutral-200 bg-white text-neutral-900 shadow-sm hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md',
  ghost: 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800',
}

const BASE_CLASSES =
  'group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 active:translate-y-0 active:scale-[.98]'

export default function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    )
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>

  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
