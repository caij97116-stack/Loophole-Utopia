import { useNavigate } from 'react-router-dom'
import { Section, Card, Tag } from '@/components/ui'

const modules = [
  { name: '封面设计器', desc: '13判型 × 9设计手法 × 多语言字体', path: '/book/cover', available: true },
  { name: '内页排版助手', desc: '11手法 × 4预设 × 字数页数估算', path: '/book/layout', available: true },
  { name: '3D实机渲染', desc: '翻页动画 × 7种装订 × 工艺渲染', path: '/book/3d', available: true },
  { name: '纸张百科', desc: '封面20+种 · 内页15+种 · 选纸决策', path: '/book/paper', available: true },
  { name: '字体与字素', desc: '3000+可商用字体 · 字素素材', path: '/book/fonts', available: true },
  { name: '工艺库', desc: '100+种中日融合工艺', path: '/book/crafts', available: true },
  { name: '装订决策器', desc: '7种装订 × 自动推荐', path: '/book/binding', available: true },
  { name: '冲突检测器', desc: '装订×工艺×纸张×页数兼容检测', path: '/book/conflict', available: true },
  { name: '书本配件', desc: '书签8种材质 · 外封6种 · 扉页5种', path: '/book/accessories', available: true },
  { name: '装帧配件', desc: '腰封 · 包装 · 亚克力书盒', path: '/book/binding-acc', available: true },
]

export default function BookHome() {
  const navigate = useNavigate()

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section
        title="书本制作"
        icon="📖"
        description="封面设计、内页排版、纸张选择、装订工艺一站式工具"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod) => (
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
    </div>
  )
}