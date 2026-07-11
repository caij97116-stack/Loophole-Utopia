import { useState } from 'react'
import { Section, Card, BackButton } from '@/components/ui'

interface GoodsCalcItem {
  name: string
  unitPrice: number
  minOrder: number
  category: string
  unit: string
}

const goodsPrices: GoodsCalcItem[] = [
  { name: '吧唧 58mm 磨砂膜', unitPrice: 2, minOrder: 50, category: 'badge', unit: '个' },
  { name: '吧唧 58mm 星幻膜', unitPrice: 2.5, minOrder: 50, category: 'badge', unit: '个' },
  { name: '吧唧 58mm 镭射膜', unitPrice: 2, minOrder: 50, category: 'badge', unit: '个' },
  { name: '吧唧 75mm 磨砂膜', unitPrice: 3, minOrder: 50, category: 'badge', unit: '个' },
  { name: '亚克力立牌 8cm 透明', unitPrice: 15, minOrder: 30, category: 'acrylic', unit: '个' },
  { name: '亚克力立牌 8cm 磨砂', unitPrice: 18, minOrder: 30, category: 'acrylic', unit: '个' },
  { name: '亚克力钥匙扣 5cm', unitPrice: 12, minOrder: 30, category: 'acrylic', unit: '个' },
  { name: '亚克力摇摇乐', unitPrice: 20, minOrder: 50, category: 'acrylic', unit: '个' },
  { name: 'PVC贴纸 A6', unitPrice: 1, minOrder: 100, category: 'sticker', unit: '张' },
  { name: 'PET贴纸 A6', unitPrice: 1.5, minOrder: 100, category: 'sticker', unit: '张' },
  { name: '明信片 300g铜版', unitPrice: 1, minOrder: 100, category: 'paper', unit: '张' },
  { name: '帆布包 丝印单色', unitPrice: 20, minOrder: 50, category: 'other', unit: '个' },
  { name: '橡胶挂件 6cm', unitPrice: 12, minOrder: 100, category: 'other', unit: '个' },
  { name: '刺绣贴 5cm', unitPrice: 15, minOrder: 50, category: 'other', unit: '个' },
]

export default function GoodsCalculator() {
  const [selected, setSelected] = useState<GoodsCalcItem>(goodsPrices[0])
  const [quantity, setQuantity] = useState(50)
  const [extraFee, setExtraFee] = useState(0)

  const totalCost = selected.unitPrice * quantity + extraFee
  const unitCostWithExtra = totalCost / quantity

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/goods" label="返回周边制作" />
      <Section title="周边报价计算器" icon="🧮" description="选择周边类型，输入数量，自动估算生产成本" />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-72 space-y-4 shrink-0">
          <Card>
            <h3 className="text-sm font-semibold mb-3">选择周边</h3>
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
              {goodsPrices.map((g) => (
                <button key={g.name} onClick={() => { setSelected(g); setQuantity(g.minOrder) }} className={`text-left px-3 py-2 rounded-lg text-xs transition-colors ${selected.name === g.name ? 'bg-primary text-white' : 'bg-bg-card border border-border hover:border-primary'}`}>
                  <div className="font-medium">{g.name}</div>
                  <div className="opacity-70">¥{g.unitPrice}/{g.unit} · 起订{g.minOrder}</div>
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-3">数量</h3>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))} className="w-full px-3 py-2 rounded-lg border border-border bg-bg text-sm mb-2" min={selected.minOrder} step={10} />
            <p className="text-xs text-text-muted">最小起订量：{selected.minOrder}{selected.unit}</p>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-3">额外费用</h3>
            <input type="number" value={extraFee} onChange={(e) => setExtraFee(Math.max(0, parseInt(e.target.value) || 0))} className="w-full px-3 py-2 rounded-lg border border-border bg-bg text-sm mb-2" placeholder="模具费/运费等" />
            <p className="text-xs text-text-muted">如模具费、运费、特殊工艺费</p>
          </Card>
        </div>

        <div className="flex-1">
          <Card className="mb-4">
            <h3 className="font-semibold text-sm mb-4">报价结果</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-bg-card rounded-lg p-3">
                <span className="text-xs text-text-muted">单价</span>
                <p className="font-semibold text-sm">¥{selected.unitPrice}/{selected.unit}</p>
              </div>
              <div className="bg-bg-card rounded-lg p-3">
                <span className="text-xs text-text-muted">数量</span>
                <p className="font-semibold text-sm">{quantity} {selected.unit}</p>
              </div>
              <div className="bg-bg-card rounded-lg p-3">
                <span className="text-xs text-text-muted">均摊单价</span>
                <p className="font-semibold text-sm">¥{unitCostWithExtra.toFixed(2)}/{selected.unit}</p>
              </div>
              <div className="bg-bg-card rounded-lg p-3 border border-primary">
                <span className="text-xs text-text-muted">总成本</span>
                <p className="font-semibold text-primary text-lg">¥{totalCost.toFixed(0)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-sm mb-3">定价建议</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {[
                { label: '成本×2', rate: 2, desc: '基础定价' },
                { label: '成本×2.5', rate: 2.5, desc: '标准定价' },
                { label: '成本×3', rate: 3, desc: '市场均价' },
                { label: '成本×3.5', rate: 3.5, desc: '溢价定价' },
              ].map((opt) => {
                const price = unitCostWithExtra * opt.rate
                const profit = totalCost * (opt.rate - 1)
                return (
                  <div key={opt.label} className="bg-bg-card rounded-lg p-3">
                    <span className="text-xs text-text-muted">{opt.label} ({opt.desc})</span>
                    <p className="font-semibold">¥{price.toFixed(1)}/{selected.unit}</p>
                    <p className="text-xs text-success">利润 ¥{profit.toFixed(0)}</p>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-text-muted mt-3">建议定价 = 成本 × 2~3倍，限定款可溢价到3.5倍。实际定价需结合市场行情和受众接受度。</p>
          </Card>
        </div>
      </div>
    </div>
  )
}