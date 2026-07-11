import { useState, useRef, useMemo, Suspense, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { BackButton, Section, Card } from '@/components/ui'

// ---- 封面图片切分工具 ----
function splitCoverImage(
  img: HTMLImageElement,
  spineRatio: number, // 书脊占封面总宽的比例
): { front: string; spine: string; back: string } {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const w = img.width
  const h = img.height

  const spineW = Math.round(w * spineRatio)
  const coverW = Math.round((w - spineW) / 2)

  // 假设图片布局：back | spine | front
  const backStart = 0
  const spineStart = coverW
  const frontStart = coverW + spineW

  function crop(sx: number, sw: number): string {
    canvas.width = sw
    canvas.height = h
    ctx.clearRect(0, 0, sw, h)
    ctx.drawImage(img, sx, 0, sw, h, 0, 0, sw, h)
    return canvas.toDataURL('image/png')
  }

  return {
    back: crop(backStart, coverW),
    spine: crop(spineStart, spineW),
    front: crop(frontStart, coverW),
  }
}

function createCanvasTexture(dataUrl: string): THREE.CanvasTexture {
  const img = new Image()
  img.src = dataUrl
  const canvas = document.createElement('canvas')
  canvas.width = img.width || 512
  canvas.height = img.height || 512
  const ctx = canvas.getContext('2d')!
  // 需要等图片加载完，但这里用同步方式
  // 实际上 dataUrl 图片浏览器已缓存，可以同步绘制
  ctx.drawImage(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

// ---- 3D 书本模型 ----
function BookModel({
  coverImage,
  spineRatio,
  bookWidth,
  bookHeight,
  coverThickness,
  spineWidth,
  pageCount,
  isOpen,
  openAngle,
  paperColor,
}: {
  coverImage: string | null
  spineRatio: number
  bookWidth: number
  bookHeight: number
  coverThickness: number
  spineWidth: number
  pageCount: number
  isOpen: boolean
  openAngle: number
  paperColor: string
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const rightCoverRef = useRef<THREE.Group>(null!)
  const pageGroupRef = useRef<THREE.Group>(null!)

  // 书本尺寸
  const hw = bookWidth / 2   // 半宽（单面封面宽度）
  const ct = coverThickness   // 封面厚度
  const sw = spineWidth / 2  // 半书脊宽

  const paperMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(paperColor),
    roughness: 0.85,
    metalness: 0,
  }), [paperColor])

  // 加载封面纹理
  const textures = useMemo(() => {
    if (!coverImage) return null
    const img = document.createElement('img')
    img.src = coverImage
    // 尝试用 Canvas 切分
    try {
      const parts = splitCoverImage(img, spineRatio)
      return {
        front: createCanvasTexture(parts.front),
        spine: createCanvasTexture(parts.spine),
        back: createCanvasTexture(parts.back),
      }
    } catch {
      // 如果切分失败，用原图做封面
      const tex = createCanvasTexture(coverImage)
      return { front: tex, spine: tex, back: tex }
    }
  }, [coverImage, spineRatio])

  // 材质
  const frontMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.05 })
    if (textures?.front) m.map = textures.front
    else m.color = new THREE.Color('#1e40af')
    return m
  }, [textures])

  const spineMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.05 })
    if (textures?.spine) m.map = textures.spine
    else m.color = new THREE.Color('#333333')
    return m
  }, [textures])

  const backMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.05 })
    if (textures?.back) m.map = textures.back
    else m.color = new THREE.Color('#1e3a5f')
    return m
  }, [textures])

  // 翻开动画
  useFrame(() => {
    if (rightCoverRef.current) {
      const target = isOpen ? openAngle : 0
      rightCoverRef.current.rotation.y = THREE.MathUtils.lerp(
        rightCoverRef.current.rotation.y, target, 0.08
      )
    }
    if (pageGroupRef.current) {
      const target = isOpen ? openAngle * 0.9 : 0
      pageGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        pageGroupRef.current.rotation.y, target, 0.08
      )
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ---- 书脊 ---- */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[spineWidth, bookHeight, ct + 0.01]} />
        <primitive object={spineMat} attach="material" />
      </mesh>

      {/* ---- 左封面 = 封底 ---- */}
      <mesh position={[-sw - hw, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[bookWidth, bookHeight, ct]} />
        <primitive object={backMat} attach="material" />
      </mesh>

      {/* ---- 右封面 = 封面（翻开动画） ---- */}
      <group ref={rightCoverRef} position={[sw + hw, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[bookWidth, bookHeight, ct]} />
          <primitive object={frontMat} attach="material" />
        </mesh>
      </group>

      {/* ---- 书页叠层 ---- */}
      <group ref={pageGroupRef} position={[sw + 0.01, 0, ct / 2]}>
        {Array.from({ length: Math.min(pageCount, 8) }).map((_, i) => {
          const pageThickness = 0.008
          const z = i * pageThickness * 1.2
          return (
            <mesh key={`page-${i}`} position={[0, 0, z]}>
              <boxGeometry args={[bookWidth - 0.04, bookHeight - 0.1, pageThickness]} />
              <primitive object={paperMat} attach="material" />
            </mesh>
          )
        })}
        {/* 最后一张可见页 */}
        <mesh position={[0, 0, Math.min(pageCount, 8) * 0.008 * 1.2]}>
          <boxGeometry args={[bookWidth - 0.04, bookHeight - 0.1, 0.005]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
      </group>
    </group>
  )
}

// ---- 3D 场景 ----
function BookScene(props: {
  coverImage: string | null
  spineRatio: number
  bookWidth: number
  bookHeight: number
  coverThickness: number
  spineWidth: number
  pageCount: number
  isOpen: boolean
  openAngle: number
  paperColor: string
  bgColor: string
  transparentBg: boolean
}) {
  const { gl, scene } = useThree()

  useEffect(() => {
    if (props.transparentBg) {
      gl.setClearColor(0x000000, 0)
      scene.background = null
    } else {
      gl.setClearColor(new THREE.Color(props.bgColor), 1)
      scene.background = new THREE.Color(props.bgColor)
    }
  }, [props.bgColor, props.transparentBg, gl, scene])

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} />

      <BookModel
        coverImage={props.coverImage}
        spineRatio={props.spineRatio}
        bookWidth={props.bookWidth}
        bookHeight={props.bookHeight}
        coverThickness={props.coverThickness}
        spineWidth={props.spineWidth}
        pageCount={props.pageCount}
        isOpen={props.isOpen}
        openAngle={props.openAngle}
        paperColor={props.paperColor}
      />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI * 5 / 6}
        minDistance={3}
        maxDistance={10}
        autoRotate={!props.isOpen}
        autoRotateSpeed={1.0}
      />

      {!props.isOpen && (
        <ContactShadows position={[0, -props.bookHeight / 2 - 0.2, 0]} opacity={0.4} scale={8} blur={3} far={4} />
      )}
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full w-full bg-bg-card">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full" />
        <span className="text-sm text-text-muted">3D 引擎加载中...</span>
      </div>
    </div>
  )
}

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
  const [bgColor, setBgColor] = useState('#e8e8e8')
  const [transparentBg, setTransparentBg] = useState(false)
  const [downloadRes, setDownloadRes] = useState(1)

  const preset = formatPresets.find((f) => f.id === format)!
  const bookWidth = format === 'custom' ? customW : preset.w
  const bookHeight = format === 'custom' ? customH : preset.h
  const actualSpine = format === 'custom' ? spineWidth : preset.spine

  // 3D中的尺寸（毫米转单位）
  const scale3D = 0.018
  const modelW = bookWidth * scale3D
  const modelH = bookHeight * scale3D
  const modelSpine = actualSpine * scale3D

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setCoverImage(dataUrl)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDownload = useCallback(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    const scale = downloadRes
    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = canvas.width * scale
    exportCanvas.height = canvas.height * scale
    const ctx = exportCanvas.getContext('2d')!
    ctx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height)
    const link = document.createElement('a')
    link.download = `book-3d-${scale}x.png`
    link.href = exportCanvas.toDataURL('image/png')
    link.click()
  }, [downloadRes])

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 pb-0">
        <BackButton to="/book" label="返回书本制作" />
        <Section title="3D 书本实机预览" icon="📖" description="上传封面图 → 贴到3D书本模型 → 旋转查看 → 下载高清渲染图" />
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
                    <img src={coverImage} alt="封面" className="w-full h-24 object-cover rounded-lg" />
                    <p className="text-xs text-text-muted truncate">{fileName}</p>
                    <span className="text-xs text-primary">点击更换</span>
                  </div>
                ) : (
                  <div className="space-y-2 py-2">
                    <span className="text-2xl block">🖼️</span>
                    <p className="text-sm text-text-muted">上传封面图</p>
                    <p className="text-xs text-text-muted">（前端+书脊+封底）</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
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
                  <input type="number" value={customW} onChange={(e) => setCustomW(Number(e.target.value))} className="w-full px-2 py-1 rounded border border-border text-sm" />
                </div>
                <div>
                  <label className="text-xs text-text-muted">高 (mm)</label>
                  <input type="number" value={customH} onChange={(e) => setCustomH(Number(e.target.value))} className="w-full px-2 py-1 rounded border border-border text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-text-muted">书脊 (mm)</label>
                  <input type="number" value={spineWidth} onChange={(e) => setSpineWidth(Number(e.target.value))} className="w-full px-2 py-1 rounded border border-border text-sm" />
                </div>
              </div>
            )}
            <p className="text-xs text-text-muted mt-2">
              {bookWidth} × {bookHeight}mm · 书脊 {actualSpine}mm
            </p>
          </Card>

          {/* 书脊比例 */}
          <Card>
            <h3 className="font-semibold text-sm mb-3">书脊切分</h3>
            <label className="text-xs text-text-muted">书脊占封面图比例: {Math.round(spineRatio * 100)}%</label>
            <input
              type="range" min={2} max={20} value={Math.round(spineRatio * 100)}
              onChange={(e) => setSpineRatio(Number(e.target.value) / 100)}
              className="w-full mt-1"
            />
            <p className="text-xs text-text-muted mt-1">图片布局：封底 | 书脊 | 封面</p>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-muted">内页</label>
                <input type="color" value={paperColor} onChange={(e) => setPaperColor(e.target.value)} className="w-full h-10 rounded border cursor-pointer" />
              </div>
              <div>
                <label className="text-xs text-text-muted">背景</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded border cursor-pointer" />
              </div>
            </div>
            <label className="flex items-center gap-2 mt-2 text-xs cursor-pointer">
              <input type="checkbox" checked={transparentBg} onChange={(e) => setTransparentBg(e.target.checked)} />
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
                <option value={1}>1x 分辨率（Web）</option>
                <option value={2}>2x 分辨率（高清）</option>
                <option value={3}>3x 分辨率（打印）</option>
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
        <div className="flex-1 bg-bg-card rounded-2xl overflow-hidden min-h-[500px] relative">
          <Suspense fallback={<LoadingFallback />}>
            <Canvas
              camera={{ position: [0, 0.3, 6.5], fov: 38 }}
              gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
              style={{ width: '100%', height: '100%' }}
            >
              <BookScene
                coverImage={coverImage}
                spineRatio={spineRatio}
                bookWidth={modelW}
                bookHeight={modelH}
                coverThickness={0.08}
                spineWidth={modelSpine}
                pageCount={8}
                isOpen={isOpen}
                openAngle={Math.PI * 0.55}
                paperColor={paperColor}
                bgColor={bgColor}
                transparentBg={transparentBg}
              />
            </Canvas>
          </Suspense>

          {/* 未上传封面时的提示 */}
          {!coverImage && (
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