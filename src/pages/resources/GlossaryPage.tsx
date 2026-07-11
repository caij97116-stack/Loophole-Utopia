import { useState } from 'react'
import { BackButton, Section, Tag, Card } from '@/components/ui'
import { glossary, type GlossaryTerm } from '@/data/glossary'

const categories = [
  { key: 'all', label: '全部', icon: '📖' },
  { key: 'printing', label: '印刷', icon: '🖨️' },
  { key: 'binding', label: '装订', icon: '📚' },
  { key: 'paper', label: '纸张', icon: '📄' },
  { key: 'process', label: '工艺', icon: '✨' },
  { key: 'design', label: '设计', icon: '🎨' },
  { key: 'event', label: '展会', icon: '🎪' },
  { key: 'business', label: '通贩', icon: '💼' },
]

export default function GlossaryPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null)

  const filtered = glossary.filter((t) => {
    if (activeCategory !== 'all' && t.category !== activeCategory) return false
    if (searchTerm && !t.term.includes(searchTerm) && !t.termJa.includes(searchTerm) && !t.definition.includes(searchTerm)) return false
    return true
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/resources" label="返回资源中心" />
      <Section title="同人术语辞典" icon="📖" description={`${glossary.length}+条术语，中日英三语对照，印刷新手指南`} />

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
          placeholder="搜索术语..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-white text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <span className="text-xs text-text-muted">{filtered.length} 条</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((term) => (
          <Card key={term.id} hover onClick={() => setSelectedTerm(term)} className="cursor-pointer">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm">{term.term}</h3>
              <Tag variant="default" size="sm">{categories.find((c) => c.key === term.category)?.label || ''}</Tag>
            </div>
            <p className="text-xs text-text-muted">{term.termJa}</p>
            <p className="text-xs text-text-muted mt-2 line-clamp-2">{term.definition}</p>
          </Card>
        ))}
      </div>

      {selectedTerm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTerm(null)}>
          <div className="bg-bg-card rounded-2xl max-w-lg w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{selectedTerm.term}</h2>
                  <Tag variant="primary">{categories.find((c) => c.key === selectedTerm.category)?.label || ''}</Tag>
                </div>
                <p className="text-sm text-text-muted">{selectedTerm.termJa}</p>
              </div>
              <button onClick={() => setSelectedTerm(null)} className="text-text-muted hover:text-text text-xl cursor-pointer">&times;</button>
            </div>
            <p className="text-sm mb-4">{selectedTerm.definition}</p>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <p className="text-sm font-medium text-amber-800">小贴士</p>
              <p className="text-sm text-amber-700 mt-1">{selectedTerm.tip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}