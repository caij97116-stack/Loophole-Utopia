import { useState, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stage, ContactShadows, Text } from '@react-three/drei'
import * as THREE from 'three'
import { BackButton, Card, Section } from '@/components/ui'

const bindingsList = [
  { id: 'saddle-stitch', name: '骑马订', desc: '订书钉装订，适合64P以内薄本', spineWidth: 0.08, pageCount: 32 },
  { id: 'perfect-binding', name: '无线胶装', desc: '胶水粘合，最常见平装', spineWidth: 0.3, pageCount: 64 },
  { id: 'sewn-binding', name: '锁线胶装', desc: '缝线+胶装，结实可平摊', spineWidth: 0.4, pageCount: 80 },
  { id: 'hardcover', name: '精装', desc: '硬壳封面，最高级', spineWidth: 0.5, pageCount: 100 },
  { id: 'open-spine', name: '裸脊线装', desc: '书脊裸露，设计感强', spineWidth: 0.3, pageCount: 64 },
  { id: 'thread-binding', name: '古线装', desc: '东方传统线装', spineWidth: 0.25, pageCount: 48 },
  { id: 'butterfly-binding', name: '蝴蝶装', desc: '每页对折粘合，完全平摊', spineWidth: 0.35, pageCount: 56 },
]

const processes = [
  { id: 'foil-gold', name: '烫金', color: '#d4a843' },
  { id: 'foil-silver', name: '烫银', color: '#b0b0b0' },
  { id: 'uv', name: '局部UV', color: '#60a5fa' },
  { id: 'emboss', name: '凹凸', color: '#a78bfa' },
  { id: 'hologram', name: '镭射', color: '#f472b6' },
]

// ---- 3D Book Model ----
function BookModel({
  coverColor,
  paperColor,
  isOpen,
  openAngle,
  pageFlip,
  binding,
  activeProcesses,
}: {
  coverColor: string
  paperColor: string
  isOpen: boolean
  openAngle: number
  pageFlip: number
  binding: string
  activeProcesses: string[]
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const pageRef = useRef<THREE.Mesh>(null!)
  const rightPageRef = useRef<THREE.Group>(null!)

  const bindingCfg = bindingsList.find((b) => b.id === binding)!
  const spineW = bindingCfg.spineWidth
  const bookW = 2.2
  const bookH = 3.0
  const coverD = 0.06
  const pageD = 0.01

  const coverMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(coverColor),
    roughness: 0.4,
    metalness: 0.05,
  }), [coverColor])

  const paperMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(paperColor),
    roughness: 0.9,
    metalness: 0,
  }), [paperColor])

  const spineMat = useMemo(() => {
    if (binding === 'hardcover') return new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.3, metalness: 0.1 })
    if (binding === 'open-spine') return new THREE.MeshStandardMaterial({ color: paperColor, roughness: 0.9 })
    if (binding === 'thread-binding') return new THREE.MeshStandardMaterial({ color: '#8B4513', roughness: 0.6 })
    return new THREE.MeshStandardMaterial({ color: '#333333', roughness: 0.5, metalness: 0.05 })
  }, [binding, paperColor])

  const hasHologram = activeProcesses.includes('hologram')
  const hasGold = activeProcesses.includes('foil-gold')
  const hasUV = activeProcesses.includes('uv')

  // Auto-rotate when not interacting
  useFrame(() => {
    if (pageRef.current && isOpen) {
      pageRef.current.rotation.y = THREE.MathUtils.lerp(pageRef.current.rotation.y, openAngle, 0.05)
    }
    if (rightPageRef.current && pageFlip > 0) {
      rightPageRef.current.rotation.y = THREE.MathUtils.lerp(rightPageRef.current.rotation.y, pageFlip * Math.PI * 0.5, 0.08)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ---- 书脊 ---- */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[spineW, bookH, coverD + 0.02]} />
        <primitive object={spineMat} attach="material" />
      </mesh>

      {/* ---- 左封面 (封底) ---- */}
      <group position={[-spineW / 2 - bookW / 2, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[bookW, bookH, coverD]} />
          <primitive object={coverMat} attach="material" />
        </mesh>
        {/* 工艺效果层 */}
        {hasHologram && (
          <mesh position={[0, 0, coverD / 2 + 0.002]}>
            <planeGeometry args={[bookW * 0.8, bookH * 0.8]} />
            <meshStandardMaterial color="#ff6b6b" roughness={0.2} metalness={0.8} transparent opacity={0.3} />
          </mesh>
        )}
        {hasGold && (
          <Text position={[0, bookH * 0.25, coverD / 2 + 0.003]} fontSize={0.18} color="#d4a843" font="/fonts/NotoSansSC-Regular.ttf" anchorX="center" anchorY="middle">
            书名
          </Text>
        )}
        {hasUV && (
          <mesh position={[0, -bookH * 0.15, coverD / 2 + 0.002]}>
            <planeGeometry args={[bookW * 0.5, 0.08]} />
            <meshStandardMaterial color="#60a5fa" roughness={0.1} metalness={0.9} transparent opacity={0.5} />
          </mesh>
        )}
      </group>

      {/* ---- 右封面 / 内页 ---- */}
      {isOpen ? (
        <>
          {/* 翻开后的左页(内页) */}
          <mesh position={[-spineW / 2 - bookW / 2 + 0.01, 0, coverD / 2 + pageD / 2]} ref={pageRef}>
            <boxGeometry args={[bookW - 0.02, bookH - 0.1, pageD]} />
            <primitive object={paperMat} attach="material" />
          </mesh>

          {/* 翻开后的右页 */}
          <group ref={rightPageRef} position={[spineW / 2 + bookW / 2 - 0.01, 0, coverD / 2 + pageD / 2]}>
            <mesh>
              <boxGeometry args={[bookW - 0.02, bookH - 0.1, pageD]} />
              <primitive object={paperMat} attach="material" />
            </mesh>
            {/* 右侧页面文字 */}
            <mesh position={[0, 0, pageD / 2 + 0.001]}>
              <planeGeometry args={[bookW * 0.75, bookH * 0.8]} />
              <meshBasicMaterial color="#d0d0d0" transparent opacity={0.5} />
            </mesh>
          </group>

          {/* 叠层页 */}
          {Array.from({ length: 3 }).map((_, i) => (
            <mesh key={`stack-left-${i}`} position={[-spineW / 2 - bookW / 2 + 0.01, 0, coverD / 2 + pageD * 1.5 + i * pageD * 0.1]}>
              <boxGeometry args={[bookW - 0.04, bookH - 0.12, pageD * 0.5]} />
              <primitive object={paperMat} attach="material" />
            </mesh>
          ))}
        </>
      ) : (
        <>
          {/* 合上时的右封面 */}
          <group position={[spineW / 2 + bookW / 2, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[bookW, bookH, coverD]} />
              <primitive object={coverMat} attach="material" />
            </mesh>
            {hasHologram && (
              <mesh position={[0, 0, coverD / 2 + 0.002]}>
                <planeGeometry args={[bookW * 0.8, bookH * 0.8]} />
                <meshStandardMaterial color="#ff6b6b" roughness={0.2} metalness={0.8} transparent opacity={0.3} />
              </mesh>
            )}
          </group>

          {/* 书页叠层（合上时显示厚度） */}
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh key={`stack-${i}`} position={[spineW / 2 + 0.01, 0, coverD / 2 + pageD * 0.3 + i * pageD * 0.15]}>
              <boxGeometry args={[bookW - 0.02, bookH - 0.06, pageD * 0.6]} />
              <primitive object={paperMat} attach="material" />
            </mesh>
          ))}
        </>
      )}

      {/* 骑马订订书钉 */}
      {binding === 'saddle-stitch' && (
        <>
          <mesh position={[0, bookH * 0.15, coverD / 2 + 0.01]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -bookH * 0.15, coverD / 2 + 0.01]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
          </mesh>
        </>
      )}

      {/* 古线装线 */}
      {binding === 'thread-binding' && (
        <>
          {Array.from({ length: 4 }).map((_, i) => (
            <mesh key={`thread-${i}`} position={[0, bookH * 0.3 - i * bookH * 0.2, coverD / 2 + 0.01]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
              <meshStandardMaterial color="#8B4513" roughness={0.6} />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}

// ---- 3D Scene ----
function BookScene({
  coverColor,
  paperColor,
  isOpen,
  openAngle,
  pageFlip,
  binding,
  activeProcesses,
}: {
  coverColor: string
  paperColor: string
  isOpen: boolean
  openAngle: number
  pageFlip: number
  binding: string
  activeProcesses: string[]
}) {
  return (
    <>
      <Stage
        intensity={0.8}
        environment="studio"
        preset="rembrandt"
        adjustCamera={false}
        shadows={{ type: 'contact', opacity: 0.6, blur: 3 }}
      >
        <BookModel
          coverColor={coverColor}
          paperColor={paperColor}
          isOpen={isOpen}
          openAngle={openAngle}
          pageFlip={pageFlip}
          binding={binding}
          activeProcesses={activeProcesses}
        />
      </Stage>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI * 5 / 6}
        minDistance={3}
        maxDistance={8}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
      <ContactShadows
        position={[0, -1.6, 0]}
        opacity={0.5}
        scale={6}
        blur={2.5}
        far={4}
      />
    </>
  )
}

// ---- Loading fallback ----
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
export default function Book3DPreview() {
  const [binding, setBinding] = useState('perfect-binding')
  const [isOpen, setIsOpen] = useState(false)
  const [activeProcess, setActiveProcess] = useState<string[]>([])
  const [coverColor, setCoverColor] = useState('#1e40af')
  const [paperColor, setPaperColor] = useState('#fef3c7')
  const [pageFlip, setPageFlip] = useState(0)

  const toggleProcess = (id: string) => {
    setActiveProcess((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id])
  }

  const selectedBinding = bindingsList.find((b) => b.id === binding)

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题栏 */}
      <div className="p-4 pb-0">
        <BackButton to="/book" label="返回书本制作" />
        <Section title="3D实机渲染预览" icon="📖" description="WebGL 真实3D渲染 · 拖拽旋转 · 滚轮缩放 · 右键平移" />
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0">
        {/* 左侧控制面板 */}
        <div className="lg:w-64 shrink-0 space-y-3 overflow-y-auto">
          <Card>
            <h3 className="font-semibold text-sm mb-3">装订方式</h3>
            <div className="space-y-1">
              {bindingsList.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBinding(b.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    binding === b.id ? 'bg-primary text-white' : 'bg-gray-100 text-text hover:bg-gray-200'
                  }`}
                >
                  <span className="text-left text-xs">{b.name}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-sm mb-3">封面工艺</h3>
            <div className="flex flex-wrap gap-1">
              {processes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggleProcess(p.id)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    activeProcess.includes(p.id) ? 'text-white' : 'bg-gray-100 text-text hover:bg-gray-200'
                  }`}
                  style={activeProcess.includes(p.id) ? { backgroundColor: p.color } : {}}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-sm mb-3">颜色</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-text-muted mb-1">封面</label>
                <input type="color" value={coverColor} onChange={(e) => setCoverColor(e.target.value)} className="w-full h-10 rounded border cursor-pointer" />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">内页</label>
                <input type="color" value={paperColor} onChange={(e) => setPaperColor(e.target.value)} className="w-full h-10 rounded border cursor-pointer" />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-sm mb-3">控制</h3>
            <div className="space-y-3">
              <button
                onClick={() => { setIsOpen(!isOpen); setPageFlip(0) }}
                className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white cursor-pointer hover:opacity-90 transition-opacity"
              >
                {isOpen ? '合上书本' : '翻开书本'}
              </button>
              {isOpen && (
                <div>
                  <label className="block text-xs text-text-muted mb-1">翻页角度</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(pageFlip * 100)}
                    onChange={(e) => setPageFlip(Number(e.target.value) / 100)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-text-muted">
                    <span>未翻</span>
                    <span>{Math.round(pageFlip * 180)}°</span>
                    <span>全翻</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="text-xs text-text-muted p-2">
            <p>当前装订：{selectedBinding?.name}</p>
            <p className="mt-1">{selectedBinding?.desc}</p>
            <p className="mt-2 text-primary">拖拽旋转 | 滚轮缩放 | 右键平移</p>
          </div>
        </div>

        {/* 右侧 3D 渲染区 */}
        <div className="flex-1 bg-bg-card rounded-2xl overflow-hidden min-h-[500px] relative">
          <Suspense fallback={<LoadingFallback />}>
            <Canvas
              camera={{ position: [0, 0.5, 5.5], fov: 40 }}
              gl={{ antialias: true, alpha: false }}
              style={{ width: '100%', height: '100%' }}
            >
              <BookScene
                coverColor={coverColor}
                paperColor={paperColor}
                isOpen={isOpen}
                openAngle={isOpen ? Math.PI * 0.55 : 0}
                pageFlip={pageFlip}
                binding={binding}
                activeProcesses={activeProcess}
              />
            </Canvas>
          </Suspense>
        </div>
      </div>
    </div>
  )
}