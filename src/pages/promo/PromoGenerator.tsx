import { useState } from 'react'
import { Section, Card } from '@/components/ui'

const templates = [
  { id: 'cover-reveal', name: '封面公开', platform: '微博/Lofter/Twitter' },
  { id: 'sample', name: '试阅发布', platform: '微博/Lofter' },
  { id: 'goods-preview', name: '周边预览', platform: '微博/小红书' },
  { id: 'event-map', name: '摊位导航', platform: '微博/Twitter' },
  { id: 'event-live', name: '展会实况', platform: '微博' },
  { id: 'post-event', name: '展后总结', platform: '微博/Lofter' },
  { id: 'mail-order', name: '通贩通知', platform: '全平台' },
]

const templateContents: Record<string, { title: string; content: string; variables: string[] }> = {
  'cover-reveal': {
    title: '封面公开模板',
    content: `【新刊封面公开】

《{本子标题}》

{判型} / {页数}P / {装订方式}

{封面描述，一两句话介绍封面设计}

📅 {展会名称} {摊位号}
📅 日期：{开展日期}
🏪 通贩：{通贩链接}

#同人志 #{展会tag} #社团名`,
    variables: ['本子标题', '判型', '页数', '装订方式', '封面描述', '展会名称', '摊位号', '开展日期', '通贩链接', '展会tag', '社团名'],
  },
  'sample': {
    title: '试阅发布模板',
    content: `【新刊试阅】

《{本子标题}》试阅公开！

{本子简介，一两句话}

全本共{页数}P，{装订方式}，{纸张类型}

📖 试阅请看下图（共{试阅页数}页）👇

📅 {展会名称} {摊位号} 首发
🏪 通贩：{通贩链接}

#同人志 #{展会tag} #{作品名} #试阅`,
    variables: ['本子标题', '本子简介', '页数', '装订方式', '纸张类型', '试阅页数', '展会名称', '摊位号', '通贩链接', '展会tag', '作品名'],
  },
  'goods-preview': {
    title: '周边预览模板',
    content: `【周边预览】

{社团名} {展会名称} 周边一览！

✨ {周边类型1}：{材质/工艺} / {尺寸} / ¥{价格}
✨ {周边类型2}：{材质/工艺} / {尺寸} / ¥{价格}
✨ {周边类型3}：{材质/工艺} / {尺寸} / ¥{价格}

（以上为实物拍摄/设计图展示👇）

📅 {展会名称} {摊位号}
📅 {开展日期}
🏪 通贩：{通贩链接}

#同人周边 #{展会tag} #社团名`,
    variables: ['社团名', '展会名称', '周边类型1', '周边类型2', '周边类型3', '材质/工艺', '尺寸', '价格', '摊位号', '开展日期', '通贩链接', '展会tag'],
  },
  'event-map': {
    title: '摊位导航模板',
    content: `【摊位导航】

{社团名} 在 {展会名称} 的摊位在这里！

📍 摊位号：{摊位号}
📍 区域：{区域名称}
📍 路线：{路线描述}

认准我们的 {社团标志物/颜色}，很好找！

✅ 新刊：{本子标题}（{页数}P / ¥{价格}）
✅ 周边：{周边列表}

期待见到大家！🙌

#展会导航 #{展会tag} #社团名`,
    variables: ['社团名', '展会名称', '摊位号', '区域名称', '路线描述', '社团标志物/颜色', '本子标题', '页数', '价格', '周边列表', '展会tag'],
  },
  'event-live': {
    title: '展会实况模板',
    content: `【展会实况】

{社团名} 在 {展会名称} 准备就绪！🎉

📍 {摊位号}，欢迎大家来玩！

📦 目前库存：
✅ 新刊：{本子标题} — 还剩{库存}本
✅ {周边1} — 还剩{库存}个
✅ {周边2} — 还剩{库存}个

（现场照片👇）

#展会实况 #{展会tag} #社团名`,
    variables: ['社团名', '展会名称', '摊位号', '本子标题', '库存', '周边1', '周边2', '展会tag'],
  },
  'post-event': {
    title: '展后总结模板',
    content: `【展后感谢】

{展会名称} 圆满结束！感谢每一位来摊位的小伙伴！🙏

📊 本次战绩：
✅ 新刊《{本子标题}》售出{销量}本
✅ {周边}售出{销量}个

🏪 通贩已开放：{通贩链接}
（没买到的小伙伴可以通贩！）

📅 下次参展：{下次展会}
（摊位号待定，确认后第一时间通知）

（摊位照片/战利品照片👇）

#展后感谢 #{展会tag} #社团名`,
    variables: ['展会名称', '本子标题', '销量', '周边', '通贩链接', '下次展会', '展会tag', '社团名'],
  },
  'mail-order': {
    title: '通贩通知模板',
    content: `【通贩通知】

{社团名} 通贩已上线！

📚 新刊：
《{本子标题}》— {判型}/{页数}P — ¥{价格}
（{剩余库存}本，售完即止）

🎁 周边：
✨ {周边1} — ¥{价格}（{库存}个）
✨ {周边2} — ¥{价格}（{库存}个）

🛒 购买链接：{通贩链接}

📦 发货时间：{发货时间}
📦 运费：{运费说明}

#通贩 #{作品tag} #社团名`,
    variables: ['社团名', '本子标题', '判型', '页数', '价格', '剩余库存', '周边1', '周边2', '库存', '通贩链接', '发货时间', '运费说明', '作品tag'],
  },
}

export default function PromoGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState('cover-reveal')
  const [variables, setVariables] = useState<Record<string, string>>({})

  const template = templateContents[selectedTemplate]

  const preview = template.content.replace(/\{(\w+)\}/g, (_, key) => {
    return variables[key] || `{${key}}`
  })

  const handleCopy = () => {
    navigator.clipboard.writeText(preview)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section title="宣发模板生成器" icon="✍️" description="选择场景，填写变量，一键生成宣发文案" />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-72 space-y-4 shrink-0">
          <Card>
            <h3 className="text-sm font-semibold mb-3">选择模板</h3>
            <div className="flex flex-col gap-2">
              {templates.map((t) => (
                <button key={t.id} onClick={() => { setSelectedTemplate(t.id); setVariables({}) }} className={`text-left px-3 py-2 rounded-lg text-xs transition-colors ${selectedTemplate === t.id ? 'bg-primary text-white' : 'bg-bg-card border border-border hover:border-primary'}`}>
                  <div className="font-medium">{t.name}</div>
                  <div className="opacity-70">{t.platform}</div>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold mb-3">填写变量</h3>
            <div className="space-y-2">
              {template.variables.map((v) => (
                <div key={v}>
                  <label className="text-xs text-text-muted">{v}</label>
                  <input
                    type="text"
                    value={variables[v] || ''}
                    onChange={(e) => setVariables((prev) => ({ ...prev, [v]: e.target.value }))}
                    className="w-full px-2 py-1.5 rounded border border-border bg-bg text-xs mt-0.5"
                    placeholder={`输入${v}`}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex-1">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">{template.title}</h3>
              <button onClick={handleCopy} className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs hover:opacity-90 transition-opacity">复制文案</button>
            </div>
            <div className="bg-bg-card rounded-lg p-4 whitespace-pre-wrap text-sm font-mono leading-relaxed">
              {preview}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}