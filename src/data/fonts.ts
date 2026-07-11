// 共享字体数据 — 与 Google Fonts 加载的字体对应
export interface FontData {
  id: string; name: string; nameJa?: string
  category: 'serif' | 'sans' | 'display' | 'handwrite' | 'jp' | 'jp-serif' | 'jp-maru' | 'jp-handwrite' | 'en-sans' | 'en-serif' | 'en-display'
  license: 'open'; description: string; bestFor: string[]; source: string
  cssFamily: string; cssFallback: string
}

export const allFonts: FontData[] = [
  // ====== 中文核心 ======
  { id: 'siyuan-sans', name: '思源黑体', category: 'sans', license: 'open', description: 'Google/Adobe联合开发，7种字重，中日韩全覆盖', bestFor: ['标题', '封面设计', '现代风格', '正文'], source: 'Google Fonts', cssFamily: "'Noto Sans SC'", cssFallback: 'sans-serif' },
  { id: 'siyuan-serif', name: '思源宋体', category: 'serif', license: 'open', description: 'Google/Adobe联合开发，7种字重，优雅衬线', bestFor: ['正文排版', '小说本', '传统风格', '书籍内页'], source: 'Google Fonts', cssFamily: "'Noto Serif SC'", cssFallback: 'serif' },

  // ====== 日文黑体 ======
  { id: 'noto-sans-jp', name: 'Noto Sans JP', category: 'jp', license: 'open', description: 'Google开源日文黑体，万能通用', bestFor: ['日文正文', '日系风格', 'UI'], source: 'Google Fonts', cssFamily: "'Noto Sans JP'", cssFallback: 'sans-serif' },
  { id: 'zen-kaku', name: 'Zen Kaku Gothic', nameJa: 'Zen角ゴシック', category: 'jp', license: 'open', description: '直线基調，見出しがシャープ', bestFor: ['日文标题', '信息密集型', '表组'], source: 'Google Fonts', cssFamily: "'Zen Kaku Gothic New'", cssFallback: 'sans-serif' },
  { id: 'biz-udgothic', name: 'BIZ UDGothic', category: 'jp', license: 'open', description: 'Windows UD字体，通用设计，高可读性', bestFor: ['日文正文', '无障碍设计', 'UI'], source: 'Google Fonts', cssFamily: "'BIZ UDGothic'", cssFallback: 'sans-serif' },
  { id: 'm-plus-1', name: 'M PLUS 1', category: 'jp', license: 'open', description: '现代日文黑体，简约利落', bestFor: ['日文标题', '现代风格', '数字'], source: 'Google Fonts', cssFamily: "'M PLUS 1'", cssFallback: 'sans-serif' },

  // ====== 日文宋体/明朝 ======
  { id: 'noto-serif-jp', name: 'Noto Serif JP', category: 'jp-serif', license: 'open', description: 'Google开源日文宋体', bestFor: ['日文正文', '传统日系', '小说'], source: 'Google Fonts', cssFamily: "'Noto Serif JP'", cssFallback: 'serif' },
  { id: 'zen-old-mincho', name: 'Zen Old Mincho', nameJa: 'Zenオールド明朝', category: 'jp-serif', license: 'open', description: '旧体明朝，复古风格', bestFor: ['和风标题', '复古设计', '历史感'], source: 'Google Fonts', cssFamily: "'Zen Old Mincho'", cssFallback: 'serif' },
  { id: 'shippori-mincho', name: 'Shippori Mincho', nameJa: 'しっぽり明朝', category: 'jp-serif', license: 'open', description: '温柔的明朝体，传统美感', bestFor: ['和风正文', '温柔氛围', '文艺'], source: 'Google Fonts', cssFamily: "'Shippori Mincho'", cssFallback: 'serif' },
  { id: 'sawarabi-mincho', name: 'Sawarabi Mincho', nameJa: 'さわらび明朝', category: 'jp-serif', license: 'open', description: '纤细优雅的明朝体', bestFor: ['和风标题', '优雅设计', '诗歌'], source: 'Google Fonts', cssFamily: "'Sawarabi Mincho'", cssFallback: 'serif' },
  { id: 'biz-udpmincho', name: 'BIZ UDPMincho', category: 'jp-serif', license: 'open', description: 'UD明朝体，高可读性', bestFor: ['日文正文', '印刷', '学术'], source: 'Google Fonts', cssFamily: "'BIZ UDPMincho'", cssFallback: 'serif' },

  // ====== 日文圆体 ======
  { id: 'm-plus-rounded', name: 'M PLUS Rounded 1c', nameJa: 'M+ Rounded', category: 'jp-maru', license: 'open', description: '开源日文圆体，可爱圆润', bestFor: ['日系可爱风', 'Q版', '少女向'], source: 'Google Fonts', cssFamily: "'M PLUS Rounded 1c'", cssFallback: 'sans-serif' },
  { id: 'zen-maru', name: 'Zen Maru Gothic', nameJa: 'Zen丸ゴシック', category: 'jp-maru', license: 'open', description: '圆体黑体，柔和亲切', bestFor: ['可爱风', '温馨设计', '儿童向'], source: 'Google Fonts', cssFamily: "'Zen Maru Gothic'", cssFallback: 'sans-serif' },
  { id: 'kiwi-maru', name: 'Kiwi Maru', nameJa: 'キウイ丸', category: 'jp-maru', license: 'open', description: '圆润可爱的丸ゴシック', bestFor: ['可爱风', '轻松氛围', '社交'], source: 'Google Fonts', cssFamily: "'Kiwi Maru'", cssFallback: 'sans-serif' },

  // ====== 日文手写/装饰 ======
  { id: 'klee-one', name: 'Klee One', nameJa: 'クレー One', category: 'jp-handwrite', license: 'open', description: '手写风格日文字体，温暖可爱', bestFor: ['日系手写风', '温暖系', '绘本'], source: 'Google Fonts', cssFamily: "'Klee One'", cssFallback: 'cursive' },
  { id: 'zen-kurenaido', name: 'Zen Kurenaido', nameJa: 'Zen紅道', category: 'jp-handwrite', license: 'open', description: '手写毛笔风格', bestFor: ['和风标题', '毛笔字', '力強い'], source: 'Google Fonts', cssFamily: "'Zen Kurenaido'", cssFallback: 'sans-serif' },
  { id: 'yuji-syuku', name: 'Yuji Syuku', nameJa: '幽州', category: 'jp-handwrite', license: 'open', description: '粗犷毛笔风格', bestFor: ['和风标题', '海报', '力強い'], source: 'Google Fonts', cssFamily: "'Yuji Syuku'", cssFallback: 'serif' },
  { id: 'yuji-mai', name: 'Yuji Mai', nameJa: '痩金体', category: 'jp-handwrite', license: 'open', description: '纤细毛笔风格', bestFor: ['和风标题', '优雅', '书法'], source: 'Google Fonts', cssFamily: "'Yuji Mai'", cssFallback: 'serif' },
  { id: 'reggae-one', name: 'Reggae One', nameJa: 'レゲエ One', category: 'jp-handwrite', license: 'open', description: '粗体活泼风格', bestFor: ['标题', '活泼', 'POP'], source: 'Google Fonts', cssFamily: "'Reggae One'", cssFallback: 'sans-serif' },

  // ====== 英文衬线 ======
  { id: 'playfair', name: 'Playfair Display', category: 'en-serif', license: 'open', description: '优雅英文衬线体，适合标题', bestFor: ['英文标题', '古典风格', '时尚'], source: 'Google Fonts', cssFamily: "'Playfair Display'", cssFallback: 'serif' },
  { id: 'lora', name: 'Lora', category: 'en-serif', license: 'open', description: '书法韵味衬线体，阅读温润', bestFor: ['英文正文', '博客', '编辑排版'], source: 'Google Fonts', cssFamily: 'Lora', cssFallback: 'serif' },

  // ====== 英文无衬线 ======
  { id: 'montserrat', name: 'Montserrat', category: 'en-sans', license: 'open', description: '几何风格，圆润现代', bestFor: ['英文标题', 'Logo', '社交媒体'], source: 'Google Fonts', cssFamily: 'Montserrat', cssFallback: 'sans-serif' },
  { id: 'poppins', name: 'Poppins', category: 'en-sans', license: 'open', description: '几何无衬线，字母"o"接近正圆', bestFor: ['英文标题', '科技产品', '简约风'], source: 'Google Fonts', cssFamily: 'Poppins', cssFallback: 'sans-serif' },
  { id: 'raleway', name: 'Raleway', category: 'en-sans', license: 'open', description: '优雅细体无衬线', bestFor: ['英文标题', '优雅设计', '品牌'], source: 'Google Fonts', cssFamily: 'Raleway', cssFallback: 'sans-serif' },
  { id: 'open-sans', name: 'Open Sans', category: 'en-sans', license: 'open', description: '网页首选字体，通用性强', bestFor: ['英文正文', 'UI', '网页'], source: 'Google Fonts', cssFamily: "'Open Sans'", cssFallback: 'sans-serif' },
  { id: 'roboto', name: 'Roboto', category: 'en-sans', license: 'open', description: 'Android系统字体，中性百搭', bestFor: ['英文正文', '移动端', '多语言'], source: 'Google Fonts', cssFamily: 'Roboto', cssFallback: 'sans-serif' },

  // ====== 英文展示/装饰 ======
  { id: 'caveat', name: 'Caveat', category: 'handwrite', license: 'open', description: '手写风格英文字体', bestFor: ['手写风格', '轻松氛围', '旁白'], source: 'Google Fonts', cssFamily: 'Caveat', cssFallback: 'cursive' },
  { id: 'oswald', name: 'Oswald', category: 'en-display', license: 'open', description: '压缩无衬线体，标题冲击力强', bestFor: ['英文标题', '海报', 'Banner'], source: 'Google Fonts', cssFamily: 'Oswald', cssFallback: 'sans-serif' },
  { id: 'bebas-neue', name: 'Bebas Neue', category: 'en-display', license: 'open', description: '全大写压缩字体，标题专用', bestFor: ['英文标题', '海报', '品牌'], source: 'Google Fonts', cssFamily: "'Bebas Neue'", cssFallback: 'sans-serif' },
]

// 字素（装饰性文字/图案素材）
export interface ZisuItem {
  id: string; name: string; type: 'ornament' | 'line' | 'bracket' | 'corner' | 'symbol'
  chars: string; usage: string
}

export const zisuLibrary: ZisuItem[] = [
  { id: 'fleurons', name: '花饰', type: 'ornament', chars: '❦ ❧ ☙ ✿ ❀ ✾ 🌸', usage: '章节标题装饰、封面点缀' },
  { id: 'lines', name: '装饰线', type: 'line', chars: '━ ┅ ═ ╌ ╍ ═══', usage: '标题上下装饰线、分隔线' },
  { id: 'brackets', name: '括号', type: 'bracket', chars: '【 】 「 」 『 』 〖 〗', usage: '书名号、标题框、强调' },
  { id: 'corners', name: '角饰', type: 'corner', chars: '┌ ┐ └ ┘ ╭ ╮ ╰ ╯', usage: '框线角装饰、复古边框' },
  { id: 'japanese', name: '和风', type: 'symbol', chars: '〽 〆 々 〓 ㊙ ㊗', usage: '日式氛围、和风装饰' },
  { id: 'arrows', name: '箭头', type: 'symbol', chars: '➤ ➜ ➝ ➞ ➠ ➢ ➣ ➤', usage: '引导视线、排版指向' },
  { id: 'shapes', name: '几何', type: 'symbol', chars: '◆ ◇ ◈ ◉ ◊ ○ ● ◎ ◐ ◑', usage: '列表标记、装饰点' },
  { id: 'stars', name: '星星', type: 'symbol', chars: '★ ☆ ✦ ✧ ✩ ✪ ✫ ✬ ✭ ✮ ✯ ✰', usage: '评分、重点标记、装饰' },
  { id: 'hearts', name: '爱心', type: 'symbol', chars: '♥ ♡ ❤ ❥ ❣ ❦', usage: '少女向、可爱风装饰' },
  { id: 'numbers', name: '圈号', type: 'symbol', chars: '① ② ③ ④ ⑤ ❶ ❷ ❸ ❹ ❺', usage: '章节编号、步骤标记' },
  { id: 'music', name: '音符', type: 'symbol', chars: '♪ ♫ ♬ ♩ ♭ ♮ ♯', usage: '音乐主题、氛围装饰' },
  { id: 'checkmarks', name: '勾叉', type: 'symbol', chars: '✓ ✔ ✗ ✘ ☐ ☑ ☒', usage: '清单、对比、标记' },
]

export function getFontStyle(fontId: string): { fontFamily: string; fontWeight: string } {
  const font = allFonts.find((f) => f.id === fontId)
  if (!font) return { fontFamily: 'sans-serif', fontWeight: '400' }
  return { fontFamily: `${font.cssFamily}, ${font.cssFallback}`, fontWeight: '400' }
}