"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { FlowSelector } from "@/components/flow-selector"
import { PhoneSimulator } from "@/components/phone-simulator"
import { WhatsAppChat } from "@/components/whatsapp-chat"
import { MapRouteView } from "@/components/map-route-view"
import { FlowTimeline } from "@/components/flow-timeline"
import { flowDefinitions, FlowStep, FlowType, FlowDefinition } from "@/lib/flow-data"
import { ArrowLeft, RotateCcw } from "lucide-react"

interface ChatMessage {
  id: string
  type: "status" | "message" | "link"
  content: string
  time: string
  sender?: "system" | "operator"
}

function getTime() {
  const now = new Date()
  const h = now.getHours().toString().padStart(2, "0")
  const m = now.getMinutes().toString().padStart(2, "0")
  return `${h}:${m}`
}

function createMessage(step: FlowStep): ChatMessage[] {
  const time = getTime()

  if (step.type === "status") {
    return [
      {
        id: step.id + "-" + Date.now(),
        type: "status",
        content: step.content,
        time,
      },
    ]
  } else if (step.type === "message") {
    return [
      {
        id: step.id + "-msg-" + Date.now(),
        type: "message",
        content: step.content,
        time,
        sender: step.sender,
      },
    ]
  }
  return []
}

function createLinkMessage(step: FlowStep): ChatMessage {
  return {
    id: step.id + "-link-" + Date.now(),
    type: "link",
    content: "maps.hutchison-lct.com/ruta/...",
    time: getTime(),
    sender: "system",
  }
}

export default function PrototypePage() {
  const [selectedFlow, setSelectedFlow] = useState<FlowType | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [showMap, setShowMap] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [isFlowDone, setIsFlowDone] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const flowRef = useRef<FlowDefinition | null>(null)

  const flow = selectedFlow
    ? flowDefinitions.find((f) => f.id === selectedFlow) ?? null
    : null

  // Keep ref in sync
  useEffect(() => {
    flowRef.current = flow
  }, [flow])

  const currentStep = flow ? flow.steps[currentStepIndex] : null

  const advanceToStep = useCallback(
    (stepIndex: number) => {
      const currentFlow = flowRef.current
      if (!currentFlow) return
      const step = currentFlow.steps[stepIndex]
      if (!step) return

      setCurrentStepIndex(stepIndex)

      if (step.type === "status" || step.type === "message") {
        const msgs = createMessage(step)
        setMessages((prev) => [...prev, ...msgs])

        // Add link bubble after message
        if (step.type === "message") {
          setTimeout(() => {
            setMessages((prev) => [...prev, createLinkMessage(step)])
          }, 400)
        }

        if (step.nextStep && step.nextStep !== "done") {
          const nextIdx = currentFlow.steps.findIndex((s) => s.id === step.nextStep)
          const nextStep = currentFlow.steps[nextIdx]

          if (nextStep && (nextStep.type === "status" || nextStep.type === "message")) {
            const delay = step.delay || 800
            timeoutRef.current = setTimeout(() => {
              advanceToStep(nextIdx)
            }, delay)
          } else {
            setIsAutoPlaying(false)
            if (nextStep) {
              setTimeout(() => setCurrentStepIndex(nextIdx), step.delay || 600)
            }
          }
        } else if (step.nextStep === "done") {
          setIsAutoPlaying(false)
          setIsFlowDone(true)
        }
      } else if (step.type === "map" || step.type === "decision") {
        setIsAutoPlaying(false)
      }
    },
    []
  )

  const handleFlowSelect = useCallback(
    (flowId: string) => {
      const f = flowDefinitions.find((fd) => fd.id === flowId)
      if (!f) return

      setSelectedFlow(flowId as FlowType)
      setCurrentStepIndex(0)
      setMessages([])
      setShowMap(false)
      setIsFlowDone(false)
      setIsAutoPlaying(true)

      // Store ref immediately
      flowRef.current = f

      // Start after a brief delay
      setTimeout(() => {
        const step = f.steps[0]
        const msgs = createMessage(step)
        setMessages(msgs)
        setCurrentStepIndex(0)

        if (step.nextStep) {
          const nextIdx = f.steps.findIndex((s) => s.id === step.nextStep)
          timeoutRef.current = setTimeout(() => {
            advanceToStep(nextIdx)
          }, step.delay || 800)
        }
      }, 500)
    },
    [advanceToStep]
  )

  const handleLinkClick = useCallback(() => {
    setShowMap(true)
  }, [])

  const handleMapClose = useCallback(() => {
    setShowMap(false)
    const currentFlow = flowRef.current
    if (!currentFlow) return

    setCurrentStepIndex((prevIdx) => {
      const step = currentFlow.steps[prevIdx]
      if (step?.nextStep && step.nextStep !== "done") {
        const nextIdx = currentFlow.steps.findIndex((s) => s.id === step.nextStep)
        if (nextIdx >= 0) return nextIdx
      }
      return prevIdx
    })
  }, [])

  const handleDecision = useCallback(
    (nextStepId: string) => {
      const currentFlow = flowRef.current
      if (!currentFlow) return
      const nextIdx = currentFlow.steps.findIndex((s) => s.id === nextStepId)
      if (nextIdx >= 0) {
        const step = currentFlow.steps[nextIdx]
        if (step.type === "status" || step.type === "message") {
          setIsAutoPlaying(true)
          advanceToStep(nextIdx)
        } else {
          setCurrentStepIndex(nextIdx)
        }
      }
    },
    [advanceToStep]
  )

  const handleReset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    flowRef.current = null
    setSelectedFlow(null)
    setCurrentStepIndex(0)
    setMessages([])
    setShowMap(false)
    setIsAutoPlaying(false)
    setIsFlowDone(false)
  }, [])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Flow select screen
  if (!selectedFlow || !flow) {
    return <FlowSelector flows={flowDefinitions} onSelect={handleFlowSelect} backHref="/" />
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </button>
          <div>
            <h1 className="text-sm font-semibold text-foreground">
              {flow.title}
            </h1>
            <p className="text-xs text-muted-foreground">{flow.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAutoPlaying && (
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Simulando...
            </span>
          )}
          {isFlowDone && (
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              Flujo completado
            </span>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-secondary px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reiniciar
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-start justify-center gap-8 p-8">
        {/* Timeline panel */}
        <div className="hidden w-72 shrink-0 overflow-hidden rounded-2xl border border-border/50 bg-card lg:block" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <FlowTimeline
            steps={flow.steps}
            currentStepIndex={currentStepIndex}
            flowTitle={flow.title}
          />
        </div>

        {/* Phone */}
        <div className="shrink-0">
          <PhoneSimulator>
            {showMap && currentStep ? (
              <MapRouteView
                routeLabel={currentStep.routeLabel || currentStep.content}
                mapType={currentStep.mapType || "route"}
                onClose={handleMapClose}
              />
            ) : (
              <WhatsAppChat
                messages={messages}
                currentStep={currentStep}
                onLinkClick={handleLinkClick}
                onDecision={handleDecision}
              />
            )}
          </PhoneSimulator>
        </div>

        {/* Info panel */}
        <div className="hidden w-72 shrink-0 flex-col gap-4 xl:flex">
          {/* Flow info */}
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">
              Informacion del Flujo
            </h3>
            <div className="mt-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Tipo</span>
                <span className="font-medium text-foreground">{flow.title}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Paso actual</span>
                <span className="font-medium text-foreground">
                  {currentStepIndex + 1} / {flow.steps.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Estado</span>
                <span className={`font-medium ${isFlowDone ? "text-emerald-400" : "text-primary"}`}>
                  {isFlowDone ? "Completado" : isAutoPlaying ? "En progreso" : "Esperando accion"}
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">Leyenda</h3>
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Paso automatico del sistema
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-[#00a884]" />
                Mensaje de WhatsApp
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-amber-400" />
                Requiere accion del operador
              </div>
            </div>
          </div>

          {/* Flow description */}
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">
              Pasos previos del operador
            </h3>
            <ol className="mt-3 flex flex-col gap-1.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">1</span>
                Registro en ASLA
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">2</span>
                Llamado externo
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">3</span>
                Acceso en K1
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground">4</span>
                Acceso en K2
              </li>
            </ol>
            <p className="mt-2 text-[10px] text-muted-foreground/60 leading-relaxed">
              Estos pasos los realiza el operador por su cuenta antes de recibir el mensaje de WhatsApp.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
