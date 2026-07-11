import { useNavigate } from 'react-router-dom'
import { Section, Card, Tag } from '@/components/ui'

const modules = [
  { name: '色差知识库', desc: 'CMYK vs RGB / 危险色预警 / 厂家色差表现', path: '/resources/color', available: true },
  { name: '常见翻车案例', desc: '20个真实翻车案例+原因+预防', path: '/resources/mistakes', available: true },
  { name: '版权合规指南', desc: '二次创作边界 / IP授权 / 字体商用', path: '/resources/copyright', available: true },
  { name: '试印/打样指南', desc: '各厂家试印对比 / 打样检查清单', path: '/resources/proof', available: true },
  { name: '纸张手感百科', desc: '实物感描述 / 类比推荐 / 纸样索取', path: '/resources/paper-feel', available: true },
  { name: '字体与字素资源', desc: '3000+可商用字体 / 字素素材', path: '/resources/fonts', available: true },
  { name: '同人术语辞典', desc: '70+条术语 / 中日英对照 / 含图解', path: '/resources/glossary', available: true },
  { name: '真实案例展示', desc: '真实同人本拆解+材质标注', path: '/resources/cases', available: true },
  { name: '入稿前检查清单', desc: '16项必查 / 交互式勾选', path: '/resources/checklist', available: true },
  { name: '新手入门全流程向导', desc: '企划→写稿→排版→封设→入稿→收货→售卖', path: '/resources/beginner', available: true },
  { name: '创作工具链', desc: '软件对比 / 学习资源 / 免费替代', path: '/resources/tools', available: true },
]

export default function ResourcesHome() {
  const navigate = useNavigate()

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section
        title="资源中心"
        icon="📚"
        description="色差知识、翻车案例、术语辞典、字体资源、版权指南等11个模块"
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