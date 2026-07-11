import { useState, useRef, useMemo, useEffect, Suspense, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { BackButton, Card, Section, Tag } from '@/components/ui'

type GoodsType = 'badge' | 'acrylic' | 'sticker' | 'rubber'
type DiecutShape = 'heart' | 'star' | 'hexagon' | 'cloud' | 'irregular'

const goodsConfigs = [
  {
    type: 'badge' as GoodsType, label: '吧唧',
    shapes: [{ id: 'circle', name: '圆形' }, { id: 'square', name: '方形' }, { id: 'heart', name: '心形' }, { id: 'star', name: '星形' }],
    sizes: [{ id: '58mm', name: '58mm标准', scale: 1.0 }, { id: '75mm', name: '75mm大', scale: 1.3 }, { id: '44mm', name: '44mm迷你', scale: 0.75 }, { id: '100mm', name: '100mm超大', scale: 1.7 }],
    effects: [{ id: 'matte', name: '磨砂', roughness: 0.8, metalness: 0 }, { id: 'glitter', name: '星幻', roughness: 0.3, metalness: 0.3 }, { id: 'laser', name: '镭射', roughness: 0.1, metalness: 0.7 }, { id: 'silver', name: '银底', roughness: 0.2, metalness: 0.9 }, { id: 'none', name: '亮膜', roughness: 0.15, metalness: 0.05 }],
  },
  {
    type: 'acrylic' as GoodsType, label: '亚克力',
    shapes: [{ id: 'circle', name: '圆形' }, { id: 'rect', name: '矩形' }, { id: 'diecut', name: '异形' }],
    sizes: [{ id: 'small', name: '5cm', scale: 0.85 }, { id: 'medium', name: '8cm', scale: 1.35 }, { id: 'large', name: '12cm', scale: 2.0 }],
    effects: [{ id: 'clear', name: '透明', roughness: 0.05, metalness: 0.05 }, { id: 'frosted', name: '磨砂', roughness: 0.5, metalness: 0 }, { id: 'none', name: '白底', roughness: 0.3, metalness: 0 }],
  },
  {
    type: 'sticker' as GoodsType, label: '贴纸',
    shapes: [{ id: 'circle', name: '圆形' }, { id: 'rect', name: '矩形' }, { id: 'diecut', name: '异形' }],
    sizes: [{ id: 'small', name: '5cm', scale: 0.85 }, { id: 'medium', name: '8cm', scale: 1.35 }, { id: 'large', name: '10cm', scale: 1.7 }],
    effects: [{ id: 'laser', name: '镭射', roughness: 0.1, metalness: 0.7 }, { id: 'none', name: '普通', roughness: 0.5, metalness: 0 }],
  },
  {
    type: 'rubber' as GoodsType, label: '橡胶挂件',
    shapes: [{ id: 'circle', name: '圆形' }, { id: 'diecut', name: '异形' }],
    sizes: [{ id: 'small', name: '4cm', scale: 0.7 }, { id: 'medium', name: '6cm', scale: 1.0 }],
    effects: [{ id: 'none', name: '标准', roughness: 0.7, metalness: 0 }],
  },
]

// ---- Shape helpers ----
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

function createStarShape(outerR: number, innerR: number): THREE.Shape {
  const shape = new THREE.Shape()
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2
    const x = Math.cos(angle) * r; const y = Math.sin(angle) * r
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y)
  }
  shape.closePath(); return shape
}

function createHexagonShape(r: number): THREE.Shape {
  const shape = new THREE.Shape()
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6
    const x = Math.cos(a) * r; const y = Math.sin(a) * r
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y)
  }
  shape.closePath(); return shape
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

function createIrregularShape(r: number): THREE.Shape {
  const shape = new THREE.Shape()
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    const vr = r * (0.7 + Math.sin(i * 2.5) * 0.3)
    const x = Math.cos(a) * vr; const y = Math.sin(a) * vr
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y)
  }
  shape.closePath(); return shape
}

function getDiecutShape(shape: DiecutShape, s: number): THREE.Shape {
  switch (shape) {
    case 'heart': return createHeartShape(s)
    case 'star': return createStarShape(s * 0.9, s * 0.5)
    case 'hexagon': return createHexagonShape(s * 0.9)
    case 'cloud': return createCloudShape(s * 0.9)
    case 'irregular': return createIrregularShape(s * 0.85)
  }
}

function getDepth(type: GoodsType): number {
  switch (type) { case 'badge': return 0.06; case 'acrylic': return 0.22; case 'sticker': return 0.025; case 'rubber': return 0.16 }
}

// ---- 3D Goods Model ----
function GoodsModel({
  goodsType, shape, scale, effect, baseColor, diecutShape, imageTexture,
}: {
  goodsType: GoodsType; shape: string; scale: number
  effect: { roughness: number; metalness: number }
  baseColor: string; diecutShape: DiecutShape
  imageTexture: THREE.Texture | null
}) {
  const innerRef = useRef<THREE.Group>(null!)
  const s = scale * 1.2
  const depth = getDepth(goodsType)
  const isBadge = goodsType === 'badge'
  const isAcrylic = goodsType === 'acrylic'
  const isSticker = goodsType === 'sticker'
  const isRubber = goodsType === 'rubber'

  useFrame(() => {
    if (innerRef.current) innerRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.03
  })

  // 设计图材质（贴到正面）
  const designMat = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({ roughness: effect.roughness, metalness: effect.metalness })
    if (imageTexture) { mat.map = imageTexture; mat.color.set('#ffffff') }
    else mat.color.set(baseColor)
    return mat
  }, [baseColor, effect.roughness, effect.metalness, imageTexture])

  // 侧面/背面材质
  const rimMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: isBadge ? '#c0c0c0' : isAcrylic ? '#e8e8e8' : isRubber ? '#d4cfc8' : '#f0f0f0',
    roughness: isBadge ? 0.2 : isAcrylic ? 0.1 : 0.5,
    metalness: isBadge ? 0.9 : 0.05,
  }), [isBadge, isAcrylic, isRubber])

  // Acrylic 透明材质
  const acrylicMat = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.05, metalness: 0.05, transparent: true, opacity: 0.85 })
    if (imageTexture) { mat.map = imageTexture; mat.color.set('#ffffff') }
    else mat.color.set('#ffffff')
    return mat
  }, [imageTexture])

  // 模具几何体
  const diecutGeom = useMemo(() => {
    if (shape !== 'diecut') return null
    const sh = getDiecutShape(diecutShape, s)
    return new THREE.ExtrudeGeometry(sh, { steps: 1, depth, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2 })
  }, [shape, diecutShape, s, depth])

  const heartGeom = useMemo(() => {
    if (isBadge && shape === 'heart') return new THREE.ExtrudeGeometry(createHeartShape(s), { steps: 1, depth, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2 })
    return null
  }, [isBadge, shape, s, depth])

  const starGeom = useMemo(() => {
    if (isBadge && shape === 'star') return new THREE.ExtrudeGeometry(createStarShape(s * 0.9, s * 0.5), { steps: 1, depth, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2 })
    return null
  }, [isBadge, shape, s, depth])

  return (
    <group ref={innerRef} position={[0, 0, 0]}>
      {/* ====== 吧唧 ====== */}
      {isBadge && shape === 'circle' && (
        <>
          {/* 金属底座 */}
          <mesh castShadow>
            <cylinderGeometry args={[s * 1.05, s * 1.05, depth * 0.6, 64]} />
            <primitive object={rimMat} attach="material" />
          </mesh>
          {/* 设计面 */}
          <mesh castShadow position={[0, 0, depth * 0.3]}>
            <cylinderGeometry args={[s, s, depth * 0.5, 64]} />
            <primitive object={designMat} attach="material" />
          </mesh>
          {/* 金属边框 */}
          <mesh>
            <torusGeometry args={[s * 1.04, s * 0.05, 16, 64]} />
            <primitive object={rimMat} attach="material" />
          </mesh>
          {/* 高光 */}
          <mesh position={[s * 0.3, s * 0.3, depth * 0.55 + 0.005]}>
            <sphereGeometry args={[s * 0.12, 8, 8]} />
            <meshStandardMaterial color="#ffffff" roughness={0} transparent opacity={0.2} />
          </mesh>
        </>
      )}
      {isBadge && shape === 'square' && (
        <>
          <mesh castShadow>
            <boxGeometry args={[s * 1.7, s * 1.7, depth * 0.6]} />
            <primitive object={rimMat} attach="material" />
          </mesh>
          <mesh castShadow position={[0, 0, depth * 0.3]}>
            <boxGeometry args={[s * 1.5, s * 1.5, depth * 0.5]} />
            <primitive object={designMat} attach="material" />
          </mesh>
        </>
      )}
      {isBadge && shape === 'heart' && heartGeom && (
        <mesh castShadow geometry={heartGeom}>
          <primitive object={designMat} attach="material" />
        </mesh>
      )}
      {isBadge && shape === 'star' && starGeom && (
        <mesh castShadow geometry={starGeom}>
          <primitive object={designMat} attach="material" />
        </mesh>
      )}

      {/* ====== 亚克力 ====== */}
      {isAcrylic && shape === 'circle' && (
        <mesh castShadow>
          <cylinderGeometry args={[s, s, depth, 64]} />
          <primitive object={acrylicMat} attach="material" />
        </mesh>
      )}
      {isAcrylic && shape === 'rect' && (
        <mesh castShadow>
          <boxGeometry args={[s * 1.5, s * 2.2, depth]} />
          <primitive object={acrylicMat} attach="material" />
        </mesh>
      )}
      {isAcrylic && shape === 'diecut' && diecutGeom && (
        <mesh castShadow geometry={diecutGeom}>
          <primitive object={acrylicMat} attach="material" />
        </mesh>
      )}
      {/* 亚克力反光 */}
      {isAcrylic && (
        <mesh position={[s * 0.25, s * 0.4, depth / 2 + 0.01]} rotation={[0, 0, -0.3]}>
          <planeGeometry args={[s * 0.5, s * 0.15]} />
          <meshStandardMaterial color="#ffffff" roughness={0} metalness={0} transparent opacity={0.15} />
        </mesh>
      )}

      {/* ====== 贴纸 ====== */}
      {isSticker && shape === 'circle' && (
        <mesh castShadow rotation={[0, 0, 0]}>
          <cylinderGeometry args={[s, s, depth, 64]} />
          <primitive object={designMat} attach="material" />
        </mesh>
      )}
      {isSticker && shape === 'rect' && (
        <mesh castShadow rotation={[0, 0, 0]}>
          <boxGeometry args={[s * 1.5, depth, s * 2.0]} />
          <primitive object={designMat} attach="material" />
        </mesh>
      )}
      {isSticker && shape === 'diecut' && diecutGeom && (
        <mesh castShadow rotation={[0, 0, 0]} geometry={diecutGeom}>
          <primitive object={designMat} attach="material" />
        </mesh>
      )}

      {/* ====== 橡胶挂件 ====== */}
      {isRubber && shape === 'circle' && (
        <mesh castShadow>
          <cylinderGeometry args={[s, s, depth, 64]} />
          <primitive object={designMat} attach="material" />
        </mesh>
      )}
      {isRubber && shape === 'diecut' && diecutGeom && (
        <mesh castShadow geometry={diecutGeom}>
          <primitive object={designMat} attach="material" />
        </mesh>
      )}
      {/* 橡胶挂件孔 */}
      {isRubber && (
        <mesh position={[0, s * 0.85, 0]}>
          <cylinderGeometry args={[s * 0.08, s * 0.08, depth * 1.2, 16]} />
          <meshStandardMaterial color="#888888" roughness={0.5} />
        </mesh>
      )}
    </group>
  )
}

// ---- 3D Scene ----
function GoodsScene(props: {
  goodsType: GoodsType; shape: string; scale: number
  effect: { roughness: number; metalness: number }
  baseColor: string; diecutShape: DiecutShape
  imageTexture: THREE.Texture | null
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} />
      <spotLight position={[0, 3, 3]} intensity={0.8} angle={0.5} penumbra={0.5} />

      <GoodsModel {...props} />

      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true}
        minPolarAngle={0} maxPolarAngle={Math.PI} minDistance={1.5} maxDistance={6}
        autoRotate={true} autoRotateSpeed={1.5} />
      <ContactShadows position={[0, -1.2, 0]} opacity={0.4} scale={4} blur={2.5} far={4} />
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

const diecutOptions: { id: DiecutShape; name: string }[] = [
  { id: 'heart', name: '心形' }, { id: 'star', name: '星形' }, { id: 'hexagon', name: '六边形' }, { id: 'cloud', name: '云朵' }, { id: 'irregular', name: '不规则' },
]

// ---- Main Page ----
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

  useEffect(() => {
    if (uploadedImage) {
      const loader = new THREE.TextureLoader()
      const tex = loader.load(uploadedImage)
      tex.colorSpace = THREE.SRGBColorSpace
      setImageTexture(tex)
      return () => { tex.dispose() }
    } else { setImageTexture(null) }
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
    setUploadedImage(null); setFileName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 pb-0">
        <BackButton to="/goods" label="返回周边制作" />
        <Section title="周边渲染器" icon="🎨" description="上传设计图 → 贴到产品Mockup → 旋转查看 · 吧唧/亚克力/贴纸/橡胶" />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0">
        <div className="lg:w-64 shrink-0 space-y-3 overflow-y-auto">
          <Card>
            <h3 className="text-sm font-semibold mb-3">周边类型</h3>
            <div className="flex flex-wrap gap-2">
              {goodsConfigs.map((g) => (
                <button key={g.type}
                  onClick={() => { setGoodsType(g.type); setShape(g.shapes[0].id); setSize(g.sizes[0].id); setEffect(g.effects[0].id); setDiecutShape('heart') }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${goodsType === g.type ? 'bg-primary text-white' : 'bg-bg-card border border-border hover:border-primary'}`}
                >{g.label}</button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold mb-3">形状</h3>
            <div className="flex flex-wrap gap-2">
              {config.shapes.map((s) => (
                <button key={s.id} onClick={() => setShape(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${shape === s.id ? 'bg-primary text-white' : 'bg-bg-card border border-border hover:border-primary'}`}
                >{s.name}</button>
              ))}
            </div>
          </Card>

          {shape === 'diecut' && (
            <Card>
              <h3 className="text-sm font-semibold mb-3">异形样式</h3>
              <div className="flex flex-wrap gap-2">
                {diecutOptions.map((ds) => (
                  <button key={ds.id} onClick={() => setDiecutShape(ds.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${diecutShape === ds.id ? 'bg-primary text-white' : 'bg-bg-card border border-border hover:border-primary'}`}
                  >{ds.name}</button>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <h3 className="text-sm font-semibold mb-3">尺寸</h3>
            <div className="flex flex-wrap gap-2">
              {config.sizes.map((s) => (
                <button key={s.id} onClick={() => setSize(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${size === s.id ? 'bg-primary text-white' : 'bg-bg-card border border-border hover:border-primary'}`}
                >{s.name}</button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold mb-3">表面效果</h3>
            <div className="flex flex-wrap gap-2">
              {config.effects.map((e) => (
                <button key={e.id} onClick={() => setEffect(e.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${effect === e.id ? 'bg-primary text-white' : 'bg-bg-card border border-border hover:border-primary'}`}
                >{e.name}</button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold mb-3">颜色</h3>
            <div className="flex gap-4">
              <div><label className="text-xs text-text-muted">主色</label>
                <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="block w-8 h-8 rounded cursor-pointer border-0 mt-1" />
              </div>
              <div><label className="text-xs text-text-muted">辅色</label>
                <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="block w-8 h-8 rounded cursor-pointer border-0 mt-1" />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold mb-3">设计图</h3>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            {uploadedImage ? (
              <div className="space-y-2">
                <img src={uploadedImage} alt="设计图" className="w-full h-20 object-cover rounded-lg border border-border" />
                <p className="text-xs text-text-muted truncate">{fileName}</p>
                <button onClick={handleClearImage} className="w-full px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer">清除</button>
              </div>
            ) : (
              <button onClick={() => fileInputRef.current?.click()} className="w-full px-3 py-2 rounded-lg text-xs font-medium border border-dashed border-border hover:border-primary text-text-muted hover:text-primary transition-colors cursor-pointer">+ 上传设计图</button>
            )}
            <p className="text-xs text-text-muted mt-2">推荐上传透明底PNG</p>
          </Card>

          <div className="text-xs text-text-muted p-2">
            <p className="text-primary">自动旋转 · 拖拽旋转 · 滚轮缩放 · 右键平移</p>
          </div>
        </div>

        <div className="flex-1 bg-bg-card rounded-2xl overflow-hidden min-h-[500px] relative">
          <Suspense fallback={<LoadingFallback />}>
            <Canvas camera={{ position: [0, 0.3, 3.5], fov: 42 }}
              gl={{ antialias: true, alpha: false }}
              style={{ width: '100%', height: '100%' }}>
              <GoodsScene goodsType={goodsType} shape={shape} scale={activeSize.scale}
                effect={activeEffect} baseColor={baseColor}
                diecutShape={diecutShape} imageTexture={imageTexture} />
            </Canvas>
          </Suspense>
        </div>
      </div>

      <div className="px-4 pb-4 flex gap-4 text-xs text-text-muted">
        <Tag variant="default">{config.label} | {activeShape.name} | {activeSize.name} | {activeEffect.name}</Tag>
        <Tag variant="info">实时预览仅供参考，实际效果以实物为准</Tag>
      </div>
    </div>
  )
}