import { useState } from 'react'
import { BackButton, Section, Card, Tag } from '@/components/ui'
import { bindings, type Binding } from '@/data/bindings'

export default function BindingSelector() {
  const [pageCount, setPageCount] = useState(64)
  const [contentType, setContentType] = useState('all')
  const [selectedBinding, setSelectedBinding] = useState<Binding | null>(null)

  const contentTypeOptions = [
    { value: 'all', label: '全部' },
    { value: 'novel', label: '小说/文字' },
    { value: 'comic', label: '漫画' },
    { value: 'art', label: '画集/摄影' },
    { value: 'mixed', label: '文画混合' },
  ]

  // 根据页数和内容类型推荐装订
  const getRecommendation = () => {
    const suitable = bindings.filter((b) => {
      if (pageCount < b.minPages || pageCount > b.maxPages) return false
      return true
    })
    return suitable
  }

  const recommendations = getRecommendation()

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/book" label="返回书本制作" />
      <Section
        title="装订方式选型决策器"
        icon="📚"
        description="7种装订方式对比，输入页数自动推荐最适装订方案"
      />

      {/* 输入区 */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">页数（P）</label>
            <input
              type="number"
              value={pageCount}
              onChange={(e) => setPageCount(Number(e.target.value))}
              min={4}
              max={800}
              step={4}
              className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm"
            />
            <p className="text-xs text-text-muted mt-1">页数应为4的倍数</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">内容类型</label>
            <div className="flex flex-wrap gap-1">
              {contentTypeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setContentType(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    contentType === opt.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-text hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end">
            <div className="text-sm">
              <span className="text-text-muted">推荐装订：</span>
              <span className="font-semibold text-primary">
                {recommendations.length > 0
                  ? recommendations.map((r) => r.name).join(' / ')
                  : '无匹配装订'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 装订方式列表 */}
      <div className="space-y-4">
        {bindings.map((binding) => {
          const isCompatible = pageCount >= binding.minPages && pageCount <= binding.maxPages
          return (
            <Card
              key={binding.id}
              hover
              onClick={() => setSelectedBinding(binding)}
              className={`${!isCompatible ? 'opacity-50' : ''} ${selectedBinding?.id === binding.id ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{binding.name}</h3>
                  <p className="text-xs text-text-muted">{binding.nameJa}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isCompatible ? (
                    <Tag variant="success">适合当前页数</Tag>
                  ) : (
                    <Tag variant="danger">页数不匹配</Tag>
                  )}
                  <Tag variant={binding.priceLevel === 'low' ? 'success' : binding.priceLevel === 'medium' ? 'warning' : 'danger'}>
                    {binding.priceLevel === 'low' ? '经济' : binding.priceLevel === 'medium' ? '中等' : '较高'}
                  </Tag>
                </div>
              </div>
              <p className="text-sm text-text-muted mb-3">{binding.description}</p>
              <div className="flex flex-wrap gap-1 text-xs">
                <span className="text-text-muted">页数范围：</span>
                <span className="font-medium">{binding.minPages}P ~ {binding.maxPages}P</span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* 装订详情弹窗 */}
      {selectedBinding && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBinding(null)}>
          <div className="bg-bg-card rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedBinding.name}</h2>
                <p className="text-sm text-text-muted">{selectedBinding.nameJa}</p>
              </div>
              <button onClick={() => setSelectedBinding(null)} className="text-text-muted hover:text-text text-xl cursor-pointer">&times;</button>
            </div>

            <p className="text-sm text-text-muted mb-4">{selectedBinding.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs text-text-muted">页数范围</span>
                <p className="text-sm font-medium">{selectedBinding.minPages}P ~ {selectedBinding.maxPages}P</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs text-text-muted">价格水平</span>
                <p className="text-sm font-medium">
                  {selectedBinding.priceLevel === 'low' ? '经济' : selectedBinding.priceLevel === 'medium' ? '中等' : '较高'}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">优点</h3>
              <div className="flex flex-wrap gap-1">
                {selectedBinding.pros.map((p) => <Tag key={p} variant="success">{p}</Tag>)}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">缺点</h3>
              <div className="flex flex-wrap gap-1">
                {selectedBinding.cons.map((c) => <Tag key={c} variant="danger">{c}</Tag>)}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">适合</h3>
              <div className="flex flex-wrap gap-1">
                {selectedBinding.suitableFor.map((s) => <Tag key={s} variant="primary">{s}</Tag>)}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">不适合</h3>
              <div className="flex flex-wrap gap-1">
                {selectedBinding.unsuitableFor.map((s) => <Tag key={s} variant="default">{s}</Tag>)}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2">工艺兼容性</h3>
              <div className="space-y-2">
                {selectedBinding.processCompatibility.map((pc) => (
                  <div key={pc.process} className="flex items-center gap-2 text-sm">
                    <span className={pc.compatible ? 'text-success' : 'text-danger'}>
                      {pc.compatible ? '✓' : '✗'}
                    </span>
                    <span className="font-medium">{pc.process}</span>
                    <span className="text-text-muted text-xs">— {pc.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}