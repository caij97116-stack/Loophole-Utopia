import { useState } from 'react'
import { Section, Card, Tag } from '@/components/ui'

type GoodsType = 'badge' | 'acrylic' | 'sticker' | 'rubber'

interface GoodsConfig {
  type: GoodsType
  label: string
  shapes: { id: string; name: string }[]
  sizes: { id: string; name: string; px: number }[]
  effects: { id: string; name: string; css: string }[]
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
      { id: '58mm', name: '58mm（标准）', px: 140 },
      { id: '75mm', name: '75mm（大吧唧）', px: 180 },
      { id: '44mm', name: '44mm（迷你）', px: 106 },
      { id: '100mm', name: '100mm（超大）', px: 240 },
    ],
    effects: [
      { id: 'matte', name: '磨砂', css: 'opacity:0.9;filter:saturate(0.85)' },
      { id: 'glitter', name: '星幻', css: 'background:linear-gradient(135deg,rgba(255,255,255,0.3),rgba(255,215,0,0.2),rgba(255,255,255,0.3))' },
      { id: 'laser', name: '镭射', css: 'background:linear-gradient(135deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff,#ff6b6b);mix-blend-mode:overlay;opacity:0.4' },
      { id: 'silver', name: '银底', css: 'background:linear-gradient(135deg,#e8e8e8,#c0c0c0,#a0a0a0,#c0c0c0,#e8e8e8)' },
      { id: 'none', name: '亮膜', css: '' },
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
      { id: 'small', name: '小（5cm）', px: 120 },
      { id: 'medium', name: '中（8cm）', px: 192 },
      { id: 'large', name: '大（12cm）', px: 288 },
    ],
    effects: [
      { id: 'clear', name: '透明', css: 'background:rgba(255,255,255,0.15);backdrop-filter:blur(1px)' },
      { id: 'frosted', name: '磨砂', css: 'background:rgba(255,255,255,0.2);backdrop-filter:blur(3px)' },
      { id: 'none', name: '白底', css: '' },
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
      { id: 'small', name: '小（5cm）', px: 120 },
      { id: 'medium', name: '中（8cm）', px: 192 },
      { id: 'large', name: '大（10cm）', px: 240 },
    ],
    effects: [
      { id: 'laser', name: '镭射', css: 'background:linear-gradient(135deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff,#ff6b6b);mix-blend-mode:overlay;opacity:0.4' },
      { id: 'none', name: '普通', css: '' },
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
      { id: 'small', name: '小（4cm）', px: 96 },
      { id: 'medium', name: '中（6cm）', px: 144 },
    ],
    effects: [
      { id: 'none', name: '标准', css: '' },
    ],
  },
]

export default function GoodsRenderer() {
  const [goodsType, setGoodsType] = useState<GoodsType>('badge')
  const [shape, setShape] = useState('circle')
  const [size, setSize] = useState('58mm')
  const [effect, setEffect] = useState('matte')
  const [baseColor, setBaseColor] = useState('#f8c8dc')
  const [accentColor, setAccentColor] = useState('#e890b0')

  const config = goodsConfigs.find((g) => g.type === goodsType)!
  const activeShape = config.shapes.find((s) => s.id === shape)!
  const activeSize = config.sizes.find((s) => s.id === size)!
  const activeEffect = config.effects.find((e) => e.id === effect)!

  const shapeStyle = (px: number) => {
    switch (shape) {
      case 'circle':
        return { borderRadius: '50%', width: px, height: px }
      case 'heart':
        return {
          width: px,
          height: px,
          clipPath: 'path("M50,15 A15,15,0,0,1,80,30 A15,15,0,0,1,50,60 A15,15,0,0,1,20,30 A15,15,0,0,1,50,15 Z")',
        }
      case 'star':
        return {
          width: px,
          height: px,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        }
      case 'square':
        return { borderRadius: '8%', width: px, height: px }
      case 'diecut':
        return { borderRadius: '12%', width: px, height: px }
      case 'rect':
        return { borderRadius: '6%', width: px * 1.2, height: px }
      default:
        return { borderRadius: '50%', width: px, height: px }
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section
        title="周边渲染器"
        icon="🎨"
        description="2D实时预览吧唧、亚克力、贴纸、橡胶挂件的不同尺寸/形状/材质效果"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧控制区 */}
        <div className="lg:w-72 space-y-4 shrink-0">
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
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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

          <Card>
            <h3 className="text-sm font-semibold mb-3">尺寸</h3>
            <div className="flex flex-wrap gap-2">
              {config.sizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSize(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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
        </div>

        {/* 右侧预览区 */}
        <div className="flex-1 flex items-center justify-center min-h-[400px] bg-bg-card rounded-2xl p-8">
          <div className="relative flex items-center justify-center">
            {/* 阴影效果 - 亚克力/橡胶 */}
            {(goodsType === 'acrylic' || goodsType === 'rubber') && (
              <div
                style={{
                  ...shapeStyle(activeSize.px),
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  background: 'rgba(0,0,0,0.15)',
                  filter: 'blur(4px)',
                }}
              />
            )}
            {/* 主体 */}
            <div
              style={{
                ...shapeStyle(activeSize.px),
                background: `linear-gradient(135deg, ${baseColor}, ${accentColor})`,
                position: 'relative',
                boxShadow: goodsType === 'badge' ? '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)' : '0 4px 16px rgba(0,0,0,0.15)',
                border: goodsType === 'badge' ? '3px solid #d0d0d0' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {/* 效果层 */}
              {activeEffect.css && (
                <div
                  style={{
                    ...shapeStyle(activeSize.px),
                    position: 'absolute',
                    inset: 0,
                    ...Object.fromEntries(
                      activeEffect.css.split(';').filter(Boolean).map((s) => {
                        const [k, v] = s.split(':')
                        return [k.trim(), v.trim()]
                      })
                    ),
                  }}
                />
              )}
              {/* 吧唧高光圆环 */}
              {goodsType === 'badge' && (
                <div
                  style={{
                    ...shapeStyle(activeSize.px),
                    position: 'absolute',
                    inset: 0,
                    border: '2px solid rgba(255,255,255,0.3)',
                    boxSizing: 'border-box',
                  }}
                />
              )}
              {/* 亚克力反光 */}
              {goodsType === 'acrylic' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '8%',
                    left: '10%',
                    width: '30%',
                    height: '20%',
                    borderRadius: '50%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.4), transparent)',
                    transform: 'rotate(-15deg)',
                  }}
                />
              )}
              {/* 示例图案 */}
              <span
                style={{
                  fontSize: activeSize.px * 0.25,
                  opacity: 0.5,
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                ★
              </span>
              {/* 橡胶挂件厚度 */}
              {goodsType === 'rubber' && (
                <div
                  style={{
                    ...shapeStyle(activeSize.px),
                    position: 'absolute',
                    bottom: -3,
                    right: -3,
                    background: `linear-gradient(135deg, ${baseColor}, ${accentColor})`,
                    filter: 'brightness(0.7)',
                    zIndex: -1,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 信息栏 */}
      <div className="mt-4 flex gap-4 text-xs text-text-muted">
        <Tag variant="default">
          {config.label} | {activeShape.name} | {activeSize.name} | {activeEffect.name}
        </Tag>
        <Tag variant="info">实时预览仅供参考，实际效果以实物为准</Tag>
      </div>
    </div>
  )
}