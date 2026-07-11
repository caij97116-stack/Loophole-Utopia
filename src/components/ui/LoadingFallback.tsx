export default function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full" />
        <span className="text-sm text-text-muted">3D 引擎初始化中...</span>
      </div>
    </div>
  )
}