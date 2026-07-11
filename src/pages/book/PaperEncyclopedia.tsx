import { useState } from 'react'
import { BackButton, Section, Card, Tag, Tabs, Select } from '@/components/ui'
import { papers, type Paper } from '@/data/papers'

const categoryTabs = [
  { key: 'all', label: '全部纸张', icon: '📄' },
  { key: 'cover', label: '封面纸', icon: '📔' },
  { key: 'inner', label: '内页纸', icon: '📖' },
  { key: 'endpaper', label: '扉页/环衬', icon: '🎨' },
]

const priceLabels: Record<string, string> = { low: '经济', medium: '中等', high: '较高' }
const priceColors: Record<string, string> = { low: 'success', medium: 'warning', high: 'danger' }

export default function PaperEncyclopedia() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')

  const filteredPapers = papers.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false
    if (priceFilter !== 'all' && p.priceLevel !== priceFilter) return false
    if (searchTerm && !p.name.includes(searchTerm) && !p.nameJa.includes(searchTerm) && !p.analog.includes(searchTerm)) return false
    return true
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/book" label="返回书本制作" />
      <Section
        title="纸张百科"
        icon="📄"
        description="封面纸20+种、内页纸15+种，了解每种纸张的质感、克重、适合场景与避坑指南"
      />

      {/* 筛选栏 */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Tabs tabs={categoryTabs} activeKey={activeCategory} onChange={setActiveCategory} />
        <input
          type="text"
          placeholder="搜索纸张名称..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-white text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <Select
          options={[
            { value: 'all', label: '全部价位' },
            { value: 'low', label: '经济' },
            { value: 'medium', label: '中等' },
            { value: 'high', label: '较高' },
          ]}
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="w-32"
        />
        <span className="text-xs text-text-muted">{filteredPapers.length} 种纸张</span>
      </div>

      {/* 纸张卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPapers.map((paper) => (
          <Card
            key={paper.id}
            hover
            onClick={() => setSelectedPaper(paper)}
            className={selectedPaper?.id === paper.id ? 'ring-2 ring-primary' : ''}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm">{paper.name}</h3>
              <Tag variant={priceColors[paper.priceLevel] as 'success' | 'warning' | 'danger'} size="sm">
                {priceLabels[paper.priceLevel]}
              </Tag>
            </div>
            <p className="text-xs text-text-muted mb-2">{paper.nameJa}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              <Tag variant="default">{paper.gsm}</Tag>
              <Tag variant="default">{paper.color}</Tag>
            </div>
            <p className="text-xs text-text-muted mt-2 line-clamp-2">{paper.texture}</p>
          </Card>
        ))}
      </div>

      {/* 纸张详情弹窗 */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPaper(null)}>
          <div className="bg-bg-card rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedPaper.name}</h2>
                <p className="text-sm text-text-muted">{selectedPaper.nameJa}</p>
              </div>
              <button onClick={() => setSelectedPaper(null)} className="text-text-muted hover:text-text text-xl cursor-pointer">&times;</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs text-text-muted">克重</span>
                <p className="text-sm font-medium">{selectedPaper.gsm}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs text-text-muted">底色</span>
                <p className="text-sm font-medium">{selectedPaper.color}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs text-text-muted">触感</span>
                <p className="text-sm font-medium">{selectedPaper.texture}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs text-text-muted">透度</span>
                <p className="text-sm font-medium">{selectedPaper.opacity}</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">特点</h3>
              <div className="flex flex-wrap gap-1">
                {selectedPaper.features.map((f) => <Tag key={f} variant="primary">{f}</Tag>)}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">适合场景</h3>
              <div className="flex flex-wrap gap-1">
                {selectedPaper.suitableFor.map((f) => <Tag key={f} variant="success">{f}</Tag>)}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">不适合场景</h3>
              <div className="flex flex-wrap gap-1">
                {selectedPaper.unsuitableFor.map((f) => <Tag key={f} variant="danger">{f}</Tag>)}
              </div>
            </div>

            {selectedPaper.analog && (
              <div className="bg-gray-50 rounded-lg p-4">
                <span className="text-xs text-text-muted">类似质感参考</span>
                <p className="text-sm mt-1">{selectedPaper.analog}</p>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button onClick={() => setSelectedPaper(null)} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium cursor-pointer hover:bg-primary-dark transition-colors">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}