import { useState, useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stage, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { BackButton, Card, Section, Tag } from '@/components/ui'

type GoodsType = 'badge' | 'acrylic' | 'sticker' | 'rubber'
type DiecutShape = 'heart' | 'star' | 'hexagon' | 'cloud' | 'irregular'

interface GoodsConfig {
  type: GoodsType
  label: string
  shapes: { id: string; name: string }[]
  sizes: { id: string; name: string; scale: number }[]
  effects: { id: string; name: string; roughness: number; metalness: number }[]
}

const goodsConfigs: GoodsConfig[] = [
  {
    type: 'badge',
    label: '吧唧',
    shapes: [
      { id: 'circle', name: '圆形' },
      { id: 'square', name: '方形' },
      { id: 'heart', name: '心形' },
      { id: 'star', name: '星形' },
    ],
    sizes: [
      { id: '58mm', name: '58mm（标准）', scale: 1.0 },
      { id: '75mm', name: '75mm（大吧唧）', scale: 1.3 },
      { id: '44mm', name: '44mm（迷你）', scale: 0.75 },
      { id: '100mm', name: '100mm（超大）', scale: 1.7 },
    ],
    effects: [
      { id: 'matte', name: '磨砂', roughness: 0.8, metalness: 0 },
      { id: 'glitter', name: '星幻', roughness: 0.3, metalness: 0.3 },
      { id: 'laser', name: '镭射', roughness: 0.1, metalness: 0.7 },
      { id: 'silver', name: '银底', roughness: 0.2, metalness: 0.9 },
      { id: 'none', name: '亮膜', roughness: 0.15, metalness: 0.05 },
    ],
  },
  {
    type: 'acrylic',
    label: '亚克力',
    shapes: [
      { id: 'rect', name: '矩形' },
      { id: 'circle', name: '圆形' },
      { id: 'diecut', name: '异形' },
    ],
    sizes: [
      { id: 'small', name: '小（5cm）', scale: 0.85 },
      { id: 'medium', name: '中（8cm）', scale: 1.35 },
      { id: 'large', name: '大（12cm）', scale: 2.0 },
    ],
    effects: [
      { id: 'clear', name: '透明', roughness: 0.05, metalness: 0.05 },
      { id: 'frosted', name: '磨砂', roughness: 0.5, metalness: 0 },
      { id: 'none', name: '白底', roughness: 0.3, metalness: 0 },
    ],
  },
  {
    type: 'sticker',
    label: '贴纸',
    shapes: [
      { id: 'rect', name: '矩形' },
      { id: 'circle', name: '圆形' },
      { id: 'diecut', name: '异形' },
    ],
    sizes: [
      { id: 'small', name: '小（5cm）', scale: 0.85 },
      { id: 'medium', name: '中（8cm）', scale: 1.35 },
      { id: 'large', name: '大（10cm）', scale: 1.7 },
    ],
    effects: [
      { id: 'laser', name: '镭射', roughness: 0.1, metalness: 0.7 },
      { id: 'none', name: '普通', roughness: 0.5, metalness: 0 },
    ],
  },
  {
    type: 'rubber',
    label: '橡胶挂件',
    shapes: [
      { id: 'circle', name: '圆形' },
      { id: 'diecut', name: '异形' },
    ],
    sizes: [
      { id: 'small', name: '小（4cm）', scale: 0.7 },
      { id: 'medium', name: '中（6cm）', scale: 1.0 },
    ],
    effects: [
      { id: 'none', name: '标准', roughness: 0.7, metalness: 0 },
    ],
  },
]

// ---- Diecut Shape Helpers ----
function createHeartShape(s: number): THREE.Shape {
  const shape = new THREE.Shape()
  shape.moveTo(s * 0.25, s * 0.25)
  shape.bezierCurveTo(s * 0.25, s * 0.25, s * 0.2, 0, 0, 0)
  shape.bezierCurveTo(s * -0.3, 0, s * -0.3, s * 0.35, s * -0.3, s * 0.35)
  shape.bezierCurveTo(s * -0.3, s * 0.55, s * -0.1, s * 0.77, s * 0.25, s * 0.95)
  shape.bezierCurveTo(s * 0.6, s * 0.77, s * 0.8, s * 0.55, s * 0.8, s * 0.35)
  shape.bezierCurveTo(s * 0.8, s * 0.35, s * 0.8, 0, s * 0.5, 0)
  shape.bezierCurveTo(s * 0.35, 0, s * 0.25, s * 0.25, s * 0.25, s * 0.25)
  return shape
}

function createStarShape(outerR: number, innerR: number, points: number): THREE.Shape {
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

function createHexagonShape(radius: number): THREE.Shape {
  const shape = new THREE.Shape()
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 6
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  return shape
}

function createCloudShape(radius: number): THREE.Shape {
  const shape = new THREE.Shape()
  const r = radius
  shape.moveTo(-r * 0.6, -r * 0.15)
  shape.lineTo(r * 0.6, -r * 0.15)
  shape.absarc(r * 0.5, -r * 0.15, r * 0.25, 0, Math.PI, true)
  shape.absarc(r * 0.25, r * 0.1, r * 0.3, 0, Math.PI, true)
  shape.absarc(0, r * 0.15, r * 0.35, 0, Math.PI, true)
  shape.absarc(-r * 0.25, r * 0.1, r * 0.3, 0, Math.PI, true)
  shape.absarc(-r * 0.5, -r * 0.15, r * 0.25, 0, Math.PI, true)
  return shape
}

function createIrregularShape(radius: number): THREE.Shape {
  const shape = new THREE.Shape()
  const points = 8
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2
    const variation = 0.7 + Math.sin(i * 2.5) * 0.3
    const r = radius * variation
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  return shape
}

function getDiecutGeometry(diecutShape: DiecutShape, s: number, depth: number): THREE.ExtrudeGeometry {
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    steps: 1,
    depth,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 3,
  }

  let shape: THREE.Shape
  switch (diecutShape) {
    case 'heart':
      shape = createHeartShape(s)
      break
    case 'star':
      shape = createStarShape(s * 0.9, s * 0.5, 5)
      break
    case 'hexagon':
      shape = createHexagonShape(s * 0.9)
      break
    case 'cloud':
      shape = createCloudShape(s * 0.9)
      break
    case 'irregular':
      shape = createIrregularShape(s * 0.85)
      break
  }

  return new THREE.ExtrudeGeometry(shape, extrudeSettings)
}

function getGoodsDepth(goodsType: GoodsType): number {
  switch (goodsType) {
    case 'badge': return 0.08
    case 'acrylic': return 0.25
    case 'sticker': return 0.03
    case 'rubber': return 0.18
  }
}

// ---- 3D Goods Model ----
function GoodsModel({
  goodsType,
  shape,
  scale,
  effect,
  baseColor,
  accentColor,
  diecutShape,
  imageTexture,
}: {
  goodsType: GoodsType
  shape: string
  scale: number
  effect: { roughness: number; metalness: number }
  baseColor: string
  accentColor: string
  diecutShape: DiecutShape
  imageTexture: THREE.Texture | null
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const innerRef = useRef<THREE.Group>(null!)

  useFrame(() => {
    // gentle floating animation
    if (innerRef.current) {
      innerRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.03
    }
  })

  const mainMat = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      roughness: effect.roughness,
      metalness: effect.metalness,
    })
    if (imageTexture) {
      mat.map = imageTexture
      mat.color.set('#ffffff')
      mat.needsUpdate = true
    }
    return mat
  }, [baseColor, effect.roughness, effect.metalness, imageTexture])

  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(accentColor),
    roughness: 0.4,
    metalness: 0.1,
  }), [accentColor])

  const s = scale * 1.2
  const isBadge = goodsType === 'badge'
  const isAcrylic = goodsType === 'acrylic'
  const isSticker = goodsType === 'sticker'
  const isRubber = goodsType === 'rubber'

  const depth = useMemo(() => getGoodsDepth(goodsType), [goodsType])

  // Diecut geometries (for badge heart/star and all diecut shapes)
  const badgeHeartGeom = useMemo(
    () => (isBadge && shape === 'heart' ? getDiecutGeometry('heart', s, depth) : null),
    [isBadge, shape, s, depth],
  )
  const badgeStarGeom = useMemo(
    () => (isBadge && shape === 'star' ? getDiecutGeometry('star', s, depth) : null),
    [isBadge, shape, s, depth],
  )
  const diecutGeom = useMemo(
    () => (shape === 'diecut' ? getDiecutGeometry(diecutShape, s, depth) : null),
    [shape, diecutShape, s, depth],
  )

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 主体 */}
      <group ref={innerRef}>
        {isBadge && shape === 'circle' && (
          <mesh castShadow>
            <cylinderGeometry args={[s, s, 0.08, 64]} />
            <primitive object={mainMat} attach="material" />
          </mesh>
        )}
        {isBadge && shape === 'square' && (
          <mesh castShadow>
            <boxGeometry args={[s * 1.7, s * 1.7, 0.08]} />
            <primitive object={mainMat} attach="material" />
          </mesh>
        )}
        {isBadge && shape === 'heart' && badgeHeartGeom && (
          <mesh castShadow geometry={badgeHeartGeom}>
            <primitive object={mainMat} attach="material" />
          </mesh>
        )}
        {isBadge && shape === 'star' && badgeStarGeom && (
          <mesh castShadow geometry={badgeStarGeom}>
            <primitive object={mainMat} attach="material" />
          </mesh>
        )}

        {isAcrylic && shape === 'circle' && (
          <mesh castShadow>
            <cylinderGeometry args={[s, s, 0.25, 64]} />
            <primitive object={mainMat} attach="material" />
          </mesh>
        )}
        {isAcrylic && shape === 'rect' && (
          <mesh castShadow>
            <boxGeometry args={[s * 1.5, s * 2.2, 0.25]} />
            <primitive object={mainMat} attach="material" />
          </mesh>
        )}
        {isAcrylic && shape === 'diecut' && diecutGeom && (
          <mesh castShadow geometry={diecutGeom}>
            <primitive object={mainMat} attach="material" />
          </mesh>
        )}

        {isSticker && shape === 'circle' && (
          <mesh castShadow rotation={[0, 0, 0]}>
            <cylinderGeometry args={[s, s, 0.03, 64]} />
            <primitive object={mainMat} attach="material" />
          </mesh>
        )}
        {isSticker && shape === 'rect' && (
          <mesh castShadow rotation={[0, 0, 0]}>
            <boxGeometry args={[s * 1.5, 0.03, s * 2.0]} />
            <primitive object={mainMat} attach="material" />
          </mesh>
        )}
        {isSticker && shape === 'diecut' && diecutGeom && (
          <mesh castShadow rotation={[0, 0, 0]} geometry={diecutGeom}>
            <primitive object={mainMat} attach="material" />
          </mesh>
        )}

        {isRubber && shape === 'circle' && (
          <mesh castShadow>
            <cylinderGeometry args={[s, s, 0.18, 64]} />
            <primitive object={mainMat} attach="material" />
          </mesh>
        )}
        {isRubber && shape === 'diecut' && diecutGeom && (
          <mesh castShadow geometry={diecutGeom}>
            <primitive object={mainMat} attach="material" />
          </mesh>
        )}

        {/* 吧唧金属边框 */}
        {isBadge && (
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[s * 1.05, 0.04, 32, 64]} />
            <meshStandardMaterial color="#c0c0c0" roughness={0.2} metalness={0.9} />
          </mesh>
        )}

        {/* 吧唧高光 */}
        {isBadge && (
          <mesh position={[s * 0.3, s * 0.3, 0.045]}>
            <sphereGeometry args={[s * 0.15, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} transparent opacity={0.15} />
          </mesh>
        )}

        {/* 亚克力反光 */}
        {isAcrylic && (
          <mesh position={[s * 0.25, s * 0.4, 0.14]} rotation={[0, 0, -0.3]}>
            <planeGeometry args={[s * 0.5, s * 0.2]} />
            <meshStandardMaterial color="#ffffff" roughness={0} metalness={0} transparent opacity={0.2} />
          </mesh>
        )}

        {/* 橡胶挂件厚度层 */}
        {isRubber && (
          <mesh position={[0, 0, -0.1]}>
            <cylinderGeometry args={[s, s, 0.02, 64]} />
            <meshStandardMaterial color={accentColor} roughness={0.7} />
          </mesh>
        )}

        {/* 装饰圈(辅色) */}
        {isBadge && (
          <mesh position={[0, 0, 0.045]}>
            <torusGeometry args={[s * 0.5, 0.02, 16, 64]} />
            <primitive object={accentMat} attach="material" />
          </mesh>
        )}
      </group>
    </group>
  )
}

// ---- 3D Scene ----
function GoodsScene({
  goodsType,
  shape,
  scale,
  effect,
  baseColor,
  accentColor,
  diecutShape,
  imageTexture,
}: {
  goodsType: GoodsType
  shape: string
  scale: number
  effect: { roughness: number; metalness: number }
  baseColor: string
  accentColor: string
  diecutShape: DiecutShape
  imageTexture: THREE.Texture | null
}) {
  return (
    <>
      <Stage
        intensity={0.8}
        environment="studio"
        preset="portrait"
        adjustCamera={false}
        shadows={{ type: 'contact', opacity: 0.5, blur: 3 }}
      >
        <GoodsModel
          goodsType={goodsType}
          shape={shape}
          scale={scale}
          effect={effect}
          baseColor={baseColor}
          accentColor={accentColor}
          diecutShape={diecutShape}
          imageTexture={imageTexture}
        />
      </Stage>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        minDistance={2}
        maxDistance={6}
        autoRotate={true}
        autoRotateSpeed={1.5}
      />
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.4}
        scale={4}
        blur={2.5}
        far={4}
      />
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full" />
        <span className="text-sm text-text-muted">3D 引擎加载中...</span>
      </div>
    </div>
  )
}

// ---- Main Page ----
const diecutShapeOptions: { id: DiecutShape; name: string }[] = [
  { id: 'heart', name: '心形' },
  { id: 'star', name: '星形' },
  { id: 'hexagon', name: '六边形' },
  { id: 'cloud', name: '云朵' },
  { id: 'irregular', name: '不规则' },
]

export default function GoodsRenderer() {
  const [goodsType, setGoodsType] = useState<GoodsType>('badge')
  const [shape, setShape] = useState('circle')
  const [size, setSize] = useState('58mm')
  const [effect, setEffect] = useState('matte')
  const [baseColor, setBaseColor] = useState('#f8c8dc')
  const [accentColor, setAccentColor] = useState('#e890b0')
  const [diecutShape, setDiecutShape] = useState<DiecutShape>('heart')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [imageTexture, setImageTexture] = useState<THREE.Texture | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const config = goodsConfigs.find((g) => g.type === goodsType)!
  const activeShape = config.shapes.find((s) => s.id === shape)!
  const activeSize = config.sizes.find((s) => s.id === size)!
  const activeEffect = config.effects.find((e) => e.id === effect)!

  // Load image texture from uploaded data URL
  useEffect(() => {
    if (uploadedImage) {
      const loader = new THREE.TextureLoader()
      const texture = loader.load(uploadedImage)
      texture.colorSpace = THREE.SRGBColorSpace
      setImageTexture(texture)
      return () => {
        texture.dispose()
      }
    } else {
      setImageTexture(null)
    }
  }, [uploadedImage])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => {
      setUploadedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleClearImage = () => {
    setUploadedImage(null)
    setFileName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 pb-0">
        <BackButton to="/goods" label="返回周边制作" />
        <Section
          title="周边渲染器"
          icon="🎨"
          description="WebGL 真实3D渲染 · 吧唧/亚克力/贴纸/橡胶挂件 · 拖拽旋转 · 滚轮缩放"
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0">
        {/* 左侧控制区 */}
        <div className="lg:w-64 shrink-0 space-y-3 overflow-y-auto">
          <Card>
            <h3 className="text-sm font-semibold mb-3">周边类型</h3>
            <div className="flex flex-wrap gap-2">
              {goodsConfigs.map((g) => (
                <button
                  key={g.type}
                  onClick={() => {
                    setGoodsType(g.type)
                    setShape(g.shapes[0].id)
                    setSize(g.sizes[0].id)
                    setEffect(g.effects[0].id)
                    setDiecutShape('heart')
                  }}
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

          {/* 异形样式选择器（仅当选择 diecut 时显示） */}
          {shape === 'diecut' && (
            <Card>
              <h3 className="text-sm font-semibold mb-3">异形样式</h3>
              <div className="flex flex-wrap gap-2">
                {diecutShapeOptions.map((ds) => (
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

          <Card>
            <h3 className="text-sm font-semibold mb-3">颜色</h3>
            <div className="flex gap-4">
              <div>
                <label className="text-xs text-text-muted">主色</label>
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="block w-8 h-8 rounded cursor-pointer border-0 mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted">辅色</label>
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="block w-8 h-8 rounded cursor-pointer border-0 mt-1"
                />
              </div>
            </div>
          </Card>

          {/* 图片上传贴图 */}
          <Card>
            <h3 className="text-sm font-semibold mb-3">贴图</h3>
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
                  alt="贴图预览"
                  className="w-full h-20 object-cover rounded-lg border border-border"
                />
                <p className="text-xs text-text-muted truncate">{fileName}</p>
                <button
                  onClick={handleClearImage}
                  className="w-full px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer"
                >
                  清除贴图
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-3 py-2 rounded-lg text-xs font-medium border border-dashed border-border hover:border-primary text-text-muted hover:text-primary transition-colors cursor-pointer"
              >
                + 上传图片
              </button>
            )}
          </Card>

          <div className="text-xs text-text-muted p-2">
            <p className="text-primary">自动旋转 · 拖拽旋转 · 滚轮缩放 · 右键平移</p>
          </div>
        </div>

        {/* 右侧 3D 渲染区 */}
        <div className="flex-1 bg-bg-card rounded-2xl overflow-hidden min-h-[500px] relative">
          <Suspense fallback={<LoadingFallback />}>
            <Canvas
              camera={{ position: [0, 0.3, 3.5], fov: 42 }}
              gl={{ antialias: true, alpha: false }}
              style={{ width: '100%', height: '100%' }}
            >
              <GoodsScene
                goodsType={goodsType}
                shape={shape}
                scale={activeSize.scale}
                effect={activeEffect}
                baseColor={baseColor}
                accentColor={accentColor}
                diecutShape={diecutShape}
                imageTexture={imageTexture}
              />
            </Canvas>
          </Suspense>
        </div>
      </div>

      {/* 底部信息栏 */}
      <div className="px-4 pb-4 flex gap-4 text-xs text-text-muted">
        <Tag variant="default">
          {config.label} | {activeShape.name} | {activeSize.name} | {activeEffect.name}
        </Tag>
        <Tag variant="info">实时预览仅供参考，实际效果以实物为准</Tag>
      </div>
    </div>
  )
}