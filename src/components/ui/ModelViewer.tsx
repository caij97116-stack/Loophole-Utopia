/**
 * Google <model-viewer> React 封装
 * 生产级 PBR 渲染：HDR 环境光 + 实时反射 + 色调映射 + 阴影
 * https://modelviewer.dev/
 */
import { useEffect, useRef, useState, createElement } from 'react'

interface ModelViewerProps {
  src: string
  alt?: string
  autoRotate?: boolean
  autoRotateDelay?: number
  exposure?: number
  shadowIntensity?: number
  shadowSoftness?: number
  toneMapping?: 'aces' | 'commerce' | 'neutral'
  className?: string
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: (error: string) => void
}

export default function ModelViewer({
  src,
  alt = '3D 模型',
  autoRotate = true,
  autoRotateDelay = 2000,
  exposure = 1.1,
  shadowIntensity = 0.6,
  shadowSoftness = 0.9,
  toneMapping = 'aces',
  className = '',
  style,
  onLoad,
  onError,
}: ModelViewerProps) {
  const viewerRef = useRef<HTMLElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const handleLoad = () => {
      setLoaded(true)
      onLoad?.()
    }

    const handleError = (e: Event) => {
      const detail = (e as CustomEvent)?.detail
      onError?.(detail?.message || '模型加载失败')
    }

    viewer.addEventListener('load', handleLoad)
    viewer.addEventListener('error', handleError)

    return () => {
      viewer.removeEventListener('load', handleLoad)
      viewer.removeEventListener('error', handleError)
    }
  }, [onLoad, onError])

  return (
    <div className={`relative ${className}`} style={style}>
      {createElement('model-viewer' as any, {
        ref: viewerRef,
        src,
        alt,
        'camera-controls': '',
        'auto-rotate': autoRotate ? '' : undefined,
        'auto-rotate-delay': autoRotateDelay,
        'rotation-per-second': '30deg',
        'interaction-prompt': 'auto',
        exposure: String(exposure),
        'shadow-intensity': String(shadowIntensity),
        'shadow-softness': String(shadowSoftness),
        'tone-mapping': toneMapping,
        'environment-image': 'neutral',
        shadow: 'true',
        'ar-status': 'not-presenting',
        style: {
          width: '100%',
          height: '100%',
          minHeight: '500px',
          backgroundColor: 'transparent',
        },
      })}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-card/50 pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full" />
            <span className="text-sm text-text-muted">3D 模型加载中...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export { ModelViewer }