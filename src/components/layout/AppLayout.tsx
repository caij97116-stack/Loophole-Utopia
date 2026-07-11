import { Suspense } from 'react'
import { Outlet, NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', icon: '🏠', label: '首页', exact: true },
  { to: '/book', icon: '📖', label: '书本制作' },
  { to: '/goods', icon: '🎁', label: '周边制作' },
  { to: '/promo', icon: '📢', label: '展会宣发' },
  { to: '/cost', icon: '💰', label: '成本管理' },
  { to: '/factories', icon: '🏭', label: '厂家报价' },
  { to: '/market', icon: '📊', label: '市场行情' },
  { to: '/guide', icon: '🔍', label: '选型指导' },
  { to: '/resources', icon: '📚', label: '资源中心' },
  { to: '/project', icon: '💾', label: '项目管理' },
  { to: '/export', icon: '📤', label: '快捷导出' },
]

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* 侧边栏 */}
      <aside className="w-56 bg-bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-5 border-b border-border">
          <NavLink to="/" className="flex items-center gap-2 no-underline">
            <span className="text-2xl">📚</span>
            <div>
              <h1 className="text-base font-bold text-text leading-tight">漏洞乌托邦</h1>
              <p className="text-xs text-text-muted">Loophole Utopia</p>
            </div>
          </NavLink>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }: { isActive: boolean }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors no-underline ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-text hover:bg-gray-100'
                    }`
                  }
                  end={item.exact}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-border text-xs text-text-muted">
          v1.0.0 · GitHub Pages + Vercel
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-y-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}