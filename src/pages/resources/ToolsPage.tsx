import { BackButton, Section, Card, Tag } from '@/components/ui'

interface Tool {
  name: string
  category: string
  platform: string
  price: string
  description: string
  bestFor: string[]
  alternatives: string[]
}

const tools: Tool[] = [
  { name: 'Clip Studio Paint', category: '绘画', platform: 'Win/Mac/iPad', price: '买断 ¥300+ / 订阅 ¥25/月', description: '漫画/插画行业标准软件，笔刷丰富，漫画功能强大', bestFor: ['漫画', '插画', '专业创作'], alternatives: ['Krita', 'MediBang Paint'] },
  { name: 'Krita', category: '绘画', platform: 'Win/Mac/Linux', price: '免费开源', description: '功能强大的免费开源绘画软件，笔刷引擎优秀', bestFor: ['插画', '概念设计', '预算有限'], alternatives: ['Clip Studio Paint', 'GIMP'] },
  { name: 'MediBang Paint', category: '绘画', platform: 'Win/Mac/iPad/Android', price: '免费', description: '轻量级漫画绘画软件，自带云同步和素材库', bestFor: ['漫画', '入门', '多设备'], alternatives: ['Jump Paint', 'Krita'] },
  { name: 'Procreate', category: '绘画', platform: 'iPad', price: '¥88 买断', description: 'iPad绘画神器，操作流畅，笔刷极佳', bestFor: ['iPad绘画', '插画', '草图'], alternatives: ['Clip Studio Paint iPad版'] },
  { name: 'Adobe InDesign', category: '排版', platform: 'Win/Mac', price: '订阅 ¥168/月', description: '专业排版软件，印刷行业标准', bestFor: ['专业排版', '多页书籍', '印刷品'], alternatives: ['Affinity Publisher', 'Scribus'] },
  { name: 'Affinity Publisher', category: '排版', platform: 'Win/Mac/iPad', price: '买断 ¥398', description: 'InDesign的强力替代品，一次性买断', bestFor: ['排版', '不想订阅', '预算有限'], alternatives: ['InDesign', 'Scribus'] },
  { name: 'Scribus', category: '排版', platform: 'Win/Mac/Linux', price: '免费开源', description: '免费开源排版软件，功能完善', bestFor: ['免费排版', '开源爱好者'], alternatives: ['InDesign', 'Affinity Publisher'] },
  { name: 'Adobe Photoshop', category: '图像处理', platform: 'Win/Mac', price: '订阅 ¥168/月', description: '图像处理行业标准，功能全面', bestFor: ['图像处理', '封面设计', '后期修图'], alternatives: ['Affinity Photo', 'GIMP', 'Photopea'] },
  { name: 'Affinity Photo', category: '图像处理', platform: 'Win/Mac/iPad', price: '买断 ¥398', description: 'Photoshop强力替代，一次性买断', bestFor: ['图像处理', '封面设计'], alternatives: ['Photoshop', 'GIMP'] },
  { name: 'GIMP', category: '图像处理', platform: 'Win/Mac/Linux', price: '免费开源', description: '免费开源图像处理软件', bestFor: ['免费图像处理', '基础修图'], alternatives: ['Photoshop', 'Photopea'] },
  { name: 'Photopea', category: '图像处理', platform: '网页版', price: '免费（有广告）', description: '网页版Photoshop，无需安装', bestFor: ['临时使用', '轻量修图', 'Chromebook'], alternatives: ['Photoshop', 'GIMP'] },
  { name: 'Canva', category: '设计', platform: '网页/App', price: '免费 / Pro ¥100/年', description: '简易设计工具，模板丰富，适合非设计师', bestFor: ['简易封面', '社交媒体图', '海报'], alternatives: ['Figma'] },
  { name: 'Inkscape', category: '矢量', platform: 'Win/Mac/Linux', price: '免费开源', description: '免费矢量图形软件，适合logo/图标设计', bestFor: ['矢量图', 'Logo设计', '图标'], alternatives: ['Adobe Illustrator', 'Affinity Designer'] },
  { name: 'SAI', category: '绘画', platform: 'Win', price: '¥300 买断', description: '轻量级绘画软件，线条流畅，日系画师最爱', bestFor: ['日系插画', '线条绘画', '轻量需求'], alternatives: ['Clip Studio Paint', 'Krita'] },
]

const categoryLabels: Record<string, string> = { '绘画': '绘画', '排版': '排版', '图像处理': '图像处理', '设计': '设计', '矢量': '矢量' }

export default function ToolsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/resources" label="返回资源中心" />
      <Section title="创作工具链" icon="🛠️" description="绘画/排版/设计软件对比，含免费替代方案" />

      {Object.entries(categoryLabels).map(([cat, label]) => {
        const catTools = tools.filter((t) => t.category === cat)
        return (
          <div key={cat} className="mb-6">
            <h3 className="font-semibold text-sm mb-3">{label}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {catTools.map((tool) => (
                <Card key={tool.name}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{tool.name}</h4>
                    <Tag variant={tool.price.includes('免费') ? 'success' : 'default'} size="sm">{tool.price}</Tag>
                  </div>
                  <p className="text-xs text-text-muted mb-2">{tool.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="text-xs text-text-muted">平台：</span>
                    <Tag variant="info" size="sm">{tool.platform}</Tag>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    <span className="text-xs text-text-muted">适合：</span>
                    {tool.bestFor.map((b) => <Tag key={b} variant="default" size="sm">{b}</Tag>)}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs text-text-muted">替代：</span>
                    {tool.alternatives.map((a) => <Tag key={a} variant="default" size="sm">{a}</Tag>)}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}