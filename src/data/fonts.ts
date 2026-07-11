// 共享字体数据 — 与 Google Fonts 加载的字体对应
export interface FontData {
  id: string
  name: string
  nameJa?: string
  category: 'serif' | 'sans' | 'display' | 'handwrite' | 'jp'
  license: 'free' | 'open' | 'paid'
  description: string
  bestFor: string[]
  source: string
  cssFamily: string
  cssFallback: string
}

export const allFonts: FontData[] = [
  {
    id: 'siyuan-serif', name: '思源宋体', nameJa: '源ノ明朝', category: 'serif', license: 'open',
    description: 'Google/Adobe联合开发的开源宋体，7种字重，中日韩全覆盖', bestFor: ['正文排版', '小说本', '传统风格'],
    source: 'github.com/adobe-fonts/source-han-serif', cssFamily: "'Noto Serif SC'", cssFallback: 'serif',
  },
  {
    id: 'siyuan-sans', name: '思源黑体', nameJa: '源ノ角ゴシック', category: 'sans', license: 'open',
    description: 'Google/Adobe联合开发的开源黑体，7种字重', bestFor: ['标题', '封面设计', '现代风格'],
    source: 'github.com/adobe-fonts/source-han-sans', cssFamily: "'Noto Sans SC'", cssFallback: 'sans-serif',
  },
  {
    id: 'noto-sans-jp', name: 'Noto Sans JP', category: 'jp', license: 'open',
    description: 'Google开源日文黑体', bestFor: ['日文正文', '日系风格'],
    source: 'fonts.google.com', cssFamily: "'Noto Sans JP'", cssFallback: 'sans-serif',
  },
  {
    id: 'noto-serif-jp', name: 'Noto Serif JP', category: 'jp', license: 'open',
    description: 'Google开源日文宋体', bestFor: ['日文正文', '传统日系'],
    source: 'fonts.google.com', cssFamily: "'Noto Serif JP'", cssFallback: 'serif',
  },
  {
    id: 'm-plus-rounded', name: 'M PLUS Rounded 1c', nameJa: 'M+ Rounded 1c', category: 'jp', license: 'open',
    description: '开源日文圆体，可爱圆润', bestFor: ['日系可爱风', 'Q版', '少女向'],
    source: 'fonts.google.com', cssFamily: "'M PLUS Rounded 1c'", cssFallback: 'sans-serif',
  },
  {
    id: 'zen-kaku', name: 'Zen Kaku Gothic New', nameJa: 'Zen角ゴシック', category: 'jp', license: 'open',
    description: '现代日文黑体，简洁清晰', bestFor: ['日文正文', '现代日系'],
    source: 'fonts.google.com', cssFamily: "'Zen Kaku Gothic New'", cssFallback: 'sans-serif',
  },
  {
    id: 'klee-one', name: 'Klee One', nameJa: 'クレー One', category: 'jp', license: 'open',
    description: '手写风格日文字体，温暖可爱', bestFor: ['日系手写风', '温暖系', '绘本'],
    source: 'fonts.google.com', cssFamily: "'Klee One'", cssFallback: 'cursive',
  },
  {
    id: 'playfair', name: 'Playfair Display', category: 'serif', license: 'open',
    description: '优雅的英文衬线字体，适合标题', bestFor: ['英文标题', '古典风格', '时尚类'],
    source: 'fonts.google.com', cssFamily: "'Playfair Display'", cssFallback: 'serif',
  },
  {
    id: 'montserrat', name: 'Montserrat', category: 'sans', license: 'open',
    description: '现代几何风格英文无衬线字体', bestFor: ['英文标题', '现代风格', 'UI'],
    source: 'fonts.google.com', cssFamily: 'Montserrat', cssFallback: 'sans-serif',
  },
  {
    id: 'caveat', name: 'Caveat', category: 'handwrite', license: 'open',
    description: '手写风格英文字体', bestFor: ['手写风格', '轻松氛围', '旁白文字'],
    source: 'fonts.google.com', cssFamily: 'Caveat', cssFallback: 'cursive',
  },
]

// 字素（装饰性文字/图案素材）
export interface ZisuItem {
  id: string
  name: string
  type: 'ornament' | 'line' | 'bracket' | 'corner' | 'symbol'
  chars: string
  usage: string
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

// Google Fonts CSS 加载状态
export function getFontStyle(fontId: string): { fontFamily: string; fontWeight: string } {
  const font = allFonts.find((f) => f.id === fontId)
  if (!font) return { fontFamily: 'sans-serif', fontWeight: '400' }
  return { fontFamily: `${font.cssFamily}, ${font.cssFallback}`, fontWeight: font.category === 'serif' ? '400' : '400' }
}