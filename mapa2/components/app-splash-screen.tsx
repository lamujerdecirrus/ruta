"use client"

import { useEffect } from "react"

interface AppSplashScreenProps {
  onFinish: () => void
}

export function AppSplashScreen({ onFinish }: AppSplashScreenProps) {
  useEffect(() => {
    const t = setTimeout(onFinish, 2000)
    return () => clearTimeout(t)
  }, [onFinish])

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#0c1520]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-3xl border border-blue-500/30 bg-blue-500/10">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-11 w-11 text-blue-400"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M12 3L2 8l10 5 10-5-10-5z" />
            <path d="M2 16l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white/90">Hutchison Ports</h1>
          <p className="text-xs text-blue-400/80">LCT - Sistema de Rutas</p>
        </div>
      </div>
      <div className="absolute bottom-16">
        <div className="h-1 w-24 overflow-hidden rounded-full bg-white/10">
          <div className="h-full animate-[loading_2s_ease-in-out] rounded-full bg-blue-500" />
        </div>
      </div>
    </div>
  )
}
