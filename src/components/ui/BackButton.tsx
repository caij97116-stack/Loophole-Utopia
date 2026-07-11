import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  to: string
  label?: string
}

export default function BackButton({ to, label = '返回' }: BackButtonProps) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(to)}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-text hover:bg-gray-200 transition-colors cursor-pointer mb-4"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  )
}