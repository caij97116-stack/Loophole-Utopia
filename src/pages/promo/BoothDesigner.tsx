import { useState } from 'react'
import { BackButton, Section, Card } from '@/components/ui'
import { boothTemplates } from '@/data/events'
import type { BoothTemplate } from '@/data/events'

const zoneIcons: Record<string, string> = {
  stand: '📋',
  display: '🖼️',
  book: '📚',
  goods: '🎁',
  poster: '🖼️',
}

const zoneLabels: Record<string, string> = {
  stand: '立牌/样品',
  display: '展示区',
  book: '本子区',
  goods: '周边区',
  poster: '海报区',
}

const zoneColors: Record<string, string> = {
  stand: '#dbeafe',
  display: '#fef3c7',
  book: '#d1fae5',
  goods: '#fce7f3',
  poster: '#e0e7ff',
}

export default function BoothDesigner() {
  const [selectedTemplate, setSelectedTemplate] = useState<BoothTemplate>(boothTemplates[0])
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  const toggleCheck = (item: string) => {
    const next = new Set(checkedItems)
    if (next.has(item)) next.delete(item)
    else next.add(item)
    setCheckedItems(next)
  }

  const scale = 2.5 // px per cm
  const gridW = selectedTemplate.width * scale
  const gridH = selectedTemplate.depth * scale

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/promo" label="返回展会宣发" />
      <Section
        title="摊位设计器"
        icon="🏪"
        description="可视化规划摊位布局，不同模板+实用技巧"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧控制区 */}
        <div className="lg:w-72 space-y-4 shrink-0">
          <Card>
            <h3 className="text-sm font-semibold mb-3">摊位模板</h3>
            <div className="flex flex-col gap-2">
              {boothTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={`text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                    selectedTemplate.id === t.id
                      ? 'bg-primary text-white'
                      : 'bg-bg-card border border-border hover:border-primary'
                  }`}
                >
                  <div className="font-medium">{t.name}</div>
                  <div className="opacity-70">{t.width}×{t.depth}cm</div>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold mb-3">布局技巧</h3>
            <ul className="space-y-2">
              {selectedTemplate.tips.map((tip, i) => (
                <li key={i} className="text-xs text-text-muted flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold mb-3">物品清单</h3>
            <div className="space-y-1.5">
              {[
                '桌布（推荐社团主题色）',
                '立牌/亚克力展示架',
                '吧唧展示架/托盘',
                '价目表/菜单牌',
                '找零盒 + 零钱',
                '包装袋/纸袋',
                '二维码收款牌',
                '样品展示用书',
                '海报/挂轴',
                '胶带/剪刀/马克笔',
                '充电宝',
                '水/零食',
              ].map((item) => (
                <label key={item} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-bg-card rounded px-1 py-0.5">
                  <input
                    type="checkbox"
                    checked={checkedItems.has(item)}
                    onChange={() => toggleCheck(item)}
                    className="rounded"
                  />
                  <span className={checkedItems.has(item) ? 'line-through text-text-muted' : ''}>{item}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-2">
              已勾选 {checkedItems.size} / 12 项
            </p>
          </Card>
        </div>

        {/* 右侧预览区 */}
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="text-xs text-text-muted">
            {selectedTemplate.name} | {selectedTemplate.width}×{selectedTemplate.depth}cm
          </div>

          {/* 网格预览 */}
          <div
            className="bg-bg-card rounded-xl p-4 flex items-center justify-center"
            style={{ minHeight: 300 }}
          >
            <div
              style={{
                width: gridW + 4,
                height: gridH + 4,
                position: 'relative',
                background: 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(0,0,0,0.05) 24px, rgba(0,0,0,0.05) 25px), repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(0,0,0,0.05) 24px, rgba(0,0,0,0.05) 25px)',
                border: '2px solid #d1d5db',
                borderRadius: 4,
              }}
            >
              {/* 后方区域标识 */}
              <div
                style={{
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: 10,
                  color: '#9ca3af',
                }}
              >
                后方（墙壁/过道）
              </div>
              {/* 前方区域标识 */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: 10,
                  color: '#9ca3af',
                }}
              >
                前方（顾客侧）
              </div>

              {/* 布局区域 */}
              {selectedTemplate.layout.map((zone, i) => {
                const zoneW = gridW / selectedTemplate.layout.length
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: i * zoneW + 4,
                      top: 4,
                      width: zoneW - 8,
                      height: gridH - 4,
                      background: zoneColors[zone.type],
                      border: '1px dashed rgba(0,0,0,0.15)',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{zoneIcons[zone.type]}</span>
                    <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 500 }}>
                      {zoneLabels[zone.type]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 图例 */}
          <div className="flex gap-4 flex-wrap">
            {Object.entries(zoneLabels).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs">
                <span className="w-3 h-3 rounded-sm" style={{ background: zoneColors[key] }} />
                <span className="text-text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}