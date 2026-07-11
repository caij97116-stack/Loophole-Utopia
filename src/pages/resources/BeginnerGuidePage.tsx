import { useState } from 'react'
import { BackButton, Section, Card, Tag } from '@/components/ui'

interface Step {
  id: string
  title: string
  icon: string
  description: string
  tips: string[]
  tools: string[]
  duration: string
}

const steps: Step[] = [
  {
    id: 's1',
    title: '企划：确定方向与规格',
    icon: '📝',
    description: '确定同人本的内容类型（小说/漫画/画集/混合）、判型（A5/B5/B6等）、大致页数、印量。这是所有后续步骤的基础。',
    tips: [
      '先想清楚这本子的定位：是自留纪念还是发售？面向什么人群？',
      '参考同类型已出版的同人本，了解市场定价和规格',
      '建议先做小批量（30-50本）试水，不要一上来就印200本',
      '判型选择：小说推荐A5/文庫；漫画推荐B5/A5；画集推荐A4/B5'
    ],
    tools: ['Google Docs/Notion（企划文档）', '同人本样本（参考书）'],
    duration: '1-3天',
  },
  {
    id: 's2',
    title: '写稿/作画：内容创作',
    icon: '✍️',
    description: '创作同人本的核心内容。文字本需要完稿+校对；漫画本需要完成分镜+线稿+上色；画集需要筛选和整理作品。',
    tips: [
      '文字本：建议提前完成全文再开始排版，排版后修改很麻烦',
      '漫画本：先画完所有页面再统一排版，保证风格一致',
      '画集：筛选作品时注意分辨率，所有图至少300DPI',
      '留出至少1-2个月的创作时间，不要赶deadline'
    ],
    tools: ['Word/Google Docs（文字）', 'Clip Studio Paint（漫画）', 'Photoshop/Procreate（绘画）'],
    duration: '1-3个月',
  },
  {
    id: 's3',
    title: '排版：内页设计与排版',
    icon: '📐',
    description: '将文字/图片按设计布局排列在页面上。设置页边距、行距、字体、页码。注意内页排版对内边距的要求。',
    tips: [
      '内边距（装订侧）要宽于外边距，因为装订会吃掉一部分空间',
      '中文推荐行距：字号的1.5-1.8倍',
      '页数必须是4的倍数',
      '横跨页大图中间留出至少5mm安全区',
      '使用我们网站的「内页排版助手」获取模板'
    ],
    tools: ['InDesign（专业排版）', 'Affinity Publisher（平价替代）', 'Word（简单排版）'],
    duration: '1-2周',
  },
  {
    id: 's4',
    title: '封设：封面设计与工艺选择',
    icon: '🎨',
    description: '设计封面，选择纸张、工艺、装订方式。封面是读者第一印象，也是最容易出彩的地方。',
    tips: [
      '封面设计要体现内容风格：小说用文艺风，画集用冲击力，漫画用角色感',
      '选择纸张和工艺时参考「纸张百科」和「工艺库」',
      '封面纸和工艺的搭配有兼容性要求，使用「冲突检测器」检查',
      '精装/锁线胶装需要设计书脊，骑马订不需要',
      '使用我们网站的「封面设计器」获取模板和灵感'
    ],
    tools: ['Photoshop（封设）', 'Illustrator（矢量设计）', '封面设计器（本网站）'],
    duration: '1-2周',
  },
  {
    id: 's5',
    title: '入稿：文件准备与检查',
    icon: '📤',
    description: '将设计文件按印刷厂要求整理好，发送给印刷厂。这是最容易翻车的环节，务必仔细检查。',
    tips: [
      '使用「入稿前文件检查清单」逐项确认',
      '分辨率300DPI / CMYK模式 / 3mm出血 / 文字转曲 / 页数4的倍数',
      '文件命名清晰：作品名_封面or内页_日期',
      '保留未转曲的源文件备份',
      '和印刷厂确认：用什么文件格式？是否需要色标？'
    ],
    tools: ['入稿前检查清单（本网站）', 'Adobe Acrobat（PDF检查）', 'Photoshop（文件检查）'],
    duration: '1-2天',
  },
  {
    id: 's6',
    title: '收货：验收与品控',
    icon: '📦',
    description: '收到印刷品后，逐本检查品质。发现问题及时和印刷厂沟通。',
    tips: [
      '检查清单：色差/裁切/装订/工艺/数量/损坏',
      '随机抽检至少10%的本子',
      '色差：和原稿/打样对比',
      '工艺：烫金是否完整、UV是否清晰',
      '发现问题拍照留证，及时联系印刷厂',
      '印刷厂通常有售后政策（免费重做/退款），了解清楚'
    ],
    tools: ['检查清单', '原稿/打样（对比用）', '手机拍照'],
    duration: '1-2天',
  },
  {
    id: 's7',
    title: '售卖：展会+通贩',
    icon: '🛒',
    description: '在展会上售卖，或通过通贩平台（BOOTH/淘宝/微店）销售。这是收获成果的环节。',
    tips: [
      '展会：提前准备零钱/收款码/包装袋/见本/价签/桌布',
      '通贩：BOOTH手续费约5.6%，淘宝/微店手续费较低',
      '定价：参考市场行情，展会价通常比通贩低10-20%',
      '发货：书本用自封袋+气泡袋+硬纸板三件套',
      '国际发送：需要填海关申报单，注意各国禁运物品'
    ],
    tools: ['BOOTH（日本通贩）', '淘宝/微店（国内通贩）', '展会清单（本网站）'],
    duration: '持续进行',
  },
]

export default function BeginnerGuidePage() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/resources" label="返回资源中心" />
      <Section title="新手入门全流程向导" icon="🚀" description="从企划到售卖，7步完成你的第一本同人志" />

      {/* 进度条 */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(i)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium shrink-0 transition-colors cursor-pointer ${
              i === activeStep ? 'bg-primary text-white' : i < activeStep ? 'bg-success/10 text-success' : 'bg-gray-100 text-text-muted'
            }`}
          >
            <span>{step.icon}</span>
            <span className="hidden sm:inline">{step.title.split('：')[0]}</span>
          </button>
        ))}
      </div>

      {/* 当前步骤详情 */}
      <Card>
        <div className="flex items-start gap-4 mb-4">
          <span className="text-4xl">{steps[activeStep].icon}</span>
          <div>
            <h2 className="text-xl font-bold">第{activeStep + 1}步：{steps[activeStep].title}</h2>
            <p className="text-sm text-text-muted mt-1">预计耗时：{steps[activeStep].duration}</p>
          </div>
        </div>

        <p className="text-sm mb-6">{steps[activeStep].description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold mb-3">关键提示</h3>
            <ul className="space-y-2">
              {steps[activeStep].tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">推荐工具</h3>
            <div className="flex flex-wrap gap-1">
              {steps[activeStep].tools.map((tool) => (
                <Tag key={tool} variant="primary">{tool}</Tag>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6 pt-4 border-t border-border">
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-text hover:bg-gray-200 disabled:opacity-30 cursor-pointer transition-colors"
          >
            ← 上一步
          </button>
          <span className="text-sm text-text-muted self-center">{activeStep + 1} / {steps.length}</span>
          <button
            onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
            disabled={activeStep === steps.length - 1}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark disabled:opacity-30 cursor-pointer transition-colors"
          >
            下一步 →
          </button>
        </div>
      </Card>
    </div>
  )
}