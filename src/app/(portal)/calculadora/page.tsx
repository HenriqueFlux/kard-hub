export const runtime = 'edge'

import CalculadoraClient from './CalculadoraClient'

export const metadata = { title: 'Calculadora de Comprometimento — Kard Hub' }

export default function CalculadoraPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#192547]">Calculadora de Comprometimento</h2>
        <p className="mt-1 text-sm text-gray-500">
          Limite de comprometimento: 70% da renda bruta
        </p>
      </div>
      <CalculadoraClient />
    </div>
  )
}
