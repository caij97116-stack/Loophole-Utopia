import { Section, Card, Tag } from '@/components/ui'

interface PlatformStrategy {
  platform: string
  icon: string
  audience: string
  bestContent: string[]
  bestTime: string
  tags: string[]
  tips: string[]
}

const strategies: PlatformStrategy[] = [
  {
    platform: '微博', icon: '🐦', audience: '核心粉丝、同人圈主力', bestContent: ['封面公开', '试阅', '周边预览', '展会实况', '展后总结'],
    bestTime: '工作日晚8-10点，周末下午2-5点',
    tags: ['#同人志#', '#CP#', '#社团名#', '#CPXX#', '#作品名ONLY#'],
    tips: [
      '带图微博互动率远高于纯文字',
      '善用微博投票功能，让粉丝选择封面/周边款式',
      '转发抽奖是快速涨粉的有效手段',
      '置顶微博放展会信息和通贩链接',
      '超话发帖可获得更多曝光',
    ],
  },
  {
    platform: 'Lofter', icon: '📝', audience: '二次创作作者、深度粉丝', bestContent: ['试阅/短篇', '插画', '创作过程分享'],
    bestTime: '周末和节假日',
    tags: ['#同人#', '#CP#', '#作品名#', '#每日一绘#'],
    tips: [
      'Lofter以图文内容为主，适合放试阅和插画',
      '标签选得好，自然流量大',
      '保持更新频率，让粉丝有期待感',
      '可在文章末尾附展会信息和通贩链接',
      '互动（点赞/评论/推荐）是关键指标',
    ],
  },
  {
    platform: '小红书', icon: '📕', audience: '女性用户、年轻群体、周边爱好者', bestContent: ['周边开箱/实物展示', '摊位布置', '吧唧墙展示', '手账/拼贴'],
    bestTime: '工作日午休12-2点，晚上8-10点',
    tags: ['#同人周边#', '#吧唧#', '#亚克力立牌#', '#展会#', '#社团#'],
    tips: [
      '小红书重图轻文，封面图决定点击率',
      '实物拍摄比设计图效果好得多',
      '多角度展示周边细节（正反面/质感/对比）',
      '可以发「吧唧墙」「周边收纳」等生活化内容',
      '善用「合集」「开箱」等视频形式',
    ],
  },
  {
    platform: 'Twitter/X', icon: '🐤', audience: '日本/海外粉丝', bestContent: ['封面公开（日英双语）', '插画', '展会信息'],
    bestTime: '日本时间晚上8-11点（北京时间7-10点）',
    tags: ['#同人誌', '#コミケ', '#CP', '#art', '#fanart'],
    tips: [
      '日英双语发帖覆盖面更广',
      '关注日本展会官方账号，及时获取信息',
      'Pixiv联动：在Pixiv放完整作品，Twitter放预览',
      '使用SNS卡片（Twitter Card）让图片更大',
      '日本粉丝习惯用「いいね」和「RT」互动',
    ],
  },
  {
    platform: 'Bilibili', icon: '📺', audience: '年轻用户、动漫爱好者', bestContent: ['绘画过程视频', '新刊翻书视频', '展会Vlog', '周边开箱'],
    bestTime: '周末和节假日',
    tags: ['#同人#', '#绘画#', '#CP#', '#展会#', '#社团#'],
    tips: [
      '视频内容更具传播力，但制作成本高',
      '翻书视频（Book Flip）简单易做，展示效果好',
      '展会Vlog可记录摊位布置和现场氛围',
      '动态（B站微博）是图文宣发的好渠道',
      '直播画稿/直播展会现场可增加互动',
    ],
  },
  {
    platform: 'Pixiv', icon: '🎨', audience: '画师、深度二次元用户', bestContent: ['完整插画', '漫画/漫画试阅', '封面大图'],
    bestTime: '周末日本时间',
    tags: ['#同人誌', '#オリジナル', '#CP', '#イラスト'],
    tips: [
      'Pixiv是展示作品的最佳平台，适合放高清完整图',
      '可以在作品描述中放展会信息和通贩链接',
      'Pixiv FANBOX可做付费内容（如设定集）',
      'BOOTH联动：Pixiv作品→BOOTH通贩',
      '关注数/收藏数/浏览数是重要参考指标',
    ],
  },
]

export default function SocialStrategy() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Section title="社交传播策略" icon="📱" description="各平台算法特点、最佳发布时间、话题标签、内容策略" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strategies.map((s) => (
          <Card key={s.platform}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <h3 className="font-semibold text-sm">{s.platform}</h3>
                <p className="text-xs text-text-muted">受众：{s.audience}</p>
              </div>
            </div>

            <div className="mb-3">
              <h4 className="text-xs font-semibold text-text-muted mb-1">最佳内容</h4>
              <div className="flex flex-wrap gap-1">
                {s.bestContent.map((c) => <Tag key={c} variant="info" size="sm">{c}</Tag>)}
              </div>
            </div>

            <div className="mb-3">
              <h4 className="text-xs font-semibold text-text-muted mb-1">发布时间</h4>
              <p className="text-xs">{s.bestTime}</p>
            </div>

            <div className="mb-3">
              <h4 className="text-xs font-semibold text-text-muted mb-1">推荐标签</h4>
              <div className="flex flex-wrap gap-1">
                {s.tags.map((t) => <Tag key={t} variant="default" size="sm">{t}</Tag>)}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-text-muted mb-1">运营技巧</h4>
              <ul className="space-y-1">
                {s.tips.map((t, i) => (
                  <li key={i} className="text-xs text-text-muted flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">{i + 1}.</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}