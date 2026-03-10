"use client"

import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"

interface AppRegisterScreenProps {
  onRegisterComplete: () => void
  onGoLogin: () => void
  onBack: () => void
}

export function AppRegisterScreen({ onRegisterComplete, onGoLogin, onBack }: AppRegisterScreenProps) {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"phone" | "password" | "code-sent" | "verify" | "success">("phone")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendCode = () => {
    if (password.length < 4) {
      setError("Ingresa datos validos")
      return
    }
    setError("")
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep("code-sent")
      setTimeout(() => setStep("verify"), 1500)
    }, 1200)
  }

  const handleVerify = () => {
    if (code.length < 4) return
    if (code === "1234" || code.length >= 4) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setStep("success")
        setTimeout(() => onRegisterComplete(), 1500)
      }, 1000)
    } else {
      setError("Codigo incorrecto. Se envio otro codigo.")
    }
  }

  return (
    <div className="flex h-full flex-col bg-[#0c1520]">
      {/* Header */}
      <div className="flex items-center gap-3 bg-[#0f1d2e] px-4 py-3 pt-10">
        <button
          onClick={step === "phone" ? onBack : () => setStep("phone")}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-sm font-semibold text-white/90">Registro</h2>
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
          <p className="mt-3 text-xs text-white/40">Crear una cuenta</p>
        </div>

        {step === "phone" && (
          <div className="flex flex-1 flex-col">
            <label className="mb-2 text-xs font-medium text-white/60">
              Ingresa un numero de telefono
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-white/40">+52</span>
              <div className="h-5 w-px bg-white/10" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Numero de telefono"
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
        )}

        {step === "password" && (
          <div className="flex flex-1 flex-col">
            <label className="mb-2 text-xs font-medium text-white/60">
              Ingresa una contrasena
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError("") }}
                placeholder="Contrasena"
                className="flex-1 bg-transparent text-sm text-white/90 outline-none placeholder:text-white/25"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/40 hover:text-white/60"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-400">{error}</p>
            )}
            <button
              onClick={handleSendCode}
              disabled={isLoading || password.length < 1}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition-all disabled:opacity-30 hover:bg-blue-400 active:scale-[0.98]"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Registrarme
            </button>
          </div>
        )}

        {step === "code-sent" && (
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-blue-400" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </div>
            <p className="mt-4 text-center text-sm font-medium text-white/80">
              Se envio un codigo de verificacion
            </p>
            <p className="mt-2 text-center text-xs text-white/40">
              Revisa tu telefono +52 {phone.slice(0, 3)}...{phone.slice(-2)}
            </p>
          </div>
        )}

        {step === "verify" && (
          <div className="flex flex-1 flex-col">
            <label className="mb-2 text-xs font-medium text-white/60">
              Ingresa el codigo de verificacion
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError("") }}
                placeholder="Codigo de 4 digitos"
                className="flex-1 bg-transparent text-center text-lg font-mono tracking-[0.3em] text-white/90 outline-none placeholder:text-white/25 placeholder:tracking-normal placeholder:text-sm"
                maxLength={6}
              />
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-400">{error}</p>
            )}
            <button
              onClick={handleVerify}
              disabled={code.length < 4 || isLoading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition-all disabled:opacity-30 hover:bg-blue-400 active:scale-[0.98]"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Verificar
            </button>
            <button
              onClick={() => setError("Se envio otro codigo de verificacion.")}
              className="mt-3 text-center text-xs text-blue-400 hover:text-blue-300"
            >
              Enviar otro codigo
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-emerald-400" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="mt-4 text-center text-sm font-medium text-white/80">
              Cuenta creada
            </p>
            <p className="mt-2 text-center text-xs text-white/40">
              Ingresando al sistema...
            </p>
          </div>
        )}

        {(step === "phone" || step === "password") && (
          <div className="mt-auto pt-6 text-center">
            <p className="text-xs text-white/30">
              {"Ya tienes cuenta? "}
              <button onClick={onGoLogin} className="font-medium text-blue-400 hover:text-blue-300">
                Inicia sesion
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
