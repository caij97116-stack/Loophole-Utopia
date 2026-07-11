import { useState, useRef, useCallback } from 'react'
import { BackButton, Section, Card, Tag, Select, Button } from '@/components/ui'
import { allFonts, zisuLibrary, getFontStyle } from '@/data/fonts'

const formats = [
  { value: 'A4', label: 'A4 (210×297mm)', desc: '大判型，适合画集' },
  { value: 'A5', label: 'A5 (148×210mm)', desc: '最常用，小说/漫画/画集通用' },
  { value: 'B5', label: 'B5 (182×257mm)', desc: '略大于A5，漫画常用' },
  { value: 'B6', label: 'B6 (128×182mm)', desc: '文库本大小，适合小说' },
  { value: 'A6', label: 'A6 (105×148mm)', desc: '口袋本，便携' },
  { value: 'square', label: '正方形 (210×210mm)', desc: '正方形，适合画集/写真' },
  { value: 'landscape', label: '横版 (297×210mm)', desc: 'A4横版，适合摄影集' },
  { value: 'shinsho', label: '新書判 (103×182mm)', desc: '日本新书判，轻小说常用' },
  { value: 'bunko', label: '文庫判 (105×148mm)', desc: '日本文库判，口袋书' },
  { value: 'custom', label: '自定义', desc: '自定义尺寸' },
]

const designStyles = [
  { value: 'text-only', label: '纯文字排版', desc: '仅书名+作者名，极简风格' },
  { value: 'image-full', label: '满版插图', desc: '整面插图铺满封面，画集常用' },
  { value: 'text-image', label: '图文结合', desc: '文字+插图组合，最通用' },
  { value: 'hollow', label: '镂空设计', desc: '封面镂空，透出内页/内封' },
  { value: 'collage', label: '拼接设计', desc: '多元素拼接，丰富层次' },
  { value: 'gradient', label: '渐变设计', desc: '背景渐变+文字，简洁有力' },
  { value: 'minimal', label: '极简设计', desc: '极简主义，留白为主' },
  { value: 'retro', label: '复古设计', desc: '招牌/怀旧风格' },
  { value: 'deconstruct', label: '解构设计', desc: '打破常规，文字自由排列' },
]

const formatSizes: Record<string, { w: number; h: number }> = {
  A4: { w: 210, h: 297 },
  A5: { w: 148, h: 210 },
  B5: { w: 182, h: 257 },
  B6: { w: 128, h: 182 },
  A6: { w: 105, h: 148 },
  square: { w: 210, h: 210 },
  landscape: { w: 297, h: 210 },
  shinsho: { w: 103, h: 182 },
  bunko: { w: 105, h: 148 },
  custom: { w: 148, h: 210 },
}

function getPreviewSize(fmt: string) {
  const s = formatSizes[fmt] || formatSizes.A5
  const scale = Math.min(200 / s.w, 300 / s.h)
  return { width: Math.round(s.w * scale), height: Math.round(s.h * scale) }
}

function getExportSize(fmt: string) {
  const s = formatSizes[fmt] || formatSizes.A5
  const dpi = 150
  return {
    width: Math.round((s.w / 25.4) * dpi),
    height: Math.round((s.h / 25.4) * dpi),
  }
}

interface TextLayer {
  id: string
  text: string
  fontId: string
  fontSize: number
  color: string
}

let textLayerIdCounter = 0
function nextTextLayerId(): string {
  return `tl-${++textLayerIdCounter}`
}

export default function CoverDesigner() {
  const [format, setFormat] = useState('A5')
  const [style, setStyle] = useState('text-image')
  const [coverImage, setCoverImage] = useState<string | null>(null)

  const [titleFont, setTitleFont] = useState('siyuan-sans')
  const [authorFont, setAuthorFont] = useState('siyuan-serif')
  const [subtitleFont, setSubtitleFont] = useState('siyuan-serif')

  const [titleText, setTitleText] = useState('')
  const [authorText, setAuthorText] = useState('')
  const [subtitleText, setSubtitleText] = useState('')

  const [titleSize, setTitleSize] = useState(28)
  const [authorSize, setAuthorSize] = useState(14)
  const [subtitleSize, setSubtitleSize] = useState(16)

  const [titleColor, setTitleColor] = useState('#ffffff')
  const [authorColor, setAuthorColor] = useState('#cccccc')
  const [subtitleColor, setSubtitleColor] = useState('#dddddd')

  const [bgColor, setBgColor] = useState('#1e293b')
  const [textColor, setTextColor] = useState('#ffffff')

  const [activeZisu, setActiveZisu] = useState<string[]>([])
  const [textLayers, setTextLayers] = useState<TextLayer[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedFormat = formats.find((f) => f.value === format)
  const selectedStyle = designStyles.find((s) => s.value === style)
  const previewSize = getPreviewSize(format)

  const titleFontStyle = getFontStyle(titleFont)
  const authorFontStyle = getFontStyle(authorFont)
  const subtitleFontStyle = getFontStyle(subtitleFont)

  const toggleZisu = useCallback((id: string) => {
    setActiveZisu((prev) =>
      prev.includes(id) ? prev.filter((z) => z !== id) : [...prev, id],
    )
  }, [])

  const addTextLayer = useCallback(() => {
    const newLayer: TextLayer = {
      id: nextTextLayerId(),
      text: '',
      fontId: 'siyuan-sans',
      fontSize: 16,
      color: '#ffffff',
    }
    setTextLayers((prev) => [...prev, newLayer])
  }, [])

  const removeTextLayer = useCallback((id: string) => {
    setTextLayers((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const updateTextLayer = useCallback(
    (id: string, patch: Partial<TextLayer>) => {
      setTextLayers((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      )
    },
    [],
  )

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0)
          setCoverImage(canvas.toDataURL('image/png'))
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    },
    [],
  )

  const removeImage = useCallback(() => {
    setCoverImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const exportCover = useCallback(async () => {
    const exportSize = getExportSize(format)
    const canvas = document.createElement('canvas')
    canvas.width = exportSize.width
    canvas.height = exportSize.height
    const ctx = canvas.getContext('2d')!

    // 1. 背景色
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 2. 图片
    if (coverImage) {
      await new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve()
        }
        img.onerror = () => resolve()
        img.src = coverImage
      })
    }

    const scaleY = exportSize.height / previewSize.height
    const fontSizeScale = scaleY

    // 3. 标题
    if (titleText) {
      const { fontFamily } = titleFontStyle
      ctx.font = `${Math.round(titleSize * fontSizeScale)}px ${fontFamily}`
      ctx.fillStyle = titleColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(titleText, canvas.width / 2, canvas.height * 0.5)
    }

    // 4. 作者
    if (authorText) {
      const { fontFamily } = authorFontStyle
      ctx.font = `${Math.round(authorSize * fontSizeScale)}px ${fontFamily}`
      ctx.fillStyle = authorColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(authorText, canvas.width / 2, canvas.height * 0.58)
    }

    // 5. 副标题
    if (subtitleText) {
      const { fontFamily } = subtitleFontStyle
      ctx.font = `${Math.round(subtitleSize * fontSizeScale)}px ${fontFamily}`
      ctx.fillStyle = subtitleColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(subtitleText, canvas.width / 2, canvas.height * 0.45)
    }

    // 6. 自定义文字图层
    textLayers.forEach((layer, i) => {
      if (!layer.text) return
      const { fontFamily } = getFontStyle(layer.fontId)
      ctx.font = `${Math.round(layer.fontSize * fontSizeScale)}px ${fontFamily}`
      ctx.fillStyle = layer.color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const y = canvas.height * 0.65 + i * 40 * fontSizeScale
      ctx.fillText(layer.text, canvas.width / 2, y)
    })

    // 7. 字素
    if (activeZisu.length > 0) {
      const zisuChars: string[] = []
      activeZisu.forEach((id) => {
        const item = zisuLibrary.find((z) => z.id === id)
        if (item) {
          zisuChars.push(...item.chars.split(/\s+/).filter(Boolean))
        }
      })
      const zisuFontSize = Math.round(18 * fontSizeScale)
      ctx.font = `${zisuFontSize}px serif`
      ctx.fillStyle = textColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const zisuStr = zisuChars.slice(0, 12).join(' ')
      ctx.fillText(zisuStr, canvas.width / 2, canvas.height * 0.92)
    }

    // 导出
    const link = document.createElement('a')
    link.download = `cover-${format}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [
    format, bgColor, coverImage, previewSize.width, previewSize.height,
    titleText, titleFontStyle, titleSize, titleColor,
    authorText, authorFontStyle, authorSize, authorColor,
    subtitleText, subtitleFontStyle, subtitleSize, subtitleColor,
    textLayers, activeZisu, textColor,
  ])

  const activeZisuItems = zisuLibrary.filter((z) => activeZisu.includes(z.id))

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/book" label="返回书本制作" />
      <Section
        title="封面设计器"
        icon="🎨"
        description="13种判型 × 9种设计手法 × 多语言字体，实时预览封面效果"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：设计面板 */}
        <Card>
          <h3 className="font-semibold text-sm mb-4">设计参数</h3>

          <Select
            label="判型"
            options={formats.map((f) => ({
              value: f.value,
              label: `${f.label} — ${f.desc}`,
            }))}
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          />

          <div className="mb-3">
            <label className="block text-sm font-medium text-text mb-1">
              设计手法
            </label>
            <div className="grid grid-cols-3 gap-1">
              {designStyles.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                    style === s.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-text hover:bg-gray-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* 图片上传 */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-text mb-1">
              封面图片
            </label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                {coverImage ? '更换图片' : '上传图片'}
              </Button>
              {coverImage && (
                <Button variant="outline" size="sm" onClick={removeImage}>
                  移除图片
                </Button>
              )}
            </div>
            {coverImage && (
              <p className="text-xs text-text-muted mt-1">已上传封面图片</p>
            )}
          </div>

          {/* 标题设置 */}
          <div className="border-t border-border pt-3 mb-3">
            <h4 className="font-medium text-xs text-text-muted mb-2">📖 书名</h4>
            <div className="mb-2">
              <input
                type="text"
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                placeholder="输入书名..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Select
                label="字体"
                options={allFonts.map((f) => ({
                  value: f.id,
                  label: f.name,
                }))}
                value={titleFont}
                onChange={(e) => setTitleFont(e.target.value)}
              />
              <div>
                <label className="block text-xs font-medium text-text mb-1">
                  字号
                </label>
                <input
                  type="number"
                  value={titleSize}
                  onChange={(e) => setTitleSize(Number(e.target.value))}
                  min={8}
                  max={120}
                  className="w-full px-2 py-2 rounded-lg border border-border bg-white text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text mb-1">
                颜色
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={titleColor}
                  onChange={(e) => setTitleColor(e.target.value)}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={titleColor}
                  onChange={(e) => setTitleColor(e.target.value)}
                  className="flex-1 px-2 py-1.5 rounded-lg border border-border bg-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* 作者设置 */}
          <div className="border-t border-border pt-3 mb-3">
            <h4 className="font-medium text-xs text-text-muted mb-2">✍️ 作者</h4>
            <div className="mb-2">
              <input
                type="text"
                value={authorText}
                onChange={(e) => setAuthorText(e.target.value)}
                placeholder="输入作者名..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Select
                label="字体"
                options={allFonts.map((f) => ({
                  value: f.id,
                  label: f.name,
                }))}
                value={authorFont}
                onChange={(e) => setAuthorFont(e.target.value)}
              />
              <div>
                <label className="block text-xs font-medium text-text mb-1">
                  字号
                </label>
                <input
                  type="number"
                  value={authorSize}
                  onChange={(e) => setAuthorSize(Number(e.target.value))}
                  min={6}
                  max={80}
                  className="w-full px-2 py-2 rounded-lg border border-border bg-white text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text mb-1">
                颜色
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={authorColor}
                  onChange={(e) => setAuthorColor(e.target.value)}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={authorColor}
                  onChange={(e) => setAuthorColor(e.target.value)}
                  className="flex-1 px-2 py-1.5 rounded-lg border border-border bg-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* 副标题设置 */}
          <div className="border-t border-border pt-3 mb-3">
            <h4 className="font-medium text-xs text-text-muted mb-2">
              📝 副标题
            </h4>
            <div className="mb-2">
              <input
                type="text"
                value={subtitleText}
                onChange={(e) => setSubtitleText(e.target.value)}
                placeholder="输入副标题..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Select
                label="字体"
                options={allFonts.map((f) => ({
                  value: f.id,
                  label: f.name,
                }))}
                value={subtitleFont}
                onChange={(e) => setSubtitleFont(e.target.value)}
              />
              <div>
                <label className="block text-xs font-medium text-text mb-1">
                  字号
                </label>
                <input
                  type="number"
                  value={subtitleSize}
                  onChange={(e) => setSubtitleSize(Number(e.target.value))}
                  min={6}
                  max={80}
                  className="w-full px-2 py-2 rounded-lg border border-border bg-white text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text mb-1">
                颜色
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={subtitleColor}
                  onChange={(e) => setSubtitleColor(e.target.value)}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={subtitleColor}
                  onChange={(e) => setSubtitleColor(e.target.value)}
                  className="flex-1 px-2 py-1.5 rounded-lg border border-border bg-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* 自定义文字图层 */}
          <div className="border-t border-border pt-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-xs text-text-muted">
                🔤 文字图层
              </h4>
              <Button variant="outline" size="sm" onClick={addTextLayer}>
                + 添加
              </Button>
            </div>
            {textLayers.map((layer) => (
              <div
                key={layer.id}
                className="border border-border rounded-lg p-2 mb-2"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-muted">
                    图层 {layer.id}
                  </span>
                  <button
                    onClick={() => removeTextLayer(layer.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    删除
                  </button>
                </div>
                <input
                  type="text"
                  value={layer.text}
                  onChange={(e) =>
                    updateTextLayer(layer.id, { text: e.target.value })
                  }
                  placeholder="输入文字..."
                  className="w-full px-2 py-1.5 rounded border border-border bg-white text-xs mb-1"
                />
                <div className="grid grid-cols-2 gap-1">
                  <select
                    value={layer.fontId}
                    onChange={(e) =>
                      updateTextLayer(layer.id, { fontId: e.target.value })
                    }
                    className="px-2 py-1 rounded border border-border bg-white text-xs"
                  >
                    {allFonts.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={layer.fontSize}
                      onChange={(e) =>
                        updateTextLayer(layer.id, {
                          fontSize: Number(e.target.value),
                        })
                      }
                      min={6}
                      max={80}
                      className="w-full px-2 py-1 rounded border border-border bg-white text-xs"
                      placeholder="字号"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={layer.color}
                    onChange={(e) =>
                      updateTextLayer(layer.id, { color: e.target.value })
                    }
                    className="w-6 h-6 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={layer.color}
                    onChange={(e) =>
                      updateTextLayer(layer.id, { color: e.target.value })
                    }
                    className="flex-1 px-2 py-1 rounded border border-border bg-white text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 字素选择 */}
          <div className="border-t border-border pt-3 mb-3">
            <h4 className="font-medium text-xs text-text-muted mb-2">
              ✨ 字素装饰
            </h4>
            <div className="grid grid-cols-3 gap-1">
              {zisuLibrary.map((z) => (
                <button
                  key={z.id}
                  onClick={() => toggleZisu(z.id)}
                  className={`px-2 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    activeZisu.includes(z.id)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-gray-100 text-text hover:bg-gray-200 border border-transparent'
                  }`}
                  title={z.usage}
                >
                  <div className="text-sm mb-0.5">
                    {z.chars.split(/\s+/)[0]}
                  </div>
                  <div className="opacity-70">{z.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 背景色 */}
          <div className="border-t border-border pt-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="mb-2">
                <label className="block text-sm font-medium text-text mb-1">
                  背景色
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 px-2 py-2 rounded-lg border border-border bg-white text-xs"
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-text mb-1">
                  默认文字色
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-10 h-10 rounded border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 px-2 py-2 rounded-lg border border-border bg-white text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            <Tag variant="default">{selectedFormat?.label}</Tag>
            <Tag variant="primary">{selectedStyle?.label}</Tag>
            <Tag variant="success">
              {allFonts.find((f) => f.id === titleFont)?.name ?? titleFont}
            </Tag>
          </div>
        </Card>

        {/* 右侧：预览 */}
        <Card>
          <h3 className="font-semibold text-sm mb-4">实时预览</h3>
          <div className="flex items-center justify-center p-4">
            <div
              className="relative border-2 border-gray-400 rounded shadow-lg overflow-hidden"
              style={{
                width: previewSize.width,
                height: previewSize.height,
                backgroundColor: bgColor,
                backgroundImage: coverImage ? `url(${coverImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* 镂空示意 */}
              {style === 'hollow' && (
                <div className="absolute inset-4 border-2 border-dashed border-white/40 rounded-lg flex items-center justify-center pointer-events-none">
                  <span className="text-xs text-white/50">[镂空区域]</span>
                </div>
              )}

              {/* 渐变示意 */}
              {style === 'gradient' && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
              )}

              {/* 拼接示意 */}
              {style === 'collage' && !coverImage && (
                <div className="absolute inset-0 grid grid-cols-2 gap-0.5 opacity-30">
                  <div className="bg-primary/30 rounded" />
                  <div className="bg-accent/30 rounded" />
                  <div className="bg-success/30 rounded" />
                  <div className="bg-info/30 rounded" />
                </div>
              )}

              {/* 满版插图示意 */}
              {style === 'image-full' && !coverImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <span className="text-xs opacity-50 text-text-muted">
                    [插图区域]
                  </span>
                </div>
              )}

              {/* 文字图层 */}
              {style !== 'image-full' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-3">
                  {/* 副标题 */}
                  {subtitleText && (
                    <div
                      className="text-center leading-tight mb-1"
                      style={{
                        fontFamily: subtitleFontStyle.fontFamily,
                        fontSize: subtitleSize,
                        color: subtitleColor,
                      }}
                    >
                      {subtitleText}
                    </div>
                  )}

                  {/* 书名 */}
                  <div
                    className="text-center font-bold leading-tight mb-2"
                    style={{
                      fontFamily: titleFontStyle.fontFamily,
                      fontSize: titleSize,
                      color: titleColor,
                    }}
                  >
                    {titleText || '书名'}
                  </div>

                  {/* 作者 */}
                  {authorText && (
                    <div
                      className="text-center leading-tight"
                      style={{
                        fontFamily: authorFontStyle.fontFamily,
                        fontSize: authorSize,
                        color: authorColor,
                      }}
                    >
                      {authorText}
                    </div>
                  )}
                  {!authorText && style !== 'minimal' && (
                    <div
                      className="text-center text-xs opacity-50"
                      style={{ color: textColor }}
                    >
                      作者名
                    </div>
                  )}

                  {/* 自定义文字图层 */}
                  {textLayers.map((layer) =>
                    layer.text ? (
                      <div
                        key={layer.id}
                        className="text-center leading-tight mt-1"
                        style={{
                          fontFamily: getFontStyle(layer.fontId).fontFamily,
                          fontSize: layer.fontSize,
                          color: layer.color,
                        }}
                      >
                        {layer.text}
                      </div>
                    ) : null,
                  )}
                </div>
              )}

              {/* 字素装饰 */}
              {activeZisuItems.length > 0 && (
                <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1 flex-wrap px-2">
                  {activeZisuItems.map((z) =>
                    z.chars.split(/\s+/).map((ch, i) => (
                      <span
                        key={`${z.id}-${i}`}
                        className="text-base leading-none"
                        style={{ color: textColor }}
                      >
                        {ch}
                      </span>
                    )),
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="text-center text-xs text-text-muted space-y-1 mt-2">
            <p>判型：{selectedFormat?.label}</p>
            <p>设计手法：{selectedStyle?.label}</p>
            <p>
              标题字体：
              {allFonts.find((f) => f.id === titleFont)?.name ?? titleFont}
            </p>
            {activeZisuItems.length > 0 && (
              <p>字素：{activeZisuItems.map((z) => z.name).join('、')}</p>
            )}
          </div>

          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={exportCover}>
              导出封面图
            </Button>
            <Button variant="primary" size="sm">保存设计</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}