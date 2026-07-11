import { useState } from 'react'
import { BackButton, Section, Card, Tag } from '@/components/ui'
import { mistakes, type Mistake } from '@/data/mistakes'

const categories = [
  { key: 'all', label: '全部' },
  { key: 'color', label: '色差' },
  { key: 'binding', label: '装订' },
  { key: 'process', label: '工艺' },
  { key: 'design', label: '设计' },
  { key: 'logistics', label: '物流' },
  { key: 'event', label: '展会' },
]

const severityLabels: Record<string, string> = { danger: '严重', warning: '注意', info: '提示' }

export default function MistakesPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedMistake, setSelectedMistake] = useState<Mistake | null>(null)

  const filtered = activeCategory === 'all' ? mistakes : mistakes.filter((m) => m.category === activeCategory)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/resources" label="返回资源中心" />
      <Section title="常见翻车案例" icon="🚨" description="前人踩过的坑，后人不要再踩。20个真实翻车案例+原因+预防方法" />

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

      <div className="space-y-3">
        {filtered.map((m) => (
          <Card key={m.id} hover onClick={() => setSelectedMistake(m)} className="cursor-pointer">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">
                {m.severity === 'danger' ? '🔴' : m.severity === 'warning' ? '🟡' : '🔵'}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{m.title}</h3>
                  <Tag variant={m.severity === 'danger' ? 'danger' : m.severity === 'warning' ? 'warning' : 'primary'} size="sm">
                    {severityLabels[m.severity]}
                  </Tag>
                </div>
                <p className="text-xs text-text-muted line-clamp-2">{m.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedMistake && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMistake(null)}>
          <div className="bg-bg-card rounded-2xl max-w-lg w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{selectedMistake.severity === 'danger' ? '🔴' : selectedMistake.severity === 'warning' ? '🟡' : '🔵'}</span>
              <h2 className="text-lg font-bold">{selectedMistake.title}</h2>
            </div>
            <Tag variant={selectedMistake.severity === 'danger' ? 'danger' : selectedMistake.severity === 'warning' ? 'warning' : 'primary'}>
              {severityLabels[selectedMistake.severity]}
            </Tag>

            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-text-muted mb-1">翻车现场</h3>
                <p className="text-sm">{selectedMistake.description}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <h3 className="text-sm font-semibold text-red-700 mb-1">翻车原因</h3>
                <p className="text-sm text-red-800">{selectedMistake.cause}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h3 className="text-sm font-semibold text-green-700 mb-1">预防方法</h3>
                <p className="text-sm text-green-800">{selectedMistake.prevention}</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button onClick={() => setSelectedMistake(null)} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium cursor-pointer">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}