export type UserRole = 'user' | 'admin'

export type ContentSection =
  | 'materiais'
  | 'roteiros'
  | 'instrucoes'
  | 'criativos'
  | 'tutoriais'

export type ContentType = 'pdf' | 'planilha' | 'imagem' | 'video' | 'link'

export interface Profile {
  id: string
  name: string
  email: string
  role: UserRole
  active: boolean
  created_at: string
}

export interface ContentItem {
  id: string
  section: ContentSection
  title: string
  description: string | null
  url: string
  thumbnail_url: string | null
  type: ContentType
  tags: string[] | null
  order: number
  active: boolean
  created_at: string
  // Extras por seção
  convenio?: string | null
  uf?: string | null
  duration?: string | null
  category?: string | null
}

export interface MenuItem {
  id: string
  label: string
  icon: string
  url: string
  order: number
  active: boolean
}

export interface Announcement {
  id: string
  title: string
  body: string
  expires_at: string | null
  active: boolean
  created_at: string
}
