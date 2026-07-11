import { useState } from 'react'
import { BackButton, Section, Card, Tag } from '@/components/ui'
import { events } from '@/data/events'
import type { Event } from '@/data/events'

const countryLabels: Record<string, string> = { CN: '国内', JP: '日本', TW: '台湾', HK: '香港', OTHER: '其他' }
const scaleLabels: Record<string, string> = { small: '小型', medium: '中型', large: '大型', mega: '超大型' }
const scaleVariants: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  small: 'default', medium: 'success', large: 'warning', mega: 'danger',
}

export default function EventCalendar() {
  const [selected, setSelected] = useState<Event | null>(null)
  const [filterCountry, setFilterCountry] = useState<string>('all')

  const filtered = filterCountry === 'all'
    ? events
    : events.filter((e) => e.country === filterCountry)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/promo" label="返回展会宣发" />
      <Section
        title="展会日历"
        icon="📅"
        description="中日同人展信息汇总，含摊位费、申请截止、参展建议"
      />

      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'all', label: '全部' },
          { id: 'CN', label: '国内' },
          { id: 'JP', label: '日本' },
          { id: 'TW', label: '台湾' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterCountry(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterCountry === f.id
                ? 'bg-primary text-white'
                : 'bg-bg-card border border-border hover:border-primary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((event) => (
          <Card key={event.id} hover onClick={() => setSelected(event)} className="cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{event.name}</h3>
              <Tag variant={scaleVariants[event.scale]} size="sm">{scaleLabels[event.scale]}</Tag>
            </div>
            <p className="text-xs text-text-muted mb-2">{event.location}</p>
            <div className="flex gap-1 flex-wrap text-xs">
              <Tag variant="default" size="sm">{countryLabels[event.country]}</Tag>
              <Tag variant="default" size="sm">{event.months.join(' / ')}</Tag>
            </div>
          </Card>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-bg rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="text-text-muted hover:text-text text-xl leading-none">×</button>
            </div>
            {selected.nameJa && <p className="text-sm text-text-muted mb-2">{selected.nameJa}</p>}
            <p className="text-sm mb-4">{selected.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-bg-card rounded-lg p-3">
                <span className="text-xs text-text-muted">地点</span>
                <p className="text-sm font-semibold">{selected.location}</p>
              </div>
              <div className="bg-bg-card rounded-lg p-3">
                <span className="text-xs text-text-muted">城市</span>
                <p className="text-sm font-semibold">{selected.city}</p>
              </div>
              <div className="bg-bg-card rounded-lg p-3">
                <span className="text-xs text-text-muted">摊位费</span>
                <p className="text-sm font-semibold">{selected.boothFee}</p>
              </div>
              <div className="bg-bg-card rounded-lg p-3">
                <span className="text-xs text-text-muted">申请截止</span>
                <p className="text-sm font-semibold">{selected.applyDeadline}</p>
              </div>
            </div>

            <div className="bg-bg-card rounded-lg p-3 text-xs text-text-muted">
              <span className="font-semibold text-info">参展提示：</span>
              {selected.notes}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}