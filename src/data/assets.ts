// SVG 素材库 — 公开可商用装饰元素（透明底）
// 所有素材均为纯 SVG 代码，可自由使用

export interface SvgAsset {
  id: string; name: string; category: string
  tags: string[]; svg: string; viewBox: string
}

export const svgAssets: SvgAsset[] = [
  // ====== 和风框架 (Japanese Frames) ======
  {
    id: 'frame-circle-floral', name: '花饰圆框', category: '框架',
    tags: ['和风', '圆形', '花饰', '框架'],
    viewBox: '0 0 200 200',
    svg: `<circle cx="100" cy="100" r="90" fill="none" stroke="#333" stroke-width="2"/>
<circle cx="100" cy="100" r="85" fill="none" stroke="#c0a060" stroke-width="1" stroke-dasharray="6,3"/>
<circle cx="100" cy="100" r="78" fill="none" stroke="#333" stroke-width="1"/>
<path d="M100 15 L100 5 M100 195 L100 185 M15 100 L5 100 M195 100 L185 100" stroke="#c0a060" stroke-width="2"/>
<circle cx="100" cy="5" r="3" fill="#c0a060"/><circle cx="100" cy="195" r="3" fill="#c0a060"/>
<circle cx="5" cy="100" r="3" fill="#c0a060"/><circle cx="185" cy="100" r="3" fill="#c0a060"/>`,
  },
  {
    id: 'frame-rect-japanese', name: '和风矩形框', category: '框架',
    tags: ['和风', '矩形', '角饰', '框架'],
    viewBox: '0 0 200 280',
    svg: `<rect x="15" y="15" width="170" height="250" fill="none" stroke="#333" stroke-width="2"/>
<rect x="20" y="20" width="160" height="240" fill="none" stroke="#c0a060" stroke-width="1"/>
<path d="M15 15 L30 15 M15 15 L15 30 M185 15 L170 15 M185 15 L185 30" stroke="#c0a060" stroke-width="2"/>
<path d="M15 265 L30 265 M15 265 L15 250 M185 265 L170 265 M185 265 L185 250" stroke="#c0a060" stroke-width="2"/>
<circle cx="22" cy="22" r="2" fill="#c0a060"/><circle cx="178" cy="22" r="2" fill="#c0a060"/>
<circle cx="22" cy="258" r="2" fill="#c0a060"/><circle cx="178" cy="258" r="2" fill="#c0a060"/>`,
  },
  {
    id: 'frame-circle-simple', name: '简约圆框', category: '框架',
    tags: ['简约', '圆形', '框架'],
    viewBox: '0 0 200 200',
    svg: `<circle cx="100" cy="100" r="90" fill="none" stroke="#333" stroke-width="3"/>
<circle cx="100" cy="100" r="82" fill="none" stroke="#999" stroke-width="1"/>`,
  },
  {
    id: 'frame-rect-rounded', name: '圆角矩形框', category: '框架',
    tags: ['简约', '矩形', '圆角', '框架'],
    viewBox: '0 0 200 150',
    svg: `<rect x="10" y="10" width="180" height="130" rx="15" fill="none" stroke="#333" stroke-width="2"/>
<rect x="16" y="16" width="168" height="118" rx="10" fill="none" stroke="#c0a060" stroke-width="1"/>`,
  },

  // ====== 装饰角 (Decorative Corners) ======
  {
    id: 'corner-floral-tl', name: '花饰角·左上', category: '角饰',
    tags: ['和风', '角饰', '花饰'],
    viewBox: '0 0 80 80',
    svg: `<path d="M5 5 L5 40 Q5 10 40 5 L5 5" fill="#c0a060" opacity="0.3"/>
<path d="M5 5 L5 35 Q5 8 35 5" fill="none" stroke="#c0a060" stroke-width="2"/>
<circle cx="10" cy="10" r="3" fill="#c0a060"/>`,
  },
  {
    id: 'corner-floral-tr', name: '花饰角·右上', category: '角饰',
    tags: ['和风', '角饰', '花饰'],
    viewBox: '0 0 80 80',
    svg: `<path d="M75 5 L75 40 Q75 10 40 5 L75 5" fill="#c0a060" opacity="0.3"/>
<path d="M75 5 L75 35 Q75 8 45 5" fill="none" stroke="#c0a060" stroke-width="2"/>
<circle cx="70" cy="10" r="3" fill="#c0a060"/>`,
  },
  {
    id: 'corner-floral-bl', name: '花饰角·左下', category: '角饰',
    tags: ['和风', '角饰', '花饰'],
    viewBox: '0 0 80 80',
    svg: `<path d="M5 75 L5 40 Q5 70 40 75 L5 75" fill="#c0a060" opacity="0.3"/>
<path d="M5 75 L5 45 Q5 72 35 75" fill="none" stroke="#c0a060" stroke-width="2"/>
<circle cx="10" cy="70" r="3" fill="#c0a060"/>`,
  },
  {
    id: 'corner-floral-br', name: '花饰角·右下', category: '角饰',
    tags: ['和风', '角饰', '花饰'],
    viewBox: '0 0 80 80',
    svg: `<path d="M75 75 L75 40 Q75 70 40 75 L75 75" fill="#c0a060" opacity="0.3"/>
<path d="M75 75 L75 45 Q75 72 45 75" fill="none" stroke="#c0a060" stroke-width="2"/>
<circle cx="70" cy="70" r="3" fill="#c0a060"/>`,
  },

  // ====== 装饰线 (Decorative Lines) ======
  {
    id: 'line-wavy', name: '波浪线', category: '线条',
    tags: ['和风', '波浪', '线条'],
    viewBox: '0 0 200 30',
    svg: `<path d="M0 15 Q25 0 50 15 Q75 30 100 15 Q125 0 150 15 Q175 30 200 15" fill="none" stroke="#c0a060" stroke-width="2"/>`,
  },
  {
    id: 'line-twin', name: '双线', category: '线条',
    tags: ['简约', '双线', '线条'],
    viewBox: '0 0 200 20',
    svg: `<line x1="0" y1="5" x2="200" y2="5" stroke="#333" stroke-width="2"/>
<line x1="0" y1="15" x2="200" y2="15" stroke="#999" stroke-width="1"/>`,
  },
  {
    id: 'line-diamond', name: '菱形横线', category: '线条',
    tags: ['装饰', '菱形', '线条'],
    viewBox: '0 0 200 20',
    svg: `<line x1="0" y1="10" x2="200" y2="10" stroke="#333" stroke-width="1"/>
<polygon points="100,2 108,10 100,18 92,10" fill="#c0a060"/>`,
  },
  {
    id: 'line-ornament-center', name: '花饰中心线', category: '线条',
    tags: ['和风', '花饰', '线条'],
    viewBox: '0 0 200 30',
    svg: `<line x1="0" y1="15" x2="85" y2="15" stroke="#c0a060" stroke-width="1.5"/>
<line x1="115" y1="15" x2="200" y2="15" stroke="#c0a060" stroke-width="1.5"/>
<circle cx="100" cy="15" r="8" fill="none" stroke="#c0a060" stroke-width="1.5"/>
<circle cx="100" cy="15" r="3" fill="#c0a060"/>`,
  },

  // ====== 樱花 (Sakura) ======
  {
    id: 'sakura-single', name: '樱花·单瓣', category: '和风',
    tags: ['樱花', '和风', '花'],
    viewBox: '0 0 40 40',
    svg: `<circle cx="20" cy="15" r="3" fill="#e8a0b0"/><circle cx="20" cy="25" r="3" fill="#e8a0b0"/>
<circle cx="12" cy="18" r="3" fill="#e8a0b0"/><circle cx="28" cy="18" r="3" fill="#e8a0b0"/>
<circle cx="15" cy="24" r="3" fill="#e8a0b0"/><circle cx="25" cy="24" r="3" fill="#e8a0b0"/>
<circle cx="20" cy="20" r="2" fill="#d47888"/>`,
  },
  {
    id: 'sakura-petal', name: '樱花花瓣', category: '和风',
    tags: ['樱花', '花瓣', '和风'],
    viewBox: '0 0 20 20',
    svg: `<path d="M10 2 Q14 6 18 10 Q14 14 10 18 Q6 14 2 10 Q6 6 10 2" fill="#f0c8d0" stroke="#e8a0b0" stroke-width="0.5"/>
<path d="M10 6 L10 10" stroke="#d47888" stroke-width="0.5"/>`,
  },

  // ====== 星星/キラキラ (Sparkles) ======
  {
    id: 'sparkle-4pt', name: '四角星·闪', category: '装饰',
    tags: ['星星', '闪亮', '装饰'],
    viewBox: '0 0 30 30',
    svg: `<path d="M15 2 L17 13 L28 15 L17 17 L15 28 L13 17 L2 15 L13 13 Z" fill="#f0c860"/>`,
  },
  {
    id: 'sparkle-cross', name: '十字星', category: '装饰',
    tags: ['星星', '十字', '装饰'],
    viewBox: '0 0 20 20',
    svg: `<line x1="10" y1="2" x2="10" y2="18" stroke="#f0c860" stroke-width="2" stroke-linecap="round"/>
<line x1="2" y1="10" x2="18" y2="10" stroke="#f0c860" stroke-width="2" stroke-linecap="round"/>`,
  },
  {
    id: 'sparkle-tiny', name: '小星点', category: '装饰',
    tags: ['星星', '小点', '装饰'],
    viewBox: '0 0 10 10',
    svg: `<circle cx="5" cy="5" r="2" fill="#f0c860"/>`,
  },

  // ====== 标签/价签 (Labels) ======
  {
    id: 'label-price', name: '价格标签', category: '标签',
    tags: ['价格', '标签', '实用'],
    viewBox: '0 0 100 40',
    svg: `<rect x="5" y="2" width="90" height="36" rx="5" fill="none" stroke="#c0392b" stroke-width="2"/>
<rect x="5" y="2" width="18" height="36" rx="5" fill="#c0392b" opacity="0.1"/>`,
  },
  {
    id: 'label-new', name: '新刊标签', category: '标签',
    tags: ['新刊', '标签', '实用'],
    viewBox: '0 0 80 80',
    svg: `<polygon points="40,5 75,25 75,55 40,75 5,55 5,25" fill="none" stroke="#e74c3c" stroke-width="2"/>
<polygon points="40,5 75,25 75,55 40,75 5,55 5,25" fill="#e74c3c" opacity="0.1"/>`,
  },

  // ====== 吹き出し (Speech Bubbles) ======
  {
    id: 'bubble-circle', name: '圆形气泡', category: '吹き出し',
    tags: ['气泡', '对话', '漫画'],
    viewBox: '0 0 120 100',
    svg: `<ellipse cx="60" cy="45" rx="55" ry="35" fill="none" stroke="#333" stroke-width="2"/>
<polygon points="40,75 55,75 35,92" fill="none" stroke="#333" stroke-width="2"/>`,
  },
  {
    id: 'bubble-rect', name: '矩形气泡', category: '吹き出し',
    tags: ['气泡', '对话', '漫画'],
    viewBox: '0 0 120 100',
    svg: `<rect x="10" y="10" width="100" height="60" rx="8" fill="none" stroke="#333" stroke-width="2"/>
<polygon points="35,70 50,70 30,88" fill="none" stroke="#333" stroke-width="2"/>`,
  },

  // ====== 丸/圆 (Circles) ======
  {
    id: 'circle-double', name: '双圆', category: '几何',
    tags: ['圆形', '几何', '简约'],
    viewBox: '0 0 60 60',
    svg: `<circle cx="30" cy="30" r="25" fill="none" stroke="#333" stroke-width="2"/>
<circle cx="30" cy="30" r="18" fill="none" stroke="#c0a060" stroke-width="1"/>`,
  },
  {
    id: 'circle-dotted', name: '点线圆', category: '几何',
    tags: ['圆形', '几何', '点线'],
    viewBox: '0 0 60 60',
    svg: `<circle cx="30" cy="30" r="25" fill="none" stroke="#999" stroke-width="2" stroke-dasharray="4,4"/>`,
  },
  {
    id: 'circle-triple', name: '三重圆', category: '几何',
    tags: ['圆形', '几何', '和风'],
    viewBox: '0 0 80 80',
    svg: `<circle cx="40" cy="40" r="35" fill="none" stroke="#333" stroke-width="2"/>
<circle cx="40" cy="40" r="28" fill="none" stroke="#c0a060" stroke-width="1.5"/>
<circle cx="40" cy="40" r="20" fill="none" stroke="#333" stroke-width="1"/>`,
  },

  // ====== 实用装饰 (Practical) ======
  {
    id: 'arrow-down', name: '下箭头', category: '实用',
    tags: ['箭头', '实用', '导航'],
    viewBox: '0 0 24 24',
    svg: `<path d="M12 5 L12 19 M5 12 L12 19 L19 12" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  },
  {
    id: 'crown', name: '皇冠', category: '装饰',
    tags: ['皇冠', '装饰', '推荐'],
    viewBox: '0 0 36 28',
    svg: `<path d="M2 24 L6 10 L14 18 L18 4 L22 18 L30 10 L34 24 Z" fill="none" stroke="#f0c860" stroke-width="2"/>`,
  },
  {
    id: 'ribbon', name: '缎带', category: '装饰',
    tags: ['缎带', '装饰', '优雅'],
    viewBox: '0 0 100 60',
    svg: `<path d="M50 5 L80 30 L50 55 L20 30 Z" fill="none" stroke="#e8a0b0" stroke-width="2"/>
<path d="M50 20 L65 35 L50 50 L35 35 Z" fill="none" stroke="#e8a0b0" stroke-width="1"/>`,
  },

  // ====== 罫線 (Ruled Lines) ======
  {
    id: 'ruled-horizontal-3', name: '三线本', category: '罫線',
    tags: ['罫線', '本', '实用'],
    viewBox: '0 0 200 60',
    svg: `<line x1="10" y1="15" x2="190" y2="15" stroke="#ccc" stroke-width="1"/>
<line x1="10" y1="30" x2="190" y2="30" stroke="#ccc" stroke-width="1"/>
<line x1="10" y1="45" x2="190" y2="45" stroke="#ccc" stroke-width="1"/>`,
  },
  {
    id: 'ruled-dot', name: '点线格', category: '罫線',
    tags: ['罫線', '点线', '实用'],
    viewBox: '0 0 200 60',
    svg: `<line x1="10" y1="15" x2="190" y2="15" stroke="#ddd" stroke-width="1" stroke-dasharray="2,6"/>
<line x1="10" y1="30" x2="190" y2="30" stroke="#ddd" stroke-width="1" stroke-dasharray="2,6"/>
<line x1="10" y1="45" x2="190" y2="45" stroke="#ddd" stroke-width="1" stroke-dasharray="2,6"/>`,
  },
]

// 按分类获取素材
export function getAssetsByCategory(category: string): SvgAsset[] {
  return svgAssets.filter((a) => a.category === category)
}

// 按标签搜索素材
export function searchAssets(query: string): SvgAsset[] {
  const q = query.toLowerCase()
  return svgAssets.filter((a) =>
    a.name.includes(q) || a.tags.some((t) => t.includes(q)) || a.category.includes(q)
  )
}

// 获取所有分类
export function getCategories(): string[] {
  return [...new Set(svgAssets.map((a) => a.category))]
}