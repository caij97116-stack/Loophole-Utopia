import { type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export default function Select({ label, options, className = '', id, ...props }: SelectProps) {
  const selectId = id || label?.replace(/\s/g, '_').toLowerCase()
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-text mb-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}