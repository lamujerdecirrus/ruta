"use client"

import { useEffect, useRef } from "react"

interface MapRouteViewProps {
  routeLabel: string
  mapType: "route" | "exit" | "buffer" | "inspection"
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
    ctx.fillStyle = "#0a1628"
    ctx.fillRect(0, 0, w, h)

    // Scale factors
    const scale = Math.min(w / 340, h / 480)
    const offsetX = (w - 340 * scale) / 2
    const offsetY = (h - 480 * scale) / 2

    const sx = (x: number) => offsetX + x * scale
    const sy = (y: number) => offsetY + y * scale
    const sw = (v: number) => v * scale

    // ===================
    // YARD LAYOUT
    // ===================

    // Main horizontal road (top)
    ctx.fillStyle = "#2a3a4a"
    ctx.fillRect(sx(0), sy(370), sw(340), sw(28))

    // Road markings (center line)
    ctx.strokeStyle = "#fbbf24"
    ctx.lineWidth = sw(1.5)
    ctx.setLineDash([sw(6), sw(4)])
    ctx.beginPath()
    ctx.moveTo(sx(0), sy(384))
    ctx.lineTo(sx(340), sy(384))
    ctx.stroke()
    ctx.setLineDash([])

    // Vertical roads
    ctx.fillStyle = "#2a3a4a"
    // Left vertical road
    ctx.fillRect(sx(65), sy(30), sw(20), sw(340))
    // Center vertical road  
    ctx.fillRect(sx(160), sy(30), sw(20), sw(340))
    // Right vertical road
    ctx.fillRect(sx(255), sy(30), sw(20), sw(340))

    // ===================
    // CONTAINER BLOCKS
    // ===================

    // Column C (left side - 1C to 16C)
    const blockColors = {
      yellow: "#ca8a04",
      green: "#15803d", 
      orange: "#ea580c",
      blue: "#0284c7",
    }

    // Block dimensions
    const blockW = sw(55)
    const blockH = sw(16)
    const blockGap = sw(4)

    // Column C blocks (x: 5-60)
    const colCX = sx(5)
    const drawBlock = (x: number, y: number, width: number, label: string, color: string) => {
      ctx.fillStyle = color
      ctx.fillRect(x, y, width, blockH)
      ctx.fillStyle = "rgba(255,255,255,0.8)"
      ctx.font = `bold ${sw(8)}px Inter, system-ui, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(label, x + width / 2, y + blockH / 2)
    }

    // 1C-2C (yellow)
    drawBlock(colCX, sy(35), blockW, "1C", blockColors.yellow)
    drawBlock(colCX, sy(35) + blockH + blockGap, blockW, "2C", blockColors.yellow)

    // 3C-8C (green)
    for (let i = 3; i <= 8; i++) {
      drawBlock(colCX, sy(35) + (i - 1) * (blockH + blockGap), blockW, `${i}C`, blockColors.green)
    }

    // 9C-12C (orange)
    for (let i = 9; i <= 12; i++) {
      drawBlock(colCX, sy(35) + (i - 1) * (blockH + blockGap), blockW, `${i}C`, blockColors.orange)
    }

    // BUFFER - Carril de Espera (between 13C-14C)
    const bufferY = sy(35) + 12 * (blockH + blockGap)
    ctx.fillStyle = "#22c55e"
    ctx.fillRect(colCX, bufferY, blockW, sw(12))
    ctx.fillStyle = "#0a1628"
    ctx.font = `bold ${sw(6)}px Inter, system-ui, sans-serif`
    ctx.textAlign = "center"
    ctx.fillText("BUFFER", colCX + blockW / 2, bufferY + sw(7))

    // 13C-16C (orange) - after buffer
    const afterBufferOffset = sw(12) + blockGap
    for (let i = 13; i <= 16; i++) {
      const yPos = bufferY + afterBufferOffset + (i - 13) * (blockH + blockGap)
      drawBlock(colCX, yPos, blockW, `${i}C`, blockColors.orange)
    }

    // Column B blocks (x: 90-145)
    const colBX = sx(90)
    
    // 1B-8B (blue)
    for (let i = 1; i <= 8; i++) {
      drawBlock(colBX, sy(35) + (i - 1) * (blockH + blockGap), blockW, `${i}B`, blockColors.blue)
    }

    // REEFERS / WC / ESTACIONAMIENTO area (9B-10B)
    ctx.fillStyle = "#6366f1"
    ctx.fillRect(colBX, sy(35) + 8 * (blockH + blockGap), blockW, blockH)
    ctx.fillStyle = "rgba(255,255,255,0.8)"
    ctx.font = `bold ${sw(6)}px Inter, system-ui, sans-serif`
    ctx.fillText("REEFERS 9B", colBX + blockW / 2, sy(35) + 8 * (blockH + blockGap) + blockH / 2)

    ctx.fillStyle = "#64748b"
    ctx.fillRect(colBX, sy(35) + 9 * (blockH + blockGap), blockW, blockH)
    ctx.fillStyle = "rgba(255,255,255,0.8)"
    ctx.fillText("ESTAC. 10B", colBX + blockW / 2, sy(35) + 9 * (blockH + blockGap) + blockH / 2)

    // 11B-12B (blue)
    for (let i = 11; i <= 12; i++) {
      drawBlock(colBX, sy(35) + (i - 1) * (blockH + blockGap), blockW, `${i}B`, blockColors.blue)
    }

    // BUFFER B (between 13B-14B)
    ctx.fillStyle = "#22c55e"
    ctx.fillRect(colBX, bufferY, blockW, sw(12))
    ctx.fillStyle = "#0a1628"
    ctx.font = `bold ${sw(6)}px Inter, system-ui, sans-serif`
    ctx.fillText("BUFFER", colBX + blockW / 2, bufferY + sw(7))

    // 13B-16B (blue) - after buffer
    for (let i = 13; i <= 16; i++) {
      const yPos = bufferY + afterBufferOffset + (i - 13) * (blockH + blockGap)
      drawBlock(colBX, yPos, blockW, `${i}B`, blockColors.blue)
    }

    // Column A blocks (x: 185-240)
    const colAX = sx(185)

    // 1A-8A (orange)
    for (let i = 1; i <= 8; i++) {
      drawBlock(colAX, sy(35) + (i - 1) * (blockH + blockGap), blockW, `${i}A`, blockColors.orange)
    }

    // REEFERS 9A
    ctx.fillStyle = "#6366f1"
    ctx.fillRect(colAX, sy(35) + 8 * (blockH + blockGap), blockW, blockH)
    ctx.fillStyle = "rgba(255,255,255,0.8)"
    ctx.font = `bold ${sw(6)}px Inter, system-ui, sans-serif`
    ctx.fillText("REEFERS 9A", colAX + blockW / 2, sy(35) + 8 * (blockH + blockGap) + blockH / 2)

    // 10A-14A (orange)
    for (let i = 10; i <= 14; i++) {
      drawBlock(colAX, sy(35) + (i - 1) * (blockH + blockGap), blockW, `${i}A`, blockColors.orange)
    }

    // Column F blocks (far right - 1F-5F)
    const colFX = sx(280)
    const smallBlockW = sw(25)

    for (let i = 1; i <= 5; i++) {
      ctx.fillStyle = "#0284c7"
      ctx.fillRect(colFX, sy(150) + (i - 1) * (blockH + blockGap), smallBlockW, blockH)
      ctx.fillStyle = "rgba(255,255,255,0.8)"
      ctx.font = `bold ${sw(7)}px Inter, system-ui, sans-serif`
      ctx.textAlign = "center"
      ctx.fillText(`${i}F`, colFX + smallBlockW / 2, sy(150) + (i - 1) * (blockH + blockGap) + blockH / 2)
    }

    // ===================
    // MUELLE (DOCK) - Top
    // ===================
    ctx.fillStyle = "#374151"
    ctx.fillRect(sx(30), sy(5), sw(200), sw(22))
    ctx.fillStyle = "#9ca3af"
    ctx.font = `bold ${sw(10)}px Inter, system-ui, sans-serif`
    ctx.textAlign = "center"
    ctx.fillText("MUELLE", sx(130), sy(18))

    // ===================
    // LOWER ZONE - Buildings
    // ===================

    // CFO area (left)
    ctx.fillStyle = "#78350f"
    ctx.fillRect(sx(20), sy(420), sw(70), sw(35))
    ctx.fillStyle = "rgba(255,255,255,0.7)"
    ctx.font = `bold ${sw(9)}px Inter, system-ui, sans-serif`
    ctx.fillText("CFO", sx(55), sy(440))

    // CCA area
    ctx.fillStyle = "#854d0e"
    ctx.fillRect(sx(95), sy(410), sw(40), sw(20))
    ctx.fillStyle = "rgba(255,255,255,0.7)"
    ctx.font = `bold ${sw(7)}px Inter, system-ui, sans-serif`
    ctx.fillText("CCA", sx(115), sy(422))

    // INSPECCION DE VACIOS (blue zone)
    ctx.fillStyle = "#1d4ed8"
    ctx.fillRect(sx(140), sy(410), sw(80), sw(25))
    ctx.fillStyle = "rgba(255,255,255,0.9)"
    ctx.font = `bold ${sw(6)}px Inter, system-ui, sans-serif`
    ctx.fillText("INSPECCION VACIOS", sx(180), sy(425))

    // CFA area (green)
    ctx.fillStyle = "#15803d"
    ctx.fillRect(sx(120), sy(438), sw(80), sw(30))
    ctx.fillStyle = "rgba(255,255,255,0.7)"
    ctx.font = `bold ${sw(9)}px Inter, system-ui, sans-serif`
    ctx.fillText("CFA", sx(160), sy(456))

    // CFS/CFR area (purple)
    ctx.fillStyle = "#7c3aed"
    ctx.fillRect(sx(210), sy(420), sw(50), sw(35))
    ctx.fillStyle = "rgba(255,255,255,0.7)"
    ctx.font = `bold ${sw(8)}px Inter, system-ui, sans-serif`
    ctx.fillText("CFS", sx(235), sy(435))
    ctx.fillText("CFR", sx(235), sy(450))

    // DIQUE (yellow)
    ctx.fillStyle = "#facc15"
    ctx.fillRect(sx(265), sy(410), sw(30), sw(15))
    ctx.fillStyle = "#0a1628"
    ctx.font = `bold ${sw(6)}px Inter, system-ui, sans-serif`
    ctx.fillText("DIQUE", sx(280), sy(420))

    // ===================
    // OCR Checkpoint
    // ===================
    ctx.fillStyle = "#22c55e"
    ctx.beginPath()
    ctx.arc(sx(170), sy(335), sw(12), 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#0a1628"
    ctx.font = `bold ${sw(6)}px Inter, system-ui, sans-serif`
    ctx.fillText("OCR", sx(170), sy(337))

    // ===================
    // ENTRY/EXIT MARKERS
    // ===================

    // ENTRADA (Entry) - right side
    ctx.fillStyle = "#ef4444"
    ctx.fillRect(sx(295), sy(340), sw(40), sw(18))
    ctx.fillStyle = "white"
    ctx.font = `bold ${sw(7)}px Inter, system-ui, sans-serif`
    ctx.fillText("ENTRADA", sx(315), sy(351))

    // SALIDA (Exit) - right side upper
    ctx.fillStyle = "#22c55e"
    ctx.fillRect(sx(295), sy(315), sw(40), sw(18))
    ctx.fillStyle = "white"
    ctx.fillText("SALIDA", sx(315), sy(326))

    // SALIDA 2 (Exit on left road)
    ctx.fillStyle = "#22c55e"
    ctx.fillRect(sx(55), sy(365), sw(35), sw(14))
    ctx.fillStyle = "white"
    ctx.font = `bold ${sw(6)}px Inter, system-ui, sans-serif`
    ctx.fillText("SALIDA", sx(72), sy(374))

    // ===================
    // "USTED ESTA AQUI" MARKER
    // ===================
    ctx.fillStyle = "#ef4444"
    ctx.beginPath()
    ctx.arc(sx(20), sy(360), sw(10), 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "white"
    ctx.font = `bold ${sw(5)}px Inter, system-ui, sans-serif`
    ctx.fillText("AQUI", sx(20), sy(362))

    // ===================
    // TRAFFIC ARROWS (red)
    // ===================
    ctx.strokeStyle = "#ef4444"
    ctx.fillStyle = "#ef4444"
    ctx.lineWidth = sw(2)

    const drawArrow = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath()
      ctx.moveTo(sx(x1), sy(y1))
      ctx.lineTo(sx(x2), sy(y2))
      ctx.stroke()

      // Arrow head
      const angle = Math.atan2(y2 - y1, x2 - x1)
      const headLen = sw(6)
      ctx.beginPath()
      ctx.moveTo(sx(x2), sy(y2))
      ctx.lineTo(
        sx(x2) - headLen * Math.cos(angle - Math.PI / 6),
        sy(y2) - headLen * Math.sin(angle - Math.PI / 6)
      )
      ctx.lineTo(
        sx(x2) - headLen * Math.cos(angle + Math.PI / 6),
        sy(y2) - headLen * Math.sin(angle + Math.PI / 6)
      )
      ctx.closePath()
      ctx.fill()
    }

    // Horizontal arrows on main road (left to right on bottom, right to left on top)
    drawArrow(30, 378, 60, 378)
    drawArrow(90, 378, 155, 378)
    drawArrow(185, 390, 250, 390)
    drawArrow(250, 390, 290, 390)

    // Vertical arrows going up
    drawArrow(75, 360, 75, 300)
    drawArrow(170, 360, 170, 300)
    drawArrow(265, 360, 265, 300)

    // ===================
    // ROUTE DRAWING
    // ===================
    ctx.setLineDash([sw(6), sw(4)])
    ctx.lineWidth = sw(3)
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    if (mapType === "buffer") {
      // Route to buffer (waiting lane)
      ctx.strokeStyle = "#22c55e"
      ctx.shadowColor = "#22c55e"
      ctx.shadowBlur = sw(8)

      ctx.beginPath()
      ctx.moveTo(sx(20), sy(360))
      ctx.lineTo(sx(75), sy(380))
      ctx.lineTo(sx(75), sy(280))
      ctx.lineTo(sx(40), sy(280))
      ctx.stroke()

      // Highlight buffer
      ctx.shadowBlur = 0
      ctx.setLineDash([])
      ctx.strokeStyle = "#22c55e"
      ctx.lineWidth = sw(3)
      ctx.strokeRect(colCX - sw(2), bufferY - sw(2), blockW + sw(4), sw(16))

      // Destination marker
      ctx.fillStyle = "#22c55e"
      ctx.beginPath()
      ctx.arc(sx(40), sy(280), sw(8), 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#0a1628"
      ctx.beginPath()
      ctx.arc(sx(40), sy(280), sw(4), 0, Math.PI * 2)
      ctx.fill()

    } else if (mapType === "inspection") {
      // Route to inspection zone
      ctx.strokeStyle = "#3b82f6"
      ctx.shadowColor = "#3b82f6"
      ctx.shadowBlur = sw(8)

      ctx.beginPath()
      ctx.moveTo(sx(20), sy(360))
      ctx.lineTo(sx(75), sy(380))
      ctx.lineTo(sx(170), sy(380))
      ctx.lineTo(sx(170), sy(420))
      ctx.stroke()

      // Highlight inspection zone
      ctx.shadowBlur = 0
      ctx.setLineDash([])
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = sw(3)
      ctx.strokeRect(sx(138), sy(408), sw(84), sw(29))

      // Destination marker
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.arc(sx(180), sy(420), sw(8), 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#0a1628"
      ctx.beginPath()
      ctx.arc(sx(180), sy(420), sw(4), 0, Math.PI * 2)
      ctx.fill()

    } else if (mapType === "exit") {
      // Route to exit
      ctx.strokeStyle = "#f59e0b"
      ctx.shadowColor = "#f59e0b"
      ctx.shadowBlur = sw(8)

      ctx.beginPath()
      ctx.moveTo(sx(170), sy(100))
      ctx.lineTo(sx(170), sy(320))
      ctx.lineTo(sx(295), sy(320))
      ctx.stroke()

      // Exit arrow highlight
      ctx.shadowBlur = 0
      ctx.setLineDash([])
      ctx.fillStyle = "#f59e0b"
      ctx.beginPath()
      ctx.moveTo(sx(310), sy(320))
      ctx.lineTo(sx(295), sy(310))
      ctx.lineTo(sx(295), sy(330))
      ctx.closePath()
      ctx.fill()

    } else {
      // Default route - to assigned container block (e.g., 5B)
      ctx.strokeStyle = "#00a884"
      ctx.shadowColor = "#00a884"
      ctx.shadowBlur = sw(8)

      ctx.beginPath()
      ctx.moveTo(sx(20), sy(360))
      ctx.lineTo(sx(75), sy(380))
      ctx.lineTo(sx(170), sy(380))
      ctx.lineTo(sx(170), sy(120))
      ctx.lineTo(sx(130), sy(120))
      ctx.stroke()

      // Highlight destination block (5B)
      ctx.shadowBlur = 0
      ctx.setLineDash([])
      ctx.strokeStyle = "#00a884"
      ctx.lineWidth = sw(3)
      ctx.strokeRect(colBX - sw(2), sy(35) + 4 * (blockH + blockGap) - sw(2), blockW + sw(4), blockH + sw(4))

      // Destination marker
      ctx.fillStyle = "#00a884"
      ctx.beginPath()
      ctx.arc(sx(130), sy(120), sw(8), 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#0a1628"
      ctx.beginPath()
      ctx.arc(sx(130), sy(120), sw(4), 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.shadowBlur = 0
    ctx.setLineDash([])

    // ===================
    // LEGEND
    // ===================
    const legendY = sy(470)
    ctx.fillStyle = "rgba(255,255,255,0.4)"
    ctx.font = `${sw(6)}px Inter, system-ui, sans-serif`
    ctx.textAlign = "left"

    // Buffer legend
    ctx.fillStyle = "#22c55e"
    ctx.fillRect(sx(10), legendY, sw(10), sw(6))
    ctx.fillStyle = "rgba(255,255,255,0.6)"
    ctx.fillText("Buffer", sx(22), legendY + sw(5))

    // Inspection legend
    ctx.fillStyle = "#1d4ed8"
    ctx.fillRect(sx(60), legendY, sw(10), sw(6))
    ctx.fillStyle = "rgba(255,255,255,0.6)"
    ctx.fillText("Inspeccion", sx(72), legendY + sw(5))

    // Route legend
    ctx.fillStyle = "#00a884"
    ctx.fillRect(sx(130), legendY, sw(10), sw(6))
    ctx.fillStyle = "rgba(255,255,255,0.6)"
    ctx.fillText("Ruta", sx(142), legendY + sw(5))

  }, [mapType, routeLabel])

  const getRouteColor = () => {
    switch (mapType) {
      case "buffer": return "#22c55e"
      case "inspection": return "#3b82f6"
      case "exit": return "#f59e0b"
      default: return "#00a884"
    }
  }

  const getRouteDescription = () => {
    switch (mapType) {
      case "buffer": return "Dirijase al carril de espera (Buffer)"
      case "inspection": return "Dirijase a la zona de inspeccion de vacios"
      case "exit": return "Siga la ruta amarilla hacia la salida"
      default: return "Siga la ruta verde hacia su destino asignado"
    }
  }

  return (
    <div className="flex h-full flex-col bg-[#0a1628]">
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
          <p className="text-[10px] text-white/50">Hutchison Ports LCT</p>
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
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${getRouteColor()}20` }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" style={{ color: getRouteColor() }} stroke="currentColor" strokeWidth="1.5">
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
              <p className="text-[10px] text-white/50">{getRouteDescription()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action */}
      <div className="bg-[#1a2a3a] p-3">
        <button
          onClick={onClose}
          className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 active:opacity-80"
          style={{ backgroundColor: getRouteColor() }}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
