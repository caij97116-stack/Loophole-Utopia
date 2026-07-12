/**
 * 程序化生成 GLB 3D 模型（Node.js + jsdom）
 * 输出到 public/models/
 */
import { JSDOM } from 'jsdom'
import * as fs from 'fs'
import * as path from 'path'

// 设置 jsdom 全局环境
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost' })
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.FileReader = dom.window.FileReader
globalThis.Blob = dom.window.Blob
globalThis.URL = dom.window.URL
globalThis.HTMLAnchorElement = dom.window.HTMLAnchorElement
// navigator is a getter-only in Node 24, skip it

// 导入 Three.js
import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

const outDir = path.join(import.meta.dirname, '..', 'public', 'models')
fs.mkdirSync(outDir, { recursive: true })

function exportGLB(scene, filename) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter()
    exporter.parse(scene, (glb) => {
      const filePath = path.join(outDir, filename)
      fs.writeFileSync(filePath, Buffer.from(glb))
      console.log(`✅ ${filename} (${(glb.byteLength / 1024).toFixed(1)} KB)`)
      resolve()
    }, (err) => { console.error(`❌ ${filename}:`, err); reject(err) }, { binary: true })
  })
}

// 1. Book
async function genBook() {
  const scene = new THREE.Scene()
  const scale = 0.018
  const bookW = 148, bookH = 210, spineW = 8
  const hw = bookW * scale / 2, hh = bookH * scale / 2, sw = spineW * scale / 2
  const ct = 0.06, pd = 0.12, overhang = 0.05
  const coverW = bookW * scale + overhang, coverH = bookH * scale + overhang

  const frontMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.02, color: '#2c3e80', name: 'frontCover' })
  const backMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.02, color: '#1a2744', name: 'backCover' })
  const spineMat = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.05, color: '#1e2d50', name: 'spine' })
  const paperMat = new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0, color: '#fef3c7', name: 'paper' })
  const edgeMat = new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0, color: '#f5f5f0', name: 'edge' })

  const group = new THREE.Group()
  group.add(new THREE.Mesh(new THREE.BoxGeometry(coverW, coverH, ct), backMat)).position.set(-sw - hw, 0, 0)
  const pageW = bookW * scale - 0.04, pageH = bookH * scale - 0.08
  group.add(new THREE.Mesh(new THREE.BoxGeometry(pageW, pageH, pd), paperMat)).position.set(-sw, 0, ct / 2 + pd / 2)
  group.add(new THREE.Mesh(new THREE.BoxGeometry(0.01, pageH, pd), edgeMat)).position.set(hw - sw - 0.02, 0, ct / 2 + pd / 2)
  group.add(new THREE.Mesh(new THREE.BoxGeometry(pageW, 0.01, pd), edgeMat)).position.set(-sw, hh - 0.04, ct / 2 + pd / 2)
  group.add(new THREE.Mesh(new THREE.BoxGeometry(pageW, 0.01, pd), edgeMat)).position.set(-sw, -hh + 0.04, ct / 2 + pd / 2)
  const rpg = new THREE.Group(); rpg.position.set(sw + 0.01, 0, ct / 2 + pd / 2)
  rpg.add(new THREE.Mesh(new THREE.BoxGeometry(pageW, pageH, pd), paperMat))
  rpg.add(new THREE.Mesh(new THREE.BoxGeometry(0.01, pageH, pd), edgeMat)).position.set(hw - 0.02, 0, 0)
  group.add(rpg)
  const fg = new THREE.Group(); fg.position.set(sw + hw, 0, 0)
  fg.add(new THREE.Mesh(new THREE.BoxGeometry(coverW, coverH, ct), frontMat))
  group.add(fg)
  group.add(new THREE.Mesh(new THREE.BoxGeometry(sw * 2, coverH, ct + pd), spineMat)).position.set(0, 0, pd / 2)
  const ribbonMat = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0, color: '#e74c3c', name: 'ribbon' })
  group.add(new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.5, 0.003), ribbonMat)).position.set(0, -hh + 0.35, ct / 2 + pd + 0.005)
  group.add(new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.25, 0.003), ribbonMat)).position.set(0, -hh - 0.05, ct / 2 + pd + 0.005)
  scene.add(group)
  await exportGLB(scene, 'book.glb')
}

// 2. Badge
async function genBadge() {
  const scene = new THREE.Scene()
  const s = 1.2
  const designMat = new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.4, color: '#f8c8dc', name: 'design' })
  const metalMat = new THREE.MeshStandardMaterial({ roughness: 0.12, metalness: 0.95, color: '#d4d4d4', name: 'metal' })
  const group = new THREE.Group()
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(s * 1.06, s * 1.06, 0.07, 64), metalMat)).position.y = -0.04
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(s * 0.98, s, 0.06, 64), designMat)).position.y = 0.025
  const rim = new THREE.Mesh(new THREE.TorusGeometry(s * 1.03, 0.025, 16, 64), metalMat)
  rim.rotation.x = Math.PI / 2; rim.position.y = 0.055; group.add(rim)
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8), new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.8, color: '#888', name: 'pin' }))
  pin.rotation.x = Math.PI / 2; pin.position.set(0, -0.1, -0.2); group.add(pin)
  scene.add(group)
  await exportGLB(scene, 'badge.glb')
}

// 3. Acrylic
async function genAcrylic() {
  const scene = new THREE.Scene()
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.02, metalness: 0.02, color: '#ffffff', transparent: true, opacity: 0.85, name: 'acrylic' })
  scene.add(new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.28, 64), mat))
  await exportGLB(scene, 'acrylic.glb')
}

// 4. Sticker
async function genSticker() {
  const scene = new THREE.Scene()
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0, color: '#8ecae6', name: 'sticker' })
  scene.add(new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.03, 64), mat))
  await exportGLB(scene, 'sticker.glb')
}

// 5. Rubber
async function genRubber() {
  const scene = new THREE.Scene()
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.65, metalness: 0, color: '#a0a0a0', name: 'rubber' })
  const group = new THREE.Group()
  group.add(new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.2, 64), mat))
  const hole = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.03, 8, 16), new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0, color: '#d4cfc8', name: 'hole' }))
  hole.position.set(0, -0.03, 0.85); hole.rotation.x = Math.PI / 2; group.add(hole)
  scene.add(group)
  await exportGLB(scene, 'rubber.glb')
}

async function main() {
  console.log('Generating GLB models...')
  await genBook()
  await genBadge()
  await genAcrylic()
  await genSticker()
  await genRubber()
  console.log('Done! Files in', outDir)
}
main().catch(console.error)