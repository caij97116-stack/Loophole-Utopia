import { useState } from 'react'
import { Section, Card } from '@/components/ui'

const bindingsList = [
  { id: 'saddle-stitch', name: '骑马订', desc: '订书钉装订，适合64P以内薄本', color: '#94a3b8' },
  { id: 'perfect-binding', name: '无线胶装', desc: '胶水粘合，最常见平装', color: '#64748b' },
  { id: 'sewn-binding', name: '锁线胶装', desc: '缝线+胶装，结实可平摊', color: '#475569' },
  { id: 'hardcover', name: '精装', desc: '硬壳封面，最高级', color: '#334155' },
  { id: 'open-spine', name: '裸脊线装', desc: '书脊裸露，设计感强', color: '#78716c' },
  { id: 'thread-binding', name: '古线装', desc: '东方传统线装', color: '#92400e' },
  { id: 'butterfly-binding', name: '蝴蝶装', desc: '每页对折粘合，完全平摊', color: '#be185d' },
]

const processes = [
  { id: 'foil-gold', name: '烫金', color: '#d4a843' },
  { id: 'foil-silver', name: '烫银', color: '#b0b0b0' },
  { id: 'uv', name: '局部UV', color: '#60a5fa' },
  { id: 'emboss', name: '凹凸', color: '#a78bfa' },
  { id: 'hologram', name: '镭射', color: '#f472b6' },
]

export default function Book3DPreview() {
  const [binding, setBinding] = useState('perfect-binding')
  const [currentPage, setCurrentPage] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [activeProcess, setActiveProcess] = useState<string[]>([])
  const [coverColor, setCoverColor] = useState('#1e40af')
  const [paperColor, setPaperColor] = useState('#fef3c7')

  const toggleProcess = (id: string) => {
    setActiveProcess((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id])
  }

  const totalPages = 64
  const selectedBinding = bindingsList.find((b) => b.id === binding)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section title="3D实机渲染预览" icon="📖" description="封面展示 × 翻页动画 × 7种装订切换 × 工艺渲染 × 纸张质感预览" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧控制面板 */}
        <Card>
          <h3 className="font-semibold text-sm mb-4">参数设置</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-2">装订方式</label>
            <div className="space-y-1">
              {bindingsList.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBinding(b.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    binding === b.id ? 'bg-primary text-white' : 'bg-gray-100 text-text hover:bg-gray-200'
                  }`}
                >
                  <span className="w-3 h-3 rounded" style={{ backgroundColor: b.color }} />
                  <span className="text-left">{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-2">封面工艺</label>
            <div className="flex flex-wrap gap-1">
              {processes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggleProcess(p.id)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    activeProcess.includes(p.id) ? 'text-white' : 'bg-gray-100 text-text hover:bg-gray-200'
                  }`}
                  style={activeProcess.includes(p.id) ? { backgroundColor: p.color } : {}}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs text-text-muted mb-1">封面颜色</label>
              <input type="color" value={coverColor} onChange={(e) => setCoverColor(e.target.value)} className="w-full h-10 rounded border cursor-pointer" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">内页颜色</label>
              <input type="color" value={paperColor} onChange={(e) => setPaperColor(e.target.value)} className="w-full h-10 rounded border cursor-pointer" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-text-muted mb-1">翻页</label>
            <input type="range" min={0} max={totalPages} value={currentPage} onChange={(e) => setCurrentPage(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs text-text-muted">
              <span>封面</span>
              <span>{currentPage}P / {totalPages}P</span>
              <span>封底</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setIsOpen(!isOpen)} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white cursor-pointer">
              {isOpen ? '合上书本' : '翻开书本'}
            </button>
          </div>

          <div className="mt-4 text-xs text-text-muted">
            <p>当前：{selectedBinding?.name}</p>
            <p>{selectedBinding?.desc}</p>
          </div>
        </Card>

        {/* 中间：3D预览 */}
        <div className="lg:col-span-2">
          <Card className="h-full flex items-center justify-center min-h-[500px]">
            <div className="relative">
              {/* 书本3D示意 */}
              <div className="flex items-center">
                {/* 封底 */}
                <div
                  className="transition-all duration-500"
                  style={{
                    width: '140px',
                    height: '200px',
                    backgroundColor: coverColor,
                    borderRadius: '2px 4px 4px 2px',
                    boxShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                    transform: isOpen ? 'rotateY(-30deg) translateX(10px)' : 'none',
                    perspective: '800px',
                    position: 'relative',
                  }}
                >
                  {/* 书脊 */}
                  {binding !== 'saddle-stitch' && binding !== 'open-spine' && (
                    <div
                      className="absolute -left-3 top-0 bottom-0 flex items-center justify-center text-[8px] text-white/70"
                      style={{
                        width: '12px',
                        backgroundColor: binding === 'hardcover' ? '#1a1a1a' : '#333',
                        writingMode: 'vertical-rl',
                        letterSpacing: '2px',
                      }}
                    >
                      {binding === 'hardcover' ? '精装' : '书脊'}
                    </div>
                  )}
                  {/* 裸脊 */}
                  {binding === 'open-spine' && (
                    <div className="absolute -left-4 top-0 bottom-0 flex flex-col" style={{ width: '16px' }}>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex-1 flex items-center" style={{ borderBottom: '1px solid #ddd' }}>
                          <div className="w-full h-0.5 bg-gray-400" />
                        </div>
                      ))}
                    </div>
                  )}
                  {/* 封面工艺 */}
                  {activeProcess.includes('foil-gold') && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs text-yellow-400 font-bold" style={{ textShadow: '0 0 2px rgba(0,0,0,0.5)' }}>
                      书名
                    </div>
                  )}
                  {activeProcess.includes('uv') && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-400/50 rounded" />
                  )}
                  {activeProcess.includes('hologram') && (
                    <div className="absolute inset-0 rounded opacity-30" style={{ background: 'linear-gradient(45deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #ff6b6b)' }} />
                  )}
                </div>

                {/* 内页 */}
                {isOpen && (
                  <>
                    <div
                      className="transition-all duration-500"
                      style={{
                        width: '140px',
                        height: '200px',
                        backgroundColor: paperColor,
                        borderRadius: '4px 2px 2px 4px',
                        boxShadow: '-2px 2px 8px rgba(0,0,0,0.2)',
                        transform: 'rotateY(30deg) translateX(-10px)',
                        marginLeft: '-4px',
                      }}
                    >
                      {/* 内页文字示意 */}
                      <div className="p-4 text-[8px] leading-relaxed text-gray-400">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div key={i} className="h-1.5 bg-gray-300 rounded mb-1" style={{ width: `${70 + Math.random() * 30}%` }} />
                        ))}
                      </div>
                    </div>

                    {/* 右侧页面 */}
                    <div
                      className="transition-all duration-500"
                      style={{
                        width: '140px',
                        height: '200px',
                        backgroundColor: paperColor,
                        borderRadius: '2px 4px 4px 2px',
                        boxShadow: '2px 2px 8px rgba(0,0,0,0.2)',
                        transform: 'rotateY(-30deg) translateX(10px)',
                        marginLeft: '-4px',
                      }}
                    >
                      <div className="p-4 text-[8px] leading-relaxed text-gray-400">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div key={i} className="h-1.5 bg-gray-300 rounded mb-1" style={{ width: `${60 + Math.random() * 40}%` }} />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 页面厚度示意 */}
              {!isOpen && (
                <div className="flex justify-center mt-1">
                  <div
                    className="rounded-b"
                    style={{
                      width: '140px',
                      height: `${Math.min(binding === 'saddle-stitch' ? 4 : 8, totalPages / 8)}px`,
                      backgroundColor: '#f5f0e8',
                      borderTop: '1px solid #e0d8c8',
                    }}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}