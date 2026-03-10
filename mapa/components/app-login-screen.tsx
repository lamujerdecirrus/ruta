"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface AppLoginScreenProps {
  onLogin: (phone: string, password: string) => void
  onGoRegister: () => void
  onBack: () => void
  errorMessage?: string
}

export function AppLoginScreen({ onLogin, onGoRegister, onBack, errorMessage }: AppLoginScreenProps) {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState<"phone" | "password">("phone")
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex h-full flex-col bg-[#0c1520]">
      {/* Header */}
      <div className="flex items-center gap-3 bg-[#0f1d2e] px-4 py-3 pt-10">
        <button
          onClick={step === "password" ? () => setStep("phone") : onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-sm font-semibold text-white/90">Iniciar Sesion</h2>
      </div>

      <div className="flex flex-1 flex-col px-6 py-8">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10">
            <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9 text-blue-400" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 3L2 8l10 5 10-5-10-5z" />
              <path d="M2 16l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <p className="mt-3 text-xs text-white/40">Hutchison Ports LCT</p>
        </div>

        {step === "phone" ? (
          <div className="flex flex-1 flex-col">
            <label className="mb-2 text-xs font-medium text-white/60">
              Numero de telefono
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-white/40">+52</span>
              <div className="h-5 w-px bg-white/10" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Ingresa tu numero"
                className="flex-1 bg-transparent text-sm text-white/90 outline-none placeholder:text-white/25"
              />
            </div>

            <button
              onClick={() => {
                if (phone.length >= 10) setStep("password")
              }}
              disabled={phone.length < 10}
              className="mt-6 w-full rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition-all disabled:opacity-30 hover:bg-blue-400 active:scale-[0.98]"
            >
              Continuar
            </button>
          </div>
        ) : (
          <div className="flex flex-1 flex-col">
            <label className="mb-2 text-xs font-medium text-white/60">
              Contrasena
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contrasena"
                className="flex-1 bg-transparent text-sm text-white/90 outline-none placeholder:text-white/25"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/40 hover:text-white/60"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {errorMessage && (
              <p className="mt-2 text-xs text-red-400">{errorMessage}</p>
            )}

            <button
              onClick={() => {
                if (password.length >= 4) onLogin(phone, password)
              }}
              disabled={password.length < 4}
              className="mt-6 w-full rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition-all disabled:opacity-30 hover:bg-blue-400 active:scale-[0.98]"
            >
              Iniciar Sesion
            </button>
          </div>
        )}

        <div className="mt-auto pt-6 text-center">
          <p className="text-xs text-white/30">
            {"No tienes cuenta? "}
            <button onClick={onGoRegister} className="font-medium text-blue-400 hover:text-blue-300">
              Registrate
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
