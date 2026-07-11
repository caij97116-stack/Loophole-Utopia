import { useState } from 'react'
import { BackButton, Section, Card, Tag, Select } from '@/components/ui'
import { bindings } from '@/data/bindings'
import { papers } from '@/data/papers'

interface Conflict {
  type: 'danger' | 'warning' | 'info'
  message: string
  suggestion: string
}

// 冲突规则
const conflictRules: { binding: string; paper: string; process: string; type: Conflict['type']; message: string; suggestion: string }[] = [
  // 骑马订 × 厚纸
  { binding: 'saddle-stitch', paper: '', process: '', type: 'danger', message: '骑马订无法使用厚封面纸（>250g），订书钉订不透且会翘起。', suggestion: '改用无线胶装，或换用200g以下封面纸。' },
  // 骑马订 × 页数多
  { binding: 'saddle-stitch', paper: '', process: '', type: 'danger', message: '骑马订最多64P，超过这个页数无法装订。', suggestion: '改用无线胶装或锁线胶装。' },
  // 无线胶装 × 厚本
  { binding: 'perfect-binding', paper: '', process: '', type: 'warning', message: '无线胶装超过400P容易脱胶，翻阅次数多会开裂。', suggestion: '建议改用锁线胶装。如果必须胶装，选择口碑好的印刷厂。' },
  // 烫金 × 覆膜
  { binding: '', paper: '', process: 'hot-foil-gold', type: 'warning', message: '烫金必须在覆膜之前进行，覆膜后无法烫金。', suggestion: '先烫金再覆膜，或选择不覆膜。' },
  // 烫金 × 细线
  { binding: '', paper: '', process: 'hot-foil-gold', type: 'warning', message: '烫金线条宽度至少0.5mm，细线容易断裂。', suggestion: '设计中烫金线条加粗到0.5mm以上。' },
  // 深色皮纹纸 × 烫黑金
  { binding: '', paper: 'leather-texture', process: 'hot-foil-gold', type: 'info', message: '深色皮纹纸烫金效果好，但深色底烫黑金效果不明显。', suggestion: '深色底用烫金/烫银，不要用烫黑金。' },
  // 珠光纸 × UV
  { binding: '', paper: 'pearl', process: 'spot-uv', type: 'info', message: '珠光纸表面光滑，UV附着力可能不如普通纸。', suggestion: '先打样测试UV附着力。' },
  // 牛皮纸 × 彩色印刷
  { binding: '', paper: 'kraft', process: '', type: 'warning', message: '牛皮纸底色为棕色，彩色印刷会发生色偏，所有颜色都会偏棕。', suggestion: '牛皮纸适合单色/双色印刷，不适合全彩封面。' },
  // 硫酸纸 × 大面积印刷
  { binding: '', paper: 'sulfuric-acid', process: '', type: 'warning', message: '硫酸纸是半透明的，大面积深色印刷会透到背面。', suggestion: '硫酸纸适合局部印刷，大面积颜色建议用不透明纸。' },
  // 精装 × 骑马订
  { binding: 'saddle-stitch', paper: '', process: '', type: 'danger', message: '骑马订无法做精装，精装需要锁线胶装。', suggestion: '如果要精装，必须用锁线胶装。' },
  // 古线装 × 厚纸
  { binding: 'thread-binding', paper: '', process: '', type: 'warning', message: '古线装需要穿线，厚纸（>200g）穿线困难。', suggestion: '用薄纸或改用其他装订方式。' },
  // 裸脊线装 × 书脊印刷
  { binding: 'open-spine', paper: '', process: '', type: 'info', message: '裸脊线装书脊裸露，无法印刷书名。', suggestion: '配外封/书衣印刷书名，或在封面设计上做文章。' },
  // 字典纸 × 双面深色印刷
  { binding: '', paper: 'bible-paper', process: '', type: 'warning', message: '字典纸极薄（30-40g），双面深色印刷会透到对面。', suggestion: '使用浅色设计，或换用更厚的纸。' },
  // 轻质纸 × 锁线胶装
  { binding: 'sewn-binding', paper: 'lightweight', process: '', type: 'info', message: '轻质纸做锁线胶装要注意，蓬松纸面可能导致书脊计算偏差。', suggestion: '先确认纸张厚度，精确计算书脊宽度。' },
  // 蝴蝶装 × 大量文字
  { binding: 'butterfly-binding', paper: '', process: '', type: 'info', message: '蝴蝶装每页对折粘合，每页厚度翻倍，大量文字不适合。', suggestion: '蝴蝶装适合画集/跨页大图，文字本用其他装订。' },
  // 覆膜 × 凹凸压印
  { binding: '', paper: '', process: 'emboss', type: 'warning', message: '凹凸压印在覆膜上效果不如裸纸，膜会缓冲凹凸深度。', suggestion: '先凹凸压印再覆膜，或选择不覆膜。' },
  // 骑马订 × 横跨页
  { binding: 'saddle-stitch', paper: '', process: '', type: 'warning', message: '骑马订虽然可以平摊，但订书钉位置会吃掉横跨页的一部分。', suggestion: '横跨页大图设计时，避开订书钉位置。' },
  // 皮革封面 × 烫金双色
  { binding: '', paper: 'leather-texture', process: 'hot-foil-gold', type: 'info', message: '皮纹纸纹理凹凸，烫金可能陷入纹理中，大面积烫金效果不如光滑纸。', suggestion: '皮纹纸适合局部烫金，大面积烫金建议用光滑纸。' },
  // 珠光硫酸纸 × 深色内封
  { binding: '', paper: 'pearl-sulfuric', process: '', type: 'info', message: '珠光硫酸纸半透明，内封图案如果是深色，透光效果最好。浅色内封透过硫酸纸不明显。', suggestion: '内封用深色/高对比度设计，配合硫酸纸透光效果。' },
  // 胶装 × 厚纸内页
  { binding: 'perfect-binding', paper: '', process: '', type: 'warning', message: '无线胶装内页纸超过157g可能导致胶装不牢固。', suggestion: '内页纸控制在157g以下，或改用锁线胶装。' },
]

export default function ConflictDetector() {
  const [selectedBinding, setSelectedBinding] = useState('')
  const [selectedPaper, setSelectedPaper] = useState('')
  const [selectedProcess, setSelectedProcess] = useState('')
  const [conflicts, setConflicts] = useState<Conflict[]>([])

  const checkConflicts = () => {
    const results: Conflict[] = []
    for (const rule of conflictRules) {
      const matchBinding = !rule.binding || rule.binding === selectedBinding
      const matchPaper = !rule.paper || rule.paper === selectedPaper
      const matchProcess = !rule.process || rule.process === selectedProcess

      if (matchBinding && matchPaper && matchProcess) {
        results.push({ type: rule.type, message: rule.message, suggestion: rule.suggestion })
      }
    }
    setConflicts(results)
  }

  const bindingOptions = [{ value: '', label: '未选择' }, ...bindings.map((b) => ({ value: b.id, label: b.name }))]
  const paperOptions = [{ value: '', label: '未选择' }, ...papers.filter((p) => p.category === 'cover').map((p) => ({ value: p.id, label: p.name }))]
  const processOptions = [
    { value: '', label: '未选择' },
    { value: 'hot-foil-gold', label: '烫金' },
    { value: 'hot-foil-silver', label: '烫银' },
    { value: 'spot-uv', label: '局部UV' },
    { value: 'emboss', label: '凹凸压印' },
    { value: 'lamination-gloss', label: '亮膜覆膜' },
    { value: 'lamination-matte', label: '哑膜覆膜' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/book" label="返回书本制作" />
      <Section title="智能冲突检测器" icon="🔍" description="装订 × 工艺 × 纸张 × 页数四维兼容性检测，防翻车利器" />

      <Card className="mb-6">
        <h3 className="font-semibold text-sm mb-4">选择你的设计方案</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select label="装订方式" options={bindingOptions} value={selectedBinding} onChange={(e) => setSelectedBinding(e.target.value)} />
          <Select label="封面纸张" options={paperOptions} value={selectedPaper} onChange={(e) => setSelectedPaper(e.target.value)} />
          <Select label="封面工艺" options={processOptions} value={selectedProcess} onChange={(e) => setSelectedProcess(e.target.value)} />
        </div>
        <button
          onClick={checkConflicts}
          className="mt-4 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-primary-dark transition-colors"
        >
          检测冲突
        </button>
      </Card>

      {conflicts.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">
            检测到 {conflicts.length} 个问题
            {conflicts.filter((c) => c.type === 'danger').length > 0 && (
              <span className="text-danger ml-2">{conflicts.filter((c) => c.type === 'danger').length} 个严重</span>
            )}
          </h3>
          {conflicts.map((c, i) => (
            <Card key={i} className={c.type === 'danger' ? 'border-danger/30 bg-red-50/50' : c.type === 'warning' ? 'border-amber-200 bg-amber-50/50' : 'border-blue-200 bg-blue-50/50'}>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">
                  {c.type === 'danger' ? '🚫' : c.type === 'warning' ? '⚠️' : 'ℹ️'}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag variant={c.type === 'danger' ? 'danger' : c.type === 'warning' ? 'warning' : 'primary'} size="sm">
                      {c.type === 'danger' ? '严重冲突' : c.type === 'warning' ? '注意事项' : '温馨提示'}
                    </Tag>
                  </div>
                  <p className="text-sm font-medium mb-1">{c.message}</p>
                  <p className="text-sm text-text-muted">
                    <span className="text-success font-medium">建议：</span>{c.suggestion}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {conflicts.length === 0 && selectedBinding && (
        <Card className="text-center py-8">
          <span className="text-4xl mb-2 block">✅</span>
          <p className="text-sm font-medium text-success">未检测到冲突！</p>
          <p className="text-xs text-text-muted mt-1">当前选择的装订、纸张、工艺组合兼容</p>
        </Card>
      )}
    </div>
  )
}