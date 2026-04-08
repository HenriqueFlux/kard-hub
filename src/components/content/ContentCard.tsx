import { ExternalLink, FileText, Sheet, Image, Video, Link as LinkIcon } from 'lucide-react'
import type { ContentItem } from '@/lib/types'

const typeIcons = {
  pdf: FileText,
  planilha: Sheet,
  imagem: Image,
  video: Video,
  link: LinkIcon,
}

const typeLabels = {
  pdf: 'PDF',
  planilha: 'Planilha',
  imagem: 'Imagem',
  video: 'Vídeo',
  link: 'Link',
}

interface ContentCardProps {
  item: ContentItem
  variant?: 'default' | 'image' | 'video' | 'grid'
  actionLabel?: string
}

export default function ContentCard({
  item,
  variant = 'default',
  actionLabel = 'Acessar',
}: ContentCardProps) {
  const Icon = typeIcons[item.type] ?? LinkIcon

  if (variant === 'image' && item.thumbnail_url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm transition hover:border-[#01F767] hover:shadow-md"
      >
        <div className="relative h-40 overflow-hidden bg-gray-100">
          <img
            src={item.thumbnail_url}
            alt={item.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
            <ExternalLink
              size={20}
              className="scale-0 text-white transition group-hover:scale-100"
            />
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm font-bold text-[#192547]">{item.title}</p>
          {item.convenio && (
            <p className="mt-0.5 text-xs text-gray-400">{item.convenio}</p>
          )}
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#01F767]/10 px-2 py-0.5 text-[10px] font-bold text-[#00963F]">
            {actionLabel}
          </span>
        </div>
      </a>
    )
  }

  if (variant === 'video') {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm transition hover:border-[#01F767] hover:shadow-md"
      >
        <div className="relative h-40 overflow-hidden bg-[#192547]/10">
          {item.thumbnail_url ? (
            <img
              src={item.thumbnail_url}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Video size={32} className="text-[#192547]/30" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#192547]/80 transition group-hover:bg-[#192547]">
              <svg viewBox="0 0 24 24" className="ml-1 h-5 w-5 fill-white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm font-bold text-[#192547]">{item.title}</p>
          <div className="mt-1 flex items-center gap-2">
            {item.category && (
              <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                {item.category}
              </span>
            )}
            {item.duration && (
              <span className="text-[10px] text-gray-400">• {item.duration}</span>
            )}
          </div>
        </div>
      </a>
    )
  }

  if (variant === 'grid') {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-4 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:border-[#01F767] hover:shadow-md"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F6FA] transition group-hover:bg-[#01F767]/10">
          <Icon size={18} className="text-[#192547] transition group-hover:text-[#01C954]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#192547]">{item.title}</p>
          {item.description && (
            <p className="mt-0.5 text-xs text-gray-400 line-clamp-2">{item.description}</p>
          )}
          {item.convenio && (
            <p className="mt-0.5 text-xs text-gray-400">
              {item.convenio}{item.uf && ` · ${item.uf}`}
            </p>
          )}
        </div>
        <ExternalLink size={14} className="mt-0.5 shrink-0 text-gray-300 transition group-hover:text-[#01F767]" />
      </a>
    )
  }

  return (
    <div className="flex items-start gap-4 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:border-[#01F767] hover:shadow-md">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F6FA]">
        <Icon size={18} className="text-[#192547]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#192547]">{item.title}</p>
        {item.description && (
          <p className="mt-0.5 text-xs text-gray-400">{item.description}</p>
        )}
        {item.convenio && (
          <p className="mt-0.5 text-xs text-gray-400">
            {item.convenio}
            {item.uf && ` · ${item.uf}`}
          </p>
        )}
        <div className="mt-3">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#01F767] px-3.5 py-1.5 text-xs font-bold text-[#192547] transition hover:opacity-90"
          >
            {actionLabel}
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
      <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
        {typeLabels[item.type]}
      </span>
    </div>
  )
}
