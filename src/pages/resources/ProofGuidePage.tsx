import { Section, Card, Tag } from '@/components/ui'

const proofData = [
  { factory: 'CP官方合作印刷', proofType: '数码打样', cost: '50-100元', time: '2-3天', quality: '较高', notes: '仅限CP参展社团' },
  { factory: '快印店（如印萌）', proofType: '数码快印', cost: '20-50元', time: '当日/次日', quality: '一般', notes: '适合快速确认排版' },
  { factory: '淘宝印刷店', proofType: '正式打样', cost: '30-80元', time: '3-5天', quality: '较高', notes: '含正式纸张和工艺' },
  { factory: '日本印刷厂', proofType: '正式打样', cost: '¥1000-3000日元', time: '5-10天', quality: '最高', notes: '需有日本地址' },
]

const checkItems = [
  { phase: '收到打样后', items: ['检查封面和内页色彩是否准确', '检查图片/文字是否模糊', '检查出血线是否对齐', '检查装订是否牢固', '检查页码顺序是否正确', '检查裁切是否整齐', '检查覆膜是否有气泡/起皮', '检查烫金/UV位置是否准确'] },
  { phase: '与设计稿对比', items: ['色差是否在可接受范围', '字体是否缺失/乱码', '图片是否被裁切/变形', '跨页图是否对齐', '页边距是否一致', '书脊厚度是否匹配'] },
  { phase: '质量问题检查', items: ['纸张是否有污渍/折痕', '印刷是否有墨迹不均', '覆膜是否起泡/脱落', '装订是否歪斜', '胶装是否开裂', '骑马订是否订歪', '烫金是否脱落/模糊'] },
]

export default function ProofGuidePage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section title="试印/打样指南" icon="🔬" description="各厂家试印对比、打样检查清单、质量问题排查" />

      <Card className="mb-6">
        <h3 className="font-semibold text-sm mb-3">打样渠道对比</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2">厂家</th>
                <th className="text-left py-2">类型</th>
                <th className="text-left py-2">费用</th>
                <th className="text-left py-2">时间</th>
                <th className="text-left py-2">质量</th>
                <th className="text-left py-2">备注</th>
              </tr>
            </thead>
            <tbody>
              {proofData.map((p) => (
                <tr key={p.factory} className="border-b border-border">
                  <td className="py-2 font-medium">{p.factory}</td>
                  <td className="py-2">{p.proofType}</td>
                  <td className="py-2">{p.cost}</td>
                  <td className="py-2">{p.time}</td>
                  <td className="py-2"><Tag variant={p.quality === '最高' ? 'danger' : p.quality === '较高' ? 'warning' : 'default'} size="sm">{p.quality}</Tag></td>
                  <td className="py-2 text-text-muted">{p.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="space-y-4">
        {checkItems.map((phase) => (
          <Card key={phase.phase}>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              {phase.phase}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {phase.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-text-muted">
                  <input type="checkbox" className="rounded" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-4 bg-bg-card rounded-xl p-4 text-xs text-text-muted">
        <p className="font-semibold text-sm mb-2">打样建议</p>
        <ul className="list-disc list-inside space-y-1">
          <li>正式印刷前务必打样，不要省略这一步</li>
          <li>数码快印打样用于确认排版和内容，不用于确认色彩（色彩与正式印刷差异大）</li>
          <li>正式打样使用与批量相同的纸张和工艺，色彩最准确</li>
          <li>如果时间紧迫，至少做数码快印确认排版</li>
          <li>打样发现问题后及时与厂家沟通，要求重新打样或调整</li>
          <li>保留打样作为验收标准，收货时对比</li>
        </ul>
      </div>
    </div>
  )
}