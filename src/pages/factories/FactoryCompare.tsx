import { useState } from 'react'
import { Section, Tag } from '@/components/ui'
import { factories, type Factory } from '@/data/factories'

const countryLabel: Record<string, string> = { cn: '国内', jp: '日本' }
const priceLabel: Record<string, string> = { low: '经济', medium: '中等', high: '较高' }

export default function FactoryCompare() {
  const [selected, setSelected] = useState<Factory[]>([])

  const toggle = (f: Factory) => {
    if (selected.find((s) => s.id === f.id)) {
      setSelected(selected.filter((s) => s.id !== f.id))
    } else if (selected.length < 4) {
      setSelected([...selected, f])
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section title="报价对比器" icon="⚖️" description="同时选择最多4家厂家，横向对比价格、质量、交期、评价" />

      <div className="flex gap-2 mb-4 flex-wrap">
        {selected.length < 4 && (
          <span className="text-xs text-text-muted self-center">已选 {selected.length}/4 · 点击厂家卡片添加对比</span>
        )}
      </div>

      {/* 厂家选择 */ }
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-6">
        {factories.map((f) => {
          const isSelected = selected.some((s) => s.id === f.id)
          return (
            <button
              key={f.id}
              onClick={() => toggle(f)}
              className={`text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                isSelected
                  ? 'bg-primary text-white'
                  : 'bg-bg-card border border-border hover:border-primary'
              }`}
            >
              <div className="font-medium truncate">{f.name}</div>
              <div className="opacity-70 text-[10px]">{countryLabel[f.country]} · {f.location}</div>
            </button>
          )
        })}
      </div>

      {/* 对比表格 */}
      {selected.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-2 px-3 w-24">对比项</th>
                {selected.map((f) => (
                  <th key={f.id} className="text-left py-2 px-3 min-w-[160px]">
                    <div className="flex items-center justify-between">
                      <span>{f.name}</span>
                      <button onClick={() => setSelected(selected.filter((s) => s.id !== f.id))} className="text-text-muted hover:text-danger">×</button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: '国家', key: 'country', render: (f: Factory) => countryLabel[f.country] },
                { label: '城市', key: 'location', render: (f: Factory) => f.location },
                { label: '类型', key: 'category', render: (f: Factory) => f.category === 'book' ? '印刷' : f.category === 'goods' ? '周边' : '一站式' },
                { label: '价格水平', key: 'priceLevel', render: (f: Factory) => <Tag variant={f.priceLevel === 'low' ? 'success' : f.priceLevel === 'medium' ? 'warning' : 'danger'} size="sm">{priceLabel[f.priceLevel]}</Tag> },
                { label: '质量评分', key: 'qualityRating', render: (f: Factory) => '★'.repeat(f.qualityRating) + '☆'.repeat(5 - f.qualityRating) },
                { label: '色差控制', key: 'colorAccuracy', render: (f: Factory) => f.colorAccuracy === 'high' ? '🥇 优秀' : f.colorAccuracy === 'medium' ? '🥈 良好' : '🥉 一般' },
                { label: '起订量', key: 'minOrder', render: (f: Factory) => f.minOrder },
                { label: '交期', key: 'turnaround', render: (f: Factory) => f.turnaround },
                { label: '加急', key: 'rush', render: (f: Factory) => f.rush ? <Tag variant="success" size="sm">支持</Tag> : <Tag variant="default" size="sm">不支持</Tag> },
                { label: '擅长', key: 'specialties', render: (f: Factory) => <div className="flex flex-wrap gap-0.5">{f.specialties.slice(0, 3).map((s) => <Tag key={s} variant="info" size="sm">{s}</Tag>)}</div> },
                { label: '最适合', key: 'bestFor', render: (f: Factory) => <div className="flex flex-wrap gap-0.5">{f.bestFor.slice(0, 3).map((s) => <Tag key={s} variant="success" size="sm">{s}</Tag>)}</div> },
                { label: '不适合', key: 'notFor', render: (f: Factory) => <div className="flex flex-wrap gap-0.5">{f.notFor.slice(0, 2).map((s) => <Tag key={s} variant="danger" size="sm">{s}</Tag>)}</div> },
                { label: '优点', key: 'pros', render: (f: Factory) => <ul className="list-disc list-inside">{f.pros.slice(0, 3).map((p) => <li key={p}>{p}</li>)}</ul> },
                { label: '缺点', key: 'cons', render: (f: Factory) => <ul className="list-disc list-inside">{f.cons.slice(0, 2).map((c) => <li key={c}>{c}</li>)}</ul> },
                { label: '评价', key: 'review', render: (f: Factory) => <div><p className="italic">"{f.review}"</p><p className="text-text-muted">— {f.reviewSource}</p></div> },
                { label: '联系方式', key: 'contact', render: (f: Factory) => f.contact },
              ].map((row) => (
                <tr key={row.key} className="border-b border-border">
                  <td className="py-2 px-3 font-medium text-text-muted">{row.label}</td>
                  {selected.map((f) => (
                    <td key={f.id} className="py-2 px-3">{row.render(f)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}