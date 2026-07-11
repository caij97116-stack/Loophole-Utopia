import { useState, useRef, useCallback, useEffect } from 'react'
import { BackButton, Section, Card, Tabs } from '@/components/ui'
import { allFonts, getFontStyle } from '@/data/fonts'
import { svgAssets, getCategories, searchAssets, type SvgAsset } from '@/data/assets'

// ====== 海报模板 ======
interface PosterTemplate {
  id: string
  name: string
  category: string
  width: number
  height: number
  bgColor: string
  textFields: { id: string; label: string; x: number; y: number; fontSize: number; color: string; defaultText: string; fontId: string }[]
  imageArea: { x: number; y: number; w: number; h: number } | null
}

const posterTemplates: PosterTemplate[] = [
  {
    id: 'backdrop-a3', name: '背面海报', category: '摊位海报',
    width: 297, height: 420, bgColor: '#ffffff',
    textFields: [
      { id: 'circle-name', label: '社团名', x: 30, y: 50, fontSize: 48, color: '#1a1a1a', defaultText: '社团名', fontId: 'siyuan-sans' },
      { id: 'book-title', label: '新刊标题', x: 30, y: 130, fontSize: 36, color: '#333333', defaultText: '新刊标题', fontId: 'siyuan-serif' },
      { id: 'event-info', label: '展会信息', x: 30, y: 200, fontSize: 28, color: '#555555', defaultText: 'XX展会  XX号摊位', fontId: 'siyuan-sans' },
      { id: 'price', label: '价格', x: 30, y: 260, fontSize: 32, color: '#c0392b', defaultText: '¥XX', fontId: 'montserrat' },
      { id: 'sns', label: 'SNS', x: 30, y: 320, fontSize: 20, color: '#888888', defaultText: 'Twitter: @xxx / 微博: @xxx', fontId: 'siyuan-sans' },
    ],
    imageArea: { x: 120, y: 60, w: 150, h: 210 },
  },
  {
    id: 'table-a4', name: '桌上立牌', category: '摊位海报',
    width: 210, height: 297, bgColor: '#fff8f0',
    textFields: [
      { id: 'circle-name', label: '社团名', x: 20, y: 30, fontSize: 40, color: '#1a1a1a', defaultText: '社团名', fontId: 'siyuan-sans' },
      { id: 'book-title', label: '新刊标题', x: 20, y: 90, fontSize: 30, color: '#333333', defaultText: '新刊标题', fontId: 'siyuan-serif' },
      { id: 'price', label: '价格', x: 20, y: 140, fontSize: 28, color: '#c0392b', defaultText: '¥XX', fontId: 'montserrat' },
      { id: 'event-info', label: '展会信息', x: 20, y: 190, fontSize: 22, color: '#555555', defaultText: 'XX展会  XX号摊位', fontId: 'siyuan-sans' },
      { id: 'description', label: '简介', x: 20, y: 240, fontSize: 18, color: '#666666', defaultText: '简介文案...', fontId: 'siyuan-serif' },
    ],
    imageArea: { x: 20, y: 160, w: 170, h: 120 },
  },
  {
    id: 'menu-a5', name: '菜单/价目表', category: '菜单',
    width: 148, height: 210, bgColor: '#ffffff',
    textFields: [
      { id: 'circle-name', label: '社团名', x: 15, y: 20, fontSize: 28, color: '#1a1a1a', defaultText: '社团名', fontId: 'siyuan-sans' },
      { id: 'book-title', label: '新刊标题', x: 15, y: 60, fontSize: 24, color: '#333333', defaultText: '新刊标题', fontId: 'siyuan-serif' },
      { id: 'price', label: '价格', x: 15, y: 95, fontSize: 22, color: '#c0392b', defaultText: '¥XX', fontId: 'montserrat' },
      { id: 'goods-list', label: '周边列表', x: 15, y: 130, fontSize: 16, color: '#444444', defaultText: '· 周边1 ¥XX\n· 周边2 ¥XX', fontId: 'siyuan-sans' },
      { id: 'event-info', label: '展会', x: 15, y: 180, fontSize: 16, color: '#888888', defaultText: 'XX展会  XX号', fontId: 'siyuan-sans' },
    ],
    imageArea: null,
  },
  {
    id: 'sns-twitter', name: 'Twitter横幅', category: 'SNS宣传',
    width: 300, height: 157, bgColor: '#1da1f2',
    textFields: [
      { id: 'circle-name', label: '社团名', x: 20, y: 40, fontSize: 32, color: '#ffffff', defaultText: '社团名', fontId: 'siyuan-sans' },
      { id: 'book-title', label: '新刊标题', x: 20, y: 90, fontSize: 26, color: '#ffffff', defaultText: '新刊标题', fontId: 'siyuan-serif' },
      { id: 'event-info', label: '展会', x: 20, y: 130, fontSize: 20, color: '#ffffff', defaultText: 'XX展会  XX号摊位', fontId: 'siyuan-sans' },
    ],
    imageArea: { x: 190, y: 15, w: 95, h: 127 },
  },
  {
    id: 'sns-instagram', name: 'Instagram方形', category: 'SNS宣传',
    width: 300, height: 300, bgColor: '#fafafa',
    textFields: [
      { id: 'circle-name', label: '社团名', x: 20, y: 30, fontSize: 36, color: '#1a1a1a', defaultText: '社团名', fontId: 'playfair' },
      { id: 'book-title', label: '新刊标题', x: 20, y: 80, fontSize: 28, color: '#333333', defaultText: '新刊标题', fontId: 'siyuan-serif' },
      { id: 'event-info', label: '展会', x: 20, y: 130, fontSize: 22, color: '#888888', defaultText: 'XX展会', fontId: 'siyuan-sans' },
    ],
    imageArea: { x: 20, y: 150, w: 260, h: 140 },
  },
  {
    id: 'sns-weibo', name: '微博九宫格', category: 'SNS宣传',
    width: 240, height: 240, bgColor: '#ffffff',
    textFields: [
      { id: 'circle-name', label: '社团名', x: 15, y: 25, fontSize: 28, color: '#1a1a1a', defaultText: '社团名', fontId: 'siyuan-sans' },
      { id: 'book-title', label: '新刊标题', x: 15, y: 65, fontSize: 24, color: '#333333', defaultText: '新刊标题', fontId: 'siyuan-serif' },
      { id: 'price', label: '价格', x: 15, y: 100, fontSize: 24, color: '#c0392b', defaultText: '¥XX', fontId: 'montserrat' },
      { id: 'event-info', label: '展会', x: 15, y: 135, fontSize: 18, color: '#888888', defaultText: 'XX展会  XX号', fontId: 'siyuan-sans' },
    ],
    imageArea: null,
  },
  {
    id: 'postcard', name: '明信片', category: '印刷品',
    width: 148, height: 100, bgColor: '#ffffff',
    textFields: [
      { id: 'circle-name', label: '社团名', x: 15, y: 20, fontSize: 20, color: '#1a1a1a', defaultText: '社团名', fontId: 'siyuan-sans' },
      { id: 'event-info', label: '展会', x: 15, y: 50, fontSize: 16, color: '#888888', defaultText: 'XX展会', fontId: 'siyuan-sans' },
    ],
    imageArea: { x: 15, y: 15, w: 118, h: 70 },
  },
  {
    id: 'blank', name: '空白画布', category: '自定义',
    width: 300, height: 200, bgColor: '#ffffff',
    textFields: [],
    imageArea: null,
  },
]

// ====== 文案模板 ======
const textTemplates = [
  { id: 'cover-reveal', name: '封面公开', platform: '微博/Lofter/Twitter' },
  { id: 'sample', name: '试阅发布', platform: '微博/Lofter' },
  { id: 'goods-preview', name: '周边预览', platform: '微博/小红书' },
  { id: 'event-map', name: '摊位导航', platform: '微博/Twitter' },
  { id: 'event-live', name: '展会实况', platform: '微博' },
  { id: 'post-event', name: '展后总结', platform: '微博/Lofter' },
  { id: 'mail-order', name: '通贩通知', platform: '全平台' },
]

const textTemplateContents: Record<string, { title: string; content: string; variables: string[] }> = {
  'cover-reveal': {
    title: '封面公开模板',
    content: `【新刊封面公开】
《{本子标题}》
{判型} / {页数}P / {装订方式}
{封面描述}
📅 {展会名称} {摊位号}
📅 日期：{开展日期}
🏪 通贩：{通贩链接}
#{展会tag} #{作品tag}`,
    variables: ['本子标题', '判型', '页数', '装订方式', '封面描述', '展会名称', '摊位号', '开展日期', '通贩链接', '展会tag', '作品tag'],
  },
  'sample': {
    title: '试阅发布模板',
    content: `【新刊试阅】
《{本子标题}》试阅公开！
{本子简介}
全本共{页数}P，{装订方式}，{纸张类型}
📖 试阅请看下图👇
📅 {展会名称} {摊位号} 首发
🏪 通贩：{通贩链接}
#{展会tag} #{作品tag}`,
    variables: ['本子标题', '本子简介', '页数', '装订方式', '纸张类型', '展会名称', '摊位号', '通贩链接', '展会tag', '作品tag'],
  },
  'goods-preview': {
    title: '周边预览模板',
    content: `【周边预览】
{社团名} {展会名称} 周边一览！
✨ {周边1}：{材质} / {尺寸} / ¥{价格}
✨ {周边2}：{材质} / {尺寸} / ¥{价格}
✨ {周边3}：{材质} / {尺寸} / ¥{价格}
📅 {展会名称} {摊位号}
🏪 通贩：{通贩链接}
#{展会tag} #{作品tag}`,
    variables: ['社团名', '展会名称', '周边1', '周边2', '周边3', '材质', '尺寸', '价格', '摊位号', '通贩链接', '展会tag', '作品tag'],
  },
  'event-map': {
    title: '摊位导航模板',
    content: `【摊位导航】
{社团名} 在 {展会名称} 的摊位在这里！
📍 摊位号：{摊位号}
📍 区域：{区域名称}
📍 路线：{路线描述}
✅ 新刊：{本子标题}（{页数}P / ¥{价格}）
✅ 周边：{周边列表}
#{展会tag} #{作品tag}`,
    variables: ['社团名', '展会名称', '摊位号', '区域名称', '路线描述', '本子标题', '页数', '价格', '周边列表', '展会tag', '作品tag'],
  },
  'event-live': {
    title: '展会实况模板',
    content: `【展会实况】
{社团名} 在 {展会名称} 准备就绪！🎉
📍 {摊位号}，欢迎大家来玩！
📦 目前库存：
✅ 新刊：{本子标题} — 还剩{库存}本
✅ {周边1} — 还剩{库存}个
✅ {周边2} — 还剩{库存}个
#{展会tag} #{作品tag}`,
    variables: ['社团名', '展会名称', '摊位号', '本子标题', '库存', '周边1', '周边2', '展会tag', '作品tag'],
  },
  'post-event': {
    title: '展后总结模板',
    content: `【展后感谢】
{展会名称} 圆满结束！感谢来摊位的小伙伴！🙏
📊 本次战绩：
✅ 新刊《{本子标题}》售出{销量}本
✅ {周边}售出{销量}个
🏪 通贩已开放：{通贩链接}
📅 下次参展：{下次展会}
#{展会tag} #{作品tag}`,
    variables: ['展会名称', '本子标题', '销量', '周边', '通贩链接', '下次展会', '展会tag', '作品tag', '社团名'],
  },
  'mail-order': {
    title: '通贩通知模板',
    content: `【通贩通知】
{社团名} 通贩已上线！
📚 新刊：《{本子标题}》— {判型}/{页数}P — ¥{价格}
🎁 周边：
✨ {周边1} — ¥{价格}
✨ {周边2} — ¥{价格}
🛒 购买链接：{通贩链接}
📦 发货时间：{发货时间}
#{作品tag} #{作品tag}`,
    variables: ['社团名', '本子标题', '判型', '页数', '价格', '周边1', '周边2', '通贩链接', '发货时间', '作品tag'],
  },
}

// ====== Assigned asset on canvas ======
interface AssignedAsset {
  asset: SvgAsset
  x: number
  y: number
  scale: number
  id: string
}

// ====== 海报设计器 Canvas ======
function PosterCanvas({
  template, texts, fontIds, uploadedImage, assignedAssets,
}: {
  template: PosterTemplate
  texts: Record<string, string>
  fontIds: Record<string, string>
  uploadedImage: string | null
  assignedAssets: AssignedAsset[]
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const displayScale = 2

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const w = template.width * displayScale
    const h = template.height * displayScale

    canvas.width = w
    canvas.height = h

    // 背景
    ctx.fillStyle = template.bgColor
    ctx.fillRect(0, 0, w, h)

    const drawAll = () => {
      // 背景
      ctx.fillStyle = template.bgColor
      ctx.fillRect(0, 0, w, h)

      // 图片
      if (uploadedImage && template.imageArea) {
        const img = new Image()
        img.src = uploadedImage
        const area = template.imageArea
        ctx.drawImage(img, area.x * displayScale, area.y * displayScale, area.w * displayScale, area.h * displayScale)
      }

      // 文字
      for (const tf of template.textFields) {
        const text = texts[tf.id] || tf.defaultText
        const fontId = fontIds[tf.id] || tf.fontId
        const fontStyle = getFontStyle(fontId)
        ctx.font = `${tf.fontSize * displayScale}px "${fontStyle.fontFamily}", ${tf.fontSize * displayScale * 0.7}px sans-serif`
        ctx.fillStyle = tf.color
        ctx.textBaseline = 'top'

        const lines = text.split('\n')
        lines.forEach((line, i) => {
          ctx.fillText(line, tf.x * displayScale, (tf.y + i * tf.fontSize * 1.3) * displayScale)
        })
      }

      // 素材 - 绘制在指定位置
      for (const aa of assignedAssets) {
        const svgBlob = new Blob([aa.asset.svg], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(svgBlob)
        const img = new Image()
        img.src = url
        const size = 40 * aa.scale * displayScale
        ctx.drawImage(img, aa.x * displayScale, aa.y * displayScale, size, size)
        URL.revokeObjectURL(url)
      }
    }

    drawAll()
  }, [template, texts, fontIds, uploadedImage, assignedAssets, displayScale])

  return (
    <canvas
      ref={canvasRef}
      className="w-full border border-border rounded-lg shadow-sm"
      style={{ maxWidth: template.width * 2 }}
    />
  )
}

// ====== 主页面 ======
export default function PromoGenerator() {
  const [activeTab, setActiveTab] = useState('poster')
  const [selectedPoster, setSelectedPoster] = useState('backdrop-a3')
  const [posterTexts, setPosterTexts] = useState<Record<string, string>>({})
  const [posterFonts, setPosterFonts] = useState<Record<string, string>>({})
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageFileName, setImageFileName] = useState('')
  const [assignedAssets, setAssignedAssets] = useState<AssignedAsset[]>([])
  const [assetCategory, setAssetCategory] = useState('全部')
  const [assetSearch, setAssetSearch] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 文案模板
  const [selectedTextTemplate, setSelectedTextTemplate] = useState('cover-reveal')
  const [textVariables, setTextVariables] = useState<Record<string, string>>({})

  const posterTemplate = posterTemplates.find((t) => t.id === selectedPoster)!
  const textTemplate = textTemplateContents[selectedTextTemplate]

  const handlePosterChange = useCallback((id: string) => {
    setSelectedPoster(id)
    setPosterTexts({})
  }, [])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => setUploadedImage(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleExport = useCallback(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `poster-${posterTemplate.id}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [posterTemplate])

  const handleAddAsset = useCallback((asset: SvgAsset) => {
    setAssignedAssets((prev) => {
      const exists = prev.find((a) => a.asset.id === asset.id)
      if (exists) return prev
      return [...prev, {
        asset,
        x: 30 + Math.random() * 60,
        y: 30 + Math.random() * 60,
        scale: 1,
        id: `${asset.id}-${Date.now()}`,
      }]
    })
  }, [])

  const handleRemoveAsset = useCallback((id: string) => {
    setAssignedAssets((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const handleMoveAsset = useCallback((id: string, dx: number, dy: number) => {
    setAssignedAssets((prev) => prev.map((a) =>
      a.id === id ? { ...a, x: a.x + dx, y: a.y + dy } : a,
    ))
  }, [])

  const handleScaleAsset = useCallback((id: string, ds: number) => {
    setAssignedAssets((prev) => prev.map((a) =>
      a.id === id ? { ...a, scale: Math.max(0.3, Math.min(3, a.scale + ds)) } : a,
    ))
  }, [])

  const filteredAssets = (() => {
    let assets = svgAssets
    if (assetCategory !== '全部') {
      assets = assets.filter((a) => a.category === assetCategory)
    }
    if (assetSearch.trim()) {
      assets = searchAssets(assetSearch)
    }
    return assets
  })()

  const textPreview = textTemplate.content.replace(/\{(\w+)\}/g, (_, key) => textVariables[key] || `{${key}}`)

  const handleCopyText = () => {
    navigator.clipboard.writeText(textPreview)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 pb-0">
        <BackButton to="/promo" label="返回展会宣发" />
        <Section
          title="宣发素材生成器"
          icon="📢"
          description="海报设计 + 文案模板 · 上传封面图 · 添加素材 · 导出高清图"
        />
      </div>

      <div className="p-4">
        <Tabs
          tabs={[
            { key: 'poster', label: '海报设计' },
            { key: 'text', label: '文案模板' },
          ]}
          activeKey={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* ====== 海报设计模式 ====== */}
      {activeTab === 'poster' && (
        <div className="flex-1 flex flex-col lg:flex-row gap-4 px-4 pb-4 min-h-0">
          {/* 左侧控制 */}
          <div className="lg:w-72 shrink-0 space-y-3 overflow-y-auto">
            {/* 模板选择 */}
            <Card>
              <h3 className="text-sm font-semibold mb-3">模板</h3>
              <div className="flex flex-col gap-1">
                {posterTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handlePosterChange(t.id)}
                    className={`text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      selectedPoster === t.id
                        ? 'bg-primary text-white'
                        : 'bg-bg-card border border-border hover:border-primary'
                    }`}
                  >
                    <span className="font-medium">{t.name}</span>
                    <span className="ml-2 opacity-70">{t.width}x{t.height}mm</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* 封面图片 */}
            <Card>
              <h3 className="text-sm font-semibold mb-3">封面图片</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {uploadedImage ? (
                <div className="space-y-2">
                  <img
                    src={uploadedImage}
                    alt="封面"
                    className="w-full h-16 object-cover rounded border border-border"
                  />
                  <p className="text-xs text-text-muted truncate">{imageFileName}</p>
                  <button
                    onClick={() => { setUploadedImage(null); setImageFileName('') }}
                    className="w-full text-xs text-red-500 hover:underline cursor-pointer"
                  >
                    清除
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-3 py-2 rounded-lg text-xs border border-dashed border-border hover:border-primary text-text-muted cursor-pointer"
                >
                  + 上传图片
                </button>
              )}
            </Card>

            {/* 文字内容 */}
            {posterTemplate.textFields.length > 0 && (
              <Card>
                <h3 className="text-sm font-semibold mb-3">文字内容</h3>
                <div className="space-y-2">
                  {posterTemplate.textFields.map((tf) => (
                    <div key={tf.id}>
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-text-muted">{tf.label}</label>
                        <select
                          value={posterFonts[tf.id] || tf.fontId}
                          onChange={(e) =>
                            setPosterFonts((prev) => ({ ...prev, [tf.id]: e.target.value }))
                          }
                          className="text-[10px] px-1 py-0.5 rounded border border-border bg-bg"
                        >
                          {allFonts.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <textarea
                        rows={tf.defaultText.includes('\n') ? 3 : 1}
                        value={posterTexts[tf.id] || ''}
                        onChange={(e) =>
                          setPosterTexts((prev) => ({ ...prev, [tf.id]: e.target.value }))
                        }
                        placeholder={tf.defaultText}
                        className="w-full px-2 py-1.5 rounded border border-border bg-bg text-xs mt-0.5 resize-none"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 素材库 */}
            <Card>
              <h3 className="text-sm font-semibold mb-3">素材库</h3>
              <div className="flex gap-1 mb-2">
                <select
                  value={assetCategory}
                  onChange={(e) => setAssetCategory(e.target.value)}
                  className="flex-1 px-2 py-1 rounded border border-border bg-bg text-xs"
                >
                  <option value="全部">全部分类</option>
                  {getCategories().map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                placeholder="搜索素材..."
                className="w-full px-2 py-1 rounded border border-border bg-bg text-xs mb-2"
              />
              <div className="grid grid-cols-3 gap-1 max-h-52 overflow-y-auto">
                {filteredAssets.map((asset) => {
                  const isAssigned = assignedAssets.some((a) => a.asset.id === asset.id)
                  return (
                    <button
                      key={asset.id}
                      onClick={() => handleAddAsset(asset)}
                      disabled={isAssigned}
                      className={`p-1 rounded border text-center cursor-pointer transition-colors ${
                        isAssigned
                          ? 'border-primary/30 bg-primary/5 opacity-50'
                          : 'border-border hover:border-primary'
                      }`}
                      title={asset.name}
                    >
                      <div
                        className="w-full h-8 flex items-center justify-center"
                        dangerouslySetInnerHTML={{
                          __html: `<svg viewBox="${asset.viewBox}" width="28" height="28"><g>${asset.svg}</g></svg>`,
                        }}
                      />
                      <span className="text-[8px] text-text-muted block truncate">{asset.name}</span>
                    </button>
                  )
                })}
              </div>
            </Card>

            {/* 已添加素材 */}
            {assignedAssets.length > 0 && (
              <Card>
                <h3 className="text-sm font-semibold mb-3">
                  已添加素材 ({assignedAssets.length})
                </h3>
                <div className="space-y-2">
                  {assignedAssets.map((aa) => (
                    <div
                      key={aa.id}
                      className="flex items-center gap-2 p-2 rounded-lg border border-border bg-bg-card"
                    >
                      <div
                        className="w-8 h-8 flex items-center justify-center shrink-0"
                        dangerouslySetInnerHTML={{
                          __html: `<svg viewBox="${aa.asset.viewBox}" width="24" height="24"><g>${aa.asset.svg}</g></svg>`,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs truncate">{aa.asset.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => handleMoveAsset(aa.id, -5, 0)}
                            className="text-[10px] px-1 rounded border border-border hover:bg-bg"
                          >
                            ←
                          </button>
                          <button
                            onClick={() => handleMoveAsset(aa.id, 5, 0)}
                            className="text-[10px] px-1 rounded border border-border hover:bg-bg"
                          >
                            →
                          </button>
                          <button
                            onClick={() => handleMoveAsset(aa.id, 0, -5)}
                            className="text-[10px] px-1 rounded border border-border hover:bg-bg"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => handleMoveAsset(aa.id, 0, 5)}
                            className="text-[10px] px-1 rounded border border-border hover:bg-bg"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => handleScaleAsset(aa.id, -0.2)}
                            className="text-[10px] px-1 rounded border border-border hover:bg-bg"
                          >
                            −
                          </button>
                          <span className="text-[10px]">{aa.scale.toFixed(1)}x</span>
                          <button
                            onClick={() => handleScaleAsset(aa.id, 0.2)}
                            className="text-[10px] px-1 rounded border border-border hover:bg-bg"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAsset(aa.id)}
                        className="text-[10px] text-red-500 hover:underline shrink-0"
                      >
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 导出 */}
            <Card>
              <h3 className="text-sm font-semibold mb-3">导出</h3>
              <button
                onClick={handleExport}
                className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-accent text-white cursor-pointer hover:opacity-90 transition-opacity"
              >
                导出 PNG
              </button>
              <p className="text-xs text-text-muted mt-2">
                {posterTemplate.width}x{posterTemplate.height}mm · 2x 高清
              </p>
            </Card>
          </div>

          {/* 右侧预览 */}
          <div className="flex-1 overflow-auto bg-bg-card rounded-2xl p-4 flex items-start justify-center">
            <PosterCanvas
              template={posterTemplate}
              texts={posterTexts}
              fontIds={posterFonts}
              uploadedImage={uploadedImage}
              assignedAssets={assignedAssets}
            />
          </div>
        </div>
      )}

      {/* ====== 文案模板模式 ====== */}
      {activeTab === 'text' && (
        <div className="flex-1 flex flex-col lg:flex-row gap-4 px-4 pb-4 min-h-0">
          <div className="lg:w-64 shrink-0 space-y-3 overflow-y-auto">
            <Card>
              <h3 className="text-sm font-semibold mb-3">选择模板</h3>
              <div className="flex flex-col gap-1">
                {textTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setSelectedTextTemplate(t.id); setTextVariables({}) }}
                    className={`text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                      selectedTextTemplate === t.id
                        ? 'bg-primary text-white'
                        : 'bg-bg-card border border-border hover:border-primary'
                    }`}
                  >
                    <div className="font-medium">{t.name}</div>
                    <div className="opacity-70">{t.platform}</div>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold mb-3">填写变量</h3>
              <div className="space-y-2">
                {textTemplate.variables.map((v) => (
                  <div key={v}>
                    <label className="text-xs text-text-muted">{v}</label>
                    <input
                      type="text"
                      value={textVariables[v] || ''}
                      onChange={(e) =>
                        setTextVariables((prev) => ({ ...prev, [v]: e.target.value }))
                      }
                      className="w-full px-2 py-1.5 rounded border border-border bg-bg text-xs mt-0.5"
                      placeholder={`输入${v}`}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="flex-1">
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">{textTemplate.title}</h3>
                <button
                  onClick={handleCopyText}
                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs cursor-pointer hover:opacity-90 transition-opacity"
                >
                  复制文案
                </button>
              </div>
              <div className="bg-bg-card rounded-lg p-4 whitespace-pre-wrap text-sm font-mono leading-relaxed">
                {textPreview}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}