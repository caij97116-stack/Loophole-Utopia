interface TabsProps {
  tabs: { key: string; label: string; icon?: string }[]
  activeKey: string
  onChange: (key: string) => void
}

export default function Tabs({ tabs, activeKey, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            activeKey === tab.key
              ? 'bg-white text-text shadow-sm'
              : 'text-text-muted hover:text-text'
          }`}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  )
}