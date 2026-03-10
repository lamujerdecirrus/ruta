"use client"

import { FlowStep } from "@/lib/flow-data"
import { Check, MapPin, Clock, MessageSquare, GitFork } from "lucide-react"

interface FlowTimelineProps {
  steps: FlowStep[]
  currentStepIndex: number
  flowTitle: string
}

const stepIcon: Record<string, React.ReactNode> = {
  status: <Clock className="h-3.5 w-3.5" />,
  message: <MessageSquare className="h-3.5 w-3.5" />,
  map: <MapPin className="h-3.5 w-3.5" />,
  decision: <GitFork className="h-3.5 w-3.5" />,
  action: <Check className="h-3.5 w-3.5" />,
}

export function FlowTimeline({ steps, currentStepIndex, flowTitle }: FlowTimelineProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/50 px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">Progreso del Flujo</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{flowTitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="relative flex flex-col gap-0">
          {steps.map((step, idx) => {
            const isDone = idx < currentStepIndex
            const isCurrent = idx === currentStepIndex
            const isFuture = idx > currentStepIndex

            return (
              <div key={step.id + "-" + idx} className="flex gap-3">
                {/* Line + Dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                      isDone
                        ? "border-primary/50 bg-primary/20 text-primary"
                        : isCurrent
                        ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30"
                        : "border-border/50 bg-secondary text-muted-foreground/50"
                    }`}
                  >
                    {isDone ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      stepIcon[step.type]
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-px flex-1 min-h-[20px] transition-colors duration-500 ${
                        isDone ? "bg-primary/30" : "bg-border/30"
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-4 pt-1 transition-opacity duration-500 ${isFuture ? "opacity-40" : "opacity-100"}`}>
                  <p
                    className={`text-xs leading-relaxed ${
                      isCurrent
                        ? "font-medium text-foreground"
                        : isDone
                        ? "text-muted-foreground"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    {step.content}
                  </p>
                  {isCurrent && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                      En curso
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
