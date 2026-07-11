import { useNavigate } from 'react-router-dom'
import { Section, Card, Tag } from '@/components/ui'

const modules = [
  { name: '展会日历', desc: '10+中日同人展 × 摊位费 × 申请攻略', path: '/promo/calendar', available: true },
  { name: '摊位设计器', desc: '3种模板 × 可视化布局 × 物品清单', path: '/promo/booth', available: true },
  { name: '宣发素材库', desc: '6阶段宣发策略 × 平台推荐 × 参展清单', path: '/promo/materials', available: true },
  { name: '社交传播策略', desc: '各平台算法分析 × 话题标签', path: '/promo/social', available: true },
  { name: '宣发模板生成器', desc: '一键生成宣发文案模板', path: '/promo/generator', available: true },
]

export default function PromoHome() {
  const navigate = useNavigate()

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section
        title="展会宣发"
        icon="📢"
        description="展会日历、摊位设计、宣发策略、参展清单全流程"
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