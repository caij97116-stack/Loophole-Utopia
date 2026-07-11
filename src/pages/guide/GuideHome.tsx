import { useState } from 'react'
import { Section, Card } from '@/components/ui'

interface GuideItem {
  name: string
  icon: string
  desc: string
  content: { title: string; items: string[] }[]
}

const guides: GuideItem[] = [
  {
    name: '纸张选型指南',
    icon: '📄',
    desc: '根据你的本子类型、预算、风格，推荐最合适的纸张组合',
    content: [
      {
        title: '按本子类型推荐',
        items: [
          '漫画本 → 内页：100g道林（米白），封面：250g铜版纸覆哑膜',
          '插画本 → 内页：120g哑粉纸（全彩），封面：300g铜版纸覆亮膜',
          '小说本 → 内页：80g道林（米白），封面：250g铜版纸覆哑膜',
          '设定集 → 内页：120g铜版纸，封面：300g铜版纸+烫金',
        ],
      },
      {
        title: '按预算推荐',
        items: [
          '经济型 → 内页80g道林 + 封面200g铜版 + 骑马订',
          '标准型 → 内页100g道林 + 封面250g铜版覆膜 + 无线胶装',
          '精装型 → 内页120g哑粉 + 封面300g铜版 + 锁线胶装 + 工艺',
        ],
      },
      {
        title: '按风格推荐',
        items: [
          '文艺/复古 → 米白道林 + 牛皮纸封面 + 裸背线装',
          '清新/可爱 → 白色道林 + 白色铜版覆哑膜',
          '暗黑/酷 → 黑色纸 + 烫银/UV工艺',
          '日系 → 米白道林 + 250g铜版 + 日式右翻',
        ],
      },
    ],
  },
  {
    name: '装订选型指南',
    icon: '📖',
    desc: '根据页数、预算、使用场景，选择最合适的装订方式',
    content: [
      {
        title: '按页数推荐',
        items: [
          '16P以内 → 骑马订（最经济，完全平摊）',
          '16-64P → 骑马订/无线胶装（根据预算选择）',
          '64-200P → 无线胶装/锁线胶装（推荐锁线，可平摊）',
          '200P以上 → 锁线胶装/裸背线装（必须锁线，否则易散架）',
        ],
      },
      {
        title: '按场景推荐',
        items: [
          '试水/无料 → 骑马订（成本低，16P薄本）',
          '标准参展 → 无线胶装（性价比高，主流选择）',
          '精装收藏 → 锁线胶装+硬壳（高级感，适合高价本）',
          '文艺/艺术 → 裸背线装（可完全平摊，展示性强）',
        ],
      },
    ],
  },
  {
    name: '工艺搭配指南',
    icon: '✨',
    desc: '封面工艺×内页工艺×装订的黄金搭配方案',
    content: [
      {
        title: '经典搭配',
        items: [
          '基础款 → 覆哑膜封面 + 无线胶装 + 无额外工艺',
          '进阶款 → 覆哑膜+UV局部 + 锁线胶装 + 扉页硫酸纸',
          '高级款 → 烫金+覆膜 + 锁线胶装 + 书签丝带 + 环衬',
          '豪华款 → 烫金+UV+击凸 + 裸背线装 + 书签+腰封+函套',
        ],
      },
      {
        title: '风格搭配',
        items: [
          '古风 → 烫金/烫红金 + 米白道林 + 线装 + 宣纸扉页',
          '科幻 → 镭射烫金 + 白色铜版 + 无线胶装 + UV',
          '少女/可爱 → 星幻膜 + 粉色道林 + 无线胶装 + 心形书签',
          '暗黑/酷 → 烫银 + 黑色纸 + 裸背线装 + 黑底白字',
        ],
      },
      {
        title: '避坑提醒',
        items: [
          '骑马订不要做烫金（订书钉位置会压到烫金区域）',
          '覆哑膜+烫金要先烫金再覆膜，否则烫不上去',
          'UV和烫金不要重叠（会互相干扰）',
          '裸背线装不适合薄本（最少64P）',
        ],
      },
    ],
  },
]

export default function GuideHome() {
  const [selected, setSelected] = useState<GuideItem | null>(null)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section
        title="选型指导"
        icon="🔍"
        description="纸张、装订、工艺的选型搭配指南，帮你做出最佳决策"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {guides.map((guide) => (
          <Card
            key={guide.name}
            hover
            onClick={() => setSelected(guide)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{guide.icon}</span>
              <h3 className="font-semibold text-sm">{guide.name}</h3>
            </div>
            <p className="text-xs text-text-muted">{guide.desc}</p>
          </Card>
        ))}
      </div>

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
              <button onClick={() => setSelected(null)} className="text-text-muted hover:text-text text-xl leading-none">×</button>
            </div>
            <p className="text-sm text-text-muted mb-4">{selected.desc}</p>

            {selected.content.map((section) => (
              <div key={section.title} className="mb-4">
                <h3 className="text-sm font-semibold mb-2">{section.title}</h3>
                <div className="flex flex-col gap-1.5">
                  {section.items.map((item) => (
                    <div key={item} className="bg-bg-card rounded-lg p-2.5 text-xs text-text-muted">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}