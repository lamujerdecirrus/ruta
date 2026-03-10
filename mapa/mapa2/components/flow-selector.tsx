"use client"

import { FlowDefinition } from "@/lib/flow-data"
import { ArrowDownToLine, ArrowUpFromLine, PackageMinus, PackagePlus, ArrowLeft } from "lucide-react"

const iconMap: Record<string, React.ReactNode> = {
  "container-deposit": <ArrowDownToLine className="h-7 w-7" />,
  "container-import": <PackagePlus className="h-7 w-7" />,
  "container-withdrawal": <PackageMinus className="h-7 w-7" />,
  "container-export": <ArrowUpFromLine className="h-7 w-7" />,
}

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  teal: {
    bg: "bg-teal-500/10",
    border: "border-teal-500/30",
    text: "text-teal-400",
    glow: "shadow-teal-500/20",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    glow: "shadow-blue-500/20",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    glow: "shadow-amber-500/20",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
    glow: "shadow-rose-500/20",
  },
}

interface FlowSelectorProps {
  flows: FlowDefinition[]
  onSelect: (flowId: string) => void
  backHref?: string
}

export function FlowSelector({ flows, onSelect, backHref }: FlowSelectorProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7 text-primary"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 3L2 8l10 5 10-5-10-5z" />
              <path d="M2 16l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground">
          Hutchison Ports LCT
        </h1>
        <p className="mt-3 text-pretty text-lg text-muted-foreground">
          Sistema de Rutas - Prototipo Interactivo
        </p>
        <p className="mt-2 text-sm text-muted-foreground/70">
          Seleccione el tipo de operacion para simular el flujo completo
        </p>
        {backHref && (
          <a
            href={backHref}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary/70 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a prototipos
          </a>
        )}
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {flows.map((flow) => {
          const colors = colorMap[flow.color] || colorMap.teal
          return (
            <button
              key={flow.id}
              onClick={() => onSelect(flow.id)}
              className={`group relative flex flex-col items-start gap-4 rounded-2xl border ${colors.border} ${colors.bg} p-6 text-left transition-all duration-300 hover:shadow-lg hover:${colors.glow} hover:scale-[1.02] active:scale-[0.98]`}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl border ${colors.border} bg-background/50 ${colors.text}`}>
                {iconMap[flow.icon]}
              </div>
              <div>
                <h2 className={`text-lg font-semibold ${colors.text}`}>
                  {flow.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {flow.subtitle}
                </p>
              </div>
              <div className={`absolute right-4 top-4 ${colors.text} opacity-0 transition-opacity group-hover:opacity-100`}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          )
        })}
      </div>

      <p className="mt-10 max-w-md text-center text-xs leading-relaxed text-muted-foreground/60">
        Este prototipo simula el flujo de comunicacion via WhatsApp entre el sistema de Hutchison Ports LCT y el operador de camion en el patio de contenedores.
      </p>
    </div>
  )
}
