'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface Option {
  value: string
  label: string
}

interface FilterBarProps {
  options: Option[]
  paramKey: string
  current: string
}

export default function FilterBar({ options, paramKey, current }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function navigate(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === options[0].value) {
      params.delete(paramKey)
    } else {
      params.set(paramKey, value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => navigate(value)}
          className={[
            'rounded-full px-4 py-1.5 text-xs font-bold transition',
            current === value
              ? 'bg-[#192547] text-[#01F767]'
              : 'bg-white text-gray-500 border border-[#E2E8F0] hover:border-[#192547] hover:text-[#192547]',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
