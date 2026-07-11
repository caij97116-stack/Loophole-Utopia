import { useState } from 'react'
import { Section, Card, Tag } from '@/components/ui'
import { processes, type Process } from '@/data/processes'

const categories = [
  { key: 'all', label: '全部工艺', icon: '✨' },
  { key: 'cover', label: '封面', icon: '📔' },
  { key: 'binding', label: '书脊/装订', icon: '📚' },
  { key: 'inner', label: '内页', icon: '📖' },
  { key: 'special', label: '特殊', icon: '🌟' },
  { key: 'badge', label: '吧唧', icon: '🔴' },
  { key: 'acrylic', label: '亚克力', icon: '💎' },
  { key: 'paper', label: '纸片周边', icon: '🃏' },
]

const priceLabels: Record<string, string> = { low: '经济', medium: '中等', high: '较高' }
const priceColors: Record<string, string> = { low: 'success', medium: 'warning', high: 'danger' }

export default function ProcessLibrary() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)

  const filtered = processes.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false
    if (searchTerm && !p.name.includes(searchTerm) && !p.nameJa.includes(searchTerm) && !p.description.includes(searchTerm)) return false
    return true
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section title="中日融合工艺库" icon="✨" description={`${processes.length}+种封面/内页/周边工艺，中日双源，附适用场景与注意事项`} />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex flex-wrap gap-1">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeCategory === c.key ? 'bg-primary text-white' : 'bg-gray-100 text-text hover:bg-gray-200'
              }`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="搜索工艺..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-white text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <span className="text-xs text-text-muted">{filtered.length} 种工艺</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <Card key={p.id} hover onClick={() => setSelectedProcess(p)} className="cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm">{p.name}</h3>
              <Tag variant={priceColors[p.priceLevel] as 'success' | 'warning' | 'danger'} size="sm">
                {priceLabels[p.priceLevel]}
              </Tag>
            </div>
            <p className="text-xs text-text-muted">{p.nameJa}</p>
            <p className="text-xs text-text-muted mt-2 line-clamp-2">{p.description}</p>
          </Card>
        ))}
      </div>

      {selectedProcess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProcess(null)}>
          <div className="bg-bg-card rounded-2xl max-w-xl w-full max-h-[80vh] overflow-y-auto p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedProcess.name}</h2>
                <p className="text-sm text-text-muted">{selectedProcess.nameJa}</p>
              </div>
              <button onClick={() => setSelectedProcess(null)} className="text-text-muted hover:text-text text-xl cursor-pointer">&times;</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs text-text-muted">价格</span>
                <p className="text-sm font-medium">{priceLabels[selectedProcess.priceLevel]}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs text-text-muted">生产时间</span>
                <p className="text-sm font-medium">{selectedProcess.productionTime}</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-1">效果</h3>
              <p className="text-sm text-text-muted">{selectedProcess.effect}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">适合</h3>
              <div className="flex flex-wrap gap-1">
                {selectedProcess.suitableFor.map((s) => <Tag key={s} variant="success">{s}</Tag>)}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">不适合</h3>
              <div className="flex flex-wrap gap-1">
                {selectedProcess.unsuitableFor.map((s) => <Tag key={s} variant="danger">{s}</Tag>)}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">注意事项</h3>
              <ul className="space-y-1">
                {selectedProcess.notes.map((n, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}