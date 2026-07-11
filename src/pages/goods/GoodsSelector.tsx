import { useState } from 'react'
import { Section, Card, Tag } from '@/components/ui'

interface GoodsType {
  name: string
  icon: string
  desc: string
  priceRange: string
  minOrder: string
  leadTime: string
  pros: string[]
  cons: string[]
  bestFor: string[]
  notFor: string[]
  tips: string
}

const goodsTypes: GoodsType[] = [
  {
    name: '吧唧/徽章',
    icon: '🔴',
    desc: '最经典的同人周边，圆形徽章，有底膜/覆膜多种工艺可选',
    priceRange: '1.5-5元/个',
    minOrder: '50个起',
    leadTime: '5-10天',
    pros: ['成本低，单价经济', '受众广，销量稳定', '工艺选择多，可玩性强', '易保存，不易损坏'],
    cons: ['尺寸受限，细节有限', '圆形居多，异形较少', '同质化严重，需差异化'],
    bestFor: ['首次出周边', '走量产品', '多角色系列', '吧唧交换文化'],
    notFor: ['需要精细展示插画细节', '大尺寸展示'],
    tips: '推荐58mm标准尺寸，磨砂膜质感最佳，镭射膜最吸睛',
  },
  {
    name: '亚克力立牌',
    icon: '💎',
    desc: '亚克力材质立牌/钥匙扣，通透感好，适合展示角色',
    priceRange: '10-30元/个',
    minOrder: '30个起',
    leadTime: '10-20天',
    pros: ['展示效果好，通透晶莹', '异形切割自由度高', '高级感强，适合高价', '钥匙扣形态实用'],
    cons: ['单价较高', '运输易划伤，需保护膜', '大尺寸易变形', '亚克力易氧化发黄'],
    bestFor: ['角色立绘展示', '限定款/高价周边', '粉丝收藏向'],
    notFor: ['预算极低', '需要大量走量'],
    tips: '建议2-3mm厚度，异形切割需留2mm出血线，宝石切割效果最佳但价格最高',
  },
  {
    name: '贴纸',
    icon: '🏷️',
    desc: 'PVC/PET贴纸，可贴在任何光滑表面，实用性强',
    priceRange: '0.5-2元/张',
    minOrder: '100张起',
    leadTime: '5-10天',
    pros: ['成本极低', '可批量制作多款', '实用性强，日常可贴', '适合无料赠送'],
    cons: ['单张价值低', 'PVC不环保', '易褪色（户外）', '易被复制盗版'],
    bestFor: ['无料配布', '多款套装', '低成本试水', '室内使用'],
    notFor: ['高价收藏', '户外长期使用'],
    tips: '推荐PET材质（环保+质感好），异形模切更有吸引力，套装打包更受欢迎',
  },
  {
    name: '明信片/贺卡',
    icon: '📮',
    desc: '纸质明信片或贺卡，成本低，适合插画展示',
    priceRange: '0.5-3元/张',
    minOrder: '100张起',
    leadTime: '3-7天',
    pros: ['成本极低', '印刷质量好', '适合插画展示', '可加烫金等工艺'],
    cons: ['产品形态单一', '易折损', '没有功能性', '竞争激烈'],
    bestFor: ['插画集碎片化销售', '贺图/节日主题', '无料配布'],
    notFor: ['需要功能性的周边', '需要立体展示'],
    tips: '推荐300g以上铜版纸，可加烫金/uv提升质感，建议做成套装而非单张',
  },
  {
    name: '帆布包/布袋',
    icon: '👜',
    desc: '帆布材质手提袋，实用性强，日常使用率高',
    priceRange: '15-40元/个',
    minOrder: '50个起',
    leadTime: '10-15天',
    pros: ['实用性强，日常使用', '展示面积大', '环保，符合潮流', '单价适中'],
    cons: ['印刷精度有限', '丝印颜色数受限', '库存占用空间大', '运输成本高'],
    bestFor: ['日常使用向', '展会限定', '实用型粉丝'],
    notFor: ['精细照片级印刷', '极小批量'],
    tips: '丝印单色最经济，多色按色加价，热转印细节更好但成本翻倍',
  },
  {
    name: '摇摇乐',
    icon: '🫧',
    desc: '双层亚克力内含闪粉/亮片，可摇动，互动性强',
    priceRange: '15-35元/个',
    minOrder: '50个起',
    leadTime: '10-18天',
    pros: ['互动性强，有趣', '视觉效果华丽', '差异化明显', '社交传播力强'],
    cons: ['制作工艺复杂', '单价较高', '可能会有漏液风险', '运输需防压'],
    bestFor: ['魔法/偶像题材', '限定款', '社交传播向'],
    notFor: ['第一次出周边', '需要透过看清图案'],
    tips: '填充物可选星形、心形、珠光粉等，建议加入防漏设计',
  },
  {
    name: '橡胶挂件',
    icon: '🧸',
    desc: '软橡胶材质立体挂件，手感柔软，适合Q版角色',
    priceRange: '8-20元/个',
    minOrder: '100个起',
    leadTime: '15-25天',
    pros: ['立体感强', '手感柔软可爱', '耐用不易坏', '适合钥匙扣'],
    cons: ['需要开模，模具费高', '颜色数越多越贵', '精细度有限', '起订量较高'],
    bestFor: ['Q版角色', '吉祥物', '有预算的长期项目'],
    notFor: ['精细写实风格', '首次试水', '预算有限'],
    tips: '模具费300-800元，建议控制6-8色以内，开模后可复用降低后续成本',
  },
  {
    name: '刺绣贴/徽章',
    icon: '🧵',
    desc: '刺绣工艺布贴，可缝制或熨烫到衣物上，手工感强',
    priceRange: '8-25元/个',
    minOrder: '50个起',
    leadTime: '15-20天',
    pros: ['质感独特，手工感', '实用性强（可熨烫）', '耐久性好', '高档感'],
    cons: ['不擅长渐变色彩', '精细度有限', '背面熨烫胶有寿命', '颜色数限制'],
    bestFor: ['军武/制服题材', '布艺周边', '衣物装饰', '高档周边'],
    notFor: ['渐变色彩设计', '照片级精细度', '极小面积'],
    tips: '建议控制6-8色以内，超过8色单价大幅上升，选择熨烫背胶更实用',
  },
]

export default function GoodsSelector() {
  const [selected, setSelected] = useState<GoodsType | null>(null)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section
        title="周边选型助手"
        icon="🎯"
        description="根据你的需求（题材、预算、受众），帮你选择最适合的周边类型"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goodsTypes.map((g) => (
          <Card
            key={g.name}
            hover
            onClick={() => setSelected(g)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{g.icon}</span>
              <h3 className="font-semibold text-sm">{g.name}</h3>
            </div>
            <p className="text-xs text-text-muted mb-2">{g.desc}</p>
            <div className="flex gap-2 text-xs">
              <Tag variant="default" size="sm">{g.priceRange}</Tag>
              <Tag variant="default" size="sm">{g.minOrder}</Tag>
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
              <h2 className="text-lg font-bold">
                <span className="text-2xl mr-2">{selected.icon}</span>
                {selected.name}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="text-text-muted hover:text-text text-xl leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-text-muted mb-4">{selected.desc}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-bg-card rounded-lg p-3">
                <span className="text-xs text-text-muted">价格区间</span>
                <p className="text-sm font-semibold">{selected.priceRange}</p>
              </div>
              <div className="bg-bg-card rounded-lg p-3">
                <span className="text-xs text-text-muted">起订/周期</span>
                <p className="text-sm font-semibold">{selected.minOrder} / {selected.leadTime}</p>
              </div>
            </div>

            <div className="mb-3">
              <h4 className="text-xs font-semibold text-success mb-1">优点</h4>
              <div className="flex flex-wrap gap-1">
                {selected.pros.map((p) => (
                  <Tag key={p} variant="success" size="sm">{p}</Tag>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <h4 className="text-xs font-semibold text-danger mb-1">缺点</h4>
              <div className="flex flex-wrap gap-1">
                {selected.cons.map((c) => (
                  <Tag key={c} variant="danger" size="sm">{c}</Tag>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <h4 className="text-xs font-semibold text-info mb-1">最适合</h4>
              <div className="flex flex-wrap gap-1">
                {selected.bestFor.map((b) => (
                  <Tag key={b} variant="info" size="sm">{b}</Tag>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <h4 className="text-xs font-semibold text-text-muted mb-1">不太适合</h4>
              <div className="flex flex-wrap gap-1">
                {selected.notFor.map((n) => (
                  <Tag key={n} variant="default" size="sm">{n}</Tag>
                ))}
              </div>
            </div>

            <div className="bg-bg-card rounded-lg p-3 text-xs text-text-muted">
              <span className="font-semibold text-info">选型建议：</span>
              {selected.tips}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}