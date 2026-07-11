import { useState } from 'react'
import { Section, Card } from '@/components/ui'

const inquiryTemplates = [
  {
    id: 'book',
    title: '同人本印刷询价',
    form: [
      { label: '本子标题', placeholder: '请输入本子名称' },
      { label: '判型', placeholder: '如 A5 / B5' },
      { label: '页数', placeholder: '如 32P / 64P' },
      { label: '印量', placeholder: '如 100本' },
      { label: '封面纸张', placeholder: '如 250g铜版纸' },
      { label: '内页纸张', placeholder: '如 100g道林纸米白' },
      { label: '封面工艺', placeholder: '如 覆哑膜+烫金' },
      { label: '装订方式', placeholder: '如 无线胶装' },
      { label: '内页色彩', placeholder: '封面四色 / 内页黑白' },
      { label: '是否有特殊要求', placeholder: '如 书签丝带、硫酸纸扉页等' },
      { label: '期望交期', placeholder: '如 7月25日前' },
      { label: '收货地址', placeholder: '省份+城市' },
    ],
    tips: '建议同时发给3-5家厂家，对比报价后再做决定',
  },
  {
    id: 'goods',
    title: '周边定制询价',
    form: [
      { label: '周边类型', placeholder: '如 吧唧/亚克力立牌/贴纸' },
      { label: '尺寸', placeholder: '如 58mm圆形 / 8cm高' },
      { label: '数量', placeholder: '如 100个' },
      { label: '工艺/材质', placeholder: '如 磨砂膜/透明亚克力/异形切割' },
      { label: '是否需要背卡/包装', placeholder: '如 需要背卡+OPP袋' },
      { label: '期望交期', placeholder: '如 7月20日前' },
      { label: '收货地址', placeholder: '省份+城市' },
      { label: '是否有设计稿', placeholder: '如 已有设计稿，可发文件' },
    ],
    tips: '最好附上参考图或设计稿，方便厂家准确报价',
  },
  {
    id: 'both',
    title: '一站式询价（本子+周边）',
    form: [
      { label: '项目名称', placeholder: '请输入项目名称' },
      { label: '本子规格', placeholder: '如 A5/32P/100本/无线胶装' },
      { label: '封面工艺', placeholder: '如 覆哑膜' },
      { label: '周边类型及数量', placeholder: '如 吧唧58mm×50个 + 亚克力立牌×30个' },
      { label: '周边工艺', placeholder: '如 磨砂膜 + 透明异形' },
      { label: '期望交期', placeholder: '如 7月25日前' },
      { label: '收货地址', placeholder: '省份+城市' },
      { label: '预算范围', placeholder: '如 总预算2000元以内' },
    ],
    tips: '一站式厂家通常有打包优惠，建议同时询价对比',
  },
]

export default function InquiryHelper() {
  const [selectedTemplate, setSelectedTemplate] = useState('book')
  const [formValues, setFormValues] = useState<Record<string, string>>({})

  const template = inquiryTemplates.find((t) => t.id === selectedTemplate)!

  const generateMessage = () => {
    let msg = `【${template.title}询价】\n\n`
    template.form.forEach((f) => {
      if (formValues[f.label]) {
        msg += `${f.label}：${formValues[f.label]}\n`
      }
    })
    msg += `\n麻烦报个价，谢谢！`
    return msg
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMessage())
  }

  const handleClear = () => {
    setFormValues({})
  }

  const filledCount = template.form.filter((f) => formValues[f.label]).length
  const totalCount = template.form.length

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section title="询价助手" icon="📋" description="一键生成标准化询价消息，复制发送给厂家" />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-72 space-y-4 shrink-0">
          <Card>
            <h3 className="text-sm font-semibold mb-3">选择模板</h3>
            <div className="flex flex-col gap-2">
              {inquiryTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setSelectedTemplate(t.id); setFormValues({}) }}
                  className={`text-left px-3 py-2 rounded-lg text-xs transition-colors ${selectedTemplate === t.id ? 'bg-primary text-white' : 'bg-bg-card border border-border hover:border-primary'}`}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold mb-3">填写信息</h3>
            <p className="text-xs text-text-muted mb-2">进度：{filledCount}/{totalCount}</p>
            <div className="space-y-2">
              {template.form.map((f) => (
                <div key={f.label}>
                  <label className="text-xs text-text-muted">{f.label}</label>
                  <input
                    type="text"
                    value={formValues[f.label] || ''}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, [f.label]: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded border border-border bg-bg text-xs mt-0.5"
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleClear} className="px-3 py-1.5 bg-bg-card border border-border rounded-lg text-xs">清空</button>
            </div>
          </Card>
        </div>

        <div className="flex-1">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">{template.title} — 预览</h3>
              <button onClick={handleCopy} className="px-4 py-2 bg-primary text-white rounded-lg text-xs hover:opacity-90 transition-opacity">复制消息</button>
            </div>
            <div className="bg-bg-card rounded-lg p-4 whitespace-pre-wrap text-sm font-mono leading-relaxed">
              {generateMessage()}
            </div>
          </Card>

          <div className="mt-4 bg-bg-card rounded-xl p-4 text-xs text-text-muted">
            <p className="font-semibold text-sm mb-2">询价技巧</p>
            <ul className="list-disc list-inside space-y-1">
              <li>同时发给3-5家厂家，留出对比时间</li>
              <li>信息越详细，报价越准确</li>
              <li>附上设计稿/参考图，厂家能更快理解需求</li>
              <li>不同厂家价格差异可能很大（同规格可达2-3倍差异）</li>
              <li>注意问清楚：是否含运费、是否含税、打样费用、加急费用</li>
              <li>确认交期是否包含物流时间</li>
              <li>{template.tips}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}