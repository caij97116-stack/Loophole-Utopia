import { useState } from 'react'
import { Section, Card, Tag } from '@/components/ui'

interface CostItem {
  category: string
  items: { name: string; priceRange: string; notes: string }[]
}

const costData: CostItem[] = [
  {
    category: '印刷成本',
    items: [
      { name: '封面印刷（A5/300g铜版/四色）', priceRange: '1-3元/本', notes: '批量越大单价越低' },
      { name: '内页印刷（A5/100g道林/黑白）', priceRange: '0.05-0.15元/P', notes: '彩色约3-5倍价格' },
      { name: '装订（无线胶装）', priceRange: '2-5元/本', notes: '骑马订更便宜约1-2元' },
      { name: '覆膜（亮膜/哑膜）', priceRange: '0.5-1元/本', notes: '封面覆膜' },
    ],
  },
  {
    category: '周边成本',
    items: [
      { name: '吧唧（58mm/磨砂膜）', priceRange: '1.5-3元/个', notes: '50个起订，含底托+背卡' },
      { name: '亚克力立牌（8cm/透明）', priceRange: '10-20元/个', notes: '30个起订，异形切割' },
      { name: '亚克力钥匙扣', priceRange: '8-15元/个', notes: '含金属链条' },
      { name: '贴纸（PVC/A6）', priceRange: '0.5-1.5元/张', notes: '100张起订' },
      { name: '明信片（300g铜版）', priceRange: '0.5-2元/张', notes: '100张起订' },
      { name: '帆布包（丝印单色）', priceRange: '15-25元/个', notes: '50个起订' },
      { name: '摇摇乐', priceRange: '15-25元/个', notes: '50个起订，含填充物' },
      { name: '橡胶挂件', priceRange: '8-15元/个', notes: '100个起订，另加模具费300-800元' },
    ],
  },
  {
    category: '展会费用',
    items: [
      { name: '摊位费（CP/半摊）', priceRange: '200-400元', notes: '全摊约400-800元' },
      { name: '差旅费（本地）', priceRange: '50-200元', notes: '交通+餐饮' },
      { name: '差旅费（跨城）', priceRange: '500-2000元', notes: '交通+住宿+餐饮' },
      { name: '摊位道具', priceRange: '100-500元', notes: '桌布/立牌/展示架/包装袋等' },
      { name: '找零备用金', priceRange: '200-500元', notes: '现金+扫码收款' },
    ],
  },
  {
    category: '其他费用',
    items: [
      { name: '封面设计（约稿）', priceRange: '200-1000元', notes: '根据画师知名度和复杂度' },
      { name: '排版设计', priceRange: '100-500元', notes: '也可自己排版' },
      { name: 'ISBN/书号（如需）', priceRange: '0-500元', notes: '同人志通常不需要' },
      { name: '快递/物流', priceRange: '20-100元', notes: '厂家发货到手的运费' },
      { name: '通贩平台手续费', priceRange: '约5-10%', notes: '淘宝/微店等平台抽成' },
    ],
  },
]

export default function CostHome() {
  const [quantities, setQuantities] = useState({
    book: 100,
    badge: 50,
    acrylic: 30,
    sticker: 100,
  })

  const calcEstimate = () => {
    const bookCost = quantities.book * (2 + 0.1 * 32 + 3 + 0.5) // 封面+内页32P+装订+覆膜
    const badgeCost = quantities.badge * 2
    const acrylicCost = quantities.acrylic * 15
    const stickerCost = quantities.sticker * 1
    const boothFee = 300
    const other = 300
    const total = bookCost + badgeCost + acrylicCost + stickerCost + boothFee + other
    return { bookCost, badgeCost, acrylicCost, stickerCost, boothFee, other, total }
  }

  const estimate = calcEstimate()

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section
        title="成本管理"
        icon="💰"
        description="印刷、周边、展会费用全透明，快速估算总成本"
      />

      {/* 快速估算器 */}
      <Card className="mb-6">
        <h3 className="font-semibold text-sm mb-4">快速成本估算器</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            { key: 'book', label: '本子数量', min: 10, max: 1000, step: 10 },
            { key: 'badge', label: '吧唧数量', min: 0, max: 500, step: 10 },
            { key: 'acrylic', label: '亚克力数量', min: 0, max: 300, step: 10 },
            { key: 'sticker', label: '贴纸数量', min: 0, max: 500, step: 10 },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-xs text-text-muted block mb-1">{f.label}</label>
              <input
                type="number"
                value={quantities[f.key as keyof typeof quantities]}
                onChange={(e) =>
                  setQuantities((prev) => ({ ...prev, [f.key]: parseInt(e.target.value) || 0 }))
                }
                className="w-full px-3 py-2 rounded-lg border border-border bg-bg text-sm"
                min={f.min}
                max={f.max}
                step={f.step}
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-bg-card rounded-lg p-3">
            <span className="text-xs text-text-muted">印刷成本</span>
            <p className="font-semibold text-success">¥{estimate.bookCost.toFixed(0)}</p>
          </div>
          <div className="bg-bg-card rounded-lg p-3">
            <span className="text-xs text-text-muted">周边成本</span>
            <p className="font-semibold">¥{(estimate.badgeCost + estimate.acrylicCost + estimate.stickerCost).toFixed(0)}</p>
          </div>
          <div className="bg-bg-card rounded-lg p-3">
            <span className="text-xs text-text-muted">展会+其他</span>
            <p className="font-semibold">¥{(estimate.boothFee + estimate.other).toFixed(0)}</p>
          </div>
          <div className="bg-bg-card rounded-lg p-3 border border-primary">
            <span className="text-xs text-text-muted">预估总成本</span>
            <p className="font-semibold text-primary text-lg">¥{estimate.total.toFixed(0)}</p>
          </div>
        </div>
        <p className="text-xs text-text-muted mt-3">
          以上为粗略估算，实际价格以厂家报价为准。建议预留10-20%的预算余量。
        </p>
      </Card>

      {/* 详细成本表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {costData.map((cat) => (
          <Card key={cat.category}>
            <h3 className="font-semibold text-sm mb-3">{cat.category}</h3>
            <div className="space-y-2">
              {cat.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex-1">
                    <span>{item.name}</span>
                    <p className="text-text-muted">{item.notes}</p>
                  </div>
                  <Tag variant="default" size="sm">{item.priceRange}</Tag>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}