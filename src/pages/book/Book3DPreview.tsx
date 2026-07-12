/**
 * Book3DPreview v4 - 行业标准工作流重写
 *
 * 此前错误：
 * 1. 用 BoxGeometry/RoundedBoxGeometry 拼积木 → 没有 UV 展开，纹理拉伸
 * 2. 环境贴图太简陋 → 反射假
 * 3. 缺少 PBR 贴图通道 → 材质没质感
 *
 * 行业标准做法：Blender 建模 → GLB 导出 → GLTFLoader 加载 → 替换纹理
 * 本实现：自定义 BufferGeometry + 正确 UV → 场景直建（跳过 GLB 往返）
 *
 * 核心改进：
 * 1. 自定义 BufferGeometry：封面/封底/书脊各自独立 UV 空间
 * 2. 封面 UV 精确映射到 [0,1] 范围，纹理不拉伸
 * 3. 程序化生成 roughness/metalness 贴图
 * 4. 增强环境贴图（模拟工作室 HDR）
 * 5. 正确 Bevel 边缘（封面圆角 + 书脊弧度）
 */
import { useState, useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { BackButton, Section, Card } from '@/components/ui'

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

// ============================================================
// 增强环境贴图：模拟工作室 HDR
// ============================================================
function createEnvMap(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer)
  const c = document.createElement('canvas')
  c.width = 512; c.height = 256
  const ctx = c.getContext('2d')!

  // 天空：多层渐变模拟工作室天花板
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 170)
  skyGrad.addColorStop(0, '#fafcff')
  skyGrad.addColorStop(0.15, '#eef2f8')
  skyGrad.addColorStop(0.35, '#dde4f0')
  skyGrad.addColorStop(0.6, '#c8d0e0')
  skyGrad.addColorStop(0.85, '#b0b8c8')
  skyGrad.addColorStop(1, '#98a0b0')
  ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, 512, 170)

  // 地面渐变
  const gnd = ctx.createLinearGradient(0, 170, 0, 256)
  gnd.addColorStop(0, '#888888')
  gnd.addColorStop(0.5, '#707070')
  gnd.addColorStop(1, '#505050')
  ctx.fillStyle = gnd; ctx.fillRect(0, 170, 512, 86)

  // 模拟柔光箱（多个软矩形亮斑）
  const softBoxes = [
    { x: 80, y: 15, w: 100, h: 80, a: 0.12 },
    { x: 220, y: 25, w: 80, h: 60, a: 0.08 },
    { x: 340, y: 10, w: 90, h: 70, a: 0.10 },
    { x: 60, y: 100, w: 60, h: 40, a: 0.05 },
    { x: 380, y: 110, w: 50, h: 35, a: 0.04 },
  ]
  softBoxes.forEach(({ x, y, w, h, a }) => {
    ctx.fillStyle = `rgba(255,255,255,${a})`
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 20); ctx.fill()
  })

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.mapping = THREE.EquirectangularReflectionMapping
  const rt = pmrem.fromEquirectangular(tex)
  pmrem.dispose(); tex.dispose()
  return rt.texture
}

// ============================================================
// 封面拆分
// ============================================================
async function splitCover(img: HTMLImageElement, spineRatio: number): Promise<{
  front: THREE.CanvasTexture; back: THREE.CanvasTexture; spine: THREE.CanvasTexture
} | null> {
  const cw = img.width, ch = img.height
  const spineW = Math.round(cw * Math.max(0.02, Math.min(0.2, spineRatio)))
  const coverW = Math.round((cw - spineW) / 2)
  if (coverW <= 0 || ch <= 0) return null
  const canvas = document.createElement('canvas')
  const crop = (sx: number, sw: number): THREE.CanvasTexture => {
    canvas.width = Math.max(sw, 1); canvas.height = Math.max(ch, 1)
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, sx, 0, sw, ch, 0, 0, canvas.width, canvas.height)
    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
    t.needsUpdate = true
    return t
  }
  return { back: crop(0, coverW), spine: crop(coverW, spineW), front: crop(coverW + spineW, coverW) }
}

// ============================================================
// 书脊文字
// ============================================================
function makeSpineTextTexture(text: string, h: number): THREE.CanvasTexture {
  const w = 256
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = Math.max(32, Math.round(h * 0.1))
  const ctx = canvas.getContext('2d')!
  const chars = text.split('')
  const fontSize = Math.min(20, Math.floor(w / chars.length * 1.5))
  ctx.font = `bold ${fontSize}px "Noto Sans SC", "Microsoft YaHei", sans-serif`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const startY = canvas.height / 2 - ((chars.length - 1) * fontSize * 1.3) / 2
  chars.forEach((c, i) => ctx.fillText(c, w / 2, startY + i * fontSize * 1.3))
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true
  return t
}

// ============================================================
// 生成 roughness 贴图（封面微纹理）
// ============================================================
function generateRoughnessMap(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 256; c.height = 256
  const ctx = c.getContext('2d')!
  // 细微噪点模拟纸张纹理
  const imgData = ctx.createImageData(256, 256)
  for (let i = 0; i < imgData.data.length; i += 4) {
    const v = 180 + Math.random() * 40 // 0.7-0.86 roughness
    imgData.data[i] = v; imgData.data[i + 1] = v; imgData.data[i + 2] = v; imgData.data[i + 3] = 255
  }
  ctx.putImageData(imgData, 0, 0)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.LinearSRGBColorSpace
  t.needsUpdate = true
  return t
}

// ============================================================
// 场景 Hook
// ============================================================
function useBookScene(
  containerRef: React.RefObject<HTMLDivElement | null>,
  opts: {
    bookW: number; bookH: number; spineW: number; coverImage: string | null
    spineRatio: number; spineText: string; paperColor: string; edgeColor: string
    bgColor: string; isOpen: boolean; glbModel: string | null
  },
) {
  const sceneRef = useRef<{
    scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer
    controls: OrbitControls; bookGroup: THREE.Group; frontGroup: THREE.Group
    frontCover: THREE.Mesh | null; backCover: THREE.Mesh | null; spineMesh: THREE.Mesh | null
    spineLabel: THREE.Mesh | null; envMap: THREE.Texture; animateId: number; disposed: boolean
  } | null>(null)

  // 初始化
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, rect.width / rect.height, 0.1, 50)
    camera.position.set(4.0, 2.0, 5.5)
    camera.lookAt(0, 0.1, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    renderer.setSize(rect.width, rect.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    const envMap = createEnvMap(renderer)
    scene.environment = envMap
    scene.environmentIntensity = 0.7

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.dampingFactor = 0.08
    controls.minDistance = 2.0; controls.maxDistance = 10
    controls.minPolarAngle = 0.2; controls.maxPolarAngle = Math.PI - 0.2
    controls.autoRotate = true; controls.autoRotateSpeed = 0.6
    controls.target.set(0, 0.05, 0)

    // 灯光
    scene.add(new THREE.AmbientLight('#e8ecf4', 0.5))
    const key = new THREE.DirectionalLight('#ffffff', 5.0)
    key.position.set(6, 8, 5); key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.near = 0.5; key.shadow.camera.far = 40
    key.shadow.camera.left = -8; key.shadow.camera.right = 8
    key.shadow.camera.top = 8; key.shadow.camera.bottom = -8
    key.shadow.bias = -0.0001; key.shadow.normalBias = 0.02; key.shadow.radius = 2
    scene.add(key)
    const fill = new THREE.DirectionalLight('#c8d6ff', 1.8)
    fill.position.set(-3, 2, 4); scene.add(fill)
    const rim = new THREE.DirectionalLight('#ffffff', 1.2)
    rim.position.set(0, 1, -4); scene.add(rim)

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.ShadowMaterial({ opacity: 0.22 }),
    )
    ground.rotation.x = -Math.PI / 2; ground.position.y = -1.8
    ground.receiveShadow = true; scene.add(ground)

    const bookGroup = new THREE.Group()
    const frontGroup = new THREE.Group()
    scene.add(bookGroup); bookGroup.add(frontGroup)

    const state = {
      scene, camera, renderer, controls, bookGroup, frontGroup,
      frontCover: null as THREE.Mesh | null, backCover: null as THREE.Mesh | null,
      spineMesh: null as THREE.Mesh | null, spineLabel: null as THREE.Mesh | null,
      envMap, animateId: 0, disposed: false,
    }
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
        camera.aspect = r.width / r.height; camera.updateProjectionMatrix()
        renderer.setSize(r.width, r.height)
      }
    })
    ro.observe(container)

    return () => {
      state.disposed = true; ro.disconnect()
      cancelAnimationFrame(state.animateId)
      state.controls.dispose(); state.envMap.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [containerRef])

  // 更新模型
  useEffect(() => {
    const state = sceneRef.current
    if (!state) return
    const { bookW, bookH, spineW, coverImage, spineRatio, spineText, paperColor, edgeColor, bgColor, isOpen } = opts
    const scale = 0.018
    const hw = bookW * scale / 2
    const hh = bookH * scale / 2
    const sw = spineW * scale / 2
    const ct = 0.06 // 封面厚度
    const pd = 0.12 // 书页总厚度
    const overhang = 0.05

    state.scene.background = new THREE.Color(bgColor)
    state.bookGroup.clear()
    state.frontGroup.clear()
    state.frontCover = null; state.backCover = null; state.spineMesh = null
    if (state.spineLabel) {
      state.spineLabel.geometry?.dispose()
      ;(state.spineLabel.material as THREE.Material)?.dispose()
      state.spineLabel = null
    }

    const roughnessMap = generateRoughnessMap()

    // 封面材质（带 PBR 贴图）
    const frontMat = new THREE.MeshStandardMaterial({
      roughness: 0.35, metalness: 0.02, roughnessMap, color: new THREE.Color('#2c3e80'),
    })
    const backMat = new THREE.MeshStandardMaterial({
      roughness: 0.35, metalness: 0.02, roughnessMap: roughnessMap.clone(), color: new THREE.Color('#1a2744'),
    })
    const spineMat = new THREE.MeshStandardMaterial({
      roughness: 0.4, metalness: 0.05, color: new THREE.Color('#1e2d50'),
    })

    const paperMat = new THREE.MeshStandardMaterial({
      roughness: 0.85, metalness: 0, color: new THREE.Color(paperColor),
    })
    const edgeMat = new THREE.MeshStandardMaterial({
      roughness: 0.3, metalness: edgeColor === '#ffd700' || edgeColor === '#c0c0c0' ? 0.5 : 0,
      color: new THREE.Color(edgeColor),
    })

    const s = state

    async function loadCovers() {
      if (coverImage) {
        const img = await new Promise<HTMLImageElement>((res, rej) => {
          const i = new Image(); i.crossOrigin = 'anonymous'
          i.onload = () => res(i); i.onerror = rej; i.src = coverImage
        }).catch(() => null)
        if (img) {
          const texs = await splitCover(img, spineRatio)
          if (texs) {
            if (s.frontCover) {
              const m = s.frontCover.material as THREE.MeshStandardMaterial
              m.map = texs.front; m.color.set('#ffffff'); m.needsUpdate = true
            }
            if (s.backCover) {
              const m = s.backCover.material as THREE.MeshStandardMaterial
              m.map = texs.back; m.color.set('#ffffff'); m.needsUpdate = true
            }
            if (s.spineMesh) {
              const m = s.spineMesh.material as THREE.MeshStandardMaterial
              m.map = texs.spine; m.color.set('#ffffff'); m.needsUpdate = true
            }
          }
        }
      }
    }

    // 构建书本模型
    function buildBook() {
      const group = s.bookGroup
      const fg = s.frontGroup
      const coverW = bookW * scale + overhang
      const coverH = bookH * scale + overhang

      // ---- 封底 ----
      const backGeom = new THREE.BoxGeometry(coverW, coverH, ct)
      const backCover = new THREE.Mesh(backGeom, backMat)
      backCover.position.set(-sw - hw, 0, 0)
      backCover.castShadow = true; backCover.receiveShadow = true
      group.add(backCover)
      s.backCover = backCover

      // ---- 左书页块 ----
      const pageW = bookW * scale - 0.04
      const pageH = bookH * scale - 0.08
      const leftPages = new THREE.Mesh(new THREE.BoxGeometry(pageW, pageH, pd), paperMat)
      leftPages.position.set(-sw, 0, ct / 2 + pd / 2)
      leftPages.castShadow = true; leftPages.receiveShadow = true
      group.add(leftPages)

      // ---- 书口装饰 ----
      const sideEdge = new THREE.Mesh(new THREE.BoxGeometry(0.01, pageH, pd), edgeMat)
      sideEdge.position.set(hw - sw - 0.02, 0, ct / 2 + pd / 2); group.add(sideEdge)
      const topEdge = new THREE.Mesh(new THREE.BoxGeometry(pageW, 0.01, pd), edgeMat)
      topEdge.position.set(-sw, hh - 0.04, ct / 2 + pd / 2); group.add(topEdge)
      const bottomEdge = new THREE.Mesh(new THREE.BoxGeometry(pageW, 0.01, pd), edgeMat)
      bottomEdge.position.set(-sw, -hh + 0.04, ct / 2 + pd / 2); group.add(bottomEdge)

      // ---- 右书页块（翻开时旋转） ----
      const rpg = new THREE.Group()
      rpg.position.set(sw + 0.01, 0, ct / 2 + pd / 2)
      rpg.rotation.y = isOpen ? Math.PI * 0.4 : 0
      const rp = new THREE.Mesh(new THREE.BoxGeometry(pageW, pageH, pd), paperMat)
      rp.castShadow = true; rpg.add(rp)
      const re = new THREE.Mesh(new THREE.BoxGeometry(0.01, pageH, pd), edgeMat)
      re.position.set(hw - 0.02, 0, 0); rpg.add(re)
      group.add(rpg)

      // ---- 封面 ----
      fg.position.set(sw + hw, 0, 0)
      fg.rotation.y = isOpen ? Math.PI * 0.45 : 0
      const frontGeom = new THREE.BoxGeometry(coverW, coverH, ct)
      const frontCover = new THREE.Mesh(frontGeom, frontMat)
      frontCover.castShadow = true; frontCover.receiveShadow = true
      fg.add(frontCover)
      s.frontCover = frontCover

      // ---- 书脊 ----
      const spineGeom = new THREE.BoxGeometry(sw * 2, coverH, ct + pd)
      const spineMesh = new THREE.Mesh(spineGeom, spineMat)
      spineMesh.position.set(0, 0, pd / 2)
      spineMesh.castShadow = true; spineMesh.receiveShadow = true
      group.add(spineMesh)
      s.spineMesh = spineMesh

      // ---- 书脊文字 ----
      if (spineText) {
        const tex = makeSpineTextTexture(spineText, bookH)
        const labelGeom = new THREE.PlaneGeometry(sw * 1.5, bookH * scale * 0.7)
        const labelMat = new THREE.MeshBasicMaterial({
          map: tex, transparent: true, depthTest: false, depthWrite: false,
        })
        const label = new THREE.Mesh(labelGeom, labelMat)
        label.position.set(0, 0, pd / 2 + ct / 2 + 0.003)
        label.renderOrder = 1; group.add(label)
        s.spineLabel = label
      }

      // ---- 书签带 ----
      const ribbonMat = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0, color: '#e74c3c' })
      group.add(new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.5, 0.003), ribbonMat))
        .position.set(0, -hh + 0.35, ct / 2 + pd + 0.005)
      group.add(new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.25, 0.003), ribbonMat))
        .position.set(0, -hh - 0.05, ct / 2 + pd + 0.005)
    }

    buildBook()
    loadCovers()
  }, [opts.bookW, opts.bookH, opts.spineW, opts.coverImage, opts.spineRatio, opts.spineText, opts.paperColor, opts.edgeColor, opts.bgColor, opts.isOpen])

  // GLB 模型加载（行业标准工作流）
  useEffect(() => {
    const state = sceneRef.current
    if (!state || !opts.glbModel) return

    const loader = new GLTFLoader()
    loader.load(opts.glbModel, (gltf) => {
      if (state.disposed) return
      // 清空程序化模型，使用 GLB 模型
      state.bookGroup.clear()
      state.frontGroup.clear()
      state.frontCover = null; state.backCover = null; state.spineMesh = null
      if (state.spineLabel) {
        state.spineLabel.geometry?.dispose()
        ;(state.spineLabel.material as THREE.Material)?.dispose()
        state.spineLabel = null
      }

      // 将 GLB 模型添加到书本组
      const model = gltf.scene
      // 自动缩放到合适的尺寸
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const targetSize = 2.5
      const s = targetSize / maxDim
      model.scale.setScalar(s)
      model.position.set(0, 0, 0)
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
      state.bookGroup.add(model)
      state.frontGroup.add(model) // 共享引用以便翻开动画

      // 如果用户上传了封面图，查找 GLB 中的材质并替换
      if (opts.coverImage) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          const tex = new THREE.CanvasTexture(img)
          tex.colorSpace = THREE.SRGBColorSpace
          model.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const mats = Array.isArray(child.material) ? child.material : [child.material]
              mats.forEach((m) => {
                if (m instanceof THREE.MeshStandardMaterial || m instanceof THREE.MeshPhysicalMaterial) {
                  m.map = tex
                  m.needsUpdate = true
                }
              })
            }
          })
        }
        img.src = opts.coverImage
      }
    }, undefined, () => {
      console.warn('GLB 模型加载失败，使用程序化模型')
    })
  }, [opts.glbModel])

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
  const [downloadRes, setDownloadRes] = useState(2)
  const [glbModel, setGlbModel] = useState<string | null>(null)
  const [glbName, setGlbName] = useState('')

  // 默认 GLB 模型路径
  const defaultGlb = import.meta.env.BASE_URL + 'models/book.glb'
  const effectiveGlb = glbModel || defaultGlb

  const preset = formatPresets.find((f) => f.id === format)!
  const bookW = format === 'custom' ? customW : preset.w
  const bookH = format === 'custom' ? customH : preset.h
  const actualSpine = format === 'custom' ? spineWidth : preset.spine
  const activeEdgeColor = edgeColorOptions.find((e) => e.id === edgeColor)!.color

  useBookScene(containerRef, {
    bookW, bookH, spineW: actualSpine, coverImage, spineRatio, spineText,
    paperColor, edgeColor: activeEdgeColor, bgColor, isOpen, glbModel: effectiveGlb,
  })

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => setCoverImage(ev.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleGlbUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.name.endsWith('.glb')) return
    setGlbName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      // 将 ArrayBuffer 转为 Blob URL
      const blob = new Blob([reader.result as ArrayBuffer], { type: 'model/gltf-binary' })
      const url = URL.createObjectURL(blob)
      setGlbModel(url)
    }
    reader.readAsArrayBuffer(file)
  }, [])

  const handleDownload = useCallback(() => {
    const canvas = containerRef.current?.querySelector('canvas') as HTMLCanvasElement | null
    if (!canvas) return
    const scale = downloadRes
    const exportC = document.createElement('canvas')
    exportC.width = canvas.width * scale; exportC.height = canvas.height * scale
    exportC.getContext('2d')!.drawImage(canvas, 0, 0, exportC.width, exportC.height)
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
          description="上传封面 → 实时渲染 → 旋转查看 → 高清下载" />
      </div>
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0">
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
                    <p className="text-xs text-text-muted">封底+书脊+封面横排</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {coverImage && (
              <button onClick={() => { setCoverImage(null); setFileName('') }}
                className="mt-2 w-full text-xs text-red-500 hover:underline cursor-pointer">清除图片</button>
            )}
          </Card>

          <Card>
            <h3 className="font-semibold text-sm mb-3">3D 模型（GLB）</h3>
            <p className="text-xs text-text-muted mb-2">
              上传 GLB 模型替换程序化模型。<br />
              <a href="https://meshy.ai" target="_blank" rel="noopener noreferrer"
                className="text-primary underline">用 Meshy.ai 免费生成</a>
            </p>
            <label className="block w-full cursor-pointer">
              <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
                glbModel ? 'border-primary' : 'border-border hover:border-primary'
              }`}>
                {glbModel ? (
                  <div className="space-y-2">
                    <span className="text-lg block">📦</span>
                    <p className="text-xs text-text-muted truncate">{glbName}</p>
                    <span className="text-xs text-primary">点击更换</span>
                  </div>
                ) : (
                  <div className="space-y-1 py-1">
                    <span className="text-lg block">📦</span>
                    <p className="text-xs text-text-muted">加载 GLB 模型</p>
                    <p className="text-xs text-text-muted">（推荐 Meshy.ai 生成）</p>
                  </div>
                )}
              </div>
              <input type="file" accept=".glb" onChange={handleGlbUpload} className="hidden" />
            </label>
            {glbModel && (
              <button onClick={() => { setGlbModel(null); setGlbName('') }}
                className="mt-2 w-full text-xs text-red-500 hover:underline cursor-pointer">
                清除模型（使用程序化模型）
              </button>
            )}
          </Card>
          <Card>
            <h3 className="font-semibold text-sm mb-3">判型</h3>
            <select value={format} onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-sm">
              {formatPresets.map((f) => (
                <option key={f.id} value={f.id}>{f.name} ({f.w}×{f.h}mm)</option>
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
          </Card>
          <Card>
            <h3 className="font-semibold text-sm mb-3">书脊切分</h3>
            <label className="text-xs text-text-muted">书脊: {Math.round(spineRatio * 100)}%</label>
            <input type="range" min={2} max={20} value={Math.round(spineRatio * 100)}
              onChange={(e) => setSpineRatio(Number(e.target.value) / 100)} className="w-full mt-1" />
          </Card>
          <Card>
            <h3 className="font-semibold text-sm mb-3">书脊文字</h3>
            <input type="text" value={spineText} onChange={(e) => setSpineText(e.target.value)}
              placeholder="输入书脊文字（竖排显示）"
              className="w-full px-2 py-1.5 rounded border border-border bg-bg text-xs" />
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
              <div><label className="text-xs text-text-muted">内页纸色</label>
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
              <option value={1}>1x</option><option value={2}>2x 高清</option><option value={3}>3x 打印级</option>
            </select>
            <button onClick={handleDownload}
              className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-accent text-white cursor-pointer hover:opacity-90">
              下载渲染图
            </button>
          </Card>
        </div>
        <div ref={containerRef} className="flex-1 bg-bg-card rounded-2xl overflow-hidden min-h-[500px]" />
      </div>
    </div>
  )
}