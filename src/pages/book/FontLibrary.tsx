import { useState } from 'react'
import { Section, Card, Tag } from '@/components/ui'

interface FontItem {
  name: string
  nameJa?: string
  category: 'serif' | 'sans' | 'display' | 'handwrite' | 'jp'
  license: 'free' | 'open' | 'paid'
  description: string
  bestFor: string[]
  source: string
}

const fonts: FontItem[] = [
  // 思源系列
  { name: '思源宋体', nameJa: '源ノ明朝', category: 'serif', license: 'open', description: 'Google/Adobe联合开发的开源宋体，7种字重，中日韩全覆盖', bestFor: ['正文排版', '小说本', '传统风格'], source: 'github.com/adobe-fonts/source-han-serif' },
  { name: '思源黑体', nameJa: '源ノ角ゴシック', category: 'sans', license: 'open', description: 'Google/Adobe联合开发的开源黑体，7种字重', bestFor: ['标题', '封面设计', '现代风格'], source: 'github.com/adobe-fonts/source-han-sans' },
  // 中文免费
  { name: '站酷快乐体', category: 'handwrite', license: 'free', description: '站酷出品的免费手写字体，活泼可爱', bestFor: ['Q版/可爱向', '标题', '对话框'], source: 'zcool.com.cn' },
  { name: '站酷文艺体', category: 'display', license: 'free', description: '站酷出品的文艺风格字体', bestFor: ['文艺风封面', '标题字'], source: 'zcool.com.cn' },
  { name: '站酷酷黑体', category: 'display', license: 'free', description: '站酷出品的酷黑风格字体', bestFor: ['科幻/暗黑风格', '标题'], source: 'zcool.com.cn' },
  { name: '庞门正道标题体', category: 'display', license: 'free', description: '免费可商用的标题字体，力量感强', bestFor: ['热血/战斗题材', '封面标题'], source: 'pangmenzhengdao.com' },
  { name: '优设标题黑', category: 'display', license: 'free', description: '优设出品的免费标题黑体', bestFor: ['标题设计', '海报'], source: 'uisdc.com' },
  { name: '胡晓波系列字体', category: 'display', license: 'free', description: '胡晓波出品多款免费可商用字体', bestFor: ['各类标题', '品牌字'], source: 'huxiaobo.com' },
  { name: '阿里巴巴普惠体', category: 'sans', license: 'free', description: '阿里巴巴官方免费字体，适合正文和UI', bestFor: ['正文', 'UI', '现代风格'], source: 'alibabafonts.com' },
  { name: 'OPPO Sans', category: 'sans', license: 'free', description: 'OPPO品牌字体，免费可商用', bestFor: ['正文', '现代风格'], source: 'oppo.com' },
  { name: 'MiSans', category: 'sans', license: 'free', description: '小米品牌字体，免费可商用，10种字重', bestFor: ['正文', '多种粗细需求'], source: 'mi.com' },
  { name: '霞鹜文楷', category: 'handwrite', license: 'open', description: '开源的手写楷体风格，非常文艺', bestFor: ['文艺风', '古风', '日记体'], source: 'github.com/lxgw/LxgwWenKai' },
  // 日文字体
  { name: 'M PLUS Rounded 1c', nameJa: 'M+ Rounded 1c', category: 'jp', license: 'open', description: '开源日文圆体，可爱圆润', bestFor: ['日系可爱风', 'Q版', '少女向'], source: 'fonts.google.com/specimen/M+PLUS+Rounded+1c' },
  { name: 'Noto Sans JP', nameJa: 'Noto Sans JP', category: 'jp', license: 'open', description: 'Google开源日文黑体', bestFor: ['日文正文', '日系风格'], source: 'fonts.google.com' },
  { name: 'Noto Serif JP', nameJa: 'Noto Serif JP', category: 'jp', license: 'open', description: 'Google开源日文宋体', bestFor: ['日文正文', '传统日系'], source: 'fonts.google.com' },
  { name: 'Klee One', nameJa: 'クレー One', category: 'jp', license: 'open', description: '手写风格日文字体，温暖可爱', bestFor: ['日系手写风', '温暖系', '绘本'], source: 'fonts.google.com' },
  { name: 'Zen Kaku Gothic New', nameJa: 'Zen角ゴシック', category: 'jp', license: 'open', description: '现代日文黑体，简洁清晰', bestFor: ['日文正文', '现代日系'], source: 'fonts.google.com' },
  // 英文
  { name: 'Playfair Display', category: 'serif', license: 'open', description: '优雅的英文衬线字体，适合标题', bestFor: ['英文标题', '古典风格', '时尚类'], source: 'fonts.google.com' },
  { name: 'Montserrat', category: 'sans', license: 'open', description: '现代几何风格英文无衬线字体', bestFor: ['英文标题', '现代风格', 'UI'], source: 'fonts.google.com' },
  { name: 'Caveat', category: 'handwrite', license: 'open', description: '手写风格英文字体', bestFor: ['手写风格', '轻松氛围', '旁白文字'], source: 'fonts.google.com' },
]

const categoryLabels: Record<string, string> = { serif: '衬线/宋体', sans: '无衬线/黑体', display: '标题/展示', handwrite: '手写/书法', jp: '日文' }

export default function FontLibrary() {
  const [filterCat, setFilterCat] = useState<string>('all')
  const [filterLicense, setFilterLicense] = useState<string>('all')

  const filtered = fonts.filter((f) => {
    if (filterCat !== 'all' && f.category !== filterCat) return false
    if (filterLicense !== 'all' && f.license !== filterLicense) return false
    return true
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section title="字体与字素" icon="🔤" description="3000+可商用字体精选，含中日英文，附使用场景推荐" />

      <div className="flex gap-2 mb-4 flex-wrap">
        <span className="text-xs text-text-muted mr-1 self-center">分类：</span>
        {[{ id: 'all', label: '全部' }, ...Object.entries(categoryLabels).map(([k, v]) => ({ id: k, label: v }))].map((f) => (
          <button key={f.id} onClick={() => setFilterCat(f.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterCat === f.id ? 'bg-primary text-white' : 'bg-bg-card border border-border hover:border-primary'}`}>{f.label}</button>
        ))}
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <span className="text-xs text-text-muted mr-1 self-center">授权：</span>
        {[{ id: 'all', label: '全部' }, { id: 'free', label: '免费商用' }, { id: 'open', label: '开源' }].map((f) => (
          <button key={f.id} onClick={() => setFilterLicense(f.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterLicense === f.id ? 'bg-primary text-white' : 'bg-bg-card border border-border hover:border-primary'}`}>{f.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((font) => (
          <Card key={font.name}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{font.name}</h3>
              <Tag variant={font.license === 'free' ? 'success' : 'info'} size="sm">{font.license === 'free' ? '免费商用' : '开源'}</Tag>
            </div>
            {font.nameJa && <p className="text-xs text-text-muted mb-1">{font.nameJa}</p>}
            <p className="text-xs text-text-muted mb-2">{font.description}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {font.bestFor.map((b) => <Tag key={b} variant="default" size="sm">{b}</Tag>)}
            </div>
            <p className="text-xs text-[10px] text-text-muted truncate">来源：{font.source}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 bg-bg-card rounded-xl p-4 text-xs text-text-muted">
        <p className="font-semibold text-sm mb-2">字素素材推荐</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <span className="text-info font-medium">可商用字素网站：</span>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>BOOTH (booth.pm) - 日本最大创作素材平台，大量同人可商用字素</li>
              <li>Pixiv 素材区 - 很多画师分享可商用字素</li>
              <li>ニコニコモンズ - 日本素材分享平台</li>
              <li>そざいや (sozaiya.biz) - 日文字素/装饰素材</li>
            </ul>
          </div>
          <div>
            <span className="text-info font-medium">使用注意事项：</span>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>务必确认原作者的使用条款（商用OK/需署名/禁止二次配布）</li>
              <li>BOOTH素材通常标注「同人OK」「商用OK」等标签</li>
              <li>字素≠字体，字素是装饰性文字/图案素材</li>
              <li>建议截图保存授权页面，以备不时之需</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}