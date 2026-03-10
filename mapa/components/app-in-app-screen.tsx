"use client"

import { OperationStep } from "@/lib/app-flow-data"
import { useEffect, useRef } from "react"
import { MapPin, Clock, Phone, Loader2, CheckCircle2 } from "lucide-react"

interface AppInAppScreenProps {
  step: OperationStep
  operatorName: string
  onViewMap: () => void
  onDecision: (nextStepId: string) => void
  isWaiting?: boolean
}

export function AppInAppScreen({ step, operatorName, onViewMap, onDecision, isWaiting }: AppInAppScreenProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [step])

  const renderContent = () => {
    switch (step.screen) {
      case "route-inspection":
        return (
          <div className="flex flex-col items-center gap-4 px-5 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/20">
              <MapPin className="h-8 w-8 text-teal-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white/90">{step.content}</p>
              <p className="mt-2 text-xs text-white/40">Se mostrara la ruta en el mapa</p>
            </div>
            <button
              onClick={onViewMap}
              className="mt-2 w-full rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-400 active:scale-[0.98]"
            >
              Ver Ruta en el Mapa
            </button>
          </div>
        )

      case "buffer-wait":
        return (
          <div className="flex flex-col items-center gap-4 px-5 py-8">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
              {isWaiting ? (
                <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
              ) : (
                <Clock className="h-8 w-8 text-amber-400" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white/90">Espera tu llamado interno</p>
              <p className="mt-2 text-xs text-white/40">
                Tu ubicacion en el buffer ha sido registrada. Se te notificara cuando sea tu turno.
              </p>
            </div>
            <button
              onClick={onViewMap}
              className="mt-2 w-full rounded-xl border border-amber-500/30 bg-amber-500/10 py-3 text-sm font-semibold text-amber-400 transition-all hover:bg-amber-500/20 active:scale-[0.98]"
            >
              Ver Buffer en el Mapa
            </button>
            {isWaiting && (
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                <p className="text-xs text-amber-400/70">Esperando llamado...</p>
              </div>
            )}
          </div>
        )

      case "internal-call":
        return (
          <div className="flex flex-col items-center gap-4 px-5 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
              <Phone className="h-8 w-8 text-emerald-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-emerald-400">Llamado interno recibido</p>
              <p className="mt-2 text-xs text-white/60">{step.content}</p>
            </div>
            <button
              onClick={onViewMap}
              className="mt-2 w-full rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-400 active:scale-[0.98]"
            >
              Ver Ruta en el Mapa
            </button>
          </div>
        )

      case "route-assignment":
        return (
          <div className="flex flex-col items-center gap-4 px-5 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
              <MapPin className="h-8 w-8 text-blue-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white/90">{step.content}</p>
              <p className="mt-2 text-xs text-white/40">Presiona para ver la ruta asignada.</p>
            </div>
            <button
              onClick={onViewMap}
              className="mt-2 w-full rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-400 active:scale-[0.98]"
            >
              Ver Ruta en el Mapa
            </button>
          </div>
        )

      case "route-map":
      case "route-map-main":
      case "route-map-exit":
        return (
          <div className="flex flex-col items-center gap-4 px-5 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
              <MapPin className="h-8 w-8 text-blue-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white/90">{step.content}</p>
              <p className="mt-2 text-xs text-white/40">{step.routeLabel || "Ver la ruta en el mapa"}</p>
            </div>
            <button
              onClick={onViewMap}
              className="mt-2 w-full rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-400 active:scale-[0.98]"
            >
              Ver Ruta en el Mapa
            </button>
          </div>
        )

      case "decision-another":
      case "decision-exit":
        return (
          <div className="flex flex-col items-center gap-4 px-5 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-white/50" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 3h5v5M4 20L20.586 3.414M21 16v5h-5M15 15l5.586 5.586M4 4l5 5" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-white/80">{step.content}</p>
            <div className="flex w-full flex-col gap-2">
              {step.options?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => onDecision(opt.nextStep)}
                  className="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 py-3 text-sm font-medium text-blue-400 transition-all hover:bg-blue-500/20 active:scale-[0.98]"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )

      case "flow-done":
        return (
          <div className="flex flex-col items-center gap-4 px-5 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-emerald-400">Flujo completado</p>
              <p className="mt-2 text-xs text-white/40">
                {operatorName}, te diriges a la salida del patio. Buen viaje.
              </p>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex flex-col items-center gap-4 px-5 py-8">
            <p className="text-sm text-white/60">{step.content}</p>
          </div>
        )
    }
  }

  return (
    <div className="flex h-full flex-col bg-[#0c1520]">
      {/* App header */}
      <div className="flex items-center gap-3 bg-[#0f1d2e] px-4 py-3 pt-10">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-blue-400" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3L2 8l10 5 10-5-10-5z" />
            <path d="M2 16l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-white/90">Sistema de Rutas</p>
          <p className="text-[10px] text-white/40">{operatorName}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center">
        {renderContent()}
      </div>

      <div ref={bottomRef} />
    </div>
  )
}
