import Link from "next/link"
import { MessageCircle, Smartphone } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-14 text-center">
        <div className="mb-5 flex items-center justify-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-8 w-8 text-primary"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 3L2 8l10 5 10-5-10-5z" />
              <path d="M2 16l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Hutchison Ports LCT
        </h1>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">
          Prototipos Interactivos - Sistema de Rutas
        </p>
        <p className="mt-2 text-sm text-muted-foreground/70">
          Seleccione el prototipo que desea explorar
        </p>
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        {/* WhatsApp Prototype */}
        <Link
          href="/whatsapp"
          className="group relative flex flex-col items-start gap-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-7 text-left transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-[0.98]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-emerald-500/30 bg-background/50 text-emerald-400">
            <MessageCircle className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-emerald-400">
              Flujo via WhatsApp
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              El operador realiza acciones previas por su cuenta (ASLA, K1, K2) y recibe mensajes de WhatsApp con enlaces de ruta automaticamente.
            </p>
          </div>
          <div className="mt-auto flex items-center gap-2 text-xs text-emerald-400/70">
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5">Sin inicio de sesion</span>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5">WhatsApp</span>
          </div>
          <div className="absolute right-5 top-5 text-emerald-400 opacity-0 transition-opacity group-hover:opacity-100">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* App Login Prototype */}
        <Link
          href="/app-flow"
          className="group relative flex flex-col items-start gap-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 p-7 text-left transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500/10 hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-blue-500/30 bg-background/50 text-blue-400">
            <Smartphone className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-400">
              Flujo con Inicio de Sesion
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              El operador abre la aplicacion web, inicia sesion o se registra, y accede directamente a las rutas de su operacion asignada.
            </p>
          </div>
          <div className="mt-auto flex items-center gap-2 text-xs text-blue-400/70">
            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5">Login / Registro</span>
            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5">App Web</span>
          </div>
          <div className="absolute right-5 top-5 text-blue-400 opacity-0 transition-opacity group-hover:opacity-100">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>

      <p className="mt-12 max-w-lg text-center text-xs leading-relaxed text-muted-foreground/50">
        Ambos prototipos simulan el flujo completo de operaciones en el patio de contenedores de Hutchison Ports LCT, con los cuatro tipos de operacion: deposito, importacion, retiro y exportacion.
      </p>
    </div>
  )
}
