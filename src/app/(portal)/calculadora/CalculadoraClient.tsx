'use client'

import { useState } from 'react'

function maskCurrency(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  const num = (parseInt(digits, 10) / 100).toFixed(2)
  return num.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function parseCurrency(str: string): number {
  if (!str || !str.trim()) return 0
  return parseFloat(str.replace(/\./g, '').replace(',', '.')) || 0
}

type ResultStatus = 'ok' | 'danger' | 'warn' | null

export default function CalculadoraClient() {
  const [salario, setSalario] = useState('')
  const [descontos, setDescontos] = useState('')
  const [parcela, setParcela] = useState('')
  const [error, setError] = useState(false)
  const [result, setResult] = useState<{ pct: string; label: string; status: ResultStatus } | null>(null)

  function calcular() {
    setError(false)
    setResult(null)

    const s = parseCurrency(salario)
    const d = parseCurrency(descontos)
    const p = parseCurrency(parcela)

    if (s <= 0) {
      setError(true)
      return
    }

    const comp = (d + p) / s
    const pct = (comp * 100).toFixed(2).replace('.', ',') + '%'

    if (comp >= 0 && comp < 0.6999) {
      setResult({ pct, label: 'Dentro dos parâmetros para avaliação', status: 'ok' })
    } else if (comp >= 0.6999 && comp <= 1) {
      setResult({ pct, label: 'Fora dos parâmetros', status: 'danger' })
    } else {
      setResult({ pct, label: 'Fora dos parâmetros — comprometimento acima de 100%', status: 'danger' })
    }
  }

  const resultStyles = {
    ok: {
      wrap: 'bg-[#f0fdf4] border-2 border-[#bbf7d0]',
      icon: 'bg-[#dcfce7] text-[#16a34a]',
      pct: 'text-[#16a34a]',
      lbl: 'text-[#15803d]',
      symbol: '✓',
    },
    danger: {
      wrap: 'bg-[#fef2f2] border-2 border-[#fecaca]',
      icon: 'bg-[#fee2e2] text-[#ef4444]',
      pct: 'text-[#ef4444]',
      lbl: 'text-[#b91c1c]',
      symbol: '✕',
    },
    warn: {
      wrap: 'bg-[#fffbeb] border-2 border-[#fde68a]',
      icon: 'bg-[#fef3c7] text-[#f59e0b]',
      pct: 'text-[#f59e0b]',
      lbl: 'text-[#b45309]',
      symbol: '!',
    },
  }

  const rs = result?.status ? resultStyles[result.status] : null

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-md">
      {/* Header */}
      <div className="relative overflow-hidden bg-[#192547] px-8 py-7">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#01F767] opacity-15" />
        <h1 className="text-base font-bold leading-snug text-white">
          Calculadora de Comprometimento de Renda
        </h1>
        <p className="mt-1.5 text-xs font-medium text-white/50">
          Limite de comprometimento: 70% da renda bruta
        </p>
      </div>

      {/* Body */}
      <div className="space-y-5 px-8 py-7">
        {[
          { id: 'salario', label: 'Salário Fixo', value: salario, set: setSalario },
          { id: 'descontos', label: 'Total de Descontos Existentes', value: descontos, set: setDescontos },
          { id: 'parcela', label: 'Parcela Contratada (nova)', value: parcela, set: setParcela },
        ].map(({ id, label, value, set }) => (
          <div key={id}>
            <label
              htmlFor={id}
              className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-[#192547]"
            >
              {label}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                R$
              </span>
              <input
                id={id}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={value}
                onChange={(e) => set(maskCurrency(e.target.value))}
                onKeyDown={(e) => e.key === 'Enter' && calcular()}
                placeholder="0,00"
                className="w-full rounded-xl border-2 border-[#e2e8f0] bg-[#f4f6fb] py-3 pl-10 pr-4 text-sm font-semibold text-[#192547] outline-none transition focus:border-[#01F767] focus:bg-white focus:shadow-[0_0_0_3px_rgba(1,247,103,0.15)] placeholder:font-medium placeholder:text-gray-300"
              />
            </div>
          </div>
        ))}

        <div className="h-px bg-[#e2e8f0]" />

        <button
          onClick={calcular}
          className="w-full rounded-xl bg-[#192547] py-3.5 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#1e3063] hover:shadow-lg active:scale-[0.99]"
        >
          Calcular Comprometimento
        </button>

        {error && (
          <div className="rounded-lg border border-[#fed7aa] bg-[#fff7ed] px-4 py-2.5 text-xs font-semibold text-[#c2410c]">
            Preencha o Salário Fixo com um valor maior que zero.
          </div>
        )}

        {result && rs && (
          <div className={`rounded-2xl ${rs.wrap} animate-[fadeIn_0.3s_ease]`}>
            <div className="flex items-center gap-4 px-5 py-4">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-black ${rs.icon}`}>
                {rs.symbol}
              </div>
              <div>
                <p className={`text-3xl font-black leading-none tracking-tight ${rs.pct}`}>
                  {result.pct}
                </p>
                <p className={`mt-1 text-xs font-bold ${rs.lbl}`}>
                  {result.label}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
