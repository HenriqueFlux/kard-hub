@AGENTS.md

# CLAUDE.md — Kard Hub (Portal de Parceiros)

## Visão do Projeto

Portal web centralizado para parceiros da Kard (correspondentes bancários, donos de financeira, RHs).
Funciona como **front-end de navegação** — todo conteúdo aponta para links externos (Google Drive, WhatsApp, sistemas internos).

**Branding final:** Kard Hub — verde #01F767 protagonista + azul #192547 base
**Versão atual:** MVP

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + Tailwind CSS v4 |
| Framework/Deploy | Next.js 16 (App Router) → Cloudflare Pages |
| Backend/API | Next.js Route Handlers → Cloudflare Workers |
| Banco de dados | Supabase (PostgreSQL) |
| Auth | Supabase Auth (SSR) |
| Storage | Sem upload — arquivos no Google Drive |
| E-mail (reset senha) | Resend |
| Ícones | Lucide React |

---

## Identidade Visual

| Token | Valor | Uso |
|-------|-------|-----|
| Primary Green | `#01F767` | Destaque, botões primários, nav ativo |
| Primary Dark | `#192547` | Sidebar, headers, textos principais |
| Mid Green | `#52FFA0` | Hover states, bordas de foco |
| Background | `#F4F6FA` | Área de conteúdo |
| Text | `#1A1A2E` | Corpo de texto |
| Border | `#E2E8F0` | Divisores, bordas de cards |

**Fonte:** Montserrat (Google Fonts) — Bold/ExtraBold títulos, Regular/Medium corpo

**Componentes visuais:**
- Cards: sombra suave, border-radius 10–12px
- Botão primário: `bg-[#01F767] text-[#192547]`
- Sidebar: `bg-[#192547]`, item ativo `bg-[#01F767] text-[#192547]`
- Ícones: Lucide React

---

## Usuários e Permissões

| Perfil | Acesso |
|--------|--------|
| `user` | Dashboard + 5 seções + links do menu |
| `admin` | Tudo + Painel de Administração |

- Sem auto-cadastro — admin cria contas
- Admin pode ativar/desativar usuários

---

## Estrutura de Rotas (`src/app/`)

```
/                       → redirect para /dashboard (auth) ou /login
/login                  → página de login
/(portal)/layout.tsx    → layout autenticado (sidebar + topbar)
/(portal)/dashboard     → home com saudação, cards rápidos e comunicados
/(portal)/materiais     → grade de cards → link Google Drive
/(portal)/roteiros      → lista com busca por convênio → link PDF
/(portal)/instrucoes    → lista de cards → link PDF
/(portal)/criativos     → galeria grid com thumb → link
/(portal)/tutoriais     → grade de vídeos → link externo
/(portal)/admin/...     → painel admin (somente perfil admin)
/api/auth/...           → route handlers de auth
```

---

## Modelo de Dados (Supabase)

### `profiles` (extends auth.users)
- `id` uuid FK, `name` text, `role` enum(user|admin), `active` boolean

### `content_items`
- `id`, `section` enum(materiais|roteiros|instrucoes|criativos|tutoriais)
- `title`, `description`, `url`, `thumbnail_url`, `type`, `tags`
- `order` int, `active` boolean, `created_at`
- Campos extras: `convenio` (roteiros), `uf` (roteiros), `duration` (tutoriais), `category` (tutoriais)

### `menu_items`
- `id`, `label`, `icon`, `url`, `order`, `active`

### `announcements`
- `id`, `title`, `body`, `expires_at`, `active`, `created_at`

---

## Regras de Desenvolvimento

- Sem upload de arquivos — admin cola URL do Google Drive
- Links externos: sempre `target="_blank" rel="noopener noreferrer"`
- Thumbnails: URL informada pelo admin no cadastro
- Desktop-first; responsivo tablet; mobile com menu hambúrguer
- Supabase RLS ativo em todas as tabelas
- Edge runtime para middleware de auth (compatível com Cloudflare)

---

## Critérios de Aceite (MVP)

- [ ] Login funcional (user + admin)
- [ ] 5 seções com cards e links externos
- [ ] Menu lateral com 7 links configuráveis
- [ ] Admin: CRUD completo de conteúdo
- [ ] Admin: criar/editar/desativar usuários
- [ ] Admin: gerenciar comunicados do dashboard
- [ ] Identidade visual Kard Hub aplicada
- [ ] Responsivo desktop e tablet
- [ ] Logout funcional

---

## Fora do Escopo (MVP)

- Upload direto de arquivos
- Integração API Google Drive
- App mobile nativo
- Chat entre parceiros
- Relatórios analíticos
- Pagamentos / comissões
- IA / agente conversacional
