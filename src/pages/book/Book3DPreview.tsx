/**
 * Book3DPreview - 纯 Three.js 书本渲染 v2
 * 参考 WitCreateYour3DCover + 柔造小程序 渲染效果
 * 环境贴图 + PBR材质 + 圆脊 + 飘口 + 封面拆分 + 书脊文字
 */
import { useState, useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { BackButton, Section, Card } from '@/components/ui'

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

// ---- 环境贴图生成器 ----
function createEnvMap(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer)
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#f5f5f5')
  // 使用简单的渐变环境
  const envCanvas = document.createElement('canvas')
  envCanvas.width = 256
  envCanvas.height = 256
  const ctx = envCanvas.getContext('2d')!
  const grad = ctx.createRadialGradient(128, 80, 20, 128, 128, 200)
  grad.addColorStop(0, '#ffffff')
  grad.addColorStop(0.4, '#e8e8f0')
  grad.addColorStop(0.7, '#c8c8d8')
  grad.addColorStop(1, '#8888a0')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 256, 256)
  const envTex = new THREE.CanvasTexture(envCanvas)
  envTex.colorSpace = THREE.SRGBColorSpace
  envTex.mapping = THREE.EquirectangularReflectionMapping
  const rt = pmrem.fromEquirectangular(envTex)
  pmrem.dispose()
  envTex.dispose()
  return rt.texture
}

// ---- 封面拆分 ----
async function splitCover(img: HTMLImageElement, spineRatio: number): Promise<{ front: THREE.CanvasTexture; back: THREE.CanvasTexture; spine: THREE.CanvasTexture } | null> {
  const cw = img.width
  const ch = img.height
  const spineW = Math.round(cw * Math.max(0.02, Math.min(0.2, spineRatio)))
  const coverW = Math.round((cw - spineW) / 2)
  if (coverW <= 0 || ch <= 0) return null

  const canvas = document.createElement('canvas')
  function crop(sx: number, sw: number): THREE.CanvasTexture {
    canvas.width = Math.max(sw, 1)
    canvas.height = Math.max(ch, 1)
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, sx, 0, sw, ch, 0, 0, canvas.width, canvas.height)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
    tex.needsUpdate = true
    return tex
  }
  return {
    back: crop(0, coverW),
    spine: crop(coverW, spineW),
    front: crop(coverW + spineW, coverW),
  }
}

// ---- 书脊文字 Canvas ----
function makeSpineTextTexture(text: string, h: number): THREE.CanvasTexture {
  const w = 128
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = Math.max(1, Math.round(h * 0.08))
  const ctx = canvas.getContext('2d')!
  const chars = text.split('')
  const fontSize = Math.min(20, Math.floor(w / chars.length * 1.5))
  ctx.font = `bold ${fontSize}px "Noto Sans SC", "Microsoft YaHei", sans-serif`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const startY = canvas.height / 2 - ((chars.length - 1) * fontSize * 1.3) / 2
  chars.forEach((c, i) => ctx.fillText(c, w / 2, startY + i * fontSize * 1.3))
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

// ============================================================
// 3D 场景 Hook
// ============================================================
function useBookScene(
  containerRef: React.RefObject<HTMLDivElement | null>,
  opts: {
    bookW: number; bookH: number; spineW: number
    coverImage: string | null; spineRatio: number; spineText: string
    paperColor: string; edgeColor: string; bgColor: string; isOpen: boolean
  },
) {
  const sceneRef = useRef<{
    scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer
    controls: OrbitControls; bookGroup: THREE.Group
    frontGroup: THREE.Group; frontMat: THREE.MeshStandardMaterial
    backMat: THREE.MeshStandardMaterial; spineMat: THREE.MeshStandardMaterial
    spineLabel: THREE.Mesh | null; envMap: THREE.Texture
    animateId: number; disposed: boolean
  } | null>(null)

  // 初始化场景 (只执行一次)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(35, rect.width / rect.height, 0.1, 50)
    // 3/4 视角：从右上方看
    camera.position.set(3.5, 1.8, 5.0)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    renderer.setSize(rect.width, rect.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    // 环境贴图
    const envMap = createEnvMap(renderer)
    scene.environment = envMap

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 2.5
    controls.maxDistance = 10
    controls.minPolarAngle = 0.3
    controls.maxPolarAngle = Math.PI - 0.3
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.8
    controls.target.set(0, 0, 0)

    // 灯光：三点照明
    const ambient = new THREE.AmbientLight('#ffffff', 0.6)
    scene.add(ambient)

    const key = new THREE.DirectionalLight('#ffffff', 4.0)
    key.position.set(5, 8, 6)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.near = 0.5
    key.shadow.camera.far = 30
    key.shadow.camera.left = -10
    key.shadow.camera.right = 10
    key.shadow.camera.top = 10
    key.shadow.camera.bottom = -10
    key.shadow.bias = -0.00005
    key.shadow.normalBias = 0.02
    scene.add(key)

    const fill = new THREE.DirectionalLight('#c8d6ff', 1.5)
    fill.position.set(-4, 3, -3)
    scene.add(fill)

    const rim = new THREE.DirectionalLight('#ffffff', 1.0)
    rim.position.set(0, -0.5, 5)
    scene.add(rim)

    // 地面
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({ opacity: 0.25 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -1.6
    ground.receiveShadow = true
    scene.add(ground)

    // 书本组
    const bookGroup = new THREE.Group()
    const frontGroup = new THREE.Group()
    const frontMat = new THREE.MeshStandardMaterial({ roughness: 0.2, metalness: 0.05 })
    const backMat = new THREE.MeshStandardMaterial({ roughness: 0.2, metalness: 0.05 })
    const spineMat = new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.05 })
    let spineLabel: THREE.Mesh | null = null

    scene.add(bookGroup)
    bookGroup.add(frontGroup)

    const state = { scene, camera, renderer, controls, bookGroup, frontGroup, frontMat, backMat, spineMat, spineLabel, envMap, animateId: 0, disposed: false }
    sceneRef.current = state

    function animate() {
      if (state.disposed) return
      state.animateId = requestAnimationFrame(animate)
      state.controls.update()
      state.renderer.render(state.scene, state.camera)
    }
    animate()

    const ro = new ResizeObserver(() => {
      const r = container.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) {
        camera.aspect = r.width / r.height
        camera.updateProjectionMatrix()
        renderer.setSize(r.width, r.height)
      }
    })
    ro.observe(container)

    return () => {
      state.disposed = true
      ro.disconnect()
      cancelAnimationFrame(state.animateId)
      state.controls.dispose()
      state.envMap.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [containerRef])

  // 更新书本模型
  useEffect(() => {
    const state = sceneRef.current
    if (!state) return

    const { bookW, bookH, spineW, coverImage, spineRatio, spineText, paperColor, edgeColor, bgColor, isOpen } = opts
    const scale = 0.018
    const hw = bookW * scale / 2
    const hh = bookH * scale / 2
    const sw = spineW * scale / 2
    const ct = 0.06 // 封面厚度
    const pageDepth = 0.12
    const overhang = 0.05

    // 更新背景色
    state.scene.background = new THREE.Color(bgColor)

    // 清空旧模型
    state.bookGroup.clear()
    state.frontGroup.clear()
    if (state.spineLabel) {
      state.spineLabel.geometry?.dispose()
      ;(state.spineLabel.material as THREE.Material)?.dispose()
    }
    state.spineLabel = null

    const paperMat = new THREE.MeshStandardMaterial({
      roughness: 0.9,
      metalness: 0,
      color: new THREE.Color(paperColor),
    })
    const edgeMat = new THREE.MeshStandardMaterial({
      roughness: 0.35,
      metalness: edgeColor === '#ffd700' || edgeColor === '#c0c0c0' ? 0.6 : 0,
      color: new THREE.Color(edgeColor),
    })

    const s = state

    async function loadCovers() {
      // 默认材质（无封面时好看的渐变）
      s.frontMat.color.set('#2c3e80')
      s.frontMat.map = null
      s.frontMat.needsUpdate = true
      s.backMat.color.set('#1a2744')
      s.backMat.map = null
      s.backMat.needsUpdate = true
      s.spineMat.color.set('#1e2d50')
      s.spineMat.map = null
      s.spineMat.needsUpdate = true

      if (coverImage) {
        const img = await new Promise<HTMLImageElement>((res, rej) => {
          const i = new Image()
          i.crossOrigin = 'anonymous'
          i.onload = () => res(i)
          i.onerror = rej
          i.src = coverImage
        }).catch(() => null)
        if (img) {
          const texs = await splitCover(img, spineRatio)
          if (texs) {
            s.frontMat.map = texs.front
            s.frontMat.color.set('#ffffff')
            s.frontMat.needsUpdate = true
            s.backMat.map = texs.back
            s.backMat.color.set('#ffffff')
            s.backMat.needsUpdate = true
            s.spineMat.map = texs.spine
            s.spineMat.color.set('#ffffff')
            s.spineMat.needsUpdate = true
          }
        }
      }
      if (s.disposed) return
      buildBook()
    }

    function buildBook() {
      const group = s.bookGroup
      const fg = s.frontGroup

      // ---- 封底 ----
      const coverW = bookW * scale + overhang
      const coverH = bookH * scale + overhang
      const backCover = new THREE.Mesh(
        new THREE.BoxGeometry(coverW, coverH, ct),
        s.backMat,
      )
      backCover.position.set(-sw - hw, 0, 0)
      backCover.castShadow = true
      backCover.receiveShadow = true
      group.add(backCover)

      // ---- 左页块（固定） ----
      const pageW = bookW * scale - 0.04
      const pageH = bookH * scale - 0.08
      const leftPages = new THREE.Mesh(
        new THREE.BoxGeometry(pageW, pageH, pageDepth),
        paperMat,
      )
      leftPages.position.set(-sw, 0, ct / 2 + pageDepth / 2)
      leftPages.castShadow = true
      leftPages.receiveShadow = true
      group.add(leftPages)

      // ---- 书口（上/下/侧边） ----
      const sideEdge = new THREE.Mesh(
        new THREE.BoxGeometry(0.012, pageH, pageDepth),
        edgeMat,
      )
      sideEdge.position.set(hw - sw - 0.02, 0, ct / 2 + pageDepth / 2)
      group.add(sideEdge)

      const topEdge = new THREE.Mesh(
        new THREE.BoxGeometry(pageW, 0.012, pageDepth),
        edgeMat,
      )
      topEdge.position.set(-sw, hh - 0.04, ct / 2 + pageDepth / 2)
      group.add(topEdge)

      const bottomEdge = new THREE.Mesh(
        new THREE.BoxGeometry(pageW, 0.012, pageDepth),
        edgeMat,
      )
      bottomEdge.position.set(-sw, -hh + 0.04, ct / 2 + pageDepth / 2)
      group.add(bottomEdge)

      // ---- 右页块（翻开时旋转） ----
      const rpg = new THREE.Group()
      rpg.position.set(sw + 0.01, 0, ct / 2 + pageDepth / 2)
      rpg.rotation.y = isOpen ? Math.PI * 0.45 : 0
      const rp = new THREE.Mesh(
        new THREE.BoxGeometry(pageW, pageH, pageDepth),
        paperMat,
      )
      rp.castShadow = true
      rpg.add(rp)
      const re = new THREE.Mesh(
        new THREE.BoxGeometry(0.012, pageH, pageDepth),
        edgeMat,
      )
      re.position.set(hw - 0.02, 0, 0)
      rpg.add(re)
      group.add(rpg)

      // ---- 封面 ----
      fg.position.set(sw + hw, 0, 0)
      fg.rotation.y = isOpen ? Math.PI * 0.5 : 0
      const frontCover = new THREE.Mesh(
        new THREE.BoxGeometry(coverW, coverH, ct),
        s.frontMat,
      )
      frontCover.castShadow = true
      frontCover.receiveShadow = true
      fg.add(frontCover)

      // ---- 书脊 ----
      const spineGeom = new THREE.BoxGeometry(sw * 2, coverH, ct + pageDepth)
      const spineMesh = new THREE.Mesh(spineGeom, s.spineMat)
      spineMesh.position.set(0, 0, pageDepth / 2)
      spineMesh.castShadow = true
      spineMesh.receiveShadow = true
      group.add(spineMesh)

      // ---- 书脊文字 ----
      if (spineText) {
        const tex = makeSpineTextTexture(spineText, bookH)
        const labelGeom = new THREE.PlaneGeometry(sw * 1.6, bookH * scale * 0.75)
        const labelMat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          depthTest: false,
          depthWrite: false,
        })
        const label = new THREE.Mesh(labelGeom, labelMat)
        label.position.set(0, 0, pageDepth / 2 + ct / 2 + 0.002)
        label.renderOrder = 1
        group.add(label)
        s.spineLabel = label
      }

      // ---- 书签带 ----
      const ribbonMat = new THREE.MeshStandardMaterial({
        roughness: 0.5,
        metalness: 0,
        color: '#e74c3c',
      })
      const ribbon = new THREE.Mesh(
        new THREE.BoxGeometry(0.025, 0.5, 0.003),
        ribbonMat,
      )
      ribbon.position.set(0, -hh + 0.35, ct / 2 + pageDepth + 0.005)
      group.add(ribbon)
      const ribbonTail = new THREE.Mesh(
        new THREE.BoxGeometry(0.025, 0.25, 0.003),
        ribbonMat,
      )
      ribbonTail.position.set(0, -hh - 0.05, ct / 2 + pageDepth + 0.005)
      group.add(ribbonTail)
    }

    loadCovers()
  }, [opts.bookW, opts.bookH, opts.spineW, opts.coverImage, opts.spineRatio, opts.spineText, opts.paperColor, opts.edgeColor, opts.bgColor, opts.isOpen])

  return sceneRef
}

// ============================================================
// 主页面
// ============================================================
export default function Book3DPreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [format, setFormat] = useState('a5')
  const [customW, setCustomW] = useState(148)
  const [customH, setCustomH] = useState(210)
  const [spineWidth, setSpineWidth] = useState(8)
  const [spineRatio, setSpineRatio] = useState(0.06)
  const [spineText, setSpineText] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [paperColor, setPaperColor] = useState('#fef3c7')
  const [edgeColor, setEdgeColor] = useState('cream')
  const [bgColor, setBgColor] = useState('#e8e8e8')
  const [downloadRes, setDownloadRes] = useState(1)

  const preset = formatPresets.find((f) => f.id === format)!
  const bookW = format === 'custom' ? customW : preset.w
  const bookH = format === 'custom' ? customH : preset.h
  const actualSpine = format === 'custom' ? spineWidth : preset.spine
  const activeEdgeColor = edgeColorOptions.find((e) => e.id === edgeColor)!.color

  useBookScene(containerRef, {
    bookW, bookH, spineW: actualSpine,
    coverImage, spineRatio, spineText,
    paperColor, edgeColor: activeEdgeColor, bgColor, isOpen,
  })

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => setCoverImage(ev.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDownload = useCallback(() => {
    const canvas = containerRef.current?.querySelector('canvas') as HTMLCanvasElement | null
    if (!canvas) return
    const scale = downloadRes
    const exportC = document.createElement('canvas')
    exportC.width = canvas.width * scale
    exportC.height = canvas.height * scale
    const ctx = exportC.getContext('2d')!
    ctx.drawImage(canvas, 0, 0, exportC.width, exportC.height)
    const link = document.createElement('a')
    link.download = `book-3d-${scale}x.png`
    link.href = exportC.toDataURL('image/png')
    link.click()
  }, [downloadRes])

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 pb-0">
        <BackButton to="/book" label="返回书本制作" />
        <Section title="3D 书本实机预览" icon="📖"
          description="上传封面图 → 实时渲染 → 旋转查看 → 下载高清图" />
      </div>
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0">
        {/* 左侧控制 */}
        <div className="lg:w-64 shrink-0 space-y-3 overflow-y-auto">
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
                    <p className="text-xs text-text-muted">（封底+书脊+封面横排）</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {coverImage && (
              <button onClick={() => { setCoverImage(null); setFileName('') }}
                className="mt-2 w-full text-xs text-red-500 hover:underline cursor-pointer">
                清除图片
              </button>
            )}
          </Card>

          <Card>
            <h3 className="font-semibold text-sm mb-3">判型</h3>
            <select value={format} onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-sm">
              {formatPresets.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            {format === 'custom' && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div><label className="text-xs text-text-muted">宽 mm</label>
                  <input type="number" value={customW} onChange={(e) => setCustomW(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded border border-border text-sm" /></div>
                <div><label className="text-xs text-text-muted">高 mm</label>
                  <input type="number" value={customH} onChange={(e) => setCustomH(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded border border-border text-sm" /></div>
                <div className="col-span-2"><label className="text-xs text-text-muted">书脊 mm</label>
                  <input type="number" value={spineWidth} onChange={(e) => setSpineWidth(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded border border-border text-sm" /></div>
              </div>
            )}
            <p className="text-xs text-text-muted mt-2">{bookW} x {bookH}mm · 书脊 {actualSpine}mm</p>
          </Card>

          <Card>
            <h3 className="font-semibold text-sm mb-3">书脊切分</h3>
            <label className="text-xs text-text-muted">书脊占封面: {Math.round(spineRatio * 100)}%</label>
            <input type="range" min={2} max={20} value={Math.round(spineRatio * 100)}
              onChange={(e) => setSpineRatio(Number(e.target.value) / 100)} className="w-full mt-1" />
            <p className="text-xs text-text-muted mt-1">封底 | 书脊 | 封面</p>
          </Card>

          <Card>
            <h3 className="font-semibold text-sm mb-3">书脊文字</h3>
            <input type="text" value={spineText} onChange={(e) => setSpineText(e.target.value)}
              placeholder="输入书脊文字（竖排）"
              className="w-full px-2 py-1.5 rounded border border-border bg-bg text-xs" />
            <p className="text-xs text-text-muted mt-1">留空不显示</p>
          </Card>

          <Card>
            <h3 className="font-semibold text-sm mb-3">控制</h3>
            <button onClick={() => setIsOpen(!isOpen)}
              className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white cursor-pointer hover:opacity-90">
              {isOpen ? '合上书本' : '翻开书本'}
            </button>
          </Card>

          <Card>
            <h3 className="font-semibold text-sm mb-3">颜色</h3>
            <div className="space-y-3">
              <div><label className="text-xs text-text-muted">内页</label>
                <input type="color" value={paperColor} onChange={(e) => setPaperColor(e.target.value)}
                  className="w-full h-10 rounded border cursor-pointer" /></div>
              <div><label className="text-xs text-text-muted">书口</label>
                <select value={edgeColor} onChange={(e) => setEdgeColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-sm mt-1">
                  {edgeColorOptions.map((ec) => <option key={ec.id} value={ec.id}>{ec.name}</option>)}
                </select></div>
              <div><label className="text-xs text-text-muted">背景</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-10 rounded border cursor-pointer" /></div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-sm mb-3">下载</h3>
            <select value={downloadRes} onChange={(e) => setDownloadRes(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-sm mb-2">
              <option value={1}>1x 分辨率</option>
              <option value={2}>2x 高清</option>
              <option value={3}>3x 打印级</option>
            </select>
            <button onClick={handleDownload}
              className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-accent text-white cursor-pointer hover:opacity-90">
              下载渲染图
            </button>
          </Card>
        </div>

        {/* 右侧 3D 渲染 */}
        <div ref={containerRef} className="flex-1 bg-bg-card rounded-2xl overflow-hidden min-h-[500px]" />
      </div>
    </div>
  )
}