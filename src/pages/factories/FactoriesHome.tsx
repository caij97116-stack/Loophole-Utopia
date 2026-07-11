import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Section, Card, Tag, Tabs } from '@/components/ui'
import { factories, type Factory } from '@/data/factories'

const subModules = [
  { name: '厂家大全', desc: '35家中日印刷/周边厂家', path: '/factories', available: true },
  { name: '报价对比器', desc: '横向对比4家厂家', path: '/factories/compare', available: true },
  { name: '询价助手', desc: '一键生成标准化询价消息', path: '/factories/inquiry', available: true },
]

const categoryTabs = [
  { key: 'all', label: '全部厂家', icon: '🏭' },
  { key: 'book', label: '同人本印刷', icon: '📖' },
  { key: 'goods', label: '周边定制', icon: '🎁' },
  { key: 'both', label: '一站式', icon: '🔄' },
]

const typeTabs = [
  { key: 'all', label: '全部类型' },
  { key: 'major', label: '大厂' },
  { key: 'indie', label: '创作者推荐/赶工' },
]

const countryLabels: Record<string, string> = { cn: '中国', jp: '日本' }
const rushLevelStars = (level: number) => '★'.repeat(level) + '☆'.repeat(5 - level)
const starRating = (level: number) => '★'.repeat(level) + '☆'.repeat(5 - level)

export default function FactoriesPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeType, setActiveType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFactory, setSelectedFactory] = useState<Factory | null>(null)

  const filtered = factories.filter((f) => {
    if (activeCategory !== 'all' && f.category !== activeCategory && !(activeCategory === 'both' && f.category === 'both')) {
      if (activeCategory === 'both' && f.category !== 'both') return false
      if (activeCategory !== 'both' && f.category !== activeCategory) return false
    }
    if (activeType !== 'all' && f.type !== activeType) return false
    if (searchTerm && !f.name.includes(searchTerm) && !f.location.includes(searchTerm) && !f.specialties.some((s) => s.includes(searchTerm))) return false
    return true
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section
        title="厂家报价专区"
        icon="🏭"
        description="35家中日印刷/周边厂家，含真实评价、价格水平、接单特色"
      />

      {/* 子模块导航 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {subModules.map((mod) => (
          <Card
            key={mod.name}
            hover={mod.available}
            onClick={() => mod.available && navigate(mod.path)}
            className={!mod.available ? 'opacity-60' : ''}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{mod.name}</h3>
              {mod.available ? (
                <Tag variant="success" size="sm">已上线</Tag>
              ) : (
                <Tag variant="default" size="sm">即将上线</Tag>
              )}
            </div>
            <p className="text-xs text-text-muted">{mod.desc}</p>
          </Card>
        ))}
      </div>

      {/* 筛选栏 */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Tabs tabs={categoryTabs} activeKey={activeCategory} onChange={setActiveCategory} />
        <Tabs tabs={typeTabs} activeKey={activeType} onChange={setActiveType} />
        <input
          type="text"
          placeholder="搜索厂家/城市/专长..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-white text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <span className="text-xs text-text-muted">{filtered.length} 家厂家</span>
      </div>

      {/* 厂家卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((factory) => (
          <Card
            key={factory.id}
            hover
            onClick={() => setSelectedFactory(factory)}
            className={selectedFactory?.id === factory.id ? 'ring-2 ring-primary' : ''}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{factory.name}</h3>
                  <Tag variant={factory.country === 'jp' ? 'primary' : 'default'} size="sm">
                    {countryLabels[factory.country]}
                  </Tag>
                  {factory.type === 'indie' && <Tag variant="warning" size="sm">创作者推荐</Tag>}
                </div>
                <p className="text-xs text-text-muted">{factory.location}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-text-muted">品质</div>
                <div className="text-sm text-accent">{starRating(factory.qualityRating)}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-2">
              {factory.specialties.slice(0, 4).map((s) => (
                <Tag key={s} variant="default" size="sm">{s}</Tag>
              ))}
              {factory.specialties.length > 4 && (
                <Tag variant="default" size="sm">{`+${factory.specialties.length - 4}`}</Tag>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-text-muted">起订量：</span>
                <span className="font-medium">{factory.minOrder}</span>
              </div>
              <div>
                <span className="text-text-muted">交期：</span>
                <span className="font-medium">{factory.turnaround}</span>
              </div>
              <div>
                <span className="text-text-muted">赶工：</span>
                <span className={`font-medium ${factory.rushLevel >= 4 ? 'text-success' : 'text-text-muted'}`}>
                  {rushLevelStars(factory.rushLevel)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 厂家详情弹窗 */}
      {selectedFactory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedFactory(null)}>
          <div className="bg-bg-card rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{selectedFactory.name}</h2>
                  <Tag variant={selectedFactory.country === 'jp' ? 'primary' : 'default'}>
                    {countryLabels[selectedFactory.country]}
                  </Tag>
                  {selectedFactory.type === 'indie' && <Tag variant="warning">创作者推荐</Tag>}
                </div>
                <p className="text-sm text-text-muted">{selectedFactory.location}</p>
              </div>
              <button onClick={() => setSelectedFactory(null)} className="text-text-muted hover:text-text text-xl cursor-pointer">&times;</button>
            </div>

            {/* 评分 */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xs text-text-muted mb-1">品质</div>
                <div className="text-accent text-lg">{starRating(selectedFactory.qualityRating)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xs text-text-muted mb-1">价格</div>
                <div className="font-semibold">
                  {selectedFactory.priceLevel === 'low' ? '低' : selectedFactory.priceLevel === 'medium' ? '中' : '高'}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xs text-text-muted mb-1">赶工</div>
                <div className="text-sm">{rushLevelStars(selectedFactory.rushLevel)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xs text-text-muted mb-1">色差</div>
                <div className="text-sm font-medium">
                  {selectedFactory.colorAccuracy === 'high' ? '低' : selectedFactory.colorAccuracy === 'medium' ? '中' : '高'}
                </div>
              </div>
            </div>

            {/* 基本信息 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs text-text-muted">起订量</span>
                <p className="text-sm font-medium">{selectedFactory.minOrder}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs text-text-muted">交期</span>
                <p className="text-sm font-medium">{selectedFactory.turnaround}</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">专长</h3>
              <div className="flex flex-wrap gap-1">
                {selectedFactory.specialties.map((s) => <Tag key={s} variant="primary">{s}</Tag>)}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">优点</h3>
              <div className="flex flex-wrap gap-1">
                {selectedFactory.pros.map((p) => <Tag key={p} variant="success">{p}</Tag>)}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">缺点</h3>
              <div className="flex flex-wrap gap-1">
                {selectedFactory.cons.map((c) => <Tag key={c} variant="danger">{c}</Tag>)}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">适合</h3>
              <div className="flex flex-wrap gap-1">
                {selectedFactory.bestFor.map((b) => <Tag key={b} variant="default">{b}</Tag>)}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">不适合</h3>
              <div className="flex flex-wrap gap-1">
                {selectedFactory.notFor.map((n) => <Tag key={n} variant="danger">{n}</Tag>)}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold mb-1">真实评价</h3>
              <p className="text-sm text-text-muted">"{selectedFactory.review}"</p>
              <p className="text-xs text-text-muted mt-1">来源：{selectedFactory.reviewSource}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <span className="text-xs text-text-muted">联系方式</span>
              <p className="text-sm font-medium mt-1">{selectedFactory.contact}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}