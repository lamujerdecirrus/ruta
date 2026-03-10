"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { appFlowDefinitions, AppFlowType, AppFlowDefinition, OperationStep } from "@/lib/app-flow-data"
import { FlowSelector } from "@/components/flow-selector"
import { flowDefinitions } from "@/lib/flow-data"
import { AppPhoneSimulator } from "@/components/app-phone-simulator"
import { AppSplashScreen } from "@/components/app-splash-screen"
import { AppLoginScreen } from "@/components/app-login-screen"
import { AppRegisterScreen } from "@/components/app-register-screen"
import { AppOperationHome } from "@/components/app-operation-home"
import { AppInAppScreen } from "@/components/app-in-app-screen"
import { MapRouteView } from "@/components/map-route-view"
import { ArrowLeft, RotateCcw } from "lucide-react"

type AppPhase =
  | "select"
  | "splash"
  | "check-session"
  | "login"
  | "register"
  | "login-error"
  | "keep-session"
  | "welcome"
  | "operation-home"
  | "operation"
  | "map"

interface TimelineEntry {
  id: string
  label: string
  status: "done" | "current" | "pending"
}

export default function AppFlowPage() {
  const [selectedFlow, setSelectedFlow] = useState<AppFlowType | null>(null)
  const [phase, setPhase] = useState<AppPhase>("select")
  const [currentOpStepIndex, setCurrentOpStepIndex] = useState(0)
  const [showMap, setShowMap] = useState(false)
  const [isFlowDone, setIsFlowDone] = useState(false)
  const [loginAttemptFailed, setLoginAttemptFailed] = useState(false)
  const [sessionKept, setSessionKept] = useState(false)
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const flowRef = useRef<AppFlowDefinition | null>(null)

  const appFlow = selectedFlow
    ? appFlowDefinitions.find((f) => f.id === selectedFlow) ?? null
    : null

  useEffect(() => {
    flowRef.current = appFlow
  }, [appFlow])

  const currentOpStep = appFlow ? appFlow.operationSteps[currentOpStepIndex] : null

  const updateTimeline = useCallback((label: string, status: "done" | "current") => {
    setTimelineEntries((prev) => {
      const updated = prev.map((e) =>
        e.status === "current" ? { ...e, status: "done" as const } : e
      )
      if (status === "current") {
        return [...updated, { id: Date.now().toString(), label, status }]
      }
      return updated
    })
  }, [])

  // Handle flow selection from the picker
  const handleFlowSelect = useCallback(
    (flowId: string) => {
      const f = appFlowDefinitions.find((fd) => fd.id === flowId)
      if (!f) return

      setSelectedFlow(flowId as AppFlowType)
      flowRef.current = f
      setPhase("splash")
      setCurrentOpStepIndex(0)
      setShowMap(false)
      setIsFlowDone(false)
      setLoginAttemptFailed(false)
      setSessionKept(false)
      setTimelineEntries([
        { id: "splash", label: "Pantalla de inicio", status: "current" },
      ])
    },
    []
  )

  // Splash finishes
  const handleSplashDone = useCallback(() => {
    updateTimeline("Pantalla de inicio", "done")
    setTimelineEntries((prev) => [
      ...prev.map((e) => ({ ...e, status: "done" as const })),
      { id: "session-check", label: "Sesion no iniciada", status: "current" },
    ])
    setPhase("check-session")
    // Simulate: no active session, show login/register choice after a brief pause
    timeoutRef.current = setTimeout(() => {
      updateTimeline("Verificando sesion", "done")
      setTimelineEntries((prev) => [
        ...prev.map((e) => ({ ...e, status: "done" as const })),
        { id: "login-or-register", label: "Inicio de sesion / Registro", status: "current" },
      ])
      setPhase("login")
    }, 1000)
  }, [updateTimeline])

  // Login
  const handleLogin = useCallback(
    (_phone: string, _password: string) => {
      if (!loginAttemptFailed) {
        // First attempt: show error
        setLoginAttemptFailed(true)
        setTimelineEntries((prev) => [
          ...prev.map((e) => ({ ...e, status: "done" as const })),
          { id: "login-error", label: 'Datos incorrectos', status: "current" },
        ])
        return
      }
      // Second attempt: success
      updateTimeline("Login exitoso", "done")
      setTimelineEntries((prev) => [
        ...prev.map((e) => ({ ...e, status: "done" as const })),
        { id: "keep-session", label: "Mantener sesion iniciada?", status: "current" },
      ])
      setPhase("keep-session")
    },
    [loginAttemptFailed, updateTimeline]
  )

  // Keep session decision
  const handleKeepSession = useCallback(
    (keep: boolean) => {
      setSessionKept(keep)
      updateTimeline(keep ? "Sesion guardada" : "Sesion no guardada", "done")
      setTimelineEntries((prev) => [
        ...prev.map((e) => ({ ...e, status: "done" as const })),
        { id: "welcome", label: `Hola, ${flowRef.current?.operatorName || "Operador"}`, status: "current" },
      ])
      setPhase("welcome")
      timeoutRef.current = setTimeout(() => {
        updateTimeline("Bienvenida", "done")
        setTimelineEntries((prev) => [
          ...prev.map((e) => ({ ...e, status: "done" as const })),
          { id: "operation-home", label: "Pantalla de operacion", status: "current" },
        ])
        setPhase("operation-home")
      }, 1500)
    },
    [updateTimeline]
  )

  // Register complete
  const handleRegisterComplete = useCallback(() => {
    updateTimeline("Cuenta creada", "done")
    setTimelineEntries((prev) => [
      ...prev.map((e) => ({ ...e, status: "done" as const })),
      { id: "welcome", label: `Hola, ${flowRef.current?.operatorName || "Operador"}`, status: "current" },
    ])
    setPhase("welcome")
    timeoutRef.current = setTimeout(() => {
      updateTimeline("Bienvenida", "done")
      setTimelineEntries((prev) => [
        ...prev.map((e) => ({ ...e, status: "done" as const })),
        { id: "operation-home", label: "Pantalla de operacion", status: "current" },
      ])
      setPhase("operation-home")
    }, 1500)
  }, [updateTimeline])

  // Start operation from home
  const handleStartOperation = useCallback(() => {
    setPhase("operation")
    setCurrentOpStepIndex(0)
    const currentFlow = flowRef.current
    if (currentFlow && currentFlow.operationSteps[0]) {
      updateTimeline("Operacion iniciada", "done")
      setTimelineEntries((prev) => [
        ...prev.map((e) => ({ ...e, status: "done" as const })),
        { id: "op-0", label: currentFlow.operationSteps[0].content, status: "current" },
      ])
    }
  }, [updateTimeline])

  // Auto-advance for steps with delay (like buffer-wait -> internal-call)
  useEffect(() => {
    if (phase !== "operation" || showMap || !appFlow) return

    const step = appFlow.operationSteps[currentOpStepIndex]
    if (!step || !step.delay || !step.nextStep) return

    // Only auto-advance for buffer-wait and internal-call screens
    if (step.screen !== "buffer-wait" && step.screen !== "internal-call") return

    const nextIdx = appFlow.operationSteps.findIndex((s) => s.id === step.nextStep)
    if (nextIdx < 0) return

    const nextStep = appFlow.operationSteps[nextIdx]
    // Don't auto-advance to map screens (user needs to press the button)
    if (nextStep.screen === "route-map" || nextStep.screen === "route-map-main" || nextStep.screen === "route-map-exit") return

    timeoutRef.current = setTimeout(() => {
      setCurrentOpStepIndex(nextIdx)
      updateTimeline(step.content, "done")
      setTimelineEntries((prev) => [
        ...prev.map((e) => ({ ...e, status: "done" as const })),
        { id: `op-${nextIdx}-${Date.now()}`, label: nextStep.content, status: "current" },
      ])
    }, step.delay)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [phase, currentOpStepIndex, showMap, appFlow, updateTimeline])

  // View map - advance to map step if current step has a map nextStep
  const handleViewMap = useCallback(() => {
    const currentFlow = flowRef.current
    if (!currentFlow) {
      setShowMap(true)
      return
    }

    const step = currentFlow.operationSteps[currentOpStepIndex]
    // If current step is a "pre-map" step (like route-inspection, internal-call, etc)
    // that leads to a map step, advance to the map step first
    if (step?.nextStep) {
      const nextIdx = currentFlow.operationSteps.findIndex((s) => s.id === step.nextStep)
      const nextStep = currentFlow.operationSteps[nextIdx]
      if (nextStep && (nextStep.screen === "route-map" || nextStep.screen === "route-map-main" || nextStep.screen === "route-map-exit")) {
        setCurrentOpStepIndex(nextIdx)
        updateTimeline(step.content, "done")
        setTimelineEntries((prev) => [
          ...prev.map((e) => ({ ...e, status: "done" as const })),
          { id: `op-${nextIdx}`, label: nextStep.content, status: "current" },
        ])
      }
    }
    setShowMap(true)
  }, [currentOpStepIndex, updateTimeline])

  // Close map
  const handleMapClose = useCallback(() => {
    setShowMap(false)
    const currentFlow = flowRef.current
    if (!currentFlow) return

    const step = currentFlow.operationSteps[currentOpStepIndex]
    if (step?.nextStep) {
      const nextIdx = currentFlow.operationSteps.findIndex((s) => s.id === step.nextStep)
      if (nextIdx >= 0) {
        setCurrentOpStepIndex(nextIdx)
        const nextStep = currentFlow.operationSteps[nextIdx]
        updateTimeline(step.content, "done")
        setTimelineEntries((prev) => [
          ...prev.map((e) => ({ ...e, status: "done" as const })),
          { id: `op-${nextIdx}`, label: nextStep.content, status: "current" },
        ])

        if (nextStep.screen === "flow-done") {
          setIsFlowDone(true)
        }
      }
    }
  }, [currentOpStepIndex, updateTimeline])

  // Decision handler
  const handleDecision = useCallback(
    (nextStepId: string) => {
      const currentFlow = flowRef.current
      if (!currentFlow) return
      const nextIdx = currentFlow.operationSteps.findIndex((s) => s.id === nextStepId)
      if (nextIdx >= 0) {
        setCurrentOpStepIndex(nextIdx)
        const nextStep = currentFlow.operationSteps[nextIdx]
        updateTimeline("Deciscion tomada", "done")
        setTimelineEntries((prev) => [
          ...prev.map((e) => ({ ...e, status: "done" as const })),
          { id: `op-${nextIdx}-${Date.now()}`, label: nextStep.content, status: "current" },
        ])

        if (nextStep.screen === "flow-done") {
          setIsFlowDone(true)
        }
      }
    },
    [updateTimeline]
  )

  // Reset everything
  const handleReset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    flowRef.current = null
    setSelectedFlow(null)
    setPhase("select")
    setCurrentOpStepIndex(0)
    setShowMap(false)
    setIsFlowDone(false)
    setLoginAttemptFailed(false)
    setSessionKept(false)
    setTimelineEntries([])
  }, [])

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Flow select screen - reuse FlowSelector with app flow definitions converted
  if (phase === "select" || !selectedFlow || !appFlow) {
    const flows = appFlowDefinitions.map((f) => ({
      id: f.id,
      title: f.title,
      subtitle: f.subtitle,
      icon: f.icon,
      color: f.color,
      steps: [], // not needed for selector
    }))
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7 text-blue-400"
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
            Sistema de Rutas - Flujo con Inicio de Sesion
          </p>
          <p className="mt-2 text-sm text-muted-foreground/70">
            Seleccione el tipo de operacion para simular el flujo completo
          </p>
          <a
            href="/"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary/70 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a prototipos
          </a>
        </div>

        <FlowSelector flows={flows as any} onSelect={handleFlowSelect} />
      </div>
    )
  }

  // Render phone content
  const renderPhoneContent = () => {
    // Map view overlay
    if (showMap && currentOpStep) {
      return (
        <MapRouteView
          routeLabel={currentOpStep.routeLabel || currentOpStep.content}
          mapType={currentOpStep.mapType || "route"}
          onClose={handleMapClose}
        />
      )
    }

    switch (phase) {
      case "splash":
        return <AppSplashScreen onFinish={handleSplashDone} />

      case "check-session":
        return (
          <div className="flex h-full flex-col items-center justify-center bg-[#0c1520]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
              <svg className="h-6 w-6 animate-spin text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <p className="mt-4 text-xs text-white/40">Verificando sesion...</p>
          </div>
        )

      case "login":
        return (
          <AppLoginScreen
            onLogin={handleLogin}
            errorMessage={loginAttemptFailed ? "Datos incorrectos" : undefined}
            onGoRegister={() => {
              setPhase("register")
              updateTimeline("Cambio a registro", "done")
              setTimelineEntries((prev) => [
                ...prev.map((e) => ({ ...e, status: "done" as const })),
                { id: "register", label: "Pantalla de registro", status: "current" },
              ])
            }}
            onBack={() => {
              setPhase("login")
            }}
          />
        )

      case "register":
        return (
          <AppRegisterScreen
            onRegisterComplete={handleRegisterComplete}
            onGoLogin={() => {
              setPhase("login")
              updateTimeline("Cambio a login", "done")
              setTimelineEntries((prev) => [
                ...prev.map((e) => ({ ...e, status: "done" as const })),
                { id: "login-retry", label: "Pantalla de login", status: "current" },
              ])
            }}
            onBack={() => setPhase("login")}
          />
        )

      case "keep-session":
        return (
          <div className="flex h-full flex-col bg-[#0c1520]">
            <div className="flex items-center gap-3 bg-[#0f1d2e] px-4 py-3 pt-10">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-blue-400" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3L2 8l10 5 10-5-10-5z" />
                  <path d="M2 16l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-white/90">Hutchison Ports LCT</p>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center px-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-emerald-400" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="mt-4 text-sm font-semibold text-white/80">Acceso exitoso</p>
              <p className="mt-6 text-center text-xs text-white/50">
                Mantener la sesion iniciada?
              </p>
              <div className="mt-4 flex w-full flex-col gap-2">
                <button
                  onClick={() => handleKeepSession(true)}
                  className="w-full rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-400 active:scale-[0.98]"
                >
                  Si, guardar datos
                </button>
                <button
                  onClick={() => handleKeepSession(false)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white/60 transition-all hover:bg-white/10 active:scale-[0.98]"
                >
                  No, no guardar
                </button>
              </div>
            </div>
          </div>
        )

      case "welcome":
        return (
          <div className="flex h-full flex-col items-center justify-center bg-[#0c1520]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-blue-400" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <p className="mt-4 text-lg font-bold text-white/90">
              Hola, {appFlow.operatorName}
            </p>
            <p className="mt-2 text-xs text-white/40">Cargando tu operacion...</p>
          </div>
        )

      case "operation-home":
        return (
          <AppOperationHome
            operatorName={appFlow.operatorName}
            operationType={appFlow.id}
            onStart={handleStartOperation}
            onLogout={handleReset}
          />
        )

      case "operation":
        if (!currentOpStep) return null
        return (
          <AppInAppScreen
            step={currentOpStep}
            operatorName={appFlow.operatorName}
            onViewMap={handleViewMap}
            onDecision={handleDecision}
            isWaiting={currentOpStep.screen === "buffer-wait"}
          />
        )

      default:
        return null
    }
  }

  const isActive = phase !== "select" && !isFlowDone

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
            <h1 className="text-sm font-semibold text-foreground">{appFlow.title}</h1>
            <p className="text-xs text-muted-foreground">Flujo con inicio de sesion</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isActive && !isFlowDone && (
            <span className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
              {phase === "operation" ? "En operacion" : "Simulando..."}
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

      {/* Main */}
      <main className="flex flex-1 items-start justify-center gap-8 p-8">
        {/* Timeline */}
        <div className="hidden w-72 shrink-0 overflow-hidden rounded-2xl border border-border/50 bg-card lg:block" style={{ maxHeight: "calc(100vh - 140px)" }}>
          <div className="border-b border-border/50 px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Progreso del Flujo</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{appFlow.title}</p>
          </div>
          <div className="overflow-y-auto px-5 py-4" style={{ maxHeight: "calc(100vh - 220px)" }}>
            <div className="flex flex-col gap-0">
              {timelineEntries.map((entry, idx) => (
                <div key={entry.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                        entry.status === "done"
                          ? "border-blue-500/50 bg-blue-500/20 text-blue-400"
                          : "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/30"
                      }`}
                    >
                      {entry.status === "done" ? (
                        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : (
                        <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                      )}
                    </div>
                    {idx < timelineEntries.length - 1 && (
                      <div className={`w-px min-h-[20px] flex-1 ${entry.status === "done" ? "bg-blue-500/30" : "bg-border/30"}`} />
                    )}
                  </div>
                  <div className="pb-4 pt-1">
                    <p className={`text-xs leading-relaxed ${entry.status === "current" ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                      {entry.label}
                    </p>
                    {entry.status === "current" && (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                        En curso
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="shrink-0">
          <AppPhoneSimulator>
            {renderPhoneContent()}
          </AppPhoneSimulator>
        </div>

        {/* Info panel */}
        <div className="hidden w-72 shrink-0 flex-col gap-4 xl:flex">
          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">Informacion del Flujo</h3>
            <div className="mt-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Tipo</span>
                <span className="font-medium text-foreground">{appFlow.title}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Operador</span>
                <span className="font-medium text-foreground">{appFlow.operatorName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Fase</span>
                <span className="font-medium text-blue-400 capitalize">{phase}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Estado</span>
                <span className={`font-medium ${isFlowDone ? "text-emerald-400" : "text-blue-400"}`}>
                  {isFlowDone ? "Completado" : "En progreso"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">Flujo de Autenticacion</h3>
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                Splash / Pantalla de inicio
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-amber-400" />
                Login con telefono y contrasena
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                Registro con verificacion por codigo
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-rose-400" />
                Opcion de mantener sesion
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">Nota sobre el Login</h3>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground/70">
              En el primer intento de login se muestra el error &quot;Datos incorrectos&quot; para demostrar el flujo de error. En el segundo intento el login es exitoso. El sistema ya sabe la operacion del operador segun su usuario.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
