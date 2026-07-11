import { type ReactNode } from 'react'

interface SectionProps {
  title: string
  icon?: string
  description?: string
  children?: ReactNode
  className?: string
}

export default function Section({ title, icon, description, children, className = '' }: SectionProps) {
  return (
    <section className={`mb-8 ${className}`}>
      <div className="mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </h2>
        {description && <p className="text-sm text-text-muted mt-1">{description}</p>}
      </div>
      {children}
    </section>
  )
}