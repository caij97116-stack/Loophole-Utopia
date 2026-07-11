import { useState, useRef } from 'react'
import mammoth from 'mammoth'
import { BackButton, Section, Card, Tag, Select, Button } from '@/components/ui'
import { allFonts, zisuLibrary, getFontStyle } from '@/data/fonts'

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

export default function LayoutAssistant() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewScrollRef = useRef<HTMLDivElement>(null)

  const [preset, setPreset] = useState('mixed')
  const [style, setStyle] = useState('justify')
  const [bodyFont, setBodyFont] = useState('siyuan-serif')
  const [titleFont, setTitleFont] = useState('siyuan-sans')
  const [fontSize, setFontSize] = useState(10.5)
  const [lineHeight, setLineHeight] = useState(1.7)
  const [marginInner, setMarginInner] = useState(20)
  const [marginOuter, setMarginOuter] = useState(15)
  const [wordCount, setWordCount] = useState(50000)
  const [estimatedPages, setEstimatedPages] = useState(0)

  const [uploadedText, setUploadedText] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [chapterZisu, setChapterZisu] = useState('')
  const [pageNumZisu, setPageNumZisu] = useState('')

  const bodyFontStyle = getFontStyle(bodyFont)
  const titleFontStyle = getFontStyle(titleFont)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedFileName(file.name)
    try {
      if (file.name.endsWith('.txt')) {
        const text = await file.text()
        setUploadedText(text)
      } else if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        setUploadedText(result.value)
      } else {
        setUploadedText('')
        setUploadedFileName('')
      }
    } catch {
      setUploadedText('')
      setUploadedFileName('')
    }
  }

  const calculatePages = () => {
    const charsPerPage = Math.round(800 * (10.5 / fontSize))
    const pages = Math.ceil(wordCount / charsPerPage)
    setEstimatedPages(Math.ceil(pages / 4) * 4)
  }

  const previewLines = (() => {
    const text = uploadedText || '正文文字示例，这是排版的预览效果。文字大小' + fontSize + 'pt，行距' + lineHeight + '倍。内边距' + marginInner + 'mm（装订侧），外边距' + marginOuter + 'mm（翻页侧）。注意装订侧要留出足够空间以防装订后文字被遮挡。'
    const paragraphs = text.split(/\n+/).filter(Boolean)
    return paragraphs
  })()

  const selectedChapterZisu = zisuLibrary.find((z) => z.id === chapterZisu)
  const selectedPageNumZisu = zisuLibrary.find((z) => z.id === pageNumZisu)

  const textAlignClass = (() => {
    switch (style) {
      case 'center': return 'text-center'
      case 'left': return 'text-left'
      case 'justify': return 'text-justify'
      default: return 'text-justify'
    }
  })()

  const handleClearFile = () => {
    setUploadedText('')
    setUploadedFileName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/book" label="返回书本制作" />
      <Section title="内页排版助手" icon="📐" description="11种排版手法 × 4种预设，字数页数估算，出血线自动标注，支持上传文档实时预览" />

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

          <Select
            label="正文字体"
            options={allFonts.map((f) => ({ value: f.id, label: `${f.name} — ${f.description}` }))}
            value={bodyFont}
            onChange={(e) => setBodyFont(e.target.value)}
          />

          <Select
            label="标题字体"
            options={allFonts.map((f) => ({ value: f.id, label: `${f.name} — ${f.description}` }))}
            value={titleFont}
            onChange={(e) => setTitleFont(e.target.value)}
          />

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

          {/* 字素装饰 */}
          <div className="border-t border-border pt-4 mt-4">
            <h3 className="font-semibold text-sm mb-3">字素装饰</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="mb-3">
                <label className="block text-sm font-medium text-text mb-1">章节标题装饰</label>
                <select
                  value={chapterZisu}
                  onChange={(e) => setChapterZisu(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                >
                  <option value="">无装饰</option>
                  {zisuLibrary.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.chars.split(' ').slice(0, 2).join(' ')})
                    </option>
                  ))}
                </select>
                {selectedChapterZisu && (
                  <p className="text-[10px] text-text-muted mt-1">{selectedChapterZisu.usage}</p>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-text mb-1">页码装饰</label>
                <select
                  value={pageNumZisu}
                  onChange={(e) => setPageNumZisu(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                >
                  <option value="">无装饰</option>
                  {zisuLibrary.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.chars.split(' ').slice(0, 2).join(' ')})
                    </option>
                  ))}
                </select>
                {selectedPageNumZisu && (
                  <p className="text-[10px] text-text-muted mt-1">{selectedPageNumZisu.usage}</p>
                )}
              </div>
            </div>
          </div>

          {/* 文档上传 */}
          <div className="border-t border-border pt-4 mt-4">
            <h3 className="font-semibold text-sm mb-3">文档上传</h3>
            <div className="mb-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.docx"
                onChange={handleFileUpload}
                className="w-full text-sm text-text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer file:transition-colors"
              />
              <p className="text-[10px] text-text-muted mt-1">支持 .txt 和 .docx 格式</p>
            </div>
            {uploadedFileName && (
              <div className="flex items-center justify-between p-2 bg-primary/5 rounded-lg">
                <span className="text-xs text-text truncate flex-1">📄 {uploadedFileName}</span>
                <button
                  onClick={handleClearFile}
                  className="text-xs text-danger hover:text-danger/80 ml-2 cursor-pointer flex-shrink-0"
                  title="清除文件"
                >
                  ✕ 清除
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <h3 className="font-semibold text-sm mb-3">字数页数估算</h3>
            <div className="mb-3">
              <label className="block text-sm font-medium text-text mb-1">总字数</label>
              <input type="number" value={wordCount} onChange={(e) => setWordCount(Number(e.target.value))} min={1000} max={500000} step={1000} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm" />
              {uploadedText && (
                <p className="text-[10px] text-text-muted mt-1">
                  文档实际字数：{uploadedText.replace(/\s/g, '').length} 字
                  <button
                    onClick={() => setWordCount(uploadedText.replace(/\s/g, '').length)}
                    className="ml-2 text-primary hover:underline cursor-pointer"
                  >
                    填入
                  </button>
                </p>
              )}
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
            <div className="border-2 border-gray-400 bg-white shadow-lg relative" style={{ width: '220px', height: '320px' }}>
              {/* 出血线 */}
              <div className="absolute inset-0 border-2 border-dashed border-danger/50" style={{ margin: '3px' }}>
                <span className="absolute -top-4 left-0 text-[9px] text-danger/70">出血线 3mm</span>
              </div>
              {/* 安全区 */}
              <div className="absolute border border-info/30" style={{ inset: '8px' }}>
                <span className="absolute -top-3 right-0 text-[9px] text-info/70">安全区</span>
              </div>
              {/* 页面内容 */}
              <div
                className="absolute inset-0 flex"
                style={{ padding: `${marginOuter}px ${marginInner}px ${marginOuter}px ${marginInner}px` }}
              >
                <div
                  className={`flex-1 flex flex-col ${textAlignClass}`}
                  style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
                >
                  {/* 标题 */}
                  <div
                    className="text-center font-bold mb-2"
                    style={{
                      fontSize: `${fontSize * 1.5}px`,
                      fontFamily: titleFontStyle.fontFamily,
                      fontWeight: titleFontStyle.fontWeight,
                    }}
                  >
                    {selectedChapterZisu && (
                      <span className="mr-1">{selectedChapterZisu.chars.split(' ')[0]}</span>
                    )}
                    {uploadedFileName ? '第一章' : '第一章'}
                    {selectedChapterZisu && (
                      <span className="ml-1">{selectedChapterZisu.chars.split(' ')[0]}</span>
                    )}
                  </div>
                  {/* 正文 */}
                  <div
                    ref={previewScrollRef}
                    className="flex-1 overflow-hidden"
                    style={{
                      fontFamily: bodyFontStyle.fontFamily,
                      fontWeight: bodyFontStyle.fontWeight,
                      lineHeight: lineHeight,
                    }}
                  >
                    {previewLines.map((para, i) => (
                      <p key={i} className="mb-1" style={{ lineHeight: lineHeight }}>
                        {para}
                      </p>
                    ))}
                    {/* 插图示意 */}
                    {preset !== 'text-only' && (
                      <div className="w-full h-10 bg-gradient-to-r from-primary/20 to-accent/20 rounded flex items-center justify-center my-2">
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
                    <div className="text-center mt-auto pt-2 text-[8px] opacity-40">
                      {selectedPageNumZisu && (
                        <span>{selectedPageNumZisu.chars.split(' ')[0]}</span>
                      )}
                      {selectedPageNumZisu ? ' 1 ' : '— 1 —'}
                      {selectedPageNumZisu && (
                        <span>{selectedPageNumZisu.chars.split(' ')[0]}</span>
                      )}
                    </div>
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
              {uploadedFileName && <Tag variant="default" size="sm">📄 {uploadedFileName}</Tag>}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}