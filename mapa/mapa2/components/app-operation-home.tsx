"use client"

import { AppFlowType } from "@/lib/app-flow-data"
import { ArrowDownToLine, ArrowUpFromLine, PackageMinus, PackagePlus, User, LogOut } from "lucide-react"

const operationConfig: Record<
  AppFlowType,
  { label: string; desc: string; icon: React.ReactNode; color: string; borderColor: string; bgColor: string }
> = {
  deposito: {
    label: "Deposito de Vacios",
    desc: "Ir a zona de inspeccion",
    icon: <ArrowDownToLine className="h-5 w-5" />,
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bgColor: "bg-teal-500/10",
  },
  importacion: {
    label: "Importacion de Llenos",
    desc: "Esperar en buffer",
    icon: <PackagePlus className="h-5 w-5" />,
    color: "text-blue-400",
    borderColor: "border-blue-500/30",
    bgColor: "bg-blue-500/10",
  },
  retiro: {
    label: "Retiro de Vacio",
    desc: "Ir a zona de retiro",
    icon: <PackageMinus className="h-5 w-5" />,
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/10",
  },
  exportacion: {
    label: "Exportacion de Llenos",
    desc: "Esperar en buffer",
    icon: <ArrowUpFromLine className="h-5 w-5" />,
    color: "text-rose-400",
    borderColor: "border-rose-500/30",
    bgColor: "bg-rose-500/10",
  },
}

interface AppOperationHomeProps {
  operatorName: string
  operationType: AppFlowType
  onStart: () => void
  onLogout: () => void
}

export function AppOperationHome({ operatorName, operationType, onStart, onLogout }: AppOperationHomeProps) {
  const config = operationConfig[operationType]

  return (
    <div className="flex h-full flex-col bg-[#0c1520]">
      {/* App header */}
      <div className="bg-[#0f1d2e] px-4 py-3 pt-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20">
              <User className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-white/40">Bienvenido</p>
              <p className="text-sm font-semibold text-white/90">{operatorName}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/40 transition-colors hover:bg-white/10 hover:text-white/60"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Welcome message */}
      <div className="px-5 py-6">
        <h2 className="text-lg font-bold text-white/90">
          Hola, {operatorName}
        </h2>
        <p className="mt-1 text-xs text-white/40">
          Tu operacion ha sido identificada automaticamente.
        </p>
      </div>

      {/* Assigned operation */}
      <div className="flex-1 px-5">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-white/30">
          Operacion asignada
        </p>
        <div className={`rounded-2xl border ${config.borderColor} ${config.bgColor} p-5`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${config.borderColor} bg-[#0c1520]/50 ${config.color}`}>
              {config.icon}
            </div>
            <div>
              <h3 className={`text-sm font-semibold ${config.color}`}>{config.label}</h3>
              <p className="mt-0.5 text-xs text-white/40">{config.desc}</p>
            </div>
          </div>

          <button
            onClick={onStart}
            className="mt-5 w-full rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-400 active:scale-[0.98]"
          >
            Iniciar Ruta
          </button>
        </div>

        {/* Info note */}
        <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <p className="text-[11px] leading-relaxed text-white/30">
            El sistema ha determinado tu tipo de operacion con base en tu registro. Al presionar &quot;Iniciar Ruta&quot; se mostrara la ruta correspondiente en el mapa.
          </p>
        </div>
      </div>

      {/* Bottom nav (decorative) */}
      <div className="flex items-center justify-around border-t border-white/5 bg-[#0f1d2e] px-4 py-3">
        <div className="flex flex-col items-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-blue-400" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          </svg>
          <span className="text-[9px] text-blue-400">Inicio</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white/30" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <span className="text-[9px] text-white/30">Rutas</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <User className="h-5 w-5 text-white/30" />
          <span className="text-[9px] text-white/30">Perfil</span>
        </div>
      </div>
    </div>
  )
}
