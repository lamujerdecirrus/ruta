"use client"

import { ReactNode } from "react"

interface AppPhoneSimulatorProps {
  children: ReactNode
}

export function AppPhoneSimulator({ children }: AppPhoneSimulatorProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative mx-auto w-[340px]">
        {/* Phone frame */}
        <div className="relative overflow-hidden rounded-[3rem] border-[3px] border-[#2a2a3a] bg-[#0c1520] shadow-2xl shadow-black/50">
          {/* Notch */}
          <div className="absolute left-1/2 top-0 z-30 h-7 w-32 -translate-x-1/2 rounded-b-2xl bg-[#0c1520]" />

          {/* App content area */}
          <div className="relative h-[680px] overflow-y-auto">
            {children}
          </div>

          {/* Home indicator */}
          <div className="flex justify-center bg-[#0c1520] pb-3 pt-1">
            <div className="h-1 w-28 rounded-full bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  )
}
