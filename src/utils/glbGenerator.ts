/**
 * GLB 模型生成器
 * 使用 Three.js 构建专业 3D 模型，导出为 GLB 格式供 <model-viewer> 渲染
 */
import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

// ---- 形状辅助函数 ----
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
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
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
  shape.moveTo(0, r)
  shape.lineTo(r * 0.6, 0)
  shape.lineTo(0, -r)
  shape.lineTo(-r * 0.6, 0)
  shape.closePath()
  return shape
}

// ---- 纹理加载 ----
async function loadTexture(dataUrl: string): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load(dataUrl, () => resolve(tex))
    tex.colorSpace = THREE.SRGBColorSpace
    tex.wrapS = THREE.ClampToEdgeWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
  })
}

// ---- 导出 GLB ----
function exportToGLB(scene: THREE.Scene | THREE.Group): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter()
    exporter.parse(
      scene,
      (glb) => resolve(glb as ArrayBuffer),
      (err) => reject(err),
      { binary: true, onlyVisible: true, maxTextureSize: 2048 },
    )
  })
}

// ============================================================
// 吧唧 Badge
// ============================================================
export interface BadgeOptions {
  shape: 'circle' | 'square' | 'heart' | 'star' | 'hexagon' | 'diamond'
  size: number      // 0.75 ~ 1.7
  roughness: number // 0.05 ~ 0.7
  metalness: number // 0 ~ 0.95
  baseColor: string
  imageDataUrl?: string
}

export async function generateBadgeGLB(options: BadgeOptions): Promise<ArrayBuffer> {
  const { shape, size, roughness, metalness, baseColor, imageDataUrl } = options
  const s = size * 1.2
  const group = new THREE.Group()

  // 纹理
  let designTex: THREE.Texture | null = null
  if (imageDataUrl) {
    try { designTex = await loadTexture(imageDataUrl) } catch { /* ignore */ }
  }

  // 设计面材质
  const designMat = new THREE.MeshStandardMaterial({
    roughness,
    metalness,
    color: new THREE.Color(baseColor),
  })
  if (designTex) {
    designMat.map = designTex
    designMat.color.set('#ffffff')
  }

  // 金属底座材质
  const metalMat = new THREE.MeshStandardMaterial({
    roughness: 0.12,
    metalness: 0.95,
    color: new THREE.Color('#d4d4d4'),
  })

  if (shape === 'circle') {
    // 金属底座
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(s * 1.06, s * 1.06, 0.07, 64),
      metalMat,
    )
    base.position.y = -0.04
    group.add(base)

    // 设计面（凸起 dome）
    const domeGeom = new THREE.CylinderGeometry(s * 0.98, s, 0.06, 64)
    const dome = new THREE.Mesh(domeGeom, designMat)
    dome.position.y = 0.025
    group.add(dome)

    // 金属边框环
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(s * 1.03, 0.025, 16, 64),
      metalMat,
    )
    rim.rotation.x = Math.PI / 2
    rim.position.y = 0.055
    group.add(rim)

    // 背面针
    const pin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8),
      new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.8, color: '#888888' }),
    )
    pin.rotation.x = Math.PI / 2
    pin.position.y = -0.1
    pin.position.z = -0.2
    group.add(pin)
  } else if (shape === 'square') {
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(s * 1.7, 0.07, s * 1.7),
      metalMat,
    )
    base.position.y = -0.04
    group.add(base)

    const top = new THREE.Mesh(
      new THREE.BoxGeometry(s * 1.5, 0.06, s * 1.5),
      designMat,
    )
    top.position.y = 0.025
    group.add(top)
  } else {
    // 异形：使用 ExtrudeGeometry
    let sh: THREE.Shape
    switch (shape) {
      case 'heart': sh = createHeartShape(s); break
      case 'star': sh = createStarShape(s * 0.9, s * 0.5); break
      case 'hexagon': sh = createHexagonShape(s * 0.9); break
      case 'diamond': sh = createDiamondShape(s * 0.9); break
      default: sh = createHeartShape(s)
    }

    const geom = new THREE.ExtrudeGeometry(sh, {
      steps: 1, depth: 0.12,
      bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 3,
    })
    const mesh = new THREE.Mesh(geom, designMat)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.y = -0.06
    group.add(mesh)
  }

  return exportToGLB(group)
}

// ============================================================
// 亚克力 Acrylic
// ============================================================
export interface AcrylicOptions {
  shape: 'circle' | 'rectangle' | 'heart' | 'star' | 'diecut'
  diecutShape?: string
  size: number
  roughness: number
  metalness: number
  imageDataUrl?: string
}

export async function generateAcrylicGLB(options: AcrylicOptions): Promise<ArrayBuffer> {
  const { shape, diecutShape, size, roughness, metalness, imageDataUrl } = options
  const s = size * 1.2
  const depth = 0.28
  const group = new THREE.Group()

  let designTex: THREE.Texture | null = null
  if (imageDataUrl) {
    try { designTex = await loadTexture(imageDataUrl) } catch { /* ignore */ }
  }

  const acrylicMat = new THREE.MeshPhysicalMaterial({
    roughness,
    metalness,
    transparent: true,
    opacity: 0.88,
    clearcoat: 0.1,
    ior: 1.5,
    reflectivity: 0.5,
    color: new THREE.Color('#ffffff'),
  })
  if (designTex) acrylicMat.map = designTex

  if (shape === 'circle') {
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(s, s, depth, 64),
      acrylicMat,
    )
    group.add(body)

    // 边缘高光
    const edge = new THREE.Mesh(
      new THREE.TorusGeometry(s * 1.005, 0.012, 8, 64),
      new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0, metalness: 0, transparent: true, opacity: 0.3 }),
    )
    edge.rotation.x = Math.PI / 2
    group.add(edge)
  } else if (shape === 'rectangle') {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(s * 1.5, depth, s * 2.2),
      acrylicMat,
    )
    group.add(body)
  } else {
    let sh: THREE.Shape
    const ss = s * 1.1
    const dshape = diecutShape || 'heart'
    switch (dshape) {
      case 'heart': sh = createHeartShape(ss); break
      case 'star': sh = createStarShape(ss * 0.9, ss * 0.5); break
      default: sh = createHeartShape(ss)
    }
    const geom = new THREE.ExtrudeGeometry(sh, {
      steps: 1, depth,
      bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 3,
    })
    const mesh = new THREE.Mesh(geom, acrylicMat)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.y = -depth / 2
    group.add(mesh)
  }

  return exportToGLB(group)
}

// ============================================================
// 贴纸 Sticker
// ============================================================
export interface StickerOptions {
  shape: 'circle' | 'rectangle' | 'heart' | 'diecut'
  diecutShape?: string
  size: number
  roughness: number
  metalness: number
  baseColor: string
  imageDataUrl?: string
}

export async function generateStickerGLB(options: StickerOptions): Promise<ArrayBuffer> {
  const { shape, diecutShape, size, roughness, metalness, baseColor, imageDataUrl } = options
  const s = size * 1.2
  const depth = 0.03
  const group = new THREE.Group()

  let designTex: THREE.Texture | null = null
  if (imageDataUrl) {
    try { designTex = await loadTexture(imageDataUrl) } catch { /* ignore */ }
  }

  const mat = new THREE.MeshStandardMaterial({
    roughness, metalness, color: new THREE.Color(baseColor),
  })
  if (designTex) {
    mat.map = designTex
    mat.color.set('#ffffff')
  }

  if (shape === 'circle') {
    group.add(new THREE.Mesh(new THREE.CylinderGeometry(s, s, depth, 64), mat))
  } else if (shape === 'rectangle') {
    group.add(new THREE.Mesh(new THREE.BoxGeometry(s * 1.5, depth, s * 2.0), mat))
  } else {
    let sh: THREE.Shape
    const dshape = diecutShape || 'heart'
    switch (dshape) {
      case 'heart': sh = createHeartShape(s); break
      default: sh = createHeartShape(s)
    }
    const geom = new THREE.ExtrudeGeometry(sh, { steps: 1, depth, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2 })
    const mesh = new THREE.Mesh(geom, mat)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.y = -depth / 2
    group.add(mesh)
  }

  return exportToGLB(group)
}

// ============================================================
// 橡胶挂件 Rubber
// ============================================================
export interface RubberOptions {
  shape: 'circle' | 'heart' | 'star' | 'diecut'
  diecutShape?: string
  size: number
  roughness: number
  baseColor: string
  imageDataUrl?: string
}

export async function generateRubberGLB(options: RubberOptions): Promise<ArrayBuffer> {
  const { shape, diecutShape, size, roughness, baseColor, imageDataUrl } = options
  const s = size * 1.2
  const depth = 0.2
  const group = new THREE.Group()

  let designTex: THREE.Texture | null = null
  if (imageDataUrl) {
    try { designTex = await loadTexture(imageDataUrl) } catch { /* ignore */ }
  }

  const mat = new THREE.MeshStandardMaterial({
    roughness, metalness: 0, color: new THREE.Color(baseColor),
  })
  if (designTex) {
    mat.map = designTex
    mat.color.set('#ffffff')
  }

  if (shape === 'circle') {
    group.add(new THREE.Mesh(new THREE.CylinderGeometry(s, s, depth, 64), mat))

    // 挂孔
    const hole = new THREE.Mesh(
      new THREE.TorusGeometry(s * 0.09, s * 0.03, 8, 16),
      new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0, color: '#d4cfc8' }),
    )
    hole.position.y = -0.03
    hole.position.z = s * 0.85
    hole.rotation.x = Math.PI / 2
    group.add(hole)
  } else {
    let sh: THREE.Shape
    const dshape = diecutShape || 'heart'
    switch (dshape) {
      case 'heart': sh = createHeartShape(s); break
      case 'star': sh = createStarShape(s * 0.9, s * 0.5); break
      default: sh = createHeartShape(s)
    }
    const geom = new THREE.ExtrudeGeometry(sh, { steps: 1, depth, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 3 })

    const mesh = new THREE.Mesh(geom, mat)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.y = -depth / 2
    group.add(mesh)

    // 挂孔
    const hole = new THREE.Mesh(
      new THREE.TorusGeometry(s * 0.09, s * 0.03, 8, 16),
      new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0, color: '#d4cfc8' }),
    )
    hole.position.y = 0.05
    hole.position.z = s * 0.85
    hole.rotation.x = Math.PI / 2
    group.add(hole)
  }

  return exportToGLB(group)
}

// ============================================================
// 书本 Book - 重写：圆脊 + 飘口 + 封面拆分 + 书脊文字
// ============================================================
export interface BookOptions {
  width: number       // 毫米
  height: number      // 毫米
  spineWidth: number  // 毫米
  coverImageDataUrl?: string  // 横排：封底|书脊|封面
  spineRatio: number // 书脊占封面图比例 (0.02 ~ 0.2)
  spineText?: string  // 书脊文字
  paperColor: string
  edgeColor: string
  openAngle: number   // 0 = 闭合, 0.55PI = 翻开
}

// Canvas 封面图片拆分为 封底/书脊/封面 三张纹理
async function splitCoverTexture(
  dataUrl: string,
  spineRatio: number,
): Promise<{ front: THREE.CanvasTexture; back: THREE.CanvasTexture; spine: THREE.CanvasTexture } | null> {
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = reject
      i.src = dataUrl
    })

    const cw = img.width
    const ch = img.height
    const spineW = Math.round(cw * spineRatio)
    const coverW = Math.round((cw - spineW) / 2)

    const canvas = document.createElement('canvas')

    function crop(sx: number, sw: number): THREE.CanvasTexture {
      canvas.width = Math.max(sw, 1)
      canvas.height = Math.max(ch, 1)
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, sx, 0, sw, ch, 0, 0, canvas.width, canvas.height)
      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.wrapS = THREE.ClampToEdgeWrapping
      tex.wrapT = THREE.ClampToEdgeWrapping
      tex.needsUpdate = true
      return tex
    }

    return {
      back: crop(0, coverW),           // 封底：最左边
      spine: crop(coverW, spineW),     // 书脊：中间
      front: crop(coverW + spineW, coverW), // 封面：最右边
    }
  } catch {
    return null
  }
}

// Canvas 渲染书脊文字
function createSpineTextTexture(
  text: string,
  _spineWidth: number,
  height: number,
): THREE.CanvasTexture | null {
  if (!text) return null
  const scale = 4
  const w = 64
  const h = Math.round(height * scale * 0.018)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = 'transparent'
  ctx.fillRect(0, 0, w, h)

  // 竖排文字
  const chars = text.split('')
  const fontSize = Math.min(18, Math.floor(w / chars.length * 1.5))
  ctx.font = `bold ${fontSize}px sans-serif`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const startY = h / 2 - ((chars.length - 1) * fontSize * 1.3) / 2
  chars.forEach((char, i) => {
    ctx.fillText(char, w / 2, startY + i * fontSize * 1.3)
  })

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

export async function generateBookGLB(options: BookOptions): Promise<ArrayBuffer> {
  const { width, height, spineWidth, coverImageDataUrl, spineRatio, spineText, paperColor, edgeColor, openAngle } = options

  const scale = 0.018
  const hw = width * scale / 2
  const hh = height * scale / 2
  const sw = spineWidth * scale / 2
  const ct = 0.08  // 封面厚度
  const pageDepth = 0.15  // 书页总厚度
  const overhang = 0.04  // 飘口（封面比书页多出的部分）

  const group = new THREE.Group()

  // ---- 封面纹理拆分 ----
  let coverTextures: { front: THREE.CanvasTexture; back: THREE.CanvasTexture; spine: THREE.CanvasTexture } | null = null
  if (coverImageDataUrl) {
    coverTextures = await splitCoverTexture(coverImageDataUrl, spineRatio)
  }

  // ---- 书脊文字纹理 ----
  const spineTextTex = spineText ? createSpineTextTexture(spineText, spineWidth, height) : null

  // ---- 材质 ----
  const frontMat = new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.03 })
  const backMat = new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.03 })
  const spineMat = new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.03 })

  if (coverTextures) {
    frontMat.map = coverTextures.front
    frontMat.color.set('#ffffff')
    backMat.map = coverTextures.back
    backMat.color.set('#ffffff')
    spineMat.map = coverTextures.spine
    spineMat.color.set('#ffffff')
  } else {
    frontMat.color.set('#1e40af')
    spineMat.color.set('#333333')
    backMat.color.set('#1e3a5f')
  }

  const paperMat = new THREE.MeshStandardMaterial({
    roughness: 0.85, metalness: 0, color: new THREE.Color(paperColor),
  })
  const edgeMat = new THREE.MeshStandardMaterial({
    roughness: 0.4, metalness: edgeColor === '#ffd700' ? 0.5 : 0, color: new THREE.Color(edgeColor),
  })

  // ---- 圆脊（弧形书脊） ----
  // 使用 ExtrudeGeometry 创建弧形书脊截面
  const spineShape = new THREE.Shape()
  const spineR = sw * 1.5 // 书脊弧半径
  spineShape.moveTo(-sw, -ct / 2)
  // 弧线向外凸出
  spineShape.quadraticCurveTo(-sw + spineR * 0.3, -ct / 2 - spineR * 0.15, 0, -ct / 2 - sw * 0.3)
  spineShape.quadraticCurveTo(sw - spineR * 0.3, -ct / 2 - spineR * 0.15, sw, -ct / 2)
  spineShape.lineTo(sw, ct / 2)
  spineShape.quadraticCurveTo(sw - spineR * 0.3, ct / 2 + spineR * 0.15, 0, ct / 2 + sw * 0.3)
  spineShape.quadraticCurveTo(-sw + spineR * 0.3, ct / 2 + spineR * 0.15, -sw, ct / 2)
  spineShape.closePath()

  const spineGeom = new THREE.ExtrudeGeometry(spineShape, {
    steps: 1,
    depth: height * scale,
    bevelEnabled: false,
  })
  const spine = new THREE.Mesh(spineGeom, spineMat)
  spine.position.z = -height * scale / 2
  group.add(spine)

  // 书脊文字叠加层（贴在弧形书脊表面）
  if (spineTextTex) {
    const spineLabelGeom = new THREE.PlaneGeometry(sw * 1.6, height * scale * 0.8)
    const spineLabelMat = new THREE.MeshBasicMaterial({
      map: spineTextTex,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })
    const spineLabel = new THREE.Mesh(spineLabelGeom, spineLabelMat)
    spineLabel.position.z = -sw * 0.35
    spineLabel.renderOrder = 1
    group.add(spineLabel)
  }

  // ---- 封底（左边） ----
  // 封面比书页大一圈（飘口）
  const coverW = width * scale + overhang
  const coverH = height * scale + overhang
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(coverW, coverH, ct),
    backMat,
  )
  back.position.set(-sw - hw, 0, 0)
  group.add(back)

  // ---- 左页块 ----
  const pageW = width * scale - 0.06
  const pageH = height * scale - 0.1
  const leftPages = new THREE.Mesh(
    new THREE.BoxGeometry(pageW, pageH, pageDepth),
    paperMat,
  )
  leftPages.position.set(-sw, 0, ct / 2 + pageDepth / 2)
  group.add(leftPages)

  // 书口侧面（左页块右侧可见）
  const edgeSide = new THREE.Mesh(
    new THREE.BoxGeometry(0.015, pageH, pageDepth),
    edgeMat,
  )
  edgeSide.position.set(hw - sw - 0.03, 0, ct / 2 + pageDepth / 2)
  group.add(edgeSide)

  // 书口上下（天头地脚）
  const edgeGeom = new THREE.BoxGeometry(pageW, 0.015, pageDepth)
  const edgeTop = new THREE.Mesh(edgeGeom.clone(), edgeMat)
  edgeTop.position.set(-sw, hh - 0.05, ct / 2 + pageDepth / 2)
  group.add(edgeTop)
  const edgeBottom = new THREE.Mesh(edgeGeom.clone(), edgeMat)
  edgeBottom.position.set(-sw, -hh + 0.05, ct / 2 + pageDepth / 2)
  group.add(edgeBottom)

  // ---- 右页块（翻开角度） ----
  const rightPagesGroup = new THREE.Group()
  rightPagesGroup.position.set(sw + 0.01, 0, ct / 2 + pageDepth / 2)
  rightPagesGroup.rotation.y = openAngle * 0.9
  const rightPages = new THREE.Mesh(
    new THREE.BoxGeometry(pageW, pageH, pageDepth),
    paperMat,
  )
  rightPagesGroup.add(rightPages)
  const rightEdge = new THREE.Mesh(
    new THREE.BoxGeometry(0.015, pageH, pageDepth),
    edgeMat,
  )
  rightEdge.position.set(hw - 0.03, 0, 0)
  rightPagesGroup.add(rightEdge)
  group.add(rightPagesGroup)

  // ---- 封面（翻开） ----
  const frontGroup = new THREE.Group()
  frontGroup.position.set(sw + hw, 0, 0)
  frontGroup.rotation.y = openAngle
  const front = new THREE.Mesh(
    new THREE.BoxGeometry(coverW, coverH, ct),
    frontMat,
  )
  frontGroup.add(front)
  group.add(frontGroup)

  // ---- 书签带 ----
  const ribbonMat = new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0, color: '#e74c3c' })
  const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.6, 0.005), ribbonMat)
  ribbon.position.set(0, -hh + 0.5, ct / 2 + pageDepth + 0.01)
  group.add(ribbon)
  const ribbonTail = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.3, 0.005), ribbonMat)
  ribbonTail.position.set(0, -hh, ct / 2 + pageDepth + 0.01)
  group.add(ribbonTail)

  return exportToGLB(group)
}