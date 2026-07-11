import { useState } from 'react'
import { BackButton, Section, Card, Tag } from '@/components/ui'

interface CheckItem {
  id: string
  category: string
  title: string
  description: string
  fix: string
}

const checklist: CheckItem[] = [
  { id: 'c1', category: '分辨率', title: '分辨率是否300DPI？', description: '封面和彩色内页至少300DPI，黑白内页600DPI。低于300必然模糊。', fix: '在PS中：图像→图像大小，检查分辨率。如果不够，需要重新扫描或重新绘制。' },
  { id: 'c2', category: '色彩模式', title: '色彩模式是否CMYK？', description: '屏幕RGB vs 印刷CMYK，RGB直接印刷会导致严重色差。', fix: '在PS中：图像→模式→CMYK颜色。注意转换后颜色可能变暗，需要调整。' },
  { id: 'c3', category: '出血', title: '是否留了3mm出血线？', description: '裁切误差±1-2mm，没有出血会露出白边。', fix: '在排版软件中设置出血线3mm。所有延伸到边缘的图案/背景都要超出裁切线3mm。' },
  { id: 'c4', category: '安全区', title: '重要内容是否在安全区内？', description: '文字/页码/人脸等不要放在距离边缘5mm以内。', fix: '设置安全区参考线（距边缘5mm），确保所有文字和重要元素在安全区内。' },
  { id: 'c5', category: '字体', title: '文字是否全部转曲？', description: '不转曲会导致印刷厂打开文件时字体丢失/变形。', fix: '在AI/InDesign中：文字→创建轮廓。PDF导出时勾选"嵌入所有字体"。' },
  { id: 'c6', category: '页数', title: '页数是否是4的倍数？', description: '印刷是按折手（4P或8P）排版的，页数不是4的倍数会导致空白页或印刷问题。', fix: '检查总页数是否是4的倍数。如果不是，增加空白页或调整内容。' },
  { id: 'c7', category: '文件格式', title: '文件格式是否正确？', description: '推荐PDF格式入稿。JPG/PNG可能导致压缩损失。', fix: '导出为PDF/X-1a或PDF/X-4格式，这是印刷行业标准。' },
  { id: 'c8', category: '色标', title: '是否保留了色标和裁切线？', description: '色标和裁切线是印刷厂校准的重要参考。', fix: '导出PDF时保留裁切标记和色标。不要手动删除它们。' },
  { id: 'c9', category: '总墨量', title: '总墨量是否超过300%？', description: 'CMYK四色总覆盖超过300%会导致纸张变形、干燥慢、背面蹭脏。', fix: '在PS中检查总墨量（窗口→信息→CMYK值相加）。超过300%的区域需要降低墨量。' },
  { id: 'c10', category: '书脊', title: '书脊宽度是否正确？', description: '书脊宽度 = 页数 × 纸张厚度 ÷ 2。计算错误会导致书脊文字偏移。', fix: '先确认纸张厚度（千分尺测量），再精确计算书脊宽度。不确定时多留0.5mm余量。' },
  { id: 'c11', category: '跨页', title: '跨页大图是否考虑了装订线？', description: '胶装/精装会吃掉中间2-5mm，重要内容不要放在装订缝处。', fix: '跨页设计时在中间留出至少5mm的安全区。把人物/文字放在左右两侧。' },
  { id: 'c12', category: '格式', title: 'PDF是否包含所有页面？', description: '入稿前逐页检查PDF，确保所有页面都包含在内，没有遗漏。', fix: '用Acrobat打开PDF，逐页翻看。检查顺序、页码、空白页是否符合预期。' },
  { id: 'c13', category: '颜色', title: '是否有危险色需要注意？', description: '深蓝/紫色/枣红/荧光色/浅肤色等高风险颜色，印刷效果可能与预期不同。', fix: '参考色差知识库的危险色预警。关键颜色要求印刷厂打样确认。' },
  { id: 'c14', category: '工艺', title: '工艺文件和印刷文件是否分开？', description: '烫金/UV/凹凸等工艺需要单独的工艺文件（矢量图），不能和印刷文件混在一起。', fix: '工艺部分单独导出为矢量文件（AI/EPS），标注工艺类型和颜色。' },
  { id: 'c15', category: '命名', title: '文件命名是否清晰？', description: '混乱的文件名会让印刷厂搞错文件。', fix: '文件命名规范：作品名_封面/内页_日期.pdf。例如：星空物语_封面_20250701.pdf' },
  { id: 'c16', category: '备份', title: '是否备份了源文件？', description: '入稿后修改需要源文件，转曲后无法编辑文字。', fix: '保存两份：一份转曲后的PDF（入稿用），一份未转曲的源文件（修改用）。' },
]

export default function ChecklistPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    const next = new Set(checked)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setChecked(next)
  }

  const progress = Math.round((checked.size / checklist.length) * 100)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/resources" label="返回资源中心" />
      <Section title="入稿前文件检查清单" icon="✅" description="16项入稿前必查项，逐项勾选确保不翻车" />

      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold">完成进度</span>
            <span className="text-2xl font-bold text-primary ml-2">{progress}%</span>
          </div>
          <div className="flex-1 mx-6 bg-gray-200 rounded-full h-3">
            <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm text-text-muted">{checked.size}/{checklist.length}</span>
        </div>
      </Card>

      <div className="space-y-2">
        {checklist.map((item) => (
          <div
            key={item.id}
            onClick={() => toggle(item.id)}
            className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
              checked.has(item.id)
                ? 'bg-green-50 border-green-200'
                : 'bg-bg-card border-border hover:bg-gray-50'
            }`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
              checked.has(item.id) ? 'bg-success border-success text-white' : 'border-gray-300'
            }`}>
              {checked.has(item.id) && '✓'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`text-sm font-semibold ${checked.has(item.id) ? 'text-green-700 line-through' : ''}`}>{item.title}</h3>
                <Tag variant="default" size="sm">{item.category}</Tag>
              </div>
              <p className="text-xs text-text-muted">{item.description}</p>
              <details className="mt-2">
                <summary className="text-xs text-primary cursor-pointer">修正方法</summary>
                <p className="text-xs text-text-muted mt-1">{item.fix}</p>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}