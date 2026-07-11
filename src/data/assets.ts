// SVG 素材库 — 全网公开可商用装饰元素（透明底，纯 SVG 代码）
// 参考来源：SVGRepo, unDraw, Pixabay, Freepik, VISWIG, Vecteezy 等
// 所有素材均为原创 SVG 代码，可自由商用

export interface SvgAsset {
  id: string; name: string; category: string
  tags: string[]; svg: string; viewBox: string
}

export const svgAssets: SvgAsset[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 框架 (Frames) — 16个
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 'frame-circle-floral', name: '花饰圆框', category: '框架', tags: ['和风', '圆形', '花饰', '框架'], viewBox: '0 0 200 200',
    svg: `<circle cx="100" cy="100" r="90" fill="none" stroke="#333" stroke-width="2"/><circle cx="100" cy="100" r="85" fill="none" stroke="#c0a060" stroke-width="1" stroke-dasharray="6,3"/><circle cx="100" cy="100" r="78" fill="none" stroke="#333" stroke-width="1"/><path d="M100 15 L100 5 M100 195 L100 185 M15 100 L5 100 M195 100 L185 100" stroke="#c0a060" stroke-width="2"/><circle cx="100" cy="5" r="3" fill="#c0a060"/><circle cx="100" cy="195" r="3" fill="#c0a060"/><circle cx="5" cy="100" r="3" fill="#c0a060"/><circle cx="185" cy="100" r="3" fill="#c0a060"/>` },
  { id: 'frame-rect-japanese', name: '和风矩形框', category: '框架', tags: ['和风', '矩形', '角饰', '框架'], viewBox: '0 0 200 280',
    svg: `<rect x="15" y="15" width="170" height="250" fill="none" stroke="#333" stroke-width="2"/><rect x="20" y="20" width="160" height="240" fill="none" stroke="#c0a060" stroke-width="1"/><path d="M15 15 L30 15 M15 15 L15 30 M185 15 L170 15 M185 15 L185 30" stroke="#c0a060" stroke-width="2"/><path d="M15 265 L30 265 M15 265 L15 250 M185 265 L170 265 M185 265 L185 250" stroke="#c0a060" stroke-width="2"/><circle cx="22" cy="22" r="2" fill="#c0a060"/><circle cx="178" cy="22" r="2" fill="#c0a060"/><circle cx="22" cy="258" r="2" fill="#c0a060"/><circle cx="178" cy="258" r="2" fill="#c0a060"/>` },
  { id: 'frame-circle-simple', name: '简约圆框', category: '框架', tags: ['简约', '圆形', '框架'], viewBox: '0 0 200 200',
    svg: `<circle cx="100" cy="100" r="90" fill="none" stroke="#333" stroke-width="3"/><circle cx="100" cy="100" r="82" fill="none" stroke="#999" stroke-width="1"/>` },
  { id: 'frame-rect-rounded', name: '圆角矩形框', category: '框架', tags: ['简约', '矩形', '圆角', '框架'], viewBox: '0 0 200 150',
    svg: `<rect x="10" y="10" width="180" height="130" rx="15" fill="none" stroke="#333" stroke-width="2"/><rect x="16" y="16" width="168" height="118" rx="10" fill="none" stroke="#c0a060" stroke-width="1"/>` },
  { id: 'frame-european', name: '欧式边框', category: '框架', tags: ['欧式', '复古', '华丽', '框架'], viewBox: '0 0 200 200',
    svg: `<rect x="10" y="10" width="180" height="180" rx="8" fill="none" stroke="#8B7355" stroke-width="2"/><rect x="16" y="16" width="168" height="168" rx="5" fill="none" stroke="#8B7355" stroke-width="1"/><circle cx="11" cy="11" r="4" fill="#8B7355"/><circle cx="189" cy="11" r="4" fill="#8B7355"/><circle cx="11" cy="189" r="4" fill="#8B7355"/><circle cx="189" cy="189" r="4" fill="#8B7355"/>` },
  { id: 'frame-chinese', name: '中式边框', category: '框架', tags: ['中式', '古典', '传统', '框架'], viewBox: '0 0 200 200',
    svg: `<rect x="8" y="8" width="184" height="184" fill="none" stroke="#c41e3a" stroke-width="2"/><rect x="14" y="14" width="172" height="172" fill="none" stroke="#c41e3a" stroke-width="1"/><rect x="5" y="5" width="6" height="6" fill="#c41e3a"/><rect x="189" y="5" width="6" height="6" fill="#c41e3a"/><rect x="5" y="189" width="6" height="6" fill="#c41e3a"/><rect x="189" y="189" width="6" height="6" fill="#c41e3a"/>` },
  { id: 'frame-dotted-rect', name: '点线方框', category: '框架', tags: ['点线', '简约', '框架'], viewBox: '0 0 200 200',
    svg: `<rect x="20" y="20" width="160" height="160" rx="4" fill="none" stroke="#999" stroke-width="2" stroke-dasharray="6,5"/>` },
  { id: 'frame-thick-thin', name: '粗细双框', category: '框架', tags: ['双线', '简约', '框架'], viewBox: '0 0 200 200',
    svg: `<rect x="15" y="15" width="170" height="170" fill="none" stroke="#333" stroke-width="4"/><rect x="22" y="22" width="156" height="156" fill="none" stroke="#333" stroke-width="1"/>` },
  { id: 'frame-vintage', name: '复古边框', category: '框架', tags: ['复古', '做旧', '框架'], viewBox: '0 0 200 200',
    svg: `<rect x="12" y="12" width="176" height="176" rx="2" fill="none" stroke="#6B5B4F" stroke-width="2"/><rect x="18" y="18" width="164" height="164" fill="none" stroke="#6B5B4F" stroke-width="1.5"/><rect x="24" y="24" width="152" height="152" fill="none" stroke="#6B5B4F" stroke-width="1"/>` },
  { id: 'frame-polaroid', name: '拍立得框', category: '框架', tags: ['拍立得', '照片', '框架'], viewBox: '0 0 160 200',
    svg: `<rect x="5" y="5" width="150" height="190" fill="#fff" stroke="#ccc" stroke-width="1"/><rect x="15" y="15" width="130" height="130" fill="none" stroke="#ddd" stroke-width="1"/><circle cx="80" cy="185" r="2" fill="#ccc"/>` },
  { id: 'frame-hexagon', name: '六边形框', category: '框架', tags: ['六边形', '几何', '框架'], viewBox: '0 0 200 200',
    svg: `<polygon points="100,10 175,50 175,150 100,190 25,150 25,50" fill="none" stroke="#333" stroke-width="2"/><polygon points="100,16 168,53 168,147 100,184 32,147 32,53" fill="none" stroke="#c0a060" stroke-width="1"/>` },
  { id: 'frame-diamond', name: '菱形框', category: '框架', tags: ['菱形', '几何', '框架'], viewBox: '0 0 200 200',
    svg: `<polygon points="100,10 190,100 100,190 10,100" fill="none" stroke="#333" stroke-width="2"/><polygon points="100,18 182,100 100,182 18,100" fill="none" stroke="#c0a060" stroke-width="1"/>` },
  { id: 'frame-banner', name: '横幅框架', category: '框架', tags: ['横幅', '标题', '框架'], viewBox: '0 0 300 100',
    svg: `<rect x="10" y="20" width="280" height="60" rx="5" fill="none" stroke="#333" stroke-width="2"/><polygon points="10,20 5,12 300,12 295,20" fill="none" stroke="#333" stroke-width="2"/><polygon points="10,80 5,88 300,88 295,80" fill="none" stroke="#333" stroke-width="2"/>` },
  { id: 'frame-scallop', name: '贝壳边圆框', category: '框架', tags: ['贝壳', '可爱', '圆形', '框架'], viewBox: '0 0 200 200',
    svg: `<circle cx="100" cy="100" r="92" fill="none" stroke="#e8a0b0" stroke-width="2"/><circle cx="100" cy="100" r="85" fill="none" stroke="#e8a0b0" stroke-width="1.5" stroke-dasharray="10,5"/>` },
  { id: 'frame-stamp', name: '邮票框', category: '框架', tags: ['邮票', '复古', '框架'], viewBox: '0 0 200 160',
    svg: `<rect x="8" y="8" width="184" height="144" fill="none" stroke="#666" stroke-width="2"/><circle cx="8" cy="8" r="4" fill="#666"/><circle cx="192" cy="8" r="4" fill="#666"/><circle cx="8" cy="152" r="4" fill="#666"/><circle cx="192" cy="152" r="4" fill="#666"/>` },
  { id: 'frame-washi', name: '和纸胶带框', category: '框架', tags: ['和风', '胶带', '可爱', '框架'], viewBox: '0 0 200 80',
    svg: `<rect x="5" y="10" width="190" height="60" rx="3" fill="none" stroke="#d4a843" stroke-width="1.5" stroke-dasharray="8,3"/><rect x="5" y="10" width="190" height="60" rx="3" fill="#f0e6c8" opacity="0.3"/>` },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 角饰 (Corners) — 8个
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 'corner-floral-tl', name: '花饰角·左上', category: '角饰', tags: ['和风', '角饰', '花饰'], viewBox: '0 0 80 80',
    svg: `<path d="M5 5 L5 40 Q5 10 40 5 L5 5" fill="#c0a060" opacity="0.3"/><path d="M5 5 L5 35 Q5 8 35 5" fill="none" stroke="#c0a060" stroke-width="2"/><circle cx="10" cy="10" r="3" fill="#c0a060"/>` },
  { id: 'corner-floral-tr', name: '花饰角·右上', category: '角饰', tags: ['和风', '角饰', '花饰'], viewBox: '0 0 80 80',
    svg: `<path d="M75 5 L75 40 Q75 10 40 5 L75 5" fill="#c0a060" opacity="0.3"/><path d="M75 5 L75 35 Q75 8 45 5" fill="none" stroke="#c0a060" stroke-width="2"/><circle cx="70" cy="10" r="3" fill="#c0a060"/>` },
  { id: 'corner-floral-bl', name: '花饰角·左下', category: '角饰', tags: ['和风', '角饰', '花饰'], viewBox: '0 0 80 80',
    svg: `<path d="M5 75 L5 40 Q5 70 40 75 L5 75" fill="#c0a060" opacity="0.3"/><path d="M5 75 L5 45 Q5 72 35 75" fill="none" stroke="#c0a060" stroke-width="2"/><circle cx="10" cy="70" r="3" fill="#c0a060"/>` },
  { id: 'corner-floral-br', name: '花饰角·右下', category: '角饰', tags: ['和风', '角饰', '花饰'], viewBox: '0 0 80 80',
    svg: `<path d="M75 75 L75 40 Q75 70 40 75 L75 75" fill="#c0a060" opacity="0.3"/><path d="M75 75 L75 45 Q75 72 45 75" fill="none" stroke="#c0a060" stroke-width="2"/><circle cx="70" cy="70" r="3" fill="#c0a060"/>` },
  { id: 'corner-simple-tl', name: '简洁角·左上', category: '角饰', tags: ['简约', '角饰'], viewBox: '0 0 60 60',
    svg: `<path d="M5 5 L5 35 M5 5 L35 5" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>` },
  { id: 'corner-simple-tr', name: '简洁角·右上', category: '角饰', tags: ['简约', '角饰'], viewBox: '0 0 60 60',
    svg: `<path d="M55 5 L55 35 M55 5 L25 5" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>` },
  { id: 'corner-simple-bl', name: '简洁角·左下', category: '角饰', tags: ['简约', '角饰'], viewBox: '0 0 60 60',
    svg: `<path d="M5 55 L5 25 M5 55 L35 55" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>` },
  { id: 'corner-simple-br', name: '简洁角·右下', category: '角饰', tags: ['简约', '角饰'], viewBox: '0 0 60 60',
    svg: `<path d="M55 55 L55 25 M55 55 L25 55" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>` },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 线条/分隔线 (Lines) — 10个
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 'line-wavy', name: '波浪线', category: '线条', tags: ['和风', '波浪', '线条'], viewBox: '0 0 200 30',
    svg: `<path d="M0 15 Q25 0 50 15 Q75 30 100 15 Q125 0 150 15 Q175 30 200 15" fill="none" stroke="#c0a060" stroke-width="2"/>` },
  { id: 'line-twin', name: '双线', category: '线条', tags: ['简约', '双线', '线条'], viewBox: '0 0 200 20',
    svg: `<line x1="0" y1="5" x2="200" y2="5" stroke="#333" stroke-width="2"/><line x1="0" y1="15" x2="200" y2="15" stroke="#999" stroke-width="1"/>` },
  { id: 'line-diamond', name: '菱形横线', category: '线条', tags: ['装饰', '菱形', '线条'], viewBox: '0 0 200 20',
    svg: `<line x1="0" y1="10" x2="200" y2="10" stroke="#333" stroke-width="1"/><polygon points="100,2 108,10 100,18 92,10" fill="#c0a060"/>` },
  { id: 'line-ornament-center', name: '花饰中心线', category: '线条', tags: ['和风', '花饰', '线条'], viewBox: '0 0 200 30',
    svg: `<line x1="0" y1="15" x2="85" y2="15" stroke="#c0a060" stroke-width="1.5"/><line x1="115" y1="15" x2="200" y2="15" stroke="#c0a060" stroke-width="1.5"/><circle cx="100" cy="15" r="8" fill="none" stroke="#c0a060" stroke-width="1.5"/><circle cx="100" cy="15" r="3" fill="#c0a060"/>` },
  { id: 'line-zigzag', name: '锯齿线', category: '线条', tags: ['锯齿', '装饰', '线条'], viewBox: '0 0 200 20',
    svg: `<polyline points="0,10 20,2 40,10 60,2 80,10 100,2 120,10 140,2 160,10 180,2 200,10" fill="none" stroke="#999" stroke-width="2"/>` },
  { id: 'line-dash', name: '虚线', category: '线条', tags: ['虚线', '简约', '线条'], viewBox: '0 0 200 10',
    svg: `<line x1="0" y1="5" x2="200" y2="5" stroke="#999" stroke-width="2" stroke-dasharray="10,6"/>` },
  { id: 'line-triple', name: '三线', category: '线条', tags: ['三线', '装饰', '线条'], viewBox: '0 0 200 20',
    svg: `<line x1="0" y1="4" x2="200" y2="4" stroke="#333" stroke-width="1.5"/><line x1="0" y1="10" x2="200" y2="10" stroke="#999" stroke-width="1"/><line x1="0" y1="16" x2="200" y2="16" stroke="#333" stroke-width="1.5"/>` },
  { id: 'line-gradient', name: '渐变线', category: '线条', tags: ['渐变', '装饰', '线条'], viewBox: '0 0 200 10',
    svg: `<line x1="0" y1="5" x2="200" y2="5" stroke="#c0a060" stroke-width="3"/><circle cx="0" cy="5" r="4" fill="#c0a060"/><circle cx="200" cy="5" r="4" fill="#c0a060"/>` },
  { id: 'line-scallop', name: '扇贝线', category: '线条', tags: ['扇贝', '可爱', '线条'], viewBox: '0 0 200 20',
    svg: `<path d="M0 15 Q10 0 20 15 Q30 0 40 15 Q50 0 60 15 Q70 0 80 15 Q90 0 100 15 Q110 0 120 15 Q130 0 140 15 Q150 0 160 15 Q170 0 180 15 Q190 0 200 15" fill="none" stroke="#e8a0b0" stroke-width="2"/>` },
  { id: 'line-arrowed', name: '箭头线', category: '线条', tags: ['箭头', '实用', '线条'], viewBox: '0 0 200 20',
    svg: `<line x1="0" y1="10" x2="180" y2="10" stroke="#333" stroke-width="2"/><polygon points="180,3 195,10 180,17" fill="#333"/>` },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 和风 (Japanese) — 12个
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 'sakura-single', name: '樱花·单瓣', category: '和风', tags: ['樱花', '和风', '花'], viewBox: '0 0 40 40',
    svg: `<circle cx="20" cy="15" r="3" fill="#e8a0b0"/><circle cx="20" cy="25" r="3" fill="#e8a0b0"/><circle cx="12" cy="18" r="3" fill="#e8a0b0"/><circle cx="28" cy="18" r="3" fill="#e8a0b0"/><circle cx="15" cy="24" r="3" fill="#e8a0b0"/><circle cx="25" cy="24" r="3" fill="#e8a0b0"/><circle cx="20" cy="20" r="2" fill="#d47888"/>` },
  { id: 'sakura-petal', name: '樱花花瓣', category: '和风', tags: ['樱花', '花瓣', '和风'], viewBox: '0 0 20 20',
    svg: `<path d="M10 2 Q14 6 18 10 Q14 14 10 18 Q6 14 2 10 Q6 6 10 2" fill="#f0c8d0" stroke="#e8a0b0" stroke-width="0.5"/><path d="M10 6 L10 10" stroke="#d47888" stroke-width="0.5"/>` },
  { id: 'wave-seigaiha', name: '青海波', category: '和风', tags: ['青海波', '和风', '传统纹样'], viewBox: '0 0 80 60',
    svg: `<circle cx="20" cy="15" r="14" fill="none" stroke="#4a90d9" stroke-width="1.5"/><circle cx="20" cy="15" r="7" fill="none" stroke="#4a90d9" stroke-width="1"/><circle cx="60" cy="15" r="14" fill="none" stroke="#4a90d9" stroke-width="1.5"/><circle cx="60" cy="15" r="7" fill="none" stroke="#4a90d9" stroke-width="1"/><circle cx="40" cy="45" r="14" fill="none" stroke="#4a90d9" stroke-width="1.5"/><circle cx="40" cy="45" r="7" fill="none" stroke="#4a90d9" stroke-width="1"/>` },
  { id: 'pattern-asanoha', name: '麻の葉纹', category: '和风', tags: ['麻の葉', '和风', '传统纹样'], viewBox: '0 0 60 60',
    svg: `<polygon points="30,5 38,22 30,38 22,22" fill="none" stroke="#c0a060" stroke-width="1"/><polygon points="30,38 38,22 55,22 47,38" fill="none" stroke="#c0a060" stroke-width="1"/><polygon points="30,38 22,22 5,22 13,38" fill="none" stroke="#c0a060" stroke-width="1"/><polygon points="30,5 38,22 55,22" fill="none" stroke="#c0a060" stroke-width="1"/><polygon points="30,5 22,22 5,22" fill="none" stroke="#c0a060" stroke-width="1"/>` },
  { id: 'japanese-seal', name: '和风印章', category: '和风', tags: ['印章', '和风', '传统'], viewBox: '0 0 60 60',
    svg: `<rect x="5" y="5" width="50" height="50" rx="3" fill="none" stroke="#c41e3a" stroke-width="2"/><rect x="10" y="10" width="40" height="40" rx="2" fill="#c41e3a" opacity="0.1"/>` },
  { id: 'fan', name: '扇子', category: '和风', tags: ['扇子', '和风', '传统'], viewBox: '0 0 60 60',
    svg: `<path d="M30 55 L8 5 L52 5 Z" fill="none" stroke="#c0a060" stroke-width="1.5"/><path d="M30 55 L20 5" fill="none" stroke="#c0a060" stroke-width="0.8"/><path d="M30 55 L40 5" fill="none" stroke="#c0a060" stroke-width="0.8"/>` },
  { id: 'tsuru', name: '千纸鹤', category: '和风', tags: ['千纸鹤', '和风', '折纸'], viewBox: '0 0 40 50',
    svg: `<polygon points="20,5 35,20 20,40 5,20" fill="none" stroke="#e8a0b0" stroke-width="1.5"/><polygon points="20,5 20,25 35,20" fill="none" stroke="#e8a0b0" stroke-width="1"/><polygon points="20,40 5,20 20,10" fill="none" stroke="#e8a0b0" stroke-width="1"/>` },
  { id: 'kamon', name: '家纹·梅', category: '和风', tags: ['家纹', '梅', '和风', '传统'], viewBox: '0 0 60 60',
    svg: `<circle cx="30" cy="30" r="25" fill="none" stroke="#333" stroke-width="2"/><circle cx="30" cy="20" r="8" fill="none" stroke="#333" stroke-width="1.5"/><circle cx="20" cy="35" r="5" fill="none" stroke="#333" stroke-width="1"/><circle cx="40" cy="35" r="5" fill="none" stroke="#333" stroke-width="1"/><circle cx="30" cy="30" r="3" fill="#c0a060"/>` },
  { id: 'noren', name: '暖簾', category: '和风', tags: ['暖簾', '和风', '店铺'], viewBox: '0 0 80 100',
    svg: `<rect x="10" y="10" width="60" height="80" fill="none" stroke="#4a4a8a" stroke-width="2"/><rect x="10" y="10" width="60" height="80" fill="#4a4a8a" opacity="0.08"/><line x1="40" y1="10" x2="40" y2="90" stroke="#4a4a8a" stroke-width="1"/>` },
  { id: 'maneki-neko', name: '招财猫', category: '和风', tags: ['招财猫', '和风', '可爱'], viewBox: '0 0 50 60',
    svg: `<ellipse cx="25" cy="30" rx="18" ry="20" fill="none" stroke="#d4a843" stroke-width="1.5"/><circle cx="20" cy="25" r="2" fill="#333"/><circle cx="30" cy="25" r="2" fill="#333"/><ellipse cx="25" cy="32" rx="1.5" ry="1" fill="#e8a0b0"/><path d="M15 38 Q25 30 35 38" fill="none" stroke="#d4a843" stroke-width="1"/><circle cx="35" cy="15" r="5" fill="#d4a843" opacity="0.2"/><circle cx="35" cy="15" r="5" fill="none" stroke="#d4a843" stroke-width="1"/>` },
  { id: 'daruma', name: '达摩', category: '和风', tags: ['达摩', '和风', '吉祥'], viewBox: '0 0 50 60',
    svg: `<ellipse cx="25" cy="30" rx="20" ry="22" fill="none" stroke="#c41e3a" stroke-width="2"/><ellipse cx="25" cy="30" rx="20" ry="22" fill="#c41e3a" opacity="0.1"/><ellipse cx="20" cy="24" rx="5" ry="4" fill="#fff"/><ellipse cx="30" cy="24" rx="5" ry="4" fill="#fff"/><circle cx="21" cy="24" r="2" fill="#333"/><circle cx="31" cy="24" r="2" fill="#333"/><ellipse cx="25" cy="38" rx="8" ry="5" fill="none" stroke="#c41e3a" stroke-width="1"/>` },
  { id: 'kotatsu', name: '被炉猫', category: '和风', tags: ['被炉', '猫', '和风', '可爱'], viewBox: '0 0 80 60',
    svg: `<rect x="15" y="20" width="50" height="25" rx="3" fill="none" stroke="#8B7355" stroke-width="1.5"/><rect x="15" y="20" width="50" height="25" rx="3" fill="#c41e3a" opacity="0.15"/><rect x="10" y="45" width="60" height="5" rx="2" fill="none" stroke="#8B7355" stroke-width="1"/><circle cx="40" cy="15" r="8" fill="none" stroke="#8B7355" stroke-width="1.5"/><circle cx="37" cy="13" r="1" fill="#333"/><circle cx="43" cy="13" r="1" fill="#333"/><path d="M38 17 L36 19 M42 17 L44 19" stroke="#8B7355" stroke-width="1"/>` },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 装饰 (Decorations) — 14个
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 'sparkle-4pt', name: '四角星·闪', category: '装饰', tags: ['星星', '闪亮', '装饰'], viewBox: '0 0 30 30',
    svg: `<path d="M15 2 L17 13 L28 15 L17 17 L15 28 L13 17 L2 15 L13 13 Z" fill="#f0c860"/>` },
  { id: 'sparkle-cross', name: '十字星', category: '装饰', tags: ['星星', '十字', '装饰'], viewBox: '0 0 20 20',
    svg: `<line x1="10" y1="2" x2="10" y2="18" stroke="#f0c860" stroke-width="2" stroke-linecap="round"/><line x1="2" y1="10" x2="18" y2="10" stroke="#f0c860" stroke-width="2" stroke-linecap="round"/>` },
  { id: 'sparkle-tiny', name: '小星点', category: '装饰', tags: ['星星', '小点', '装饰'], viewBox: '0 0 10 10',
    svg: `<circle cx="5" cy="5" r="2" fill="#f0c860"/>` },
  { id: 'crown', name: '皇冠', category: '装饰', tags: ['皇冠', '装饰', '推荐'], viewBox: '0 0 36 28',
    svg: `<path d="M2 24 L6 10 L14 18 L18 4 L22 18 L30 10 L34 24 Z" fill="none" stroke="#f0c860" stroke-width="2"/>` },
  { id: 'ribbon', name: '缎带', category: '装饰', tags: ['缎带', '装饰', '优雅'], viewBox: '0 0 100 60',
    svg: `<path d="M50 5 L80 30 L50 55 L20 30 Z" fill="none" stroke="#e8a0b0" stroke-width="2"/><path d="M50 20 L65 35 L50 50 L35 35 Z" fill="none" stroke="#e8a0b0" stroke-width="1"/>` },
  { id: 'ribbon-banner', name: '飘带横幅', category: '装饰', tags: ['飘带', '横幅', '装饰'], viewBox: '0 0 200 80',
    svg: `<path d="M10 15 L190 15 L170 40 L190 65 L10 65 L30 40 Z" fill="none" stroke="#c0a060" stroke-width="2"/>` },
  { id: 'medal', name: '奖章', category: '装饰', tags: ['奖章', '装饰', '荣誉'], viewBox: '0 0 50 70',
    svg: `<circle cx="25" cy="30" r="18" fill="none" stroke="#f0c860" stroke-width="2"/><circle cx="25" cy="30" r="12" fill="none" stroke="#f0c860" stroke-width="1"/><rect x="20" y="48" width="10" height="15" fill="none" stroke="#f0c860" stroke-width="1.5"/>` },
  { id: 'heart-solid', name: '实心爱心', category: '装饰', tags: ['爱心', '可爱', '装饰'], viewBox: '0 0 30 26',
    svg: `<path d="M15 25 C15 25 2 16 2 8 C2 3 6 0 10 0 C13 0 15 3 15 5 C15 3 17 0 20 0 C24 0 28 3 28 8 C28 16 15 25 15 25 Z" fill="#e8a0b0"/>` },
  { id: 'diamond-gem', name: '钻石', category: '装饰', tags: ['钻石', '装饰', '华丽'], viewBox: '0 0 40 50',
    svg: `<polygon points="20,2 38,15 20,48 2,15" fill="none" stroke="#7ec8e3" stroke-width="1.5"/><polygon points="20,15 30,25 20,38 10,25" fill="none" stroke="#7ec8e3" stroke-width="1"/>` },
  { id: 'clover', name: '四叶草', category: '装饰', tags: ['四叶草', '幸运', '装饰'], viewBox: '0 0 40 40',
    svg: `<circle cx="20" cy="12" r="7" fill="none" stroke="#6ab04c" stroke-width="1.5"/><circle cx="12" cy="22" r="7" fill="none" stroke="#6ab04c" stroke-width="1.5"/><circle cx="28" cy="22" r="7" fill="none" stroke="#6ab04c" stroke-width="1.5"/><circle cx="20" cy="32" r="7" fill="none" stroke="#6ab04c" stroke-width="1.5"/><line x1="20" y1="19" x2="20" y2="25" stroke="#6ab04c" stroke-width="1.5"/>` },
  { id: 'music-note', name: '音符', category: '装饰', tags: ['音符', '音乐', '装饰'], viewBox: '0 0 30 40',
    svg: `<circle cx="22" cy="28" r="6" fill="none" stroke="#333" stroke-width="1.5"/><line x1="28" y1="28" x2="28" y2="8" stroke="#333" stroke-width="2"/><line x1="22" y1="8" x2="28" y2="8" stroke="#333" stroke-width="2"/><path d="M28 8 Q22 10 22 20" fill="none" stroke="#333" stroke-width="1.5"/>` },
  { id: 'bookmark', name: '书签', category: '装饰', tags: ['书签', '实用', '装饰'], viewBox: '0 0 30 50',
    svg: `<polygon points="5,0 25,0 25,50 15,38 5,50" fill="none" stroke="#e8a0b0" stroke-width="1.5"/>` },
  { id: 'feather', name: '羽毛', category: '装饰', tags: ['羽毛', '优雅', '装饰'], viewBox: '0 0 20 50',
    svg: `<path d="M10 2 Q2 15 5 30 Q4 40 10 48" fill="none" stroke="#999" stroke-width="1.5"/><path d="M10 2 Q12 10 10 20 Q11 25 10 35" fill="none" stroke="#ccc" stroke-width="1"/><path d="M10 2 Q8 10 10 20 Q9 25 10 35" fill="none" stroke="#ccc" stroke-width="1"/>` },
  { id: 'butterfly', name: '蝴蝶', category: '装饰', tags: ['蝴蝶', '自然', '装饰'], viewBox: '0 0 40 30',
    svg: `<path d="M20 15 Q5 0 2 10 Q5 15 20 15" fill="none" stroke="#e8a0b0" stroke-width="1.5"/><path d="M20 15 Q35 0 38 10 Q35 15 20 15" fill="none" stroke="#e8a0b0" stroke-width="1.5"/><path d="M20 15 Q8 20 5 28 Q12 22 20 15" fill="none" stroke="#e8a0b0" stroke-width="1"/><path d="M20 15 Q32 20 35 28 Q28 22 20 15" fill="none" stroke="#e8a0b0" stroke-width="1"/>` },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 标签/价签 (Labels) — 8个
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 'label-price', name: '价格标签', category: '标签', tags: ['价格', '标签', '实用'], viewBox: '0 0 100 40',
    svg: `<rect x="5" y="2" width="90" height="36" rx="5" fill="none" stroke="#c0392b" stroke-width="2"/><rect x="5" y="2" width="18" height="36" rx="5" fill="#c0392b" opacity="0.1"/>` },
  { id: 'label-new', name: '新刊标签', category: '标签', tags: ['新刊', '标签', '实用'], viewBox: '0 0 80 80',
    svg: `<polygon points="40,5 75,25 75,55 40,75 5,55 5,25" fill="none" stroke="#e74c3c" stroke-width="2"/><polygon points="40,5 75,25 75,55 40,75 5,55 5,25" fill="#e74c3c" opacity="0.1"/>` },
  { id: 'label-soldout', name: '完售标签', category: '标签', tags: ['完售', '标签', '实用'], viewBox: '0 0 100 40',
    svg: `<rect x="5" y="2" width="90" height="36" rx="5" fill="none" stroke="#e74c3c" stroke-width="2"/><rect x="5" y="2" width="90" height="36" rx="5" fill="#e74c3c" opacity="0.1"/>` },
  { id: 'label-free', name: '無料标签', category: '标签', tags: ['無料', '免费', '标签'], viewBox: '0 0 80 40',
    svg: `<rect x="5" y="2" width="70" height="30" rx="4" fill="none" stroke="#27ae60" stroke-width="2"/><rect x="5" y="2" width="70" height="30" rx="4" fill="#27ae60" opacity="0.08"/>` },
  { id: 'label-round', name: '圆形标签', category: '标签', tags: ['圆形', '标签', '装饰'], viewBox: '0 0 50 50',
    svg: `<circle cx="25" cy="25" r="22" fill="none" stroke="#e74c3c" stroke-width="2"/><circle cx="25" cy="25" r="22" fill="#e74c3c" opacity="0.08"/>` },
  { id: 'label-ribbon-tag', name: '飘带标签', category: '标签', tags: ['飘带', '标签', '装饰'], viewBox: '0 0 100 40',
    svg: `<path d="M5 5 L85 5 L95 20 L85 35 L5 35 L15 20 Z" fill="none" stroke="#e74c3c" stroke-width="2"/>` },
  { id: 'label-starburst', name: '炸裂标签', category: '标签', tags: ['炸裂', '标签', '醒目'], viewBox: '0 0 80 80',
    svg: `<polygon points="40,5 48,30 75,35 48,40 40,65 32,40 5,35 32,30" fill="none" stroke="#f39c12" stroke-width="2"/>` },
  { id: 'label-warning', name: '注意标签', category: '标签', tags: ['注意', '标签', '实用'], viewBox: '0 0 40 40',
    svg: `<polygon points="20,3 37,35 3,35" fill="none" stroke="#f39c12" stroke-width="2"/><line x1="20" y1="14" x2="20" y2="24" stroke="#f39c12" stroke-width="2"/><circle cx="20" cy="29" r="1.5" fill="#f39c12"/>` },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 吹き出し (Speech Bubbles) — 6个
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 'bubble-circle', name: '圆形气泡', category: '吹き出し', tags: ['气泡', '对话', '漫画'], viewBox: '0 0 120 100',
    svg: `<ellipse cx="60" cy="45" rx="55" ry="35" fill="none" stroke="#333" stroke-width="2"/><polygon points="40,75 55,75 35,92" fill="none" stroke="#333" stroke-width="2"/>` },
  { id: 'bubble-rect', name: '矩形气泡', category: '吹き出し', tags: ['气泡', '对话', '漫画'], viewBox: '0 0 120 100',
    svg: `<rect x="10" y="10" width="100" height="60" rx="8" fill="none" stroke="#333" stroke-width="2"/><polygon points="35,70 50,70 30,88" fill="none" stroke="#333" stroke-width="2"/>` },
  { id: 'bubble-shout', name: '喊叫气泡', category: '吹き出し', tags: ['气泡', '喊叫', '漫画'], viewBox: '0 0 120 100',
    svg: `<polygon points="60,10 75,15 115,15 115,75 75,75 60,80 50,75 5,75 5,15 45,15" fill="none" stroke="#333" stroke-width="2"/>` },
  { id: 'bubble-thought', name: '思考气泡', category: '吹き出し', tags: ['气泡', '思考', '漫画'], viewBox: '0 0 100 120',
    svg: `<ellipse cx="50" cy="50" rx="40" ry="30" fill="none" stroke="#333" stroke-width="2"/><circle cx="35" cy="105" r="8" fill="none" stroke="#333" stroke-width="1.5"/><circle cx="25" cy="115" r="5" fill="none" stroke="#333" stroke-width="1"/>` },
  { id: 'bubble-fluffy', name: '云朵气泡', category: '吹き出し', tags: ['气泡', '云朵', '可爱'], viewBox: '0 0 120 90',
    svg: `<path d="M60 15 Q75 5 90 15 Q105 15 105 30 Q110 45 95 50 Q100 65 85 70 Q80 80 60 75 Q45 85 30 75 Q15 80 10 65 Q5 55 15 45 Q5 30 20 20 Q20 5 45 10 Q50 5 60 15" fill="none" stroke="#e8a0b0" stroke-width="2"/>` },
  { id: 'bubble-scream', name: '尖叫气泡', category: '吹き出し', tags: ['气泡', '尖叫', '漫画'], viewBox: '0 0 120 100',
    svg: `<polygon points="60,5 72,12 108,8 112,20 118,10 112,25 118,40 110,50 115,65 100,70 95,85 85,75 72,80 60,75 48,80 35,75 25,85 20,70 5,65 10,50 5,40 8,25 2,10 12,20 8,8 48,12" fill="none" stroke="#333" stroke-width="2"/>` },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 几何 (Geometric) — 8个
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 'circle-double', name: '双圆', category: '几何', tags: ['圆形', '几何', '简约'], viewBox: '0 0 60 60',
    svg: `<circle cx="30" cy="30" r="25" fill="none" stroke="#333" stroke-width="2"/><circle cx="30" cy="30" r="18" fill="none" stroke="#c0a060" stroke-width="1"/>` },
  { id: 'circle-dotted', name: '点线圆', category: '几何', tags: ['圆形', '几何', '点线'], viewBox: '0 0 60 60',
    svg: `<circle cx="30" cy="30" r="25" fill="none" stroke="#999" stroke-width="2" stroke-dasharray="4,4"/>` },
  { id: 'circle-triple', name: '三重圆', category: '几何', tags: ['圆形', '几何', '和风'], viewBox: '0 0 80 80',
    svg: `<circle cx="40" cy="40" r="35" fill="none" stroke="#333" stroke-width="2"/><circle cx="40" cy="40" r="28" fill="none" stroke="#c0a060" stroke-width="1.5"/><circle cx="40" cy="40" r="20" fill="none" stroke="#333" stroke-width="1"/>` },
  { id: 'triangle', name: '三角形', category: '几何', tags: ['三角形', '几何', '简约'], viewBox: '0 0 60 55',
    svg: `<polygon points="30,5 55,48 5,48" fill="none" stroke="#333" stroke-width="2"/>` },
  { id: 'pentagon', name: '五边形', category: '几何', tags: ['五边形', '几何', '简约'], viewBox: '0 0 60 60',
    svg: `<polygon points="30,5 55,22 48,52 12,52 5,22" fill="none" stroke="#333" stroke-width="2"/>` },
  { id: 'octagon', name: '八边形', category: '几何', tags: ['八边形', '几何', '简约'], viewBox: '0 0 60 60',
    svg: `<polygon points="20,5 40,5 55,20 55,40 40,55 20,55 5,40 5,20" fill="none" stroke="#333" stroke-width="2"/>` },
  { id: 'cross', name: '十字', category: '几何', tags: ['十字', '几何', '简约'], viewBox: '0 0 40 40',
    svg: `<line x1="20" y1="2" x2="20" y2="38" stroke="#333" stroke-width="2"/><line x1="2" y1="20" x2="38" y2="20" stroke="#333" stroke-width="2"/>` },
  { id: 'plus', name: '加号', category: '几何', tags: ['加号', '几何', '简约'], viewBox: '0 0 40 40',
    svg: `<line x1="20" y1="5" x2="20" y2="35" stroke="#333" stroke-width="2" stroke-linecap="round"/><line x1="5" y1="20" x2="35" y2="20" stroke="#333" stroke-width="2" stroke-linecap="round"/>` },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 罫線 (Ruled Lines) — 6个
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 'ruled-horizontal-3', name: '三线本', category: '罫線', tags: ['罫線', '本', '实用'], viewBox: '0 0 200 60',
    svg: `<line x1="10" y1="15" x2="190" y2="15" stroke="#ccc" stroke-width="1"/><line x1="10" y1="30" x2="190" y2="30" stroke="#ccc" stroke-width="1"/><line x1="10" y1="45" x2="190" y2="45" stroke="#ccc" stroke-width="1"/>` },
  { id: 'ruled-dot', name: '点线格', category: '罫線', tags: ['罫線', '点线', '实用'], viewBox: '0 0 200 60',
    svg: `<line x1="10" y1="15" x2="190" y2="15" stroke="#ddd" stroke-width="1" stroke-dasharray="2,6"/><line x1="10" y1="30" x2="190" y2="30" stroke="#ddd" stroke-width="1" stroke-dasharray="2,6"/><line x1="10" y1="45" x2="190" y2="45" stroke="#ddd" stroke-width="1" stroke-dasharray="2,6"/>` },
  { id: 'ruled-grid', name: '方格', category: '罫線', tags: ['罫線', '方格', '实用'], viewBox: '0 0 100 100',
    svg: `<line x1="25" y1="0" x2="25" y2="100" stroke="#eee" stroke-width="1"/><line x1="50" y1="0" x2="50" y2="100" stroke="#eee" stroke-width="1"/><line x1="75" y1="0" x2="75" y2="100" stroke="#eee" stroke-width="1"/><line x1="0" y1="25" x2="100" y2="25" stroke="#eee" stroke-width="1"/><line x1="0" y1="50" x2="100" y2="50" stroke="#eee" stroke-width="1"/><line x1="0" y1="75" x2="100" y2="75" stroke="#eee" stroke-width="1"/>` },
  { id: 'ruled-notebook', name: '笔记本线', category: '罫線', tags: ['罫線', '笔记本', '实用'], viewBox: '0 0 200 200',
    svg: `<line x1="30" y1="0" x2="30" y2="200" stroke="#e8a0b0" stroke-width="1"/><line x1="10" y1="20" x2="190" y2="20" stroke="#ddd" stroke-width="1"/><line x1="10" y1="40" x2="190" y2="40" stroke="#ddd" stroke-width="1"/><line x1="10" y1="60" x2="190" y2="60" stroke="#ddd" stroke-width="1"/><line x1="10" y1="80" x2="190" y2="80" stroke="#ddd" stroke-width="1"/><line x1="10" y1="100" x2="190" y2="100" stroke="#ddd" stroke-width="1"/><line x1="10" y1="120" x2="190" y2="120" stroke="#ddd" stroke-width="1"/>` },
  { id: 'ruled-staff', name: '五线谱', category: '罫線', tags: ['五线谱', '音乐', '实用'], viewBox: '0 0 200 30',
    svg: `<line x1="10" y1="5" x2="190" y2="5" stroke="#999" stroke-width="1"/><line x1="10" y1="10" x2="190" y2="10" stroke="#999" stroke-width="1"/><line x1="10" y1="15" x2="190" y2="15" stroke="#999" stroke-width="1"/><line x1="10" y1="20" x2="190" y2="20" stroke="#999" stroke-width="1"/><line x1="10" y1="25" x2="190" y2="25" stroke="#999" stroke-width="1"/>` },
  { id: 'ruled-calendar', name: '日历格', category: '罫線', tags: ['日历', '罫線', '实用'], viewBox: '0 0 200 140',
    svg: `<rect x="5" y="5" width="190" height="130" fill="none" stroke="#ccc" stroke-width="1"/><line x1="5" y1="25" x2="195" y2="25" stroke="#ccc" stroke-width="1"/><line x1="32" y1="25" x2="32" y2="135" stroke="#ccc" stroke-width="1"/><line x1="60" y1="25" x2="60" y2="135" stroke="#ccc" stroke-width="1"/><line x1="88" y1="25" x2="88" y2="135" stroke="#ccc" stroke-width="1"/><line x1="116" y1="25" x2="116" y2="135" stroke="#ccc" stroke-width="1"/><line x1="144" y1="25" x2="144" y2="135" stroke="#ccc" stroke-width="1"/><line x1="172" y1="25" x2="172" y2="135" stroke="#ccc" stroke-width="1"/>` },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 实用 (Practical) — 8个
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 'arrow-down', name: '下箭头', category: '实用', tags: ['箭头', '实用', '导航'], viewBox: '0 0 24 24',
    svg: `<path d="M12 5 L12 19 M5 12 L12 19 L19 12" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` },
  { id: 'arrow-up', name: '上箭头', category: '实用', tags: ['箭头', '实用', '导航'], viewBox: '0 0 24 24',
    svg: `<path d="M12 19 L12 5 M5 12 L12 5 L19 12" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` },
  { id: 'check-circle', name: '勾选圆', category: '实用', tags: ['勾选', '实用', '确认'], viewBox: '0 0 30 30',
    svg: `<circle cx="15" cy="15" r="12" fill="none" stroke="#27ae60" stroke-width="2"/><path d="M9 15 L13 19 L21 11" fill="none" stroke="#27ae60" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` },
  { id: 'x-circle', name: '叉号圆', category: '实用', tags: ['叉号', '实用', '取消'], viewBox: '0 0 30 30',
    svg: `<circle cx="15" cy="15" r="12" fill="none" stroke="#e74c3c" stroke-width="2"/><line x1="9" y1="9" x2="21" y2="21" stroke="#e74c3c" stroke-width="2" stroke-linecap="round"/><line x1="21" y1="9" x2="9" y2="21" stroke="#e74c3c" stroke-width="2" stroke-linecap="round"/>` },
  { id: 'info-circle', name: '信息圆', category: '实用', tags: ['信息', '实用', '提示'], viewBox: '0 0 30 30',
    svg: `<circle cx="15" cy="15" r="12" fill="none" stroke="#3498db" stroke-width="2"/><line x1="15" y1="9" x2="15" y2="10" stroke="#3498db" stroke-width="2" stroke-linecap="round"/><line x1="15" y1="14" x2="15" y2="22" stroke="#3498db" stroke-width="2" stroke-linecap="round"/>` },
  { id: 'camera', name: '相机', category: '实用', tags: ['相机', '实用', '拍照'], viewBox: '0 0 40 30',
    svg: `<rect x="5" y="8" width="30" height="18" rx="3" fill="none" stroke="#333" stroke-width="2"/><circle cx="20" cy="17" r="5" fill="none" stroke="#333" stroke-width="2"/><path d="M13 8 L10 4 L15 4 L13 8" fill="none" stroke="#333" stroke-width="1.5"/>` },
  { id: 'palette', name: '调色盘', category: '实用', tags: ['调色盘', '实用', '艺术'], viewBox: '0 0 40 35',
    svg: `<ellipse cx="20" cy="18" rx="18" ry="15" fill="none" stroke="#333" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="#e74c3c"/><circle cx="22" cy="8" r="3" fill="#3498db"/><circle cx="30" cy="14" r="3" fill="#f39c12"/><circle cx="28" cy="24" r="3" fill="#27ae60"/><circle cx="14" cy="22" r="3" fill="#9b59b6"/>` },
  { id: 'clock', name: '时钟', category: '实用', tags: ['时钟', '实用', '时间'], viewBox: '0 0 30 30',
    svg: `<circle cx="15" cy="15" r="12" fill="none" stroke="#333" stroke-width="2"/><line x1="15" y1="15" x2="15" y2="8" stroke="#333" stroke-width="2" stroke-linecap="round"/><line x1="15" y1="15" x2="20" y2="15" stroke="#333" stroke-width="2" stroke-linecap="round"/>` },
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