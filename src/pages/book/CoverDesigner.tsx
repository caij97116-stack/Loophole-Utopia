import { useState } from 'react'
import { Section, Card, Tag, Select, Button } from '@/components/ui'

const formats = [
  { value: 'A4', label: 'A4 (210×297mm)', desc: '大判型，适合画集' },
  { value: 'A5', label: 'A5 (148×210mm)', desc: '最常用，小说/漫画/画集通用' },
  { value: 'B5', label: 'B5 (182×257mm)', desc: '略大于A5，漫画常用' },
  { value: 'B6', label: 'B6 (128×182mm)', desc: '文库本大小，适合小说' },
  { value: 'A6', label: 'A6 (105×148mm)', desc: '口袋本，便携' },
  { value: 'square', label: '正方形 (210×210mm)', desc: '正方形，适合画集/写真' },
  { value: 'landscape', label: '横版 (297×210mm)', desc: 'A4横版，适合摄影集' },
  { value: 'shinsho', label: '新書判 (103×182mm)', desc: '日本新书判，轻小说常用' },
  { value: 'bunko', label: '文庫判 (105×148mm)', desc: '日本文库判，口袋书' },
  { value: 'custom', label: '自定义', desc: '自定义尺寸' },
]

const designStyles = [
  { value: 'text-only', label: '纯文字排版', desc: '仅书名+作者名，极简风格' },
  { value: 'image-full', label: '满版插图', desc: '整面插图铺满封面，画集常用' },
  { value: 'text-image', label: '图文结合', desc: '文字+插图组合，最通用' },
  { value: 'hollow', label: '镂空设计', desc: '封面镂空，透出内页/内封' },
  { value: 'collage', label: '拼接设计', desc: '多元素拼接，丰富层次' },
  { value: 'gradient', label: '渐变设计', desc: '背景渐变+文字，简洁有力' },
  { value: 'minimal', label: '极简设计', desc: '极简主义，留白为主' },
  { value: 'retro', label: '复古设计', desc: '招牌/怀旧风格' },
  { value: 'deconstruct', label: '解构设计', desc: '打破常规，文字自由排列' },
]

const fonts = [
  { value: 'siyuan-black', label: '思源黑体 Heavy', lang: 'CN' },
  { value: 'siyuan-song', label: '思源宋体 Bold', lang: 'CN' },
  { value: 'zcool-black', label: '站酷高端黑', lang: 'CN' },
  { value: 'alibaba', label: '阿里普惠体', lang: 'CN' },
  { value: 'lxgw-wenkai', label: '霞鹜文楷', lang: 'CN' },
  { value: 'dela-gothic', label: '德拉黑体', lang: 'JP' },
  { value: 'm-plus', label: 'M+ FONTS', lang: 'JP' },
  { value: 'playfair', label: 'Playfair Display', lang: 'EN' },
  { value: 'montserrat', label: 'Montserrat', lang: 'EN' },
  { value: 'nanum', label: '나눔명조 (分享明朝)', lang: 'KR' },
]

export default function CoverDesigner() {
  const [format, setFormat] = useState('A5')
  const [style, setStyle] = useState('text-image')
  const [titleFont, setTitleFont] = useState('siyuan-black')
  const [titleText, setTitleText] = useState('')
  const [authorText, setAuthorText] = useState('')
  const [bgColor, setBgColor] = useState('#1e293b')
  const [textColor, setTextColor] = useState('#ffffff')

  const selectedFormat = formats.find((f) => f.value === format)
  const selectedStyle = designStyles.find((s) => s.value === style)
  const selectedFont = fonts.find((f) => f.value === titleFont)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section title="封面设计器" icon="🎨" description="13种判型 × 9种设计手法 × 多语言字体，实时预览封面效果" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：设计面板 */}
        <Card>
          <h3 className="font-semibold text-sm mb-4">设计参数</h3>

          <Select label="判型" options={formats.map((f) => ({ value: f.value, label: `${f.label} — ${f.desc}` }))} value={format} onChange={(e) => setFormat(e.target.value)} />

          <div className="mb-3">
            <label className="block text-sm font-medium text-text mb-1">设计手法</label>
            <div className="grid grid-cols-3 gap-1">
              {designStyles.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                    style === s.value ? 'bg-primary text-white' : 'bg-gray-100 text-text hover:bg-gray-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <Select label="标题字体" options={fonts.map((f) => ({ value: f.value, label: `${f.label} [${f.lang}]` }))} value={titleFont} onChange={(e) => setTitleFont(e.target.value)} />

          <div className="mb-3">
            <label className="block text-sm font-medium text-text mb-1">书名</label>
            <input
              type="text"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              placeholder="输入书名..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-text mb-1">作者</label>
            <input
              type="text"
              value={authorText}
              onChange={(e) => setAuthorText(e.target.value)}
              placeholder="输入作者名..."
              className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="mb-3">
              <label className="block text-sm font-medium text-text mb-1">背景色</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded border border-border cursor-pointer" />
                <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 px-2 py-2 rounded-lg border border-border bg-white text-xs" />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-text mb-1">文字色</label>
              <div className="flex items-center gap-2">
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-10 h-10 rounded border border-border cursor-pointer" />
                <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-1 px-2 py-2 rounded-lg border border-border bg-white text-xs" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            <Tag variant="default">{selectedFormat?.label}</Tag>
            <Tag variant="primary">{selectedStyle?.label}</Tag>
            {selectedFont && <Tag variant="success">{selectedFont.label}</Tag>}
          </div>
        </Card>

        {/* 右侧：预览 */}
        <Card>
          <h3 className="font-semibold text-sm mb-4">实时预览</h3>
          <div className="flex items-center justify-center p-4">
            <div
              className="border-2 border-gray-300 rounded shadow-lg flex flex-col items-center justify-center transition-all"
              style={{
                width: format === 'A4' ? '180px' : format === 'A5' ? '130px' : format === 'B5' ? '150px' : format === 'B6' ? '110px' : format === 'A6' ? '90px' : format === 'square' ? '150px' : format === 'landscape' ? '200px' : format === 'shinsho' ? '90px' : format === 'bunko' ? '90px' : '140px',
                height: format === 'A4' ? '255px' : format === 'A5' ? '185px' : format === 'B5' ? '210px' : format === 'B6' ? '155px' : format === 'A6' ? '130px' : format === 'square' ? '150px' : format === 'landscape' ? '140px' : format === 'shinsho' ? '160px' : format === 'bunko' ? '130px' : '200px',
                backgroundColor: bgColor,
                padding: style === 'text-only' ? '20px' : style === 'minimal' ? '30px' : '12px',
              }}
            >
              {/* 满版插图示意 */}
              {style === 'image-full' && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 rounded flex items-center justify-center">
                    <span className="text-xs opacity-50">[插图区域]</span>
                  </div>
                </div>
              )}

              {/* 拼接设计示意 */}
              {style === 'collage' && (
                <div className="w-full h-full grid grid-cols-2 gap-1">
                  <div className="bg-primary/20 rounded" />
                  <div className="bg-accent/20 rounded" />
                  <div className="bg-success/20 rounded" />
                  <div className="bg-info/20 rounded" />
                </div>
              )}

              {/* 文字区域 */}
              {(style !== 'image-full') && (
                <div className={`text-center ${style === 'text-only' || style === 'minimal' ? 'flex-1 flex flex-col items-center justify-center' : 'mt-auto'}`}
                  style={{ color: textColor }}
                >
                  <div className="text-lg font-bold leading-tight mb-2">
                    {titleText || '书名'}
                  </div>
                  {authorText && (
                    <div className="text-xs opacity-80">
                      {authorText}
                    </div>
                  )}
                  {!authorText && style !== 'minimal' && (
                    <div className="text-xs opacity-50">作者名</div>
                  )}
                </div>
              )}

              {/* 镂空示意 */}
              {style === 'hollow' && (
                <div className="absolute inset-4 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-white/50">[镂空区域]</span>
                </div>
              )}

              {/* 渐变示意 */}
              {style === 'gradient' && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none" />
              )}
            </div>
          </div>

          <div className="text-center text-xs text-text-muted space-y-1 mt-2">
            <p>判型：{selectedFormat?.label}</p>
            <p>设计手法：{selectedStyle?.label}</p>
            <p>标题字体：{selectedFont?.label}</p>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline" size="sm">导出封面图</Button>
            <Button variant="primary" size="sm">保存设计</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}