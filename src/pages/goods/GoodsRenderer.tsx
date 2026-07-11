import { useState, useRef, useMemo, Suspense, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, AccumulativeShadows, RandomizedLight } from '@react-three/drei'
import * as THREE from 'three'
import { BackButton, Card, Section, Tag } from '@/components/ui'

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

// ---- Shape helpers ----
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
  const totalPoints = points * 2
  for (let i = 0; i < totalPoints; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    const angle = (i / totalPoints) * Math.PI * 2 - Math.PI / 2
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
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  return shape
}

function createCloudShape(r: number): THREE.Shape {
  const shape = new THREE.Shape()
  shape.moveTo(-r * 0.6, -r * 0.15)
  shape.lineTo(r * 0.6, -r * 0.15)
  shape.absarc(r * 0.5, -r * 0.15, r * 0.25, 0, Math.PI, true)
  shape.absarc(r * 0.25, r * 0.1, r * 0.3, 0, Math.PI, true)
  shape.absarc(0, r * 0.15, r * 0.35, 0, Math.PI, true)
  shape.absarc(-r * 0.25, r * 0.1, r * 0.3, 0, Math.PI, true)
  shape.absarc(-r * 0.5, -r * 0.15, r * 0.25, 0, Math.PI, true)
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

function createFlowerShape(r: number): THREE.Shape {
  const shape = new THREE.Shape()
  const petals = 6
  for (let i = 0; i < petals * 2; i++) {
    const angle = (i / (petals * 2)) * Math.PI * 2 - Math.PI / 2
    const rr = i % 2 === 0 ? r : r * 0.4
    const x = Math.cos(angle) * rr
    const y = Math.sin(angle) * rr
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  return shape
}

function getDiecutShape(shape: DiecutShape, s: number): THREE.Shape {
  switch (shape) {
    case 'heart': return createHeartShape(s)
    case 'star': return createStarShape(s * 0.9, s * 0.5)
    case 'hexagon': return createHexagonShape(s * 0.9)
    case 'cloud': return createCloudShape(s * 0.9)
    case 'diamond': return createDiamondShape(s * 0.9)
    case 'flower': return createFlowerShape(s * 0.85)
    case 'irregular': {
      const shape = new THREE.Shape()
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2
        const vr = s * (0.7 + Math.sin(i * 2.5) * 0.3)
        const x = Math.cos(a) * vr
        const y = Math.sin(a) * vr
        if (i === 0) shape.moveTo(x, y)
        else shape.lineTo(x, y)
      }
      shape.closePath()
      return shape
    }
  }
}

function getDepth(type: GoodsType): number {
  switch (type) {
    case 'badge': return 0.12
    case 'acrylic': return 0.28
    case 'sticker': return 0.03
    case 'rubber': return 0.2
  }
}

// ---- 3D Goods Model ----
function GoodsModel({
  goodsType, shape, scale, effect, baseColor, diecutShape, imageTexture,
}: {
  goodsType: GoodsType
  shape: string
  scale: number
  effect: { roughness: number; metalness: number }
  baseColor: string
  diecutShape: DiecutShape
  imageTexture: THREE.Texture | null
}) {
  const meshRef = useRef<THREE.Group>(null!)
  const s = scale * 1.2
  const depth = getDepth(goodsType)
  const isBadge = goodsType === 'badge'
  const isAcrylic = goodsType === 'acrylic'
  const isSticker = goodsType === 'sticker'
  const isRubber = goodsType === 'rubber'

  // 异形几何体缓存
  const diecutGeom = useMemo(() => {
    if (shape !== 'diecut') return null
    const sh = getDiecutShape(diecutShape, s)
    return new THREE.ExtrudeGeometry(sh, {
      steps: 1, depth, bevelEnabled: true,
      bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 3,
    })
  }, [shape, diecutShape, s, depth])

  // 特定形状的几何体
  const heartGeom = useMemo(() => {
    if (shape !== 'heart') return null
    const sh = createHeartShape(s)
    return new THREE.ExtrudeGeometry(sh, {
      steps: 1, depth, bevelEnabled: true,
      bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 3,
    })
  }, [shape, s, depth])

  const starGeom = useMemo(() => {
    if (shape !== 'star') return null
    const sh = createStarShape(s * 0.9, s * 0.5)
    return new THREE.ExtrudeGeometry(sh, {
      steps: 1, depth, bevelEnabled: true,
      bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 3,
    })
  }, [shape, s, depth])

  const hexGeom = useMemo(() => {
    if (shape !== 'hexagon') return null
    const sh = createHexagonShape(s * 0.9)
    return new THREE.ExtrudeGeometry(sh, {
      steps: 1, depth, bevelEnabled: true,
      bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 3,
    })
  }, [shape, s, depth])

  const diamondGeom = useMemo(() => {
    if (shape !== 'diamond') return null
    const sh = createDiamondShape(s * 0.9)
    return new THREE.ExtrudeGeometry(sh, {
      steps: 1, depth, bevelEnabled: true,
      bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 3,
    })
  }, [shape, s, depth])

  return (
    <group ref={meshRef} position={[0, 0.05, 0]}>
      {/* ====== 吧唧 ====== */}
      {isBadge && shape === 'circle' && (
        <>
          {/* 金属底座 - 稍大一圈 */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[s * 1.06, s * 1.06, depth * 0.55, 64]} />
            <meshStandardMaterial color="#d4d4d4" roughness={0.15} metalness={0.95} />
          </mesh>
          {/* 设计面 - 略微凸起 */}
          <mesh castShadow position={[0, depth * 0.28, 0]}>
            <cylinderGeometry args={[s, s * 0.98, depth * 0.5, 64]} />
            <meshStandardMaterial
              roughness={effect.roughness}
              metalness={effect.metalness}
              color={imageTexture ? '#ffffff' : baseColor}
              map={imageTexture ?? undefined}
            />
          </mesh>
          {/* 金属边框环 */}
          <mesh position={[0, depth * 0.28, 0]}>
            <torusGeometry args={[s * 1.03, s * 0.04, 16, 64]} />
            <meshStandardMaterial color="#d4d4d4" roughness={0.15} metalness={0.95} />
          </mesh>
          {/* 顶面高光模拟（dome effect） */}
          <mesh position={[0, depth * 0.53 + 0.001, 0]}>
            <cylinderGeometry args={[s * 0.95, s * 0.95, 0.002, 64]} />
            <meshStandardMaterial color="#ffffff" roughness={0.05} metalness={0} transparent opacity={0.15} />
          </mesh>
          {/* 背面针 */}
          <mesh position={[0, -(depth * 0.28), 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[s * 0.02, s * 0.02, s * 0.15, 8]} />
            <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.8} />
          </mesh>
        </>
      )}

      {isBadge && shape === 'square' && (
        <>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[s * 1.7, depth * 0.55, s * 1.7]} />
            <meshStandardMaterial color="#d4d4d4" roughness={0.15} metalness={0.95} />
          </mesh>
          <mesh castShadow position={[0, depth * 0.28, 0]}>
            <boxGeometry args={[s * 1.5, depth * 0.5, s * 1.5]} />
            <meshStandardMaterial
              roughness={effect.roughness}
              metalness={effect.metalness}
              color={imageTexture ? '#ffffff' : baseColor}
              map={imageTexture ?? undefined}
            />
          </mesh>
        </>
      )}

      {isBadge && (shape === 'heart' || shape === 'star' || shape === 'hexagon' || shape === 'diamond') && (
        (heartGeom || starGeom || hexGeom || diamondGeom) && (
          <mesh castShadow receiveShadow
            geometry={heartGeom || starGeom || hexGeom || diamondGeom || undefined}
            rotation={[0, 0, 0]}
          >
            <meshStandardMaterial
              roughness={effect.roughness}
              metalness={effect.metalness}
              color={imageTexture ? '#ffffff' : baseColor}
              map={imageTexture ?? undefined}
            />
          </mesh>
        )
      )}

      {/* ====== 亚克力 ====== */}
      {isAcrylic && shape === 'circle' && (
        <>
          <mesh castShadow>
            <cylinderGeometry args={[s, s, depth, 64]} />
            <meshPhysicalMaterial
              roughness={effect.roughness}
              metalness={effect.metalness}
              transparent
              opacity={0.88}
              clearcoat={0.1}
              ior={1.5}
              reflectivity={0.5}
              color={imageTexture ? '#ffffff' : '#ffffff'}
              map={imageTexture ?? undefined}
            />
          </mesh>
          {/* 边缘高光 */}
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[s * 1.005, s * 0.015, 8, 64]} />
            <meshStandardMaterial color="#ffffff" roughness={0} metalness={0} transparent opacity={0.3} />
          </mesh>
        </>
      )}

      {isAcrylic && shape === 'rect' && (
        <>
          <mesh castShadow>
            <boxGeometry args={[s * 1.5, depth, s * 2.2]} />
            <meshPhysicalMaterial
              roughness={effect.roughness}
              metalness={effect.metalness}
              transparent
              opacity={0.88}
              clearcoat={0.1}
              ior={1.5}
              reflectivity={0.5}
              color={imageTexture ? '#ffffff' : '#ffffff'}
              map={imageTexture ?? undefined}
            />
          </mesh>
          {/* 边缘高光线 */}
          <mesh position={[s * 0.75, 0, 0]}>
            <boxGeometry args={[0.01, depth * 1.1, s * 2.2]} />
            <meshStandardMaterial color="#ffffff" roughness={0} metalness={0} transparent opacity={0.3} />
          </mesh>
          <mesh position={[-s * 0.75, 0, 0]}>
            <boxGeometry args={[0.01, depth * 1.1, s * 2.2]} />
            <meshStandardMaterial color="#ffffff" roughness={0} metalness={0} transparent opacity={0.2} />
          </mesh>
        </>
      )}

      {isAcrylic && (shape === 'diecut' || shape === 'heart' || shape === 'star') && (
        ((diecutGeom || heartGeom || starGeom) && (
          <mesh castShadow
            geometry={diecutGeom || heartGeom || starGeom || undefined}
          >
            <meshPhysicalMaterial
              roughness={effect.roughness}
              metalness={effect.metalness}
              transparent
              opacity={0.88}
              clearcoat={0.1}
              ior={1.5}
              reflectivity={0.5}
              color={imageTexture ? '#ffffff' : '#ffffff'}
              map={imageTexture ?? undefined}
            />
          </mesh>
        ))
      )}

      {/* 亚克力表面反光 */}
      {isAcrylic && (
        <mesh position={[s * 0.2, depth / 2 + 0.005, s * 0.3]} rotation={[-0.1, 0, -0.25]}>
          <planeGeometry args={[s * 0.4, s * 0.12]} />
          <meshStandardMaterial color="#ffffff" roughness={0} metalness={0} transparent opacity={0.18} />
        </mesh>
      )}

      {/* ====== 贴纸 ====== */}
      {isSticker && shape === 'circle' && (
        <mesh castShadow>
          <cylinderGeometry args={[s, s, depth, 64]} />
          <meshStandardMaterial
            roughness={effect.roughness}
            metalness={effect.metalness}
            color={imageTexture ? '#ffffff' : baseColor}
            map={imageTexture ?? undefined}
          />
        </mesh>
      )}

      {isSticker && shape === 'rect' && (
        <mesh castShadow>
          <boxGeometry args={[s * 1.5, depth, s * 2.0]} />
          <meshStandardMaterial
            roughness={effect.roughness}
            metalness={effect.metalness}
            color={imageTexture ? '#ffffff' : baseColor}
            map={imageTexture ?? undefined}
          />
        </mesh>
      )}

      {isSticker && (shape === 'diecut' || shape === 'heart') && (
        ((diecutGeom || heartGeom) && (
          <mesh castShadow geometry={diecutGeom || heartGeom || undefined}>
            <meshStandardMaterial
              roughness={effect.roughness}
              metalness={effect.metalness}
              color={imageTexture ? '#ffffff' : baseColor}
              map={imageTexture ?? undefined}
            />
          </mesh>
        ))
      )}

      {/* ====== 橡胶挂件 ====== */}
      {isRubber && shape === 'circle' && (
        <>
          <mesh castShadow>
            <cylinderGeometry args={[s, s, depth, 64]} />
            <meshStandardMaterial
              roughness={effect.roughness}
              metalness={effect.metalness}
              color={imageTexture ? '#ffffff' : baseColor}
              map={imageTexture ?? undefined}
            />
          </mesh>
          {/* 挂孔 */}
          <mesh position={[0, depth / 2 + 0.02, s * 0.85]}>
            <torusGeometry args={[s * 0.09, s * 0.03, 8, 16]} />
            <meshStandardMaterial color="#d4cfc8" roughness={0.7} metalness={0} />
          </mesh>
        </>
      )}

      {isRubber && (shape === 'diecut' || shape === 'heart' || shape === 'star') && (
        (diecutGeom || heartGeom || starGeom) && (
          <mesh castShadow
            geometry={diecutGeom || heartGeom || starGeom || undefined}
          >
            <meshStandardMaterial
              roughness={effect.roughness}
              metalness={effect.metalness}
              color={imageTexture ? '#ffffff' : baseColor}
              map={imageTexture ?? undefined}
            />
          </mesh>
        )
      )}

      {isRubber && (
        <mesh position={[0, depth / 2 + 0.02, s * 0.85]}>
          <torusGeometry args={[s * 0.09, s * 0.03, 8, 16]} />
          <meshStandardMaterial color="#d4cfc8" roughness={0.7} metalness={0} />
        </mesh>
      )}
    </group>
  )
}

// ---- 3D Scene ----
function GoodsScene(props: {
  goodsType: GoodsType
  shape: string
  scale: number
  effect: { roughness: number; metalness: number }
  baseColor: string
  diecutShape: DiecutShape
  imageTexture: THREE.Texture | null
}) {
  return (
    <>
      {/* Studio 环境贴图 - 提供真实金属反射 */}
      <Environment preset="studio" background={false} />

      {/* 3点摄影棚灯光 */}
      <ambientLight intensity={0.4} />
      {/* 主光 */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={3.5}
        castShadow
        shadow-mapSize={1024}
        shadow-bias={-0.0001}
      />
      {/* 补光 */}
      <directionalLight position={[-3, 3, -2]} intensity={1.2} />
      {/* 顶光 */}
      <spotLight
        position={[0, 5, 0]}
        intensity={2.5}
        angle={0.4}
        penumbra={0.5}
        castShadow
      />
      {/* 底部补光 - 减少暗面 */}
      <directionalLight position={[0, -1, 3]} intensity={0.6} />

      <GoodsModel {...props} />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI - 0.2}
        minDistance={1.5}
        maxDistance={6}
        autoRotate={true}
        autoRotateSpeed={1.2}
      />

      {/* 柔和阴影 */}
      <AccumulativeShadows
        position={[0, -1.1, 0]}
        frames={60}
        alphaTest={0.85}
        scale={5}
        opacity={0.5}
      >
        <RandomizedLight
          amount={4}
          radius={4}
          intensity={1.5}
          position={[5, 5, 5]}
        />
      </AccumulativeShadows>
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full" />
        <span className="text-sm text-text-muted">3D 引擎初始化中...</span>
      </div>
    </div>
  )
}

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
  const [imageTexture, setImageTexture] = useState<THREE.Texture | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const config = goodsConfigs.find((g) => g.type === goodsType)!
  const activeShape = config.shapes.find((s) => s.id === shape)!
  const activeSize = config.sizes.find((s) => s.id === size)!
  const activeEffect = config.effects.find((e) => e.id === effect)!

  useEffect(() => {
    if (uploadedImage) {
      const loader = new THREE.TextureLoader()
      const tex = loader.load(uploadedImage)
      tex.colorSpace = THREE.SRGBColorSpace
      setImageTexture(tex)
      return () => { tex.dispose() }
    } else {
      setImageTexture(null)
    }
  }, [uploadedImage])

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
        <div className="flex-1 bg-bg-card rounded-2xl overflow-hidden min-h-[500px] relative">
          <Suspense fallback={<LoadingFallback />}>
            <Canvas
              camera={{ position: [0, 0.4, 3.5], fov: 40 }}
              gl={{
                antialias: true,
                alpha: false,
                preserveDrawingBuffer: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.1,
              }}
              style={{ width: '100%', height: '100%' }}
              shadows="soft"
            >
              <GoodsScene
                goodsType={goodsType}
                shape={shape}
                scale={activeSize.scale}
                effect={activeEffect}
                baseColor={baseColor}
                diecutShape={diecutShape}
                imageTexture={imageTexture}
              />
            </Canvas>
          </Suspense>
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