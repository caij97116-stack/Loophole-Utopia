import { Section, Card, Tag } from '@/components/ui'

interface PaperFeel {
  name: string
  category: string
  color: string
  feel: string
  analogy: string
  thickness: string
  opacity: string
  bestFor: string[]
  rating: number
}

const paperFeels: PaperFeel[] = [
  { name: '道林纸 米白 80g', category: '内页', color: '暖米白', feel: '微粗糙，有纸质感，不反光', analogy: '像是老书的纸张，温暖有质感', thickness: '适中偏薄', opacity: '一般（背面微透）', bestFor: ['小说本', '漫画本', '文字为主'], rating: 4 },
  { name: '道林纸 米白 100g', category: '内页', color: '暖米白', feel: '微微粗糙，手感扎实', analogy: '像精装书籍的内页纸', thickness: '适中', opacity: '较好（不透）', bestFor: ['漫画本', '插画本', '综合本'], rating: 5 },
  { name: '道林纸 白色 100g', category: '内页', color: '冷白', feel: '细腻光滑，纸面较白', analogy: '像日系漫画单行本的纸', thickness: '适中', opacity: '好', bestFor: ['日系漫画', '黑白对比强'], rating: 4 },
  { name: '哑粉纸 120g', category: '内页', color: '柔和白', feel: '非常细腻光滑，不反光', analogy: '像高端杂志的内页', thickness: '偏厚', opacity: '很好', bestFor: ['全彩插画本', '照片集'], rating: 4 },
  { name: '铜版纸 120g', category: '内页', color: '亮白', feel: '光滑有光泽，反光明显', analogy: '像时尚杂志的纸张', thickness: '偏厚', opacity: '很好', bestFor: ['全彩设定集', '照片集'], rating: 3 },
  { name: '铜版纸 250g', category: '封面', color: '亮白', feel: '硬挺光滑，有分量感', analogy: '像精装书的外壳', thickness: '厚', opacity: '完全不透', bestFor: ['封面', '明信片'], rating: 4 },
  { name: '铜版纸 300g', category: '封面', color: '亮白', feel: '非常硬挺，手感扎实', analogy: '像高档包装盒的纸', thickness: '很厚', opacity: '完全不透', bestFor: ['封面', '高档明信片'], rating: 5 },
  { name: '牛皮纸 120g', category: '封面', color: '自然棕', feel: '粗糙有纤维感，自然质朴', analogy: '像复古信封/档案袋的纸', thickness: '适中', opacity: '好', bestFor: ['复古风封面', '文艺风'], rating: 3 },
  { name: '硫酸纸 73g', category: '扉页', color: '半透明白', feel: '光滑半透明，有朦胧感', analogy: '像描图纸/临摹纸', thickness: '薄', opacity: '半透明', bestFor: ['扉页', '隔页', '文艺设计'], rating: 4 },
  { name: '星幻纸 120g', category: '封面', color: '闪亮', feel: '光滑闪亮，有星星点点的闪光', analogy: '像星空下的光泽', thickness: '偏厚', opacity: '好', bestFor: ['少女向封面', '梦幻风格'], rating: 3 },
]

export default function PaperFeelPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section title="纸张手感百科" icon="✋" description="实物感描述、类比推荐、纸样索取指南" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paperFeels.map((paper) => (
          <Card key={paper.name}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{paper.name}</h3>
              <Tag variant="default" size="sm">{paper.category}</Tag>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < paper.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
              ))}
              <span className="text-xs text-text-muted ml-1">推荐度</span>
            </div>
            <div className="space-y-1.5 text-xs text-text-muted">
              <div><span className="font-medium text-text">颜色：</span>{paper.color}</div>
              <div><span className="font-medium text-text">手感：</span>{paper.feel}</div>
              <div><span className="font-medium text-text">类比：</span>{paper.analogy}</div>
              <div><span className="font-medium text-text">厚度：</span>{paper.thickness} | <span className="font-medium text-text">透度：</span>{paper.opacity}</div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {paper.bestFor.map((b) => <Tag key={b} variant="info" size="sm">{b}</Tag>)}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 bg-bg-card rounded-xl p-4 text-xs text-text-muted">
        <p className="font-semibold text-sm mb-2">纸样索取指南</p>
        <ul className="list-disc list-inside space-y-1">
          <li>大部分印刷厂免费提供纸样册，联系客服索取即可</li>
          <li>淘宝搜索"纸样册"可购买综合纸样本（约20-50元）</li>
          <li>日本印刷厂通常有纸样请求页面（紙見本請求）</li>
          <li>建议索取至少3-5家厂家的纸样，横向对比</li>
          <li>纸样到手后，用手摸、对光看、翻折测试，感受真实质感</li>
          <li>不同批次的纸张颜色可能有差异，印刷前确认</li>
        </ul>
      </div>
    </div>
  )
}