import { useNavigate } from 'react-router-dom'
import { Section, Card, Tag } from '@/components/ui'

const modules = [
  { name: '周边工艺百科', desc: '25+种工艺 × 5大品类 × 优缺点评价', path: '/goods/processes', available: true },
  { name: '周边渲染器', desc: '吧唧/亚克力/贴纸 × 形状×尺寸×材质', path: '/goods/renderer', available: true },
  { name: '周边选型助手', desc: '8种周边 × 价格/受众/题材分析', path: '/goods/selector', available: true },
  { name: '周边报价计算器', desc: '输入数量/规格自动估算成本', path: '/goods/calculator', available: true },
]

export default function GoodsHome() {
  const navigate = useNavigate()

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section
        title="周边制作"
        icon="🎁"
        description="吧唧、亚克力、贴纸、帆布包等周边全流程一站式管理"
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