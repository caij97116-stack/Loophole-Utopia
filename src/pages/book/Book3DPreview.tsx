import { useState, useCallback, useEffect } from 'react'
import { BackButton, Section, Card, ModelViewer } from '@/components/ui'
import { generateBookGLB } from '@/utils/glbGenerator'

// ---- 判型预设 ----
const formatPresets = [
  { id: 'a5', name: 'A5 判', w: 148, h: 210, spine: 8 },
  { id: 'b6', name: 'B6 判', w: 128, h: 182, spine: 6 },
  { id: 'a6', name: 'A6 判', w: 105, h: 148, spine: 5 },
  { id: 'b5', name: 'B5 判', w: 182, h: 257, spine: 10 },
  { id: 'square', name: '正方判', w: 182, h: 182, spine: 8 },
  { id: 'a4', name: 'A4 判', w: 210, h: 297, spine: 12 },
  { id: 'custom', name: '自定义', w: 148, h: 210, spine: 8 },
]

const edgeColorOptions = [
  { id: 'white', name: '白色', color: '#f5f5f0' },
  { id: 'cream', name: '奶油', color: '#fef3c7' },
  { id: 'gold', name: '金口', color: '#ffd700' },
  { id: 'silver', name: '银口', color: '#c0c0c0' },
  { id: 'red', name: '赤口', color: '#c0392b' },
  { id: 'blue', name: '青口', color: '#2c3e80' },
  { id: 'black', name: '黑口', color: '#2d2d2d' },
]

// ---- 主页面 ----
export default function Book3DPreview() {
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [format, setFormat] = useState('a5')
  const [customW, setCustomW] = useState(148)
  const [customH, setCustomH] = useState(210)
  const [spineWidth, setSpineWidth] = useState(8)
  const [spineRatio, setSpineRatio] = useState(0.06)
  const [isOpen, setIsOpen] = useState(false)
  const [paperColor, setPaperColor] = useState('#fef3c7')
  const [edgeColor, setEdgeColor] = useState('cream')
  const [bgColor, setBgColor] = useState('#e8e8e8')
  const [transparentBg, setTransparentBg] = useState(false)
  const [downloadRes, setDownloadRes] = useState(1)
  const [glbUrl, setGlbUrl] = useState<string | null>(null)
  const [glbLoading, setGlbLoading] = useState(false)

  const preset = formatPresets.find((f) => f.id === format)!
  const bookWidth = format === 'custom' ? customW : preset.w
  const bookHeight = format === 'custom' ? customH : preset.h
  const actualSpine = format === 'custom' ? spineWidth : preset.spine

  const activeEdgeColor = edgeColorOptions.find((e) => e.id === edgeColor)!.color

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setCoverImage(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  // GLB 模型生成
  useEffect(() => {
    let cancelled = false
    const oldUrl = glbUrl

    async function generate() {
      setGlbLoading(true)
      try {
        const glb = await generateBookGLB({
          width: bookWidth,
          height: bookHeight,
          spineWidth: actualSpine,
          coverImageDataUrl: coverImage ?? undefined,
          paperColor,
          edgeColor: activeEdgeColor,
          openAngle: isOpen ? Math.PI * 0.55 : 0,
        })
        if (cancelled) return
        const newUrl = URL.createObjectURL(new Blob([glb], { type: 'model/gltf-binary' }))
        setGlbUrl(newUrl)
        if (oldUrl) URL.revokeObjectURL(oldUrl)
      } finally {
        if (!cancelled) setGlbLoading(false)
      }
    }

    generate()
    return () => { cancelled = true }
  }, [bookWidth, bookHeight, actualSpine, coverImage, paperColor, activeEdgeColor, isOpen])

  const handleDownload = useCallback(() => {
    const viewer = document.querySelector('model-viewer')
    if (!viewer || !(viewer as any).toBlob) return
    const scale = downloadRes
    ;(viewer as any).toBlob({ idealAspect: true }).then((blob: Blob) => {
      const link = document.createElement('a')
      link.download = `book-3d-${scale}x.png`
      link.href = URL.createObjectURL(blob)
      link.click()
    })
  }, [downloadRes])

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 pb-0">
        <BackButton to="/book" label="返回书本制作" />
        <Section
          title="3D 书本实机预览"
          icon="📖"
          description="上传封面图 → PBR材质渲染 → 旋转查看 → 下载高清渲染图"
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0">
        {/* 左侧控制面板 */}
        <div className="lg:w-64 shrink-0 space-y-3 overflow-y-auto">
          {/* 封面图片上传 */}
          <Card>
            <h3 className="font-semibold text-sm mb-3">封面图片</h3>
            <label className="block w-full cursor-pointer">
              <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary transition-colors">
                {coverImage ? (
                  <div className="space-y-2">
                    <img
                      src={coverImage}
                      alt="封面"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <p className="text-xs text-text-muted truncate">{fileName}</p>
                    <span className="text-xs text-primary">点击更换</span>
                  </div>
                ) : (
                  <div className="space-y-2 py-2">
                    <span className="text-2xl block">🖼️</span>
                    <p className="text-sm text-text-muted">上传封面图</p>
                    <p className="text-xs text-text-muted">（封底+书脊+封面横排）</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {coverImage && (
              <button
                onClick={() => { setCoverImage(null); setFileName('') }}
                className="mt-2 w-full text-xs text-red-500 hover:underline cursor-pointer"
              >
                清除图片
              </button>
            )}
          </Card>

          {/* 判型 */}
          <Card>
            <h3 className="font-semibold text-sm mb-3">判型</h3>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-sm"
            >
              {formatPresets.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            {format === 'custom' && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="text-xs text-text-muted">宽 (mm)</label>
                  <input
                    type="number"
                    value={customW}
                    onChange={(e) => setCustomW(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded border border-border text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-muted">高 (mm)</label>
                  <input
                    type="number"
                    value={customH}
                    onChange={(e) => setCustomH(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded border border-border text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-text-muted">书脊 (mm)</label>
                  <input
                    type="number"
                    value={spineWidth}
                    onChange={(e) => setSpineWidth(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded border border-border text-sm"
                  />
                </div>
              </div>
            )}
            <p className="text-xs text-text-muted mt-2">
              {bookWidth} x {bookHeight}mm · 书脊 {actualSpine}mm
            </p>
          </Card>

          {/* 书脊切分 */}
          <Card>
            <h3 className="font-semibold text-sm mb-3">书脊切分</h3>
            <label className="text-xs text-text-muted">
              书脊占封面: {Math.round(spineRatio * 100)}%
            </label>
            <input
              type="range"
              min={2}
              max={20}
              value={Math.round(spineRatio * 100)}
              onChange={(e) => setSpineRatio(Number(e.target.value) / 100)}
              className="w-full mt-1"
            />
            <p className="text-xs text-text-muted mt-1">封底 | 书脊 | 封面</p>
          </Card>

          {/* 控制 */}
          <Card>
            <h3 className="font-semibold text-sm mb-3">控制</h3>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white cursor-pointer hover:opacity-90 transition-opacity"
            >
              {isOpen ? '合上书本' : '翻开书本'}
            </button>
          </Card>

          {/* 颜色 */}
          <Card>
            <h3 className="font-semibold text-sm mb-3">颜色</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-text-muted">内页颜色</label>
                <input
                  type="color"
                  value={paperColor}
                  onChange={(e) => setPaperColor(e.target.value)}
                  className="w-full h-10 rounded border cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted">书口颜色</label>
                <select
                  value={edgeColor}
                  onChange={(e) => setEdgeColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-sm mt-1"
                >
                  {edgeColorOptions.map((ec) => (
                    <option key={ec.id} value={ec.id}>{ec.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-text-muted">背景颜色</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-10 rounded border cursor-pointer"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 mt-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={transparentBg}
                onChange={(e) => setTransparentBg(e.target.checked)}
              />
              透明背景（导出时）
            </label>
          </Card>

          {/* 下载 */}
          <Card>
            <h3 className="font-semibold text-sm mb-3">下载</h3>
            <div className="space-y-2">
              <select
                value={downloadRes}
                onChange={(e) => setDownloadRes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-sm"
              >
                <option value={1}>1x 分辨率</option>
                <option value={2}>2x 高清</option>
                <option value={3}>3x 打印级</option>
              </select>
              <button
                onClick={handleDownload}
                className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-accent text-white cursor-pointer hover:opacity-90 transition-opacity"
              >
                下载渲染图
              </button>
            </div>
          </Card>

          <div className="text-xs text-text-muted p-2">
            <p className="text-primary">拖拽旋转 · 滚轮缩放 · 右键平移</p>
          </div>
        </div>

        {/* 右侧 3D 渲染区 */}
        <div
          className="flex-1 bg-bg-card rounded-2xl overflow-hidden min-h-[500px] relative"
          style={{ backgroundColor: transparentBg ? 'transparent' : undefined }}
        >
          {glbUrl ? (
            <ModelViewer
              src={glbUrl}
              autoRotate={!isOpen}
              exposure={1.1}
              shadowIntensity={0.5}
            />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[500px]">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full" />
                <span className="text-sm text-text-muted">
                  {glbLoading ? '3D 模型生成中...' : '请配置参数'}
                </span>
              </div>
            </div>
          )}

          {!coverImage && glbUrl && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-text-muted text-sm bg-bg-card/80 px-4 py-2 rounded-lg">
                请先上传封面图片
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}