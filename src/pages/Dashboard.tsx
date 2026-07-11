import { useNavigate } from 'react-router-dom'
import { Card, Tag } from '@/components/ui'
import { useProjectStore } from '@/store/projectStore'

const sections = [
  { to: '/book', icon: '📖', label: '书本制作', desc: '封面设计 · 排版 · 纸张 · 工艺 · 装订', count: 10, color: 'bg-blue-50 border-blue-200' },
  { to: '/goods', icon: '🎁', label: '周边制作', desc: '工艺百科 · 渲染器 · 选型 · 报价', count: 4, color: 'bg-pink-50 border-pink-200' },
  { to: '/promo', icon: '📢', label: '展会宣发', desc: '展会日历 · 摊位设计 · 宣发素材', count: 5, color: 'bg-amber-50 border-amber-200' },
  { to: '/cost', icon: '💰', label: '成本管理', desc: '成本估算 · 费用明细', count: 1, color: 'bg-green-50 border-green-200' },
  { to: '/factories', icon: '🏭', label: '厂家报价', desc: '厂家大全 · 报价对比 · 询价', count: 3, color: 'bg-purple-50 border-purple-200' },
  { to: '/market', icon: '📊', label: '市场行情', desc: '中日市场定价参考', count: 1, color: 'bg-orange-50 border-orange-200' },
  { to: '/guide', icon: '🔍', label: '选型指导', desc: '纸张 · 装订 · 工艺搭配', count: 3, color: 'bg-teal-50 border-teal-200' },
  { to: '/resources', icon: '📚', label: '资源中心', desc: '术语 · 色差 · 案例 · 工具链', count: 11, color: 'bg-indigo-50 border-indigo-200' },
  { to: '/project', icon: '💾', label: '项目管理', desc: '项目创建 · 进度看板', count: 2, color: 'bg-rose-50 border-rose-200' },
]

const quickLinks = [
  { to: '/book/cover', icon: '🎨', label: '封面设计器' },
  { to: '/book/3d', icon: '📐', label: '3D渲染' },
  { to: '/goods/renderer', icon: '✨', label: '周边渲染' },
  { to: '/promo/calendar', icon: '📅', label: '展会日历' },
  { to: '/cost', icon: '🧮', label: '成本估算' },
  { to: '/factories', icon: '🏭', label: '找厂家' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { projects } = useProjectStore()

  const totalModules = sections.reduce((sum, s) => sum + s.count, 0)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">漏洞乌托邦</h1>
        <p className="text-text-muted text-sm mt-1">Loophole Utopia — 从设计到印刷到展会，一站式同人创作管理</p>
      </div>

      {/* 快捷入口 */}
      <Card className="mb-6">
        <h3 className="font-semibold text-sm mb-3">快捷入口</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {quickLinks.map((link) => (
            <button
              key={link.to}
              onClick={() => navigate(link.to)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-bg-card border border-border hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="text-xs font-medium">{link.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="text-center">
          <p className="text-3xl font-bold text-primary">{totalModules}</p>
          <p className="text-xs text-text-muted">功能模块</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-info">{projects.length}</p>
          <p className="text-xs text-text-muted">进行中项目</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-success">35</p>
          <p className="text-xs text-text-muted">收录厂家</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-accent">10+</p>
          <p className="text-xs text-text-muted">展会信息</p>
        </Card>
      </div>

      {/* 板块导航 */}
      <h3 className="font-semibold text-sm mb-3">全部板块</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Card
            key={section.to}
            hover
            onClick={() => navigate(section.to)}
            className={`cursor-pointer border-2 ${section.color}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{section.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{section.label}</h3>
                  <Tag variant="default" size="sm">{section.count}模块</Tag>
                </div>
                <p className="text-xs text-text-muted mt-0.5">{section.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 text-center text-xs text-text-muted">
        v1.0.0 · 共 {totalModules} 个功能模块 · 9 大板块 · 构建于 Vite + React + TypeScript + Tailwind CSS
      </div>
    </div>
  )
}