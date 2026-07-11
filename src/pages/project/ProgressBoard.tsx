import { useState } from 'react'
import { BackButton, Section, Card, Tag } from '@/components/ui'

interface Task {
  id: string
  projectId: string
  title: string
  status: 'todo' | 'doing' | 'done'
  priority: 'high' | 'medium' | 'low'
}

const initialTasks: Task[] = [
  { id: '1', projectId: '', title: '确定作品主题和内容', status: 'todo', priority: 'high' },
  { id: '2', projectId: '', title: '完成初稿/内页', status: 'todo', priority: 'high' },
  { id: '3', projectId: '', title: '封面设计', status: 'todo', priority: 'high' },
  { id: '4', projectId: '', title: '排版入稿', status: 'todo', priority: 'high' },
  { id: '5', projectId: '', title: '联系印刷厂询价', status: 'todo', priority: 'medium' },
  { id: '6', projectId: '', title: '周边设计', status: 'todo', priority: 'medium' },
  { id: '7', projectId: '', title: '周边下单生产', status: 'todo', priority: 'medium' },
  { id: '8', projectId: '', title: '宣发素材准备', status: 'todo', priority: 'medium' },
  { id: '9', projectId: '', title: '提交摊位申请', status: 'todo', priority: 'high' },
  { id: '10', projectId: '', title: '收货验收', status: 'todo', priority: 'high' },
  { id: '11', projectId: '', title: '展会当日准备', status: 'todo', priority: 'high' },
  { id: '12', projectId: '', title: '展后复盘总结', status: 'todo', priority: 'low' },
]

const statusLabels: Record<string, string> = { todo: '待开始', doing: '进行中', done: '已完成' }
const statusColors: Record<string, string> = { todo: 'bg-gray-50', doing: 'bg-blue-50', done: 'bg-green-50' }
const priorityLabels: Record<string, string> = { high: '高', medium: '中', low: '低' }

export default function ProgressBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [newTask, setNewTask] = useState('')
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium')

  const columns = ['todo', 'doing', 'done'] as const

  const moveTask = (taskId: string, newStatus: 'todo' | 'doing' | 'done') => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
  }

  const addTask = () => {
    if (!newTask.trim()) return
    const id = String(Date.now())
    setTasks((prev) => [...prev, { id, projectId: '', title: newTask.trim(), status: 'todo', priority: newPriority }])
    setNewTask('')
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const total = tasks.length
  const done = tasks.filter((t) => t.status === 'done').length
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/project" label="返回项目管理" />
      <Section title="进度看板" icon="📋" description="Kanban风格任务管理，拖拽进度一目了然" />

      {/* 进度条 */}
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">总体进度</span>
          <span className="text-xs text-text-muted">{done}/{total} 完成</span>
        </div>
        <div className="w-full bg-bg rounded-full h-3">
          <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </Card>

      {/* 添加任务 */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="添加新任务..."
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as 'high' | 'medium' | 'low')}
          className="px-3 py-2 rounded-lg border border-border bg-bg text-sm"
        >
          <option value="high">高优先级</option>
          <option value="medium">中优先级</option>
          <option value="low">低优先级</option>
        </select>
        <button onClick={addTask} className="px-4 py-2 bg-primary text-white rounded-lg text-sm">添加</button>
      </div>

      {/* 看板 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div key={col} className={`${statusColors[col]} rounded-xl p-4 min-h-[200px]`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">{statusLabels[col]}</h3>
              <Tag variant={col === 'done' ? 'success' : col === 'doing' ? 'info' : 'default'} size="sm">
                {tasks.filter((t) => t.status === col).length}
              </Tag>
            </div>
            <div className="space-y-2">
              {tasks.filter((t) => t.status === col).map((task) => (
                <div key={task.id} className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{task.title}</span>
                    <button onClick={() => deleteTask(task.id)} className="text-text-muted hover:text-danger text-xs">×</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'default'} size="sm">
                      {priorityLabels[task.priority]}
                    </Tag>
                    {col !== 'done' && (
                      <button
                        onClick={() => moveTask(task.id, col === 'todo' ? 'doing' : 'done')}
                        className="text-xs text-primary hover:underline"
                      >
                        {col === 'todo' ? '开始 →' : '完成 →'}
                      </button>
                    )}
                    {col === 'done' && (
                      <button
                        onClick={() => moveTask(task.id, 'todo')}
                        className="text-xs text-text-muted hover:underline"
                      >
                        重新开始
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}