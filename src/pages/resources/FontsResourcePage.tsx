import { BackButton, Section, Card } from '@/components/ui'

export default function FontsResourcePage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <BackButton to="/resources" label="返回资源中心" />
      <Section title="字体与字素资源" icon="🔤" description="3000+可商用字体精选 + 字素素材来源" />

      <Card className="mb-6">
        <h3 className="font-semibold text-sm mb-3">字体推荐</h3>
        <p className="text-xs text-text-muted mb-4">
          完整字体库已整合在「书本制作 → 字体与字素」模块中，包含20+款精选可商用字体（中文/日文/英文），
          按类别（衬线/无衬线/标题/手写/日文）和授权（免费商用/开源）分类筛选。
        </p>
        <button
          onClick={() => window.location.href = '/book/fonts'}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          前往字体与字素 →
        </button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-sm mb-3">字素素材来源</h3>
          <div className="space-y-3 text-xs text-text-muted">
            <div>
              <span className="font-medium text-text">BOOTH (booth.pm)</span>
              <p>日本最大创作素材平台，大量同人可商用字素/装饰素材，搜索「素材」「字素」等关键词</p>
            </div>
            <div>
              <span className="font-medium text-text">Pixiv 素材区</span>
              <p>搜索「素材」「フリー素材」标签，很多画师分享可商用字素</p>
            </div>
            <div>
              <span className="font-medium text-text">ニコニコモンズ (commons.nicovideo.jp)</span>
              <p>日本素材分享平台，含字体、图标、背景等</p>
            </div>
            <div>
              <span className="font-medium text-text">そざいや (sozaiya.biz)</span>
              <p>日文字素/装饰素材专门站，分类清晰</p>
            </div>
            <div>
              <span className="font-medium text-text">いらすとや (irasutoya.com)</span>
              <p>日本免费插图素材，可商用，风格统一可爱</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-sm mb-3">使用注意事项</h3>
          <div className="space-y-2 text-xs text-text-muted">
            <div className="flex items-start gap-2">
              <span className="text-danger font-bold">!</span>
              <span>务必确认原作者的使用条款（商用OK / 需署名 / 禁止二次配布）</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-danger font-bold">!</span>
              <span>BOOTH素材通常标注「同人OK」「商用OK」「加工OK」等标签</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-info font-bold">i</span>
              <span>字素 ≠ 字体，字素是装饰性文字/图案素材，字体是完整字库</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-info font-bold">i</span>
              <span>建议截图保存授权页面，以备不时之需</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-warning font-bold">!</span>
              <span>系统自带字体（如微软雅黑）不可商用！必须使用明确授权可商用的字体</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}