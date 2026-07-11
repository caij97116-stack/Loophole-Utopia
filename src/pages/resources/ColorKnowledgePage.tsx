import { useState } from 'react'
import { BackButton, Section, Card, Tag } from '@/components/ui'
import { colorTips, type ColorTip } from '@/data/colorKnowledge'

const categories = [
  { key: 'all', label: '全部' },
  { key: 'basic', label: '基础知识' },
  { key: 'danger', label: '危险色预警' },
  { key: 'factory', label: '厂家色差' },
  { key: 'fix', label: '修正方法' },
]

export default function ColorKnowledgePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedTip, setSelectedTip] = useState<ColorTip | null>(null)

  const filtered = activeCategory === 'all' ? colorTips : colorTips.filter((t) => t.category === activeCategory)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/resources" label="返回资源中心" />
      <Section title="色差知识库" icon="🎨" description="从RGB到CMYK，从屏幕到纸张，全方位了解色彩管理" />

      <div className="flex flex-wrap gap-1 mb-6">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveCategory(c.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeCategory === c.key ? 'bg-primary text-white' : 'bg-gray-100 text-text hover:bg-gray-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((tip) => (
          <Card key={tip.id} hover onClick={() => setSelectedTip(tip)}>
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">
                {tip.category === 'danger' ? '⚠️' : tip.category === 'basic' ? '📘' : tip.category === 'factory' ? '🏭' : '🔧'}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">{tip.title}</h3>
                <p className="text-xs text-text-muted line-clamp-2">{tip.content}</p>
              </div>
              <Tag variant={tip.category === 'danger' ? 'danger' : tip.category === 'fix' ? 'success' : 'primary'}>
                {categories.find((c) => c.key === tip.category)?.label || ''}
              </Tag>
            </div>
          </Card>
        ))}
      </div>

      {selectedTip && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTip(null)}>
          <div className="bg-bg-card rounded-2xl max-w-lg w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold">{selectedTip.title}</h2>
              <button onClick={() => setSelectedTip(null)} className="text-text-muted hover:text-text text-xl cursor-pointer">&times;</button>
            </div>
            <p className="text-sm leading-relaxed">{selectedTip.content}</p>
          </div>
        </div>
      )}
    </div>
  )
}