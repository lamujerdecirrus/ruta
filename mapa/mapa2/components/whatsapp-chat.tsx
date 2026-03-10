"use client"

import { FlowStep } from "@/lib/flow-data"
import { useEffect, useRef } from "react"

interface ChatMessage {
  id: string
  type: "status" | "message" | "link"
  content: string
  time: string
  sender?: "system" | "operator"
}

interface WhatsAppChatProps {
  messages: ChatMessage[]
  currentStep: FlowStep | null
  onLinkClick: () => void
  onDecision: (nextStep: string) => void
}

export function WhatsAppChat({
  messages,
  currentStep,
  onLinkClick,
  onDecision,
}: WhatsAppChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, currentStep])

  return (
    <div className="flex h-full flex-col gap-2 px-3 py-3">
      {/* Date badge */}
      <div className="mb-1 flex justify-center">
        <span className="rounded-lg bg-[#1a2a3a] px-3 py-1 text-[10px] text-white/50">
          Hoy
        </span>
      </div>

      {/* Messages */}
      {messages.map((msg) => {
        if (msg.type === "status") {
          return (
            <div key={msg.id} className="flex justify-center">
              <span className="rounded-lg bg-[#1a2a3a]/80 px-3 py-1.5 text-[10px] text-white/40">
                {msg.content}
              </span>
            </div>
          )
        }

        if (msg.type === "message" || msg.type === "link") {
          return (
            <div
              key={msg.id}
              className="flex justify-start"
            >
              <div className="relative max-w-[85%] rounded-xl rounded-tl-sm bg-[#1f2c34] px-3 pb-4 pt-2 shadow-sm">
                {/* System label */}
                <p className="mb-1 text-[10px] font-semibold text-[#00a884]">
                  Sistema LCT
                </p>
                {/* Message content */}
                <p className="whitespace-pre-line text-[12px] leading-relaxed text-white/90">
                  {msg.content}
                </p>

                {msg.type === "link" && (
                  <button
                    onClick={onLinkClick}
                    className="mt-2 flex w-full items-center gap-2 rounded-lg bg-[#00a884]/10 px-3 py-2 text-left transition-colors hover:bg-[#00a884]/20"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-[#00a884]" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                    <span className="text-[11px] font-medium text-[#00a884] underline">
                      Ver ruta en el mapa
                    </span>
                  </button>
                )}

                {/* Time */}
                <span className="absolute bottom-1 right-2 text-[9px] text-white/30">
                  {msg.time}
                </span>
              </div>
            </div>
          )
        }

        return null
      })}

      {/* Decision buttons */}
      {currentStep?.type === "decision" && (
        <div className="mt-1 flex flex-col gap-2 px-1">
          <div className="flex justify-center">
            <span className="rounded-lg bg-[#1a2a3a]/80 px-3 py-1.5 text-[10px] text-white/50">
              {currentStep.content}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {currentStep.options?.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => onDecision(opt.nextStep)}
                className="w-full rounded-xl border border-[#00a884]/30 bg-[#00a884]/10 px-4 py-2.5 text-[12px] font-medium text-[#00a884] transition-all hover:bg-[#00a884]/20 active:scale-[0.98]"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
