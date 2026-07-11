import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Section, Card, Tag } from '@/components/ui'
import { useProjectStore } from '@/store/projectStore'

export default function ProjectHome() {
  const navigate = useNavigate()
  const { projects, addProject, deleteProject } = useProjectStore()
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<'book' | 'goods'>('book')

  const handleCreate = () => {
    if (!newName.trim()) return
    addProject({
      name: newName.trim(),
      type: newType,
      status: 'planning',
      createdAt: new Date().toISOString(),
    })
    setNewName('')
    setShowNew(false)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section
        title="项目管理"
        icon="💾"
        description="管理你的同人创作项目，从企划到完成的全程追踪"
      />

      {/* 子模块导航 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card hover onClick={() => navigate('/project')}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">项目管理</h3>
            <Tag variant="success" size="sm">已上线</Tag>
          </div>
          <p className="text-xs text-text-muted">创建/管理同人项目</p>
        </Card>
        <Card hover onClick={() => navigate('/project/board')}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">进度看板</h3>
            <Tag variant="success" size="sm">已上线</Tag>
          </div>
          <p className="text-xs text-text-muted">Kanban任务管理 · 12步标准流程</p>
        </Card>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowNew(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + 新建项目
        </button>
      </div>

      {showNew && (
        <Card className="mb-4">
          <h3 className="font-semibold text-sm mb-3">新建项目</h3>
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="项目名称"
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as 'book' | 'goods')}
              className="px-3 py-2 rounded-lg border border-border bg-bg text-sm"
            >
              <option value="book">书本</option>
              <option value="goods">周边</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
            >
              创建
            </button>
            <button
              onClick={() => setShowNew(false)}
              className="px-4 py-2 bg-bg-card border border-border rounded-lg text-sm"
            >
              取消
            </button>
          </div>
        </Card>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <p className="text-lg mb-2">还没有项目</p>
          <p className="text-sm">点击"+ 新建项目"开始你的第一个同人创作项目</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <Card key={proj.id}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">{proj.name}</h3>
                <div className="flex gap-1">
                  <Tag variant={proj.type === 'book' ? 'info' : 'warning'} size="sm">
                    {proj.type === 'book' ? '书本' : '周边'}
                  </Tag>
                  <Tag variant="default" size="sm">{proj.status}</Tag>
                </div>
              </div>
              <p className="text-xs text-text-muted">
                创建于 {new Date(proj.createdAt).toLocaleDateString('zh-CN')}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => deleteProject(proj.id)}
                  className="text-xs text-danger hover:underline"
                >
                  删除
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}