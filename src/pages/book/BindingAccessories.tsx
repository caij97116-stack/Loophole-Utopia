import { useState } from 'react'
import { Section, Card, Tag } from '@/components/ui'

interface BindingAccessory {
  name: string
  type: 'obi' | 'packaging' | 'case' | 'other'
  description: string
  priceRange: string
  pros: string[]
  cons: string[]
  bestFor: string[]
  notes: string
}

const accessories: BindingAccessory[] = [
  { name: '腰封/帯', type: 'obi', description: '包裹在封面上的带状纸，日本书籍标配，可印刷书名/宣传语', priceRange: '0.5-1.5元/条', pros: ['增加层次感', '可放宣传语', '日系感强', '可拆卸不影响封面'], cons: ['制作精度要求高', '容易丢失', '尺寸需精确计算'], bestFor: ['日系风格', '宣传语突出', '多本系列'], notes: '宽度通常为封面高度的1/3-1/4，需要精确计算封面+书脊的总宽度' },
  { name: '书盒/函套', type: 'case', description: '硬质纸盒保护书本，可印刷，高级感十足', priceRange: '15-40元/个', pros: ['保护性极强', '高级感', '可做展示', '适合厚本/套装'], cons: ['成本高', '制作周期长', '运输体积大', '起订量高'], bestFor: ['精装限定版', '套装合集', '高价收藏本'], notes: '建议用2mm以上灰板，内衬绒布/丝绸更显高级' },
  { name: '亚克力书盒', type: 'case', description: '透明亚克力盒子，展示效果好，保护性强', priceRange: '20-50元/个', pros: ['展示效果极佳', '透明可见封面', '可重复使用', '现代感强'], cons: ['成本高昂', '重量大', '易刮花', '起订量高'], bestFor: ['超限定版', '签名版', '展示用'], notes: '建议3mm以上厚度，考虑磁吸开口设计' },
  { name: 'OPP袋/自封袋', type: 'packaging', description: '透明塑料自封袋，最基础的包装保护', priceRange: '0.05-0.2元/个', pros: ['成本极低', '透明可见', '防尘防潮', '自封方便'], cons: ['质感普通', '环保性差', '容易皱'], bestFor: ['日常包装', '展会赠送', '基础保护'], notes: '选厚度0.04mm以上，太薄容易破损' },
  { name: '牛皮纸袋', type: 'packaging', description: '牛皮纸材质包装袋，环保文艺，可定制印刷', priceRange: '0.5-3元/个', pros: ['环保', '文艺感', '可定制印刷', '手感好'], cons: ['不透明', '防潮性差', '重物不耐'], bestFor: ['文艺风', '环保主题', '轻量包装'], notes: '建议120g以上牛皮纸，可印社团logo' },
  { name: '磨砂袋', type: 'packaging', description: '半透明磨砂塑料包装袋，质感好，隐约可见内容', priceRange: '0.2-0.5元/个', pros: ['半透明朦胧美', '质感好', '防尘防潮', '性价比高'], cons: ['不如OPP透明', '塑料材质', '尺寸选择有限'], bestFor: ['吧唧包装', '周边整体包装', '中档包装'], notes: '选0.05mm以上，自封口更方便' },
  { name: '书签丝带', type: 'other', description: '粘在书脊上的丝带书签，方便标记阅读位置', priceRange: '0.3-1元/条', pros: ['实用性强', '成本低', '颜色可选', '高级感'], cons: ['需要装订时预装', '丝带会磨损', '颜色需搭配'], bestFor: ['锁线胶装以上', '精装本', '厚本'], notes: '丝带颜色建议与封面主色调搭配，宽度3-5mm' },
  { name: '硫酸纸扉页', type: 'other', description: '半透明硫酸纸作为扉页/隔页，增加层次感', priceRange: '0.3-1元/张', pros: ['朦胧美感', '层次感', '文艺感', '可印刷'], cons: ['易皱', '易撕裂', '印刷需注意'], bestFor: ['文艺风', '插画本', '精装本'], notes: '70-90g硫酸纸最佳，太薄容易透，太厚失去半透明效果' },
  { name: '环衬纸', type: 'other', description: '精装本封面内侧的装饰纸，连接封面和内页', priceRange: '0.5-2元/本', pros: ['增加品质感', '颜色可选', '隐藏装订痕迹'], cons: ['精装本专用', '选择需搭配', '增加成本'], bestFor: ['精装本', '高端本'], notes: '建议120g以上特种纸，颜色与封面/内页协调' },
  { name: '书角', type: 'other', description: '金属/塑料书角保护套，保护书本边角', priceRange: '1-5元/套', pros: ['保护边角', '金属质感', '复古感', '耐用'], cons: ['增加重量', '可能划伤', '安装需技巧'], bestFor: ['精装本', '复古风', '收藏本'], notes: '可选黄铜/不锈钢/塑料，黄铜最复古但最贵' },
]

export default function BindingAccessories() {
  const [selected, setSelected] = useState<BindingAccessory | null>(null)
  const [filterType, setFilterType] = useState<string>('all')

  const typeLabels: Record<string, string> = { obi: '腰封', packaging: '包装', case: '盒装', other: '其他' }

  const filtered = filterType === 'all' ? accessories : accessories.filter((a) => a.type === filterType)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section title="装帧配件" icon="📦" description="腰封、书盒、包装袋、丝带书签等装帧配件大全" />

      <div className="flex gap-2 mb-4 flex-wrap">
        {[{ id: 'all', label: '全部' }, ...Object.entries(typeLabels).map(([k, v]) => ({ id: k, label: v }))].map((f) => (
          <button key={f.id} onClick={() => setFilterType(f.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterType === f.id ? 'bg-primary text-white' : 'bg-bg-card border border-border hover:border-primary'}`}>{f.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((acc) => (
          <Card key={acc.name} hover onClick={() => setSelected(acc)} className="cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{acc.name}</h3>
              <Tag variant="default" size="sm">{typeLabels[acc.type]}</Tag>
            </div>
            <p className="text-xs text-text-muted mb-2">{acc.description}</p>
            <Tag variant="default" size="sm">{acc.priceRange}</Tag>
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
            <p className="text-sm text-text-muted mb-4">{selected.description}</p>
            <div className="mb-3"><h4 className="text-xs font-semibold text-success mb-1">优点</h4><div className="flex flex-wrap gap-1">{selected.pros.map((p) => <Tag key={p} variant="success" size="sm">{p}</Tag>)}</div></div>
            <div className="mb-3"><h4 className="text-xs font-semibold text-danger mb-1">缺点</h4><div className="flex flex-wrap gap-1">{selected.cons.map((c) => <Tag key={c} variant="danger" size="sm">{c}</Tag>)}</div></div>
            <div className="mb-3"><h4 className="text-xs font-semibold text-info mb-1">最适合</h4><div className="flex flex-wrap gap-1">{selected.bestFor.map((b) => <Tag key={b} variant="info" size="sm">{b}</Tag>)}</div></div>
            <div className="flex gap-4 text-xs text-text-muted mb-3"><span>价格：{selected.priceRange}</span></div>
            <div className="bg-bg-card rounded-lg p-3 text-xs text-text-muted"><span className="font-semibold text-info">提示：</span>{selected.notes}</div>
          </div>
        </div>
      )}
    </div>
  )
}