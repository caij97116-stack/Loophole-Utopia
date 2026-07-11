import { useState } from 'react'
import { Section, Card, Tag, Tabs, BackButton } from '@/components/ui'
import { goodsProcesses, goodsCategories } from '@/data/goodsProcesses'
import type { GoodsProcess } from '@/data/goodsProcesses'

const priceLabels: Record<string, string> = {
  low: '经济',
  medium: '中等',
  high: '较高',
  premium: '高端',
}
const priceVariants: Record<string, 'success' | 'default' | 'danger' | 'info' | 'warning'> = {
  low: 'success',
  medium: 'default',
  high: 'warning',
  premium: 'danger',
}

export default function GoodsProcessLibrary() {
  const [activeCategory, setActiveCategory] = useState<string>(goodsCategories[0].id)
  const [selected, setSelected] = useState<GoodsProcess | null>(null)

  const filtered = goodsProcesses.filter((p) => p.category === activeCategory)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/goods" label="返回周边制作" />
      <Section
        title="周边工艺百科"
        icon="🎁"
        description="吧唧、亚克力、纸品、贴纸、特殊周边的工艺大全，含优缺点评价与选型建议"
      />
      <Tabs
        tabs={goodsCategories.map((c) => ({ key: c.id, label: c.name, icon: c.icon }))}
        activeKey={activeCategory}
        onChange={(key) => setActiveCategory(key)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filtered.map((proc) => (
          <Card
            key={proc.id}
            hover
            onClick={() => setSelected(proc)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{proc.name}</h3>
              <Tag variant={priceVariants[proc.priceLevel]} size="sm">
                {priceLabels[proc.priceLevel]}
              </Tag>
            </div>
            {proc.nameJa && (
              <p className="text-xs text-text-muted mb-1">{proc.nameJa}</p>
            )}
            <p className="text-xs text-text-muted line-clamp-2">{proc.description}</p>
            <div className="flex gap-1 mt-2 flex-wrap">
              <Tag variant="default" size="sm">{proc.productionTime}</Tag>
              <Tag variant="default" size="sm">起订{proc.minOrder}</Tag>
            </div>
          </Card>
        ))}
      </div>

      {/* 详情弹窗 */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-bg rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{selected.name}</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-text-muted hover:text-text text-xl leading-none"
              >
                ×
              </button>
            </div>
            {selected.nameJa && (
              <p className="text-sm text-text-muted mb-3">{selected.nameJa}</p>
            )}
            <p className="text-sm mb-4">{selected.description}</p>

            <div className="mb-3">
              <h4 className="text-xs font-semibold text-text-muted mb-1">工艺效果</h4>
              <p className="text-sm">{selected.effect}</p>
            </div>

            <div className="mb-3">
              <h4 className="text-xs font-semibold text-success mb-1">适合</h4>
              <div className="flex flex-wrap gap-1">
                {selected.suitableFor.map((s) => (
                  <Tag key={s} variant="success" size="sm">{s}</Tag>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <h4 className="text-xs font-semibold text-danger mb-1">不适合</h4>
              <div className="flex flex-wrap gap-1">
                {selected.unsuitableFor.map((s) => (
                  <Tag key={s} variant="danger" size="sm">{s}</Tag>
                ))}
              </div>
            </div>

            <div className="flex gap-4 text-xs text-text-muted mb-3">
              <span>生产周期：{selected.productionTime}</span>
              <span>起订量：{selected.minOrder}个</span>
            </div>

            {selected.notes && (
              <div className="bg-bg-card rounded-lg p-3 text-xs text-text-muted">
                <span className="font-semibold text-info">提示：</span>
                {selected.notes}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}