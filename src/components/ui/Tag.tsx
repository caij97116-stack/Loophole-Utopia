import type { ReactNode } from 'react'

interface TagProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
}

const variantClasses: Record<string, string> = {
  default: 'bg-gray-100 text-text',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-green-50 text-success',
  warning: 'bg-amber-50 text-accent',
  danger: 'bg-red-50 text-danger',
  info: 'bg-blue-50 text-info',
}

export default function Tag({ children, variant = 'default', size = 'sm' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } ${variantClasses[variant]}`}
    >
      {children}
    </span>
  )
}