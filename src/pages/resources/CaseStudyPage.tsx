import { useState } from 'react'
import { BackButton, Section, Card, Tag } from '@/components/ui'

interface Case {
  title: string
  type: string
  format: string
  pages: number
  binding: string
  coverPaper: string
  innerPaper: string
  processes: string[]
  price: string
  notes: string
}

const cases: Case[] = [
  { title: '日系漫画本《星之记忆》', type: '漫画', format: 'A5', pages: 32, binding: '无线胶装', coverPaper: '250g铜版纸', innerPaper: '100g道林米白', processes: ['覆哑膜', 'UV局部（标题）'], price: '约40元', notes: '经典的日系漫画配置，米白道林+哑膜是漫画本黄金组合' },
  { title: '全彩插画本《花语集》', type: '插画', format: 'A5', pages: 24, binding: '锁线胶装', coverPaper: '300g铜版纸', innerPaper: '120g哑粉纸', processes: ['覆亮膜', '烫金（标题）'], price: '约80元', notes: '全彩插画选哑粉纸，色彩还原好不反光。锁线胶装可平摊展示跨页' },
  { title: '小说本《夜行列车》', type: '小说', format: 'A5', pages: 128, binding: '锁线胶装', coverPaper: '250g铜版纸', innerPaper: '80g道林米白', processes: ['覆哑膜'], price: '约50元', notes: '小说本页数多，选80g纸减轻重量。锁线胶装适合厚本翻阅' },
  { title: '设定集《机械纪元》', type: '设定集', format: 'B5', pages: 48, binding: '锁线胶装+硬壳', coverPaper: '硬壳+300g铜版纸', innerPaper: '120g铜版纸', processes: ['烫银', 'UV局部', '环衬'], price: '约120元', notes: '硬壳精装+烫银+UV，科幻题材的高级配置。硬壳精装需额外3-5天' },
  { title: '薄本试水《短篇集#1》', type: '短篇', format: 'A5', pages: 16, binding: '骑马订', coverPaper: '200g铜版纸', innerPaper: '100g道林', processes: [], price: '约20元', notes: '最低成本的试水配置，骑马订适合16P薄本，成本控制优秀' },
  { title: '古风画集《墨韵》', type: '插画', format: 'B5', pages: 32, binding: '裸背线装', coverPaper: '牛皮纸+烫金', innerPaper: '120g道林米白', processes: ['烫红金', '宣纸扉页', '丝带书签'], price: '约90元', notes: '古风配置：裸背线装可完全平摊，宣纸扉页+烫红金+丝带书签，古韵十足' },
  { title: '少女向漫画《甜点日记》', type: '漫画', format: 'A5', pages: 48, binding: '无线胶装', coverPaper: '250g星幻纸', innerPaper: '100g道林', processes: ['封面星幻纸', '心形书签'], price: '约55元', notes: '少女向配置：星幻纸封面闪闪发光，心形书签增加可爱度' },
  { title: '暗黑系《深渊》', type: '漫画', format: 'A5', pages: 64, binding: '锁线胶装', coverPaper: '300g铜版纸', innerPaper: '100g道林', processes: ['烫银', 'UV局部', '黑色环衬'], price: '约70元', notes: '暗黑系配置：烫银+UV在黑底上效果极佳，黑色环衬增加氛围' },
]

export default function CaseStudyPage() {
  const [selected, setSelected] = useState<Case | null>(null)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/resources" label="返回资源中心" />
      <Section title="真实案例展示" icon="📖" description="真实同人本拆解，含材质标注、工艺说明、价格参考" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cases.map((c) => (
          <Card key={c.title} hover onClick={() => setSelected(c)} className="cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{c.title}</h3>
              <Tag variant="default" size="sm">{c.type}</Tag>
            </div>
            <div className="text-xs text-text-muted space-y-0.5 mb-2">
              <p>{c.format} / {c.pages}P / {c.binding}</p>
              <p>封面：{c.coverPaper}</p>
              <p>内页：{c.innerPaper}</p>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {c.processes.map((p) => <Tag key={p} variant="info" size="sm">{p}</Tag>)}
            </div>
            <Tag variant="success" size="sm">{c.price}</Tag>
          </Card>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-bg rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{selected.title}</h2>
              <button onClick={() => setSelected(null)} className="text-text-muted hover:text-text text-xl leading-none">×</button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-bg-card rounded-lg p-3"><span className="text-xs text-text-muted">类型</span><p className="font-semibold text-sm">{selected.type}</p></div>
              <div className="bg-bg-card rounded-lg p-3"><span className="text-xs text-text-muted">判型/页数</span><p className="font-semibold text-sm">{selected.format} / {selected.pages}P</p></div>
              <div className="bg-bg-card rounded-lg p-3"><span className="text-xs text-text-muted">装订</span><p className="font-semibold text-sm">{selected.binding}</p></div>
              <div className="bg-bg-card rounded-lg p-3"><span className="text-xs text-text-muted">参考价格</span><p className="font-semibold text-sm">{selected.price}</p></div>
            </div>
            <div className="mb-3"><h4 className="text-xs font-semibold text-text-muted mb-1">封面</h4><p className="text-sm">{selected.coverPaper}</p></div>
            <div className="mb-3"><h4 className="text-xs font-semibold text-text-muted mb-1">内页</h4><p className="text-sm">{selected.innerPaper}</p></div>
            <div className="mb-3"><h4 className="text-xs font-semibold text-text-muted mb-1">工艺</h4><div className="flex flex-wrap gap-1">{selected.processes.map((p) => <Tag key={p} variant="info" size="sm">{p}</Tag>)}</div></div>
            <div className="bg-bg-card rounded-lg p-3 text-xs text-text-muted"><span className="font-semibold text-info">解析：</span>{selected.notes}</div>
          </div>
        </div>
      )}
    </div>
  )
}