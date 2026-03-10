"use client"

import { ReactNode } from "react"

interface PhoneSimulatorProps {
  children: ReactNode
  time?: string
}

export function PhoneSimulator({ children, time = "10:32" }: PhoneSimulatorProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative mx-auto w-[340px]">
        {/* Phone frame */}
        <div className="relative overflow-hidden rounded-[3rem] border-[3px] border-[#2a2a3a] bg-[#1a1a2e] shadow-2xl shadow-black/50">
          {/* Notch */}
          <div className="absolute left-1/2 top-0 z-30 h-7 w-32 -translate-x-1/2 rounded-b-2xl bg-[#1a1a2e]" />

          {/* Status bar */}
          <div className="relative z-20 flex items-center justify-between bg-[#075e54] px-6 pb-1 pt-9">
            <span className="text-xs font-medium text-white/90">{time}</span>
            <div className="flex items-center gap-1">
              <div className="flex gap-[2px]">
                <div className="h-2 w-[3px] rounded-sm bg-white/80" />
                <div className="h-2.5 w-[3px] rounded-sm bg-white/80" />
                <div className="h-3 w-[3px] rounded-sm bg-white/80" />
                <div className="h-3.5 w-[3px] rounded-sm bg-white/60" />
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-1 h-3.5 w-3.5 text-white/80"
              >
                <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
              </svg>
            </div>
          </div>

          {/* WhatsApp header */}
          <div className="flex items-center gap-3 bg-[#075e54] px-4 pb-3">
            <button className="text-white/90">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#128c7e]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 text-white"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 3L2 8l10 5 10-5-10-5z" />
                <path d="M2 16l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">
                Hutchison Ports LCT
              </p>
              <p className="text-[11px] text-white/60">en linea</p>
            </div>
          </div>

          {/* Chat area */}
          <div className="h-[520px] overflow-y-auto bg-[#0b141a]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}>
            {children}
          </div>

          {/* Input bar */}
          <div className="flex items-center gap-2 bg-[#1a2530] px-3 py-2">
            <div className="flex flex-1 items-center rounded-full bg-[#2a3942] px-4 py-2">
              <span className="text-sm text-white/40">Mensaje</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00a884]">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 text-white"
              >
                <path d="M12 14.95c-2.9-2.73-5.2-5.1-5.2-7.15C6.8 5.08 8.95 3 12 3s5.2 2.08 5.2 4.8c0 2.05-2.3 4.42-5.2 7.15z" />
              </svg>
            </div>
          </div>

          {/* Home indicator */}
          <div className="flex justify-center bg-[#1a2530] pb-3 pt-1">
            <div className="h-1 w-28 rounded-full bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  )
}
