/**
 * GoodsRenderer v3 - 纯 Three.js 周边渲染
 * 替代 model-viewer + GLB 生成器方案
 * 技术：MeshPhysicalMaterial + 环境贴图 + 三点布光 + 实时PBR
 * 支持：吧唧 / 亚克力 / 贴纸 / 橡胶
 */
import { useState, useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { BackButton, Card, Section, Tag } from '@/components/ui'

// ============================================================
// 形状生成函数
// ============================================================
function createHeartShape(s: number): THREE.Shape {
  const shape = new THREE.Shape()
  shape.moveTo(0, s * 0.3)
  shape.bezierCurveTo(0, s * 0.55, s * 0.3, s * 0.8, s * 0.25, s * 0.95)
  shape.bezierCurveTo(s * 0.2, s * 1.1, 0, s * 0.7, 0, s * 0.3)
  shape.bezierCurveTo(0, s * 0.55, -s * 0.3, s * 0.8, -s * 0.25, s * 0.95)
  shape.bezierCurveTo(-s * 0.2, s * 1.1, 0, s * 0.7, 0, s * 0.3)
  return shape
}

function createStarShape(outerR: number, innerR: number, points: number = 5): THREE.Shape {
  const shape = new THREE.Shape()
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2
    const x = Math.cos(angle) * r; const y = Math.sin(angle) * r
    i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)
  }
  shape.closePath()
  return shape
}

function createHexagonShape(r: number): THREE.Shape {
  const shape = new THREE.Shape()
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6
    shape.lineTo(Math.cos(a) * r, Math.sin(a) * r)
  }
  shape.closePath()
  return shape
}

function createDiamondShape(r: number): THREE.Shape {
  const shape = new THREE.Shape()
  shape.moveTo(0, r); shape.lineTo(r * 0.6, 0)
  shape.lineTo(0, -r); shape.lineTo(-r * 0.6, 0)
  shape.closePath()
  return shape
}

function createFlowerShape(r: number): THREE.Shape {
  const shape = new THREE.Shape()
  const petals = 6
  for (let i = 0; i < petals * 2; i++) {
    const rr = i % 2 === 0 ? r : r * 0.5
    const a = (i / (petals * 2)) * Math.PI * 2 - Math.PI / 2
    const x = Math.cos(a) * rr; const y = Math.sin(a) * rr
    i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)
  }
  shape.closePath()
  return shape
}

function createCloudShape(r: number): THREE.Shape {
  const shape = new THREE.Shape()
  const cx = -r * 0.4; const cy = r * 0.15
  shape.moveTo(cx, cy)
  shape.bezierCurveTo(-r * 0.85, r * 0.05, -r * 0.7, -r * 0.3, -r * 0.2, -r * 0.15)
  shape.bezierCurveTo(-r * 0.3, -r * 0.5, r * 0.1, -r * 0.55, r * 0.3, -r * 0.2)
  shape.bezierCurveTo(r * 0.7, -r * 0.4, r * 0.9, r * 0.05, r * 0.5, r * 0.2)
  shape.bezierCurveTo(r * 0.7, r * 0.5, r * 0.05, r * 0.5, -r * 0.15, r * 0.25)
  shape.bezierCurveTo(-r * 0.35, r * 0.55, -r * 0.65, r * 0.35, cx, cy)
  shape.closePath()
  return shape
}

function createIrregularShape(r: number): THREE.Shape {
  const shape = new THREE.Shape()
  const bumps = 8
  for (let i = 0; i < bumps; i++) {
    const a = (i / bumps) * Math.PI * 2
    const rr = r * (0.7 + 0.3 * Math.sin(i * 2.3))
    const x = Math.cos(a) * rr; const y = Math.sin(a) * rr
    i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)
  }
  shape.closePath()
  return shape
}

function getDiecutShape(shape: string, r: number): THREE.Shape {
  switch (shape) {
    case 'heart': return createHeartShape(r)
    case 'star': return createStarShape(r * 0.9, r * 0.5)
    case 'hexagon': return createHexagonShape(r * 0.9)
    case 'diamond': return createDiamondShape(r * 0.9)
    case 'flower': return createFlowerShape(r)
    case 'cloud': return createCloudShape(r)
    case 'irregular': return createIrregularShape(r)
    default: return createHeartShape(r)
  }
}

// ---- 环境贴图 ----
function createEnvMap(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer)
  const c = document.createElement('canvas')
  c.width = 512; c.height = 256
  const ctx = c.getContext('2d')!
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 180)
  skyGrad.addColorStop(0, '#ffffff')
  skyGrad.addColorStop(0.3, '#e8ecf4')
  skyGrad.addColorStop(0.6, '#c8ccd8')
  skyGrad.addColorStop(1, '#a0a4b0')
  ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, 512, 180)
  const groundGrad = ctx.createLinearGradient(0, 180, 0, 256)
  groundGrad.addColorStop(0, '#909090')
  groundGrad.addColorStop(1, '#606060')
  ctx.fillStyle = groundGrad; ctx.fillRect(0, 180, 512, 76)
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  ctx.fillRect(50, 10, 80, 120); ctx.fillRect(200, 30, 100, 100); ctx.fillRect(380, 20, 70, 110)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.mapping = THREE.EquirectangularReflectionMapping
  const rt = pmrem.fromEquirectangular(tex)
  pmrem.dispose(); tex.dispose()
  return rt.texture
}

// ---- 异步加载纹理 ----
async function loadImageTexture(dataUrl: string): Promise<THREE.Texture | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const tex = new THREE.CanvasTexture(img)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
      tex.needsUpdate = true
      resolve(tex)
    }
    img.onerror = () => resolve(null)
    img.src = dataUrl
  })
}

// ============================================================
// 类型定义
// ============================================================
type GoodsType = 'badge' | 'acrylic' | 'sticker' | 'rubber'
type DiecutShape = 'heart' | 'star' | 'hexagon' | 'cloud' | 'irregular' | 'diamond' | 'flower'

interface GoodsConfig {
  type: GoodsType; label: string
  shapes: { id: string; name: string }[]
  sizes: { id: string; name: string; scale: number }[]
  effects: { id: string; name: string; roughness: number; metalness: number }[]
}

const goodsConfigs: GoodsConfig[] = [
  {
    type: 'badge', label: '吧唧',
    shapes: [
      { id: 'circle', name: '圆形' }, { id: 'square', name: '方形' },
      { id: 'heart', name: '心形' }, { id: 'star', name: '星形' },
      { id: 'hexagon', name: '六边形' }, { id: 'diamond', name: '菱形' },
    ],
    sizes: [
      { id: '58mm', name: '58mm标准', scale: 1.0 }, { id: '75mm', name: '75mm大', scale: 1.3 },
      { id: '44mm', name: '44mm迷你', scale: 0.75 }, { id: '100mm', name: '100mm超大', scale: 1.7 },
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
    type: 'acrylic', label: '亚克力',
    shapes: [
      { id: 'circle', name: '圆形' }, { id: 'rect', name: '矩形' },
      { id: 'diecut', name: '异形' }, { id: 'heart', name: '心形' }, { id: 'star', name: '星形' },
    ],
    sizes: [
      { id: 'small', name: '5cm', scale: 0.85 }, { id: 'medium', name: '8cm', scale: 1.35 },
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
    type: 'sticker', label: '贴纸',
    shapes: [
      { id: 'circle', name: '圆形' }, { id: 'rect', name: '矩形' },
      { id: 'diecut', name: '异形' }, { id: 'heart', name: '心形' },
    ],
    sizes: [
      { id: 'small', name: '5cm', scale: 0.85 }, { id: 'medium', name: '8cm', scale: 1.35 },
      { id: 'large', name: '10cm', scale: 1.7 },
    ],
    effects: [
      { id: 'laser', name: '镭射', roughness: 0.08, metalness: 0.7 },
      { id: 'matte', name: '磨砂', roughness: 0.6, metalness: 0 },
      { id: 'none', name: '普通', roughness: 0.4, metalness: 0 },
    ],
  },
  {
    type: 'rubber', label: '橡胶',
    shapes: [
      { id: 'circle', name: '圆形' }, { id: 'diecut', name: '异形' },
      { id: 'heart', name: '心形' }, { id: 'star', name: '星形' },
    ],
    sizes: [
      { id: 'small', name: '4cm', scale: 0.7 }, { id: 'medium', name: '6cm', scale: 1.0 },
      { id: 'large', name: '8cm', scale: 1.35 },
    ],
    effects: [
      { id: 'none', name: '标准', roughness: 0.65, metalness: 0 },
      { id: 'glossy', name: '亮面', roughness: 0.3, metalness: 0.05 },
    ],
  },
]

const diecutOptions: { id: DiecutShape; name: string }[] = [
  { id: 'heart', name: '心形' }, { id: 'star', name: '星形' },
  { id: 'hexagon', name: '六边形' }, { id: 'diamond', name: '菱形' },
  { id: 'flower', name: '花形' }, { id: 'cloud', name: '云朵' },
  { id: 'irregular', name: '不规则' },
]

// ============================================================
// 3D 场景 Hook
// ============================================================
interface GoodsSceneOpts {
  goodsType: GoodsType
  shape: string; diecutShape: DiecutShape
  size: number; roughness: number; metalness: number
  baseColor: string; imageDataUrl: string | null
  bgColor: string
}

function useGoodsScene(
  containerRef: React.RefObject<HTMLDivElement | null>,
  opts: GoodsSceneOpts,
) {
  const sceneRef = useRef<{
    scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer
    controls: OrbitControls; modelGroup: THREE.Group; envMap: THREE.Texture
    animateId: number; disposed: boolean
  } | null>(null)

  // 初始化（仅一次）
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(28, rect.width / rect.height, 0.1, 30)
    camera.position.set(0, 0.3, 4.5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true, alpha: true, preserveDrawingBuffer: true,
    })
    renderer.setSize(rect.width, rect.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    // 环境贴图
    const envMap = createEnvMap(renderer)
    scene.environment = envMap
    scene.environmentIntensity = 0.65

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.dampingFactor = 0.08
    controls.minDistance = 1.5; controls.maxDistance = 8
    controls.minPolarAngle = 0.1; controls.maxPolarAngle = Math.PI - 0.1
    controls.autoRotate = true; controls.autoRotateSpeed = 1.2
    controls.target.set(0, 0, 0)

    // 灯光
    scene.add(new THREE.AmbientLight('#e8ecf4', 0.5))
    const key = new THREE.DirectionalLight('#ffffff', 5.0)
    key.position.set(3, 5, 4)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.near = 0.5; key.shadow.camera.far = 20
    key.shadow.camera.left = -5; key.shadow.camera.right = 5
    key.shadow.camera.top = 5; key.shadow.camera.bottom = -5
    key.shadow.bias = -0.0001; key.shadow.normalBias = 0.02
    key.shadow.radius = 2
    scene.add(key)
    const fill = new THREE.DirectionalLight('#c8d6ff', 1.8)
    fill.position.set(-2, 1, 3)
    scene.add(fill)
    const rim = new THREE.DirectionalLight('#ffffff', 1.0)
    rim.position.set(0, 0.5, -3)
    scene.add(rim)

    // 地面阴影
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15),
      new THREE.ShadowMaterial({ opacity: 0.2 }),
    )
    ground.rotation.x = -Math.PI / 2; ground.position.y = -1.5
    ground.receiveShadow = true
    scene.add(ground)

    const modelGroup = new THREE.Group()
    scene.add(modelGroup)

    const state = { scene, camera, renderer, controls, modelGroup, envMap, animateId: 0, disposed: false }
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
    const { goodsType, shape, diecutShape, size, roughness, metalness, baseColor, imageDataUrl, bgColor } = opts
    const s = size * 1.2

    state.scene.background = new THREE.Color(bgColor)
    state.modelGroup.clear()

    async function build() {
      let designTex: THREE.Texture | null = null
      if (imageDataUrl) {
        designTex = await loadImageTexture(imageDataUrl)
      }

      if (goodsType === 'badge') {
        buildBadge(s, shape, roughness, metalness, baseColor, designTex)
      } else if (goodsType === 'acrylic') {
        buildAcrylic(s, shape, diecutShape, roughness, metalness, designTex)
      } else if (goodsType === 'sticker') {
        buildSticker(s, shape, diecutShape, roughness, metalness, baseColor, designTex)
      } else if (goodsType === 'rubber') {
        buildRubber(s, shape, diecutShape, roughness, baseColor, designTex)
      }
    }

    function buildBadge(s: number, shape: string, roughness: number, metalness: number, baseColor: string, tex: THREE.Texture | null) {
      const group = state!.modelGroup

      const designMat = new THREE.MeshPhysicalMaterial({
        roughness, metalness, color: new THREE.Color(baseColor),
        clearcoat: 0.3, clearcoatRoughness: 0.15,
      })
      if (tex) { designMat.map = tex; designMat.color.set('#ffffff') }

      const metalMat = new THREE.MeshStandardMaterial({
        roughness: 0.12, metalness: 0.95, color: new THREE.Color('#d4d4d4'),
      })

      if (shape === 'circle') {
        // 金属底座
        const base = new THREE.Mesh(new THREE.CylinderGeometry(s * 1.06, s * 1.06, 0.07, 64), metalMat)
        base.position.y = -0.04; base.castShadow = true; base.receiveShadow = true
        group.add(base)
        // 设计面凸起
        const dome = new THREE.Mesh(new THREE.CylinderGeometry(s * 0.98, s, 0.06, 64), designMat)
        dome.position.y = 0.025; dome.castShadow = true
        group.add(dome)
        // 金属边框
        const rim = new THREE.Mesh(new THREE.TorusGeometry(s * 1.03, 0.025, 16, 64), metalMat)
        rim.rotation.x = Math.PI / 2; rim.position.y = 0.055
        group.add(rim)
        // 背面别针
        const pin = new THREE.Mesh(
          new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8),
          new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.8, color: '#888888' }),
        )
        pin.rotation.x = Math.PI / 2; pin.position.set(0, -0.1, -0.2)
        group.add(pin)
      } else if (shape === 'square') {
        const base = new THREE.Mesh(new RoundedBoxGeometry(s * 1.7, 0.07, s * 1.7, 3, 0.04), metalMat)
        base.position.y = -0.04; base.castShadow = true; base.receiveShadow = true
        group.add(base)
        const top = new THREE.Mesh(new RoundedBoxGeometry(s * 1.5, 0.06, s * 1.5, 3, 0.04), designMat)
        top.position.y = 0.025; top.castShadow = true
        group.add(top)
      } else {
        const sh = getDiecutShape(shape, s)
        const geom = new THREE.ExtrudeGeometry(sh, {
          steps: 1, depth: 0.12, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 3,
        })
        const mesh = new THREE.Mesh(geom, designMat)
        mesh.rotation.x = -Math.PI / 2; mesh.position.y = -0.06
        mesh.castShadow = true; mesh.receiveShadow = true
        group.add(mesh)
      }
    }

    function buildAcrylic(s: number, shape: string, diecutShape: string, roughness: number, metalness: number, tex: THREE.Texture | null) {
      const group = state!.modelGroup
      const d = 0.28

      const acrylicMat = new THREE.MeshPhysicalMaterial({
        roughness, metalness, color: new THREE.Color('#ffffff'),
        transparent: true, opacity: 0.88, clearcoat: 0.15,
        specularIntensity: 0.5, specularColor: new THREE.Color('#ffffff'),
      })
      if (tex) acrylicMat.map = tex

      if (shape === 'circle') {
        const body = new THREE.Mesh(new THREE.CylinderGeometry(s, s, d, 64), acrylicMat)
        body.castShadow = true; body.receiveShadow = true
        group.add(body)
        // 边缘高光
        const edge = new THREE.Mesh(
          new THREE.TorusGeometry(s * 1.005, 0.012, 8, 64),
          new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0, metalness: 0, transparent: true, opacity: 0.25 }),
        )
        edge.rotation.x = Math.PI / 2
        group.add(edge)
      } else if (shape === 'rect') {
        const body = new THREE.Mesh(new RoundedBoxGeometry(s * 1.5, d, s * 2.2, 3, 0.04), acrylicMat)
        body.castShadow = true; body.receiveShadow = true
        group.add(body)
      } else {
        const dshape = shape === 'diecut' ? diecutShape : shape
        const sh = getDiecutShape(dshape, s * 1.1)
        const geom = new THREE.ExtrudeGeometry(sh, {
          steps: 1, depth: d, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 3,
        })
        const mesh = new THREE.Mesh(geom, acrylicMat)
        mesh.rotation.x = -Math.PI / 2; mesh.position.y = -d / 2
        mesh.castShadow = true; mesh.receiveShadow = true
        group.add(mesh)
      }
    }

    function buildSticker(s: number, shape: string, diecutShape: string, roughness: number, metalness: number, baseColor: string, tex: THREE.Texture | null) {
      const group = state!.modelGroup
      const d = 0.03

      const mat = new THREE.MeshPhysicalMaterial({
        roughness, metalness, color: new THREE.Color(baseColor),
        clearcoat: 0.2, clearcoatRoughness: 0.2,
      })
      if (tex) { mat.map = tex; mat.color.set('#ffffff') }

      if (shape === 'circle') {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(s, s, d, 64), mat)
        mesh.castShadow = true; mesh.receiveShadow = true
        group.add(mesh)
      } else if (shape === 'rect') {
        const mesh = new THREE.Mesh(new RoundedBoxGeometry(s * 1.5, d, s * 2.0, 3, 0.03), mat)
        mesh.castShadow = true; mesh.receiveShadow = true
        group.add(mesh)
      } else {
        const dshape = shape === 'diecut' ? diecutShape : shape
        const sh = getDiecutShape(dshape, s)
        const geom = new THREE.ExtrudeGeometry(sh, {
          steps: 1, depth: d, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2,
        })
        const mesh = new THREE.Mesh(geom, mat)
        mesh.rotation.x = -Math.PI / 2; mesh.position.y = -d / 2
        mesh.castShadow = true; mesh.receiveShadow = true
        group.add(mesh)
      }
    }

    function buildRubber(s: number, shape: string, diecutShape: string, roughness: number, baseColor: string, tex: THREE.Texture | null) {
      const group = state!.modelGroup
      const d = 0.2

      const mat = new THREE.MeshStandardMaterial({
        roughness, metalness: 0, color: new THREE.Color(baseColor),
      })
      if (tex) { mat.map = tex; mat.color.set('#ffffff') }

      if (shape === 'circle') {
        const body = new THREE.Mesh(new THREE.CylinderGeometry(s, s, d, 64), mat)
        body.castShadow = true; body.receiveShadow = true
        group.add(body)
        // 挂孔
        const hole = new THREE.Mesh(
          new THREE.TorusGeometry(s * 0.09, s * 0.03, 8, 16),
          new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0, color: '#d4cfc8' }),
        )
        hole.position.set(0, -0.03, s * 0.85); hole.rotation.x = Math.PI / 2
        group.add(hole)
      } else {
        const dshape = shape === 'diecut' ? diecutShape : shape
        const sh = getDiecutShape(dshape, s)
        const geom = new THREE.ExtrudeGeometry(sh, {
          steps: 1, depth: d, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 3,
        })
        const mesh = new THREE.Mesh(geom, mat)
        mesh.rotation.x = -Math.PI / 2; mesh.position.y = -d / 2
        mesh.castShadow = true; mesh.receiveShadow = true
        group.add(mesh)
        // 挂孔
        const hole = new THREE.Mesh(
          new THREE.TorusGeometry(s * 0.09, s * 0.03, 8, 16),
          new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0, color: '#d4cfc8' }),
        )
        hole.position.set(0, 0.05, s * 0.85); hole.rotation.x = Math.PI / 2
        group.add(hole)
      }
    }

    build()
  }, [opts.goodsType, opts.shape, opts.diecutShape, opts.size, opts.roughness, opts.metalness, opts.baseColor, opts.imageDataUrl, opts.bgColor])

  return sceneRef
}

// ============================================================
// 主页面
// ============================================================
export default function GoodsRenderer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [goodsType, setGoodsType] = useState<GoodsType>('badge')
  const [shape, setShape] = useState('circle')
  const [size, setSize] = useState('58mm')
  const [effect, setEffect] = useState('matte')
  const [baseColor, setBaseColor] = useState('#f8c8dc')
  const [diecutShape, setDiecutShape] = useState<DiecutShape>('heart')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [bgColor, setBgColor] = useState('#e8e8e8')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const config = goodsConfigs.find((g) => g.type === goodsType)!
  const activeShape = config.shapes.find((s) => s.id === shape)!
  const activeSize = config.sizes.find((s) => s.id === size)!
  const activeEffect = config.effects.find((e) => e.id === effect)!

  useGoodsScene(containerRef, {
    goodsType, shape, diecutShape,
    size: activeSize.scale,
    roughness: activeEffect.roughness,
    metalness: activeEffect.metalness,
    baseColor, imageDataUrl: uploadedImage, bgColor,
  })

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => setUploadedImage(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleClearImage = useCallback(() => {
    setUploadedImage(null); setFileName('')
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
        <Section title="周边渲染器" icon="🎨"
          description="上传设计图 → 实时PBR渲染 → 旋转查看 · 吧唧/亚克力/贴纸/橡胶" />
      </div>
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0">
        {/* 左侧控制 */}
        <div className="lg:w-64 shrink-0 space-y-3 overflow-y-auto">
          <Card>
            <h3 className="text-sm font-semibold mb-3">周边类型</h3>
            <div className="flex flex-wrap gap-2">
              {goodsConfigs.map((g) => (
                <button key={g.type} onClick={() => handleTypeChange(g.type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    goodsType === g.type ? 'bg-primary text-white' : 'bg-bg-card border border-border hover:border-primary'
                  }`}>{g.label}</button>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-3">形状</h3>
            <div className="flex flex-wrap gap-2">
              {config.shapes.map((s) => (
                <button key={s.id} onClick={() => setShape(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    shape === s.id ? 'bg-primary text-white' : 'bg-bg-card border border-border hover:border-primary'
                  }`}>{s.name}</button>
              ))}
            </div>
          </Card>
          {showDiecutSelect && (
            <Card>
              <h3 className="text-sm font-semibold mb-3">异形样式</h3>
              <div className="flex flex-wrap gap-2">
                {diecutOptions.map((ds) => (
                  <button key={ds.id} onClick={() => setDiecutShape(ds.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      diecutShape === ds.id ? 'bg-primary text-white' : 'bg-bg-card border border-border hover:border-primary'
                    }`}>{ds.name}</button>
                ))}
              </div>
            </Card>
          )}
          <Card>
            <h3 className="text-sm font-semibold mb-3">尺寸</h3>
            <div className="flex flex-wrap gap-2">
              {config.sizes.map((s) => (
                <button key={s.id} onClick={() => setSize(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    size === s.id ? 'bg-primary text-white' : 'bg-bg-card border border-border hover:border-primary'
                  }`}>{s.name}</button>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-3">表面效果</h3>
            <div className="flex flex-wrap gap-2">
              {config.effects.map((e) => (
                <button key={e.id} onClick={() => setEffect(e.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    effect === e.id ? 'bg-primary text-white' : 'bg-bg-card border border-border hover:border-primary'
                  }`}>{e.name}</button>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-3">颜色</h3>
            <div>
              <label className="text-xs text-text-muted">主色</label>
              <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)}
                className="w-full h-10 rounded border cursor-pointer mt-1" />
            </div>
            <div className="mt-2">
              <label className="text-xs text-text-muted">背景色</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-10 rounded border cursor-pointer mt-1" />
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-3">设计图</h3>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            {uploadedImage ? (
              <div className="space-y-2">
                <img src={uploadedImage} alt="设计图" className="w-full h-20 object-cover rounded-lg border border-border" />
                <p className="text-xs text-text-muted truncate">{fileName}</p>
                <button onClick={handleClearImage}
                  className="w-full px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer">
                  清除
                </button>
              </div>
            ) : (
              <button onClick={() => fileInputRef.current?.click()}
                className="w-full px-3 py-2 rounded-lg text-xs font-medium border border-dashed border-border hover:border-primary text-text-muted hover:text-primary transition-colors cursor-pointer">
                + 上传设计图
              </button>
            )}
            <p className="text-xs text-text-muted mt-2">推荐透明底PNG</p>
          </Card>
          <div className="text-xs text-text-muted p-2">
            <p className="text-primary">拖拽旋转 · 滚轮缩放 · 右键平移</p>
          </div>
        </div>
        {/* 右侧 3D 渲染 */}
        <div ref={containerRef} className="flex-1 bg-bg-card rounded-2xl overflow-hidden min-h-[500px]" />
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