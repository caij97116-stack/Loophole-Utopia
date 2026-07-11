import { useState } from 'react'
import { Section, Card, Tag } from '@/components/ui'
import { useProjectStore } from '@/store/projectStore'

export default function ExportPage() {
  const { projects } = useProjectStore()
  const [copied, setCopied] = useState(false)

  const exportData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    projects,
    stats: {
      totalProjects: projects.length,
      bookProjects: projects.filter((p) => p.type === 'book').length,
      goodsProjects: projects.filter((p) => p.type === 'goods').length,
    },
  }

  const jsonStr = JSON.stringify(exportData, null, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `doujin-workshop-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section title="快捷导出" icon="📤" description="导出项目数据、打印清单、备份到本地" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card hover onClick={handleDownload}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">💾</span>
            <div>
              <h3 className="font-semibold text-sm">导出 JSON</h3>
              <p className="text-xs text-text-muted">下载项目数据到本地备份</p>
            </div>
          </div>
        </Card>
        <Card hover onClick={handleCopy}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">📋</span>
            <div>
              <h3 className="font-semibold text-sm">{copied ? '已复制！' : '复制到剪贴板'}</h3>
              <p className="text-xs text-text-muted">复制 JSON 数据</p>
            </div>
          </div>
        </Card>
        <Card hover onClick={handlePrint}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🖨️</span>
            <div>
              <h3 className="font-semibold text-sm">打印页面</h3>
              <p className="text-xs text-text-muted">打印当前页面内容</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold text-sm mb-3">项目数据概览</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-bg-card rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-primary">{exportData.stats.totalProjects}</p>
            <p className="text-xs text-text-muted">总项目数</p>
          </div>
          <div className="bg-bg-card rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-info">{exportData.stats.bookProjects}</p>
            <p className="text-xs text-text-muted">书本项目</p>
          </div>
          <div className="bg-bg-card rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-accent">{exportData.stats.goodsProjects}</p>
            <p className="text-xs text-text-muted">周边项目</p>
          </div>
        </div>

        {projects.length > 0 ? (
          <div className="space-y-2">
            {projects.map((p) => (
              <div key={p.id} className="bg-bg-card rounded-lg p-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-text-muted ml-2">
                    {p.type === 'book' ? '书本' : '周边'} · {new Date(p.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <Tag variant={p.status === 'planning' ? 'default' : 'success'} size="sm">{p.status}</Tag>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-text-muted text-sm">
            暂无项目数据。前往「项目管理」创建你的第一个项目。
          </div>
        )}
      </Card>

      <div className="mt-4 bg-bg-card rounded-xl p-4 text-xs text-text-muted">
        <p className="font-semibold text-sm mb-2">数据说明</p>
        <ul className="list-disc list-inside space-y-1">
          <li>导出的 JSON 文件包含所有项目数据和统计信息</li>
          <li>可用于备份、迁移到其他设备、或分享给合作者</li>
          <li>数据存储在浏览器本地，清除浏览器数据会导致数据丢失</li>
          <li>建议定期导出备份，避免数据丢失</li>
        </ul>
      </div>
    </div>
  )
}