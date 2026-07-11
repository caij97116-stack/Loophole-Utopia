import { useState, useRef, useCallback, useEffect } from 'react'
import { BackButton, Card, Section, Tag, ModelViewer } from '@/components/ui'
import { generateBadgeGLB, generateAcrylicGLB, generateStickerGLB, generateRubberGLB } from '@/utils/glbGenerator'
import type { BadgeOptions, AcrylicOptions, StickerOptions, RubberOptions } from '@/utils/glbGenerator'

type GoodsType = 'badge' | 'acrylic' | 'sticker' | 'rubber'
type DiecutShape = 'heart' | 'star' | 'hexagon' | 'cloud' | 'irregular' | 'diamond' | 'flower'

const goodsConfigs = [
  {
    type: 'badge' as GoodsType, label: '吧唧',
    shapes: [
      { id: 'circle', name: '圆形' }, { id: 'square', name: '方形' },
      { id: 'heart', name: '心形' }, { id: 'star', name: '星形' },
      { id: 'hexagon', name: '六边形' }, { id: 'diamond', name: '菱形' },
    ],
    sizes: [
      { id: '58mm', name: '58mm标准', scale: 1.0 },
      { id: '75mm', name: '75mm大', scale: 1.3 },
      { id: '44mm', name: '44mm迷你', scale: 0.75 },
      { id: '100mm', name: '100mm超大', scale: 1.7 },
    ],
    effects: [
      { id: 'matte', name: '磨砂', roughness: 0.7, metalness: 0 },
      { id: 'glitter', name: '星幻', roughness: 0.25, metalness: 0.4 },
      { id: 'laser', name: '镭射', roughness: 0.08, metalness: 0.8 },
      { id: 'silver', name: '银底', roughness: 0.15, metalness: 0.95 },
      { id: 'gold', name: '金底', roughness: 0.15, metalness: 0.95 },
      { id: 'holographic', name: '全息', roughness: 0.05, metalness: 0.5 },
      { id: 'none', name: '亮膜', roughness: 0.12, metalness: 0.05 },
    ],
  },
  {
    type: 'acrylic' as GoodsType, label: '亚克力',
    shapes: [
      { id: 'circle', name: '圆形' }, { id: 'rect', name: '矩形' },
      { id: 'diecut', name: '异形' }, { id: 'heart', name: '心形' },
      { id: 'star', name: '星形' },
    ],
    sizes: [
      { id: 'small', name: '5cm', scale: 0.85 },
      { id: 'medium', name: '8cm', scale: 1.35 },
      { id: 'large', name: '12cm', scale: 2.0 },
    ],
    effects: [
      { id: 'clear', name: '透明', roughness: 0.02, metalness: 0.02 },
      { id: 'frosted', name: '磨砂', roughness: 0.4, metalness: 0 },
      { id: 'pearl', name: '珠光', roughness: 0.15, metalness: 0.2 },
      { id: 'none', name: '白底', roughness: 0.3, metalness: 0 },
    ],
  },
  {
    type: 'sticker' as GoodsType, label: '贴纸',
    shapes: [
      { id: 'circle', name: '圆形' }, { id: 'rect', name: '矩形' },
      { id: 'diecut', name: '异形' }, { id: 'heart', name: '心形' },
    ],
    sizes: [
      { id: 'small', name: '5cm', scale: 0.85 },
      { id: 'medium', name: '8cm', scale: 1.35 },
      { id: 'large', name: '10cm', scale: 1.7 },
    ],
    effects: [
      { id: 'laser', name: '镭射', roughness: 0.08, metalness: 0.7 },
      { id: 'matte', name: '磨砂', roughness: 0.6, metalness: 0 },
      { id: 'none', name: '普通', roughness: 0.4, metalness: 0 },
    ],
  },
  {
    type: 'rubber' as GoodsType, label: '橡胶',
    shapes: [
      { id: 'circle', name: '圆形' }, { id: 'diecut', name: '异形' },
      { id: 'heart', name: '心形' }, { id: 'star', name: '星形' },
    ],
    sizes: [
      { id: 'small', name: '4cm', scale: 0.7 },
      { id: 'medium', name: '6cm', scale: 1.0 },
      { id: 'large', name: '8cm', scale: 1.35 },
    ],
    effects: [
      { id: 'none', name: '标准', roughness: 0.65, metalness: 0 },
      { id: 'glossy', name: '亮面', roughness: 0.3, metalness: 0.05 },
    ],
  },
]

const diecutOptions: { id: DiecutShape; name: string }[] = [
  { id: 'heart', name: '心形' },
  { id: 'star', name: '星形' },
  { id: 'hexagon', name: '六边形' },
  { id: 'diamond', name: '菱形' },
  { id: 'flower', name: '花形' },
  { id: 'cloud', name: '云朵' },
  { id: 'irregular', name: '不规则' },
]

// ---- Main Page ----
export default function GoodsRenderer() {
  const [goodsType, setGoodsType] = useState<GoodsType>('badge')
  const [shape, setShape] = useState('circle')
  const [size, setSize] = useState('58mm')
  const [effect, setEffect] = useState('matte')
  const [baseColor, setBaseColor] = useState('#f8c8dc')
  const [diecutShape, setDiecutShape] = useState<DiecutShape>('heart')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [glbUrl, setGlbUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const config = goodsConfigs.find((g) => g.type === goodsType)!
  const activeShape = config.shapes.find((s) => s.id === shape)!
  const activeSize = config.sizes.find((s) => s.id === size)!
  const activeEffect = config.effects.find((e) => e.id === effect)!

  // GLB 生成
  useEffect(() => {
    let cancelled = false
    const oldUrl = glbUrl

    async function generate() {
      let glb: ArrayBuffer
      if (goodsType === 'badge') {
        const glbShape = shape as BadgeOptions['shape']
        glb = await generateBadgeGLB({
          shape: glbShape,
          size: activeSize.scale,
          roughness: activeEffect.roughness,
          metalness: activeEffect.metalness,
          baseColor,
          imageDataUrl: uploadedImage ?? undefined,
        } satisfies BadgeOptions)
      } else if (goodsType === 'acrylic') {
        const glbShape = (shape === 'rect' ? 'rectangle' : shape) as AcrylicOptions['shape']
        glb = await generateAcrylicGLB({
          shape: glbShape,
          diecutShape,
          size: activeSize.scale,
          roughness: activeEffect.roughness,
          metalness: activeEffect.metalness,
          imageDataUrl: uploadedImage ?? undefined,
        } satisfies AcrylicOptions)
      } else if (goodsType === 'sticker') {
        const glbShape = (shape === 'rect' ? 'rectangle' : shape) as StickerOptions['shape']
        glb = await generateStickerGLB({
          shape: glbShape,
          diecutShape,
          size: activeSize.scale,
          roughness: activeEffect.roughness,
          metalness: activeEffect.metalness,
          baseColor,
          imageDataUrl: uploadedImage ?? undefined,
        } satisfies StickerOptions)
      } else {
        glb = await generateRubberGLB({
          shape: shape as RubberOptions['shape'],
          diecutShape,
          size: activeSize.scale,
          roughness: activeEffect.roughness,
          baseColor,
          imageDataUrl: uploadedImage ?? undefined,
        } satisfies RubberOptions)
      }

      if (cancelled) return
      const newUrl = URL.createObjectURL(new Blob([glb], { type: 'model/gltf-binary' }))
      setGlbUrl(newUrl)
      if (oldUrl) URL.revokeObjectURL(oldUrl)
    }

    generate()
    return () => {
      cancelled = true
    }
  }, [goodsType, shape, size, effect, baseColor, uploadedImage, diecutShape, activeSize.scale, activeEffect.roughness, activeEffect.metalness, glbUrl])

  // 组件卸载时清理 Blob URL
  useEffect(() => {
    return () => {
      if (glbUrl) URL.revokeObjectURL(glbUrl)
    }
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => setUploadedImage(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleClearImage = useCallback(() => {
    setUploadedImage(null)
    setFileName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const handleTypeChange = useCallback((type: GoodsType) => {
    setGoodsType(type)
    const cfg = goodsConfigs.find((g) => g.type === type)!
    setShape(cfg.shapes[0].id)
    setSize(cfg.sizes[0].id)
    setEffect(cfg.effects[0].id)
    setDiecutShape('heart')
  }, [])

  const showDiecutSelect = shape === 'diecut'

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 pb-0">
        <BackButton to="/goods" label="返回周边制作" />
        <Section
          title="周边渲染器"
          icon="🎨"
          description="上传设计图 → 实时PBR材质渲染 → 旋转查看 · 吧唧/亚克力/贴纸/橡胶"
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0">
        {/* 左侧控制面板 */}
        <div className="lg:w-64 shrink-0 space-y-3 overflow-y-auto">
          {/* 周边类型 */}
          <Card>
            <h3 className="text-sm font-semibold mb-3">周边类型</h3>
            <div className="flex flex-wrap gap-2">
              {goodsConfigs.map((g) => (
                <button
                  key={g.type}
                  onClick={() => handleTypeChange(g.type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    goodsType === g.type
                      ? 'bg-primary text-white'
                      : 'bg-bg-card border border-border hover:border-primary'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </Card>

          {/* 形状 */}
          <Card>
            <h3 className="text-sm font-semibold mb-3">形状</h3>
            <div className="flex flex-wrap gap-2">
              {config.shapes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setShape(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    shape === s.id
                      ? 'bg-primary text-white'
                      : 'bg-bg-card border border-border hover:border-primary'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </Card>

          {/* 异形样式 */}
          {showDiecutSelect && (
            <Card>
              <h3 className="text-sm font-semibold mb-3">异形样式</h3>
              <div className="flex flex-wrap gap-2">
                {diecutOptions.map((ds) => (
                  <button
                    key={ds.id}
                    onClick={() => setDiecutShape(ds.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      diecutShape === ds.id
                        ? 'bg-primary text-white'
                        : 'bg-bg-card border border-border hover:border-primary'
                    }`}
                  >
                    {ds.name}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* 尺寸 */}
          <Card>
            <h3 className="text-sm font-semibold mb-3">尺寸</h3>
            <div className="flex flex-wrap gap-2">
              {config.sizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSize(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    size === s.id
                      ? 'bg-primary text-white'
                      : 'bg-bg-card border border-border hover:border-primary'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </Card>

          {/* 表面效果 */}
          <Card>
            <h3 className="text-sm font-semibold mb-3">表面效果</h3>
            <div className="flex flex-wrap gap-2">
              {config.effects.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setEffect(e.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    effect === e.id
                      ? 'bg-primary text-white'
                      : 'bg-bg-card border border-border hover:border-primary'
                  }`}
                >
                  {e.name}
                </button>
              ))}
            </div>
          </Card>

          {/* 颜色 */}
          <Card>
            <h3 className="text-sm font-semibold mb-3">颜色</h3>
            <div>
              <label className="text-xs text-text-muted">主色</label>
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-full h-10 rounded border cursor-pointer mt-1"
              />
            </div>
          </Card>

          {/* 设计图上传 */}
          <Card>
            <h3 className="text-sm font-semibold mb-3">设计图</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {uploadedImage ? (
              <div className="space-y-2">
                <img
                  src={uploadedImage}
                  alt="设计图"
                  className="w-full h-20 object-cover rounded-lg border border-border"
                />
                <p className="text-xs text-text-muted truncate">{fileName}</p>
                <button
                  onClick={handleClearImage}
                  className="w-full px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer"
                >
                  清除
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-3 py-2 rounded-lg text-xs font-medium border border-dashed border-border hover:border-primary text-text-muted hover:text-primary transition-colors cursor-pointer"
              >
                + 上传设计图
              </button>
            )}
            <p className="text-xs text-text-muted mt-2">推荐透明底PNG</p>
          </Card>

          <div className="text-xs text-text-muted p-2">
            <p className="text-primary">自动旋转预览 · 拖拽旋转 · 滚轮缩放 · 右键平移</p>
          </div>
        </div>

        {/* 右侧 3D 渲染区 */}
        <div className="flex-1 bg-bg-card rounded-2xl overflow-hidden min-h-[500px]">
          {glbUrl ? (
            <ModelViewer
              src={glbUrl}
              autoRotate={true}
              exposure={1.1}
              shadowIntensity={0.6}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full" />
                <span className="text-sm text-text-muted">生成 3D 模型中...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 flex gap-4 text-xs text-text-muted">
        <Tag variant="default">
          {config.label} | {activeShape.name} | {activeSize.name} | {activeEffect.name}
        </Tag>
        <Tag variant="info">PBR实时渲染 · 环境反射 · 柔光阴影 · 效果以实物为准</Tag>
      </div>
    </div>
  )
}