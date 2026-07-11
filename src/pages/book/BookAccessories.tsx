import { useState } from 'react'
import { Section, Card, Tag } from '@/components/ui'

interface BookmarkType {
  id: string
  name: string
  material: string
  sizes: string[]
  processes: string[]
  priceLevel: string
  pros: string[]
  cons: string[]
}

interface CoverType {
  id: string
  name: string
  material: string
  description: string
  priceLevel: string
  pros: string[]
  cons: string[]
}

interface EndpaperType {
  id: string
  name: string
  description: string
  bestFor: string
}

const bookmarks: BookmarkType[] = [
  { id: 'b1', name: '金属蚀刻书签', material: '黄铜/不锈钢/锌合金', sizes: ['50×150mm', '40×120mm', '30×100mm'], processes: ['蚀刻镂空', '电镀', '填色', '流苏穿绳'], priceLevel: 'medium', pros: ['质感高级', '耐用', '可做镂空设计', '适合收藏'], cons: ['成本较高', '重量大', '需要开模'] },
  { id: 'b2', name: '木质激光雕刻书签', material: '榉木/胡桃木/黑胡桃木', sizes: ['50×150mm', '40×120mm'], processes: ['激光雕刻', '烫印', 'UV印刷'], priceLevel: 'medium', pros: ['自然质感', '独特木纹', '环保', '每件纹理独一无二'], cons: ['怕水', '颜色单一', '薄了易断'] },
  { id: 'b3', name: '亚克力书签', material: '透明/彩色亚克力', sizes: ['50×150mm', '异形定制'], processes: ['UV印刷', '白墨打底', '异形切割', '钻石抛光'], priceLevel: 'low', pros: ['透明剔透', '可异形', '色彩鲜艳', '价格低'], cons: ['易刮花', '质感不如金属', '太薄易断'] },
  { id: 'b4', name: '皮质磁吸书签', material: 'PU皮/真皮', sizes: ['对折式', '30×100mm'], processes: ['烫印', '压纹', '磁吸扣'], priceLevel: 'medium', pros: ['磁吸设计方便', '皮质高级感', '可加流苏', '实用性强'], cons: ['真皮成本高', '磁吸扣可能生锈'] },
  { id: 'b5', name: '纸质书签', material: '珠光纸/艺术纸/铜版纸', sizes: ['50×150mm', '40×120mm'], processes: ['彩色印刷', '覆膜', '烫金', '打孔穿绳'], priceLevel: 'low', pros: ['成本最低', '印刷效果好', '可批量', '适合做赠品'], cons: ['不耐用', '容易折损', '怕水'] },
  { id: 'b6', name: '珐琅工艺书签', material: '铜+珐琅', sizes: ['40×100mm', '异形'], processes: ['珐琅填色', '电镀金边', '高温烧制'], priceLevel: 'high', pros: ['色彩浓郁', '收藏级品质', '工艺感强'], cons: ['成本最高', '工期长', '需要专门工厂'] },
  { id: 'b7', name: '丝绸织锦书签', material: '丝绸', sizes: ['50×150mm'], processes: ['织锦', '烫金'], priceLevel: 'medium', pros: ['中式传统美感', '柔软', '独特'], cons: ['容易起毛', '可做的工厂少'] },
  { id: 'b8', name: '3D打印异形书签', material: '树脂/PLA', sizes: ['异形定制'], processes: ['3D打印', '上色', 'UV涂层'], priceLevel: 'medium', pros: ['零开模', '复杂造型', '个性化'], cons: ['表面可能不够光滑', '强度一般'] },
]

const covers: CoverType[] = [
  { id: 'c1', name: '珠光硫酸纸外封', material: '珠光硫酸纸 90-110g', description: '半透明珠光纸，透出内封图案的倒影效果。近年同人圈最热门外封材料。', priceLevel: 'medium', pros: ['半透明透光效果', '珠光闪烁', '高级感极强', '轻便'], cons: ['透光率有限', '深色内封效果最好', '浅色内封不明显'] },
  { id: 'c2', name: '普通硫酸纸外封', material: '硫酸纸 75-110g', description: '半透明柔光，简约设计之选。', priceLevel: 'low', pros: ['价格低', '半透明', '柔光效果'], cons: ['透光率高于珠光款', '无珠光效果'] },
  { id: 'c3', name: '布书衣', material: '棉布/帆布/Liberty印花', description: '可缝制书签带，手工感强。', priceLevel: 'medium', pros: ['手感好', '可缝制', '独特', '可水洗'], cons: ['手工制作耗时', '不适合批量'] },
  { id: 'c4', name: 'PVC透明书衣', material: 'PVC透明膜', description: '防水保护，UVカット。', priceLevel: 'low', pros: ['防水', '透明', '保护效果好', '便宜'], cons: ['塑料感', '环保性差'] },
  { id: 'c5', name: '杜邦纸书衣', material: '杜邦纸', description: '轻量防水，可手写可打印。', priceLevel: 'low', pros: ['轻量', '防水', '可手写', '环保'], cons: ['质感偏塑料', '不是所有人都喜欢'] },
  { id: 'c6', name: '纸质书衣', material: 'クラフト紙/包装纸', description: 'DIY手作感，可自由创作。', priceLevel: 'low', pros: ['成本极低', 'DIY', '个性化', '环保'], cons: ['不耐用', '需要手工'] },
]

const endpapers: EndpaperType[] = [
  { id: 'e1', name: '硫酸纸扉页', description: '半透明硫酸纸做扉页，翻开时朦胧透出下层内容，营造氛围感。', bestFor: '文艺风同人本、氛围感强的作品' },
  { id: 'e2', name: '珠光硫酸纸扉页', description: '闪光质感，高级感，配合外封做双层透光效果。', bestFor: '高端画集、特殊版本' },
  { id: 'e3', name: '彩色艺术纸扉页', description: '彩色/纹理/预印花纹，翻页的仪式感。', bestFor: '精装本环衬、追求质感的作品' },
  { id: 'e4', name: '胶片/透卡插页', description: '透明胶片叠加效果，创意插页。', bestFor: '创意设计、叠加效果' },
  { id: 'e5', name: '折页', description: '展开式大图，超出正常页面尺寸。', bestFor: '画集、需要展示大图的场景' },
]

const packaging = [
  { name: '自封袋（OPP）', desc: '透明光亮，最常用包装', price: '极低' },
  { name: '自封袋（CPP磨砂）', desc: '磨砂质感，高级感', price: '低' },
  { name: '亚克力书盒', desc: '透明展示盒，收藏级', price: '中' },
  { name: 'PVC函套', desc: '磨砂/透明，保护+展示', price: '中' },
  { name: '牛皮纸包装', desc: '环保手作感，无料本常用', price: '极低' },
]

const priceLabels: Record<string, string> = { low: '经济', medium: '中等', high: '较高', '极低': '极低', '低': '低', '中': '中' }
const priceColors: Record<string, string> = { low: 'success', medium: 'warning', high: 'danger', '极低': 'success', '低': 'success', '中': 'warning' }

export default function BookAccessories() {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'covers' | 'endpapers' | 'packaging'>('bookmarks')

  const tabs = [
    { key: 'bookmarks' as const, label: '书签 (8种材质)', icon: '🔖' },
    { key: 'covers' as const, label: '外封/书衣 (6种)', icon: '📔' },
    { key: 'endpapers' as const, label: '扉页/环衬 (5种)', icon: '🎨' },
    { key: 'packaging' as const, label: '包装方案 (5种)', icon: '📦' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section title="书本配件设计器" icon="🔖" description="书签8种材质 × 外封6种材质 × 扉页5种 × 包装5种" />

      <div className="flex flex-wrap gap-1 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === t.key ? 'bg-primary text-white' : 'bg-gray-100 text-text hover:bg-gray-200'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* 书签 */}
      {activeTab === 'bookmarks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map((b) => (
            <Card key={b.id}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm">{b.name}</h3>
                <Tag variant={priceColors[b.priceLevel] as 'success' | 'warning' | 'danger'} size="sm">{priceLabels[b.priceLevel]}</Tag>
              </div>
              <div className="text-xs text-text-muted space-y-1">
                <p><span className="font-medium">材质：</span>{b.material}</p>
                <p><span className="font-medium">尺寸：</span>{b.sizes.join(' / ')}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {b.processes.map((p) => <Tag key={p} variant="default" size="sm">{p}</Tag>)}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-50 rounded p-2">
                  <span className="text-success font-medium">优点</span>
                  <ul className="mt-1 space-y-0.5">
                    {b.pros.slice(0, 3).map((p, i) => <li key={i} className="text-text-muted">+ {p}</li>)}
                  </ul>
                </div>
                <div className="bg-red-50 rounded p-2">
                  <span className="text-danger font-medium">缺点</span>
                  <ul className="mt-1 space-y-0.5">
                    {b.cons.slice(0, 3).map((c, i) => <li key={i} className="text-text-muted">- {c}</li>)}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 外封/书衣 */}
      {activeTab === 'covers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {covers.map((c) => (
            <Card key={c.id}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm">{c.name}</h3>
                <Tag variant={priceColors[c.priceLevel] as 'success' | 'warning' | 'danger'} size="sm">{priceLabels[c.priceLevel]}</Tag>
              </div>
              <p className="text-xs text-text-muted mb-2">{c.material}</p>
              <p className="text-xs text-text-muted mb-3">{c.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-success font-medium">优点</span>
                  <ul className="mt-1 space-y-0.5">
                    {c.pros.slice(0, 3).map((p, i) => <li key={i} className="text-text-muted">+ {p}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="text-danger font-medium">缺点</span>
                  <ul className="mt-1 space-y-0.5">
                    {c.cons.slice(0, 3).map((co, i) => <li key={i} className="text-text-muted">- {co}</li>)}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 扉页 */}
      {activeTab === 'endpapers' && (
        <div className="space-y-3">
          {endpapers.map((e) => (
            <Card key={e.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{e.name}</h3>
                  <p className="text-xs text-text-muted mt-1">{e.description}</p>
                </div>
                <Tag variant="primary" size="sm">{e.bestFor}</Tag>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 包装 */}
      {activeTab === 'packaging' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packaging.map((p) => (
            <Card key={p.name}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{p.name}</h3>
                  <p className="text-xs text-text-muted mt-1">{p.desc}</p>
                </div>
                <Tag variant={priceColors[p.price] as 'success' | 'warning' | 'danger'} size="sm">{p.price}</Tag>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}