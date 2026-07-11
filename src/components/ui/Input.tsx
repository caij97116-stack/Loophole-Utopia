import { type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.replace(/\s/g, '_').toLowerCase()
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${error ? 'border-danger' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}