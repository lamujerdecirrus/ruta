"use client"

import { useEffect, useRef } from "react"

interface MapRouteViewProps {
  routeLabel: string
  mapType: "route" | "exit"
  onClose: () => void
}

export function MapRouteView({ routeLabel, mapType, onClose }: MapRouteViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = canvas.offsetHeight * dpr
    ctx.scale(dpr, dpr)
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    // Background
    ctx.fillStyle = "#0f1923"
    ctx.fillRect(0, 0, w, h)

    // Draw grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)"
    ctx.lineWidth = 1
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    // Draw yard zones
    const zones = mapType === "exit"
      ? [
          { x: 30, y: 60, w: 100, h: 70, label: "Zona A", color: "rgba(20,184,166,0.15)", border: "rgba(20,184,166,0.4)" },
          { x: 150, y: 60, w: 100, h: 70, label: "Zona B", color: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.4)" },
          { x: 30, y: 160, w: 100, h: 70, label: "Zona C", color: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)" },
          { x: 150, y: 160, w: 100, h: 70, label: "Zona D", color: "rgba(244,63,94,0.15)", border: "rgba(244,63,94,0.4)" },
        ]
      : [
          { x: 20, y: 50, w: 90, h: 60, label: "Zona A", color: "rgba(20,184,166,0.15)", border: "rgba(20,184,166,0.4)" },
          { x: 130, y: 50, w: 90, h: 60, label: "Zona B", color: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.4)" },
          { x: 20, y: 140, w: 90, h: 60, label: "Zona C", color: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)" },
          { x: 130, y: 140, w: 90, h: 60, label: "Zona D", color: "rgba(244,63,94,0.15)", border: "rgba(244,63,94,0.4)" },
          { x: 240, y: 80, w: 50, h: 120, label: "Muelle", color: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.4)" },
        ]

    zones.forEach((zone) => {
      ctx.fillStyle = zone.color
      ctx.strokeStyle = zone.border
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(zone.x, zone.y, zone.w, zone.h, 6)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = zone.border
      ctx.font = "bold 10px Inter, system-ui, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(zone.label, zone.x + zone.w / 2, zone.y + zone.h / 2 + 3)
    })

    // Draw container rows (small rectangles inside zones)
    zones.forEach((zone) => {
      ctx.fillStyle = "rgba(255,255,255,0.08)"
      const rows = 3
      const cols = 4
      const rw = (zone.w - 20) / cols
      const rh = (zone.h - 25) / rows
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.fillRect(
            zone.x + 8 + c * rw + 1,
            zone.y + 18 + r * rh + 1,
            rw - 2,
            rh - 2
          )
        }
      }
    })

    // Draw roads
    ctx.strokeStyle = "rgba(255,255,255,0.12)"
    ctx.lineWidth = 12
    ctx.setLineDash([])

    // Horizontal road
    ctx.beginPath()
    ctx.moveTo(0, h - 50)
    ctx.lineTo(w, h - 50)
    ctx.stroke()

    // Vertical road
    ctx.beginPath()
    ctx.moveTo(w / 2 - 10, h - 50)
    ctx.lineTo(w / 2 - 10, 30)
    ctx.stroke()

    // Road markings
    ctx.strokeStyle = "rgba(255,200,0,0.3)"
    ctx.lineWidth = 1
    ctx.setLineDash([8, 8])
    ctx.beginPath()
    ctx.moveTo(0, h - 50)
    ctx.lineTo(w, h - 50)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(w / 2 - 10, h - 50)
    ctx.lineTo(w / 2 - 10, 30)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw route path (animated feel)
    const routeColor = mapType === "exit" ? "#f59e0b" : "#00a884"
    ctx.strokeStyle = routeColor
    ctx.lineWidth = 3
    ctx.setLineDash([6, 4])
    ctx.shadowColor = routeColor
    ctx.shadowBlur = 8

    if (mapType === "exit") {
      // Route from center to exit (right side)
      ctx.beginPath()
      ctx.moveTo(w / 2 - 10, 170)
      ctx.lineTo(w / 2 - 10, h - 50)
      ctx.lineTo(w - 10, h - 50)
      ctx.stroke()

      // Exit arrow
      ctx.fillStyle = routeColor
      ctx.beginPath()
      ctx.moveTo(w - 5, h - 50)
      ctx.lineTo(w - 15, h - 45)
      ctx.lineTo(w - 15, h - 55)
      ctx.closePath()
      ctx.fill()

      // Exit label
      ctx.shadowBlur = 0
      ctx.fillStyle = "#f59e0b"
      ctx.font = "bold 11px Inter, system-ui, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("SALIDA", w - 30, h - 60)
    } else {
      // Route from entry to destination zone
      ctx.beginPath()
      ctx.moveTo(10, h - 50)
      ctx.lineTo(w / 2 - 10, h - 50)
      ctx.lineTo(w / 2 - 10, 130)
      ctx.lineTo(165, 130)
      ctx.stroke()

      // Destination marker
      ctx.shadowBlur = 0
      ctx.fillStyle = routeColor
      ctx.beginPath()
      ctx.arc(165, 130, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#0f1923"
      ctx.beginPath()
      ctx.arc(165, 130, 4, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.shadowBlur = 0
    ctx.setLineDash([])

    // Draw entry point (truck icon area)
    ctx.fillStyle = mapType === "exit" ? "rgba(245,158,11,0.2)" : "rgba(0,168,132,0.2)"
    ctx.beginPath()
    if (mapType === "exit") {
      ctx.arc(w / 2 - 10, 170, 10, 0, Math.PI * 2)
    } else {
      ctx.arc(10, h - 50, 10, 0, Math.PI * 2)
    }
    ctx.fill()

    // Truck indicator
    ctx.fillStyle = mapType === "exit" ? "#f59e0b" : "#00a884"
    ctx.beginPath()
    if (mapType === "exit") {
      ctx.arc(w / 2 - 10, 170, 5, 0, Math.PI * 2)
    } else {
      ctx.arc(10, h - 50, 5, 0, Math.PI * 2)
    }
    ctx.fill()

    // Labels
    ctx.fillStyle = "rgba(255,255,255,0.5)"
    ctx.font = "9px Inter, system-ui, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("Entrada K2", 5, h - 25)
    ctx.textAlign = "right"
    ctx.fillText("Salida", w - 5, h - 25)

  }, [mapType, routeLabel])

  return (
    <div className="flex h-full flex-col bg-[#0f1923]">
      {/* Map header */}
      <div className="flex items-center gap-3 bg-[#1a2a3a] px-4 py-3">
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <p className="text-xs font-semibold text-white/90">{routeLabel}</p>
          <p className="text-[10px] text-white/50">
            {mapType === "exit" ? "Ruta de salida" : "Ruta asignada"}
          </p>
        </div>
        <div className="flex h-7 items-center rounded-full bg-[#00a884]/20 px-3">
          <span className="text-[10px] font-medium text-[#00a884]">EN VIVO</span>
        </div>
      </div>

      {/* Map canvas */}
      <div className="relative flex-1">
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{ display: "block" }}
        />

        {/* Floating route info */}
        <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-[#1a2a3a]/95 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${mapType === "exit" ? "bg-amber-500/20" : "bg-[#00a884]/20"}`}>
              <svg viewBox="0 0 24 24" fill="none" className={`h-5 w-5 ${mapType === "exit" ? "text-amber-400" : "text-[#00a884]"}`} stroke="currentColor" strokeWidth="1.5">
                {mapType === "exit" ? (
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                ) : (
                  <>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </>
                )}
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-white/90">{routeLabel}</p>
              <p className="text-[10px] text-white/50">
                {mapType === "exit" ? "Siga la ruta amarilla hacia la salida" : "Siga la ruta verde hacia su destino"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action */}
      <div className="bg-[#1a2a3a] p-3">
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-[#00a884] py-3 text-sm font-semibold text-[#0f1923] transition-colors hover:bg-[#00c09a] active:bg-[#009973]"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
