import { useState } from 'react'
import { Section, Card, Tag, Select, Button } from '@/components/ui'

const layoutStyles = [
  { value: 'center', label: '居中对齐', desc: '标题居中，传统排版' },
  { value: 'left', label: '左对齐', desc: '左对齐，阅读流畅' },
  { value: 'justify', label: '两端对齐', desc: '文字块整齐' },
  { value: 'asymmetric', label: '非对称', desc: '图文错落，现代感' },
  { value: 'grid', label: '网格排版', desc: '规整网格，画册常用' },
  { value: 'free', label: '自由排版', desc: '自由布局，创意感' },
  { value: 'parallax', label: '层叠排版', desc: '文字叠加图片，层次感' },
  { value: 'frame', label: '框架排版', desc: '用线框/边框组织内容' },
  { value: 'vertical', label: '竖排', desc: '日式竖排，传统感' },
  { value: 'column', label: '双栏排版', desc: '左右分栏，学术感' },
  { value: 'magazine', label: '杂志排版', desc: '杂志风格，多变活泼' },
]

const presets = [
  { value: 'text-only', label: '纯文字', icon: '📝', desc: '小说/散文/随笔，以文字为主' },
  { value: 'mixed', label: '文画混合', icon: '📖', desc: '文字+插图混合，绘本/轻小说' },
  { value: 'comic', label: '漫画', icon: '💬', desc: '漫画/条漫，以图为主' },
  { value: 'artbook', label: '画集', icon: '🖼️', desc: '画集/摄影集，以图为主' },
]

const fonts = [
  { value: 'siyuan-song', label: '思源宋体', desc: '正文最常用，可读性最佳' },
  { value: 'lxgw-wenkai', label: '霞鹜文楷', desc: '温柔手写风，适合文艺小说' },
  { value: 'alibaba', label: '阿里普惠体', desc: '现代无衬线，清晰易读' },
  { value: 'genwan-mincho', label: '源ノ明朝', desc: '日文小说正文标配' },
  { value: 'siyuan-black', label: '思源黑体', desc: '标题/对白/注释' },
  { value: 'noto-serif', label: 'Noto Serif', desc: '英文衬线正文' },
]

export default function LayoutAssistant() {
  const [preset, setPreset] = useState('mixed')
  const [style, setStyle] = useState('justify')
  const [bodyFont, setBodyFont] = useState('siyuan-song')
  const [titleFont, setTitleFont] = useState('siyuan-black')
  const [fontSize, setFontSize] = useState(10.5)
  const [lineHeight, setLineHeight] = useState(1.7)
  const [marginInner, setMarginInner] = useState(20)
  const [marginOuter, setMarginOuter] = useState(15)
  const [wordCount, setWordCount] = useState(50000)
  const [estimatedPages, setEstimatedPages] = useState(0)

  const calculatePages = () => {
    // 粗略估算：A5页面约600-800字/页
    const charsPerPage = Math.round(800 * (10.5 / fontSize))
    const pages = Math.ceil(wordCount / charsPerPage)
    setEstimatedPages(Math.ceil(pages / 4) * 4) // 调整为4的倍数
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section title="内页排版助手" icon="📐" description="11种排版手法 × 4种预设，字数页数估算，出血线自动标注" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：参数面板 */}
        <Card>
          <h3 className="font-semibold text-sm mb-4">排版参数</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-2">内容预设</label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPreset(p.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                    preset === p.value ? 'bg-primary text-white' : 'bg-gray-100 text-text hover:bg-gray-200'
                  }`}
                >
                  <span>{p.icon}</span>
                  <div>
                    <div className="text-xs">{p.label}</div>
                    <div className="text-[10px] opacity-70">{p.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-text mb-2">排版手法</label>
            <div className="grid grid-cols-3 gap-1">
              {layoutStyles.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    style === s.value ? 'bg-primary text-white' : 'bg-gray-100 text-text hover:bg-gray-200'
                  }`}
                  title={s.desc}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <Select label="正文字体" options={fonts.map((f) => ({ value: f.value, label: `${f.label} — ${f.desc}` }))} value={bodyFont} onChange={(e) => setBodyFont(e.target.value)} />

          <Select label="标题字体" options={fonts.map((f) => ({ value: f.value, label: `${f.label} — ${f.desc}` }))} value={titleFont} onChange={(e) => setTitleFont(e.target.value)} />

          <div className="grid grid-cols-2 gap-3">
            <div className="mb-3">
              <label className="block text-sm font-medium text-text mb-1">字号 (pt)</label>
              <input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} min={8} max={16} step={0.5} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm" />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-text mb-1">行距 (倍)</label>
              <input type="number" value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} min={1.2} max={2.5} step={0.1} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="mb-3">
              <label className="block text-sm font-medium text-text mb-1">内边距 (mm) 装订侧</label>
              <input type="number" value={marginInner} onChange={(e) => setMarginInner(Number(e.target.value))} min={10} max={40} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm" />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-text mb-1">外边距 (mm) 翻页侧</label>
              <input type="number" value={marginOuter} onChange={(e) => setMarginOuter(Number(e.target.value))} min={10} max={30} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm" />
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <h3 className="font-semibold text-sm mb-3">字数页数估算</h3>
            <div className="mb-3">
              <label className="block text-sm font-medium text-text mb-1">总字数</label>
              <input type="number" value={wordCount} onChange={(e) => setWordCount(Number(e.target.value))} min={1000} max={500000} step={1000} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm" />
            </div>
            <Button variant="secondary" size="sm" onClick={calculatePages}>估算页数</Button>
            {estimatedPages > 0 && (
              <div className="mt-3 p-3 bg-primary/5 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">预估页数</span>
                  <span className="text-xl font-bold text-primary">{estimatedPages}P</span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  约 {estimatedPages / 4} 张纸（折手），排版时注意页数需为4的倍数
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* 右侧：预览 */}
        <Card>
          <h3 className="font-semibold text-sm mb-4">页面预览</h3>
          <div className="flex items-center justify-center">
            <div className="border-2 border-gray-400 bg-white shadow-lg relative" style={{ width: '200px', height: '280px' }}>
              {/* 出血线 */}
              <div className="absolute inset-0 border-2 border-dashed border-danger/50" style={{ margin: '3px' }}>
                <span className="absolute -top-4 left-0 text-[9px] text-danger/70">出血线 3mm</span>
              </div>
              {/* 安全区 */}
              <div className="absolute border border-info/30" style={{ inset: '8px' }}>
                <span className="absolute -top-3 right-0 text-[9px] text-info/70">安全区</span>
              </div>
              {/* 页面内容 */}
              <div className="absolute inset-0 flex" style={{ padding: `${marginOuter}px ${marginInner}px ${marginOuter}px ${marginInner}px` }}>
                <div className="flex-1 flex flex-col" style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}>
                  {/* 标题 */}
                  <div className="text-center font-bold mb-2" style={{ fontSize: `${fontSize * 1.5}px` }}>
                    第一章
                  </div>
                  {/* 正文示意 */}
                  <div className="text-justify flex-1 overflow-hidden">
                    <p className="mb-2" style={{ lineHeight: lineHeight }}>
                      正文文字示例，这是排版的预览效果。文字大小{fontSize}pt，行距{lineHeight}倍。
                    </p>
                    <p className="mb-2" style={{ lineHeight: lineHeight }}>
                      内边距{marginInner}mm（装订侧），外边距{marginOuter}mm（翻页侧）。注意装订侧要留出足够空间以防装订后文字被遮挡。
                    </p>
                    {/* 插图示意 */}
                    {preset !== 'text-only' && (
                      <div className="w-full h-12 bg-gradient-to-r from-primary/20 to-accent/20 rounded flex items-center justify-center my-2">
                        <span className="text-[8px] opacity-40">[插图/漫画区域]</span>
                      </div>
                    )}
                    {/* 双栏示意 */}
                    {style === 'column' && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-[8px]">左栏文字内容示例，双栏排版的左右栏文字。</div>
                        <div className="text-[8px]">右栏文字内容示例，双栏排版的右栏文字，中间有分隔。</div>
                      </div>
                    )}
                    {/* 页码 */}
                    <div className="text-center mt-auto pt-2 text-[8px] opacity-40">— 1 —</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4 space-y-1">
            <div className="flex flex-wrap justify-center gap-1">
              <Tag variant="default" size="sm">预设：{presets.find((p) => p.value === preset)?.label}</Tag>
              <Tag variant="primary" size="sm">排版：{layoutStyles.find((s) => s.value === style)?.label}</Tag>
              <Tag variant="success" size="sm">{fontSize}pt</Tag>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}