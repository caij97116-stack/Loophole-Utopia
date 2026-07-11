import { useState } from 'react'
import { Section, Card, Tag } from '@/components/ui'
import { promoMaterials, checklistItems } from '@/data/events'

export default function PromoMaterialLibrary() {
  const [activeTab, setActiveTab] = useState<'materials' | 'checklist'>('materials')

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section
        title="宣发素材库"
        icon="📢"
        description="从试阅到展后总结，完整的宣发时间线和素材策略"
      />

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'materials' ? 'bg-primary text-white' : 'bg-bg-card border border-border'
          }`}
        >
          宣发素材
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'checklist' ? 'bg-primary text-white' : 'bg-bg-card border border-border'
          }`}
        >
          参展清单
        </button>
      </div>

      {activeTab === 'materials' && (
        <div className="space-y-4">
          {promoMaterials.map((mat) => (
            <Card key={mat.id}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-sm">{mat.name}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{mat.description}</p>
                </div>
                <Tag variant="info" size="sm">{mat.bestTime}</Tag>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {mat.platforms.map((p) => (
                  <Tag key={p} variant="default" size="sm">{p}</Tag>
                ))}
              </div>
              <ul className="space-y-1">
                {mat.tips.map((tip, i) => (
                  <li key={i} className="text-xs text-text-muted flex items-start gap-2">
                    <span className="text-primary mt-0.5">{i + 1}.</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'checklist' && (
        <div className="space-y-4">
          {checklistItems.map((phase) => (
            <Card key={phase.phase}>
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {phase.phase}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {phase.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-text-muted">
                    <input type="checkbox" className="rounded" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}