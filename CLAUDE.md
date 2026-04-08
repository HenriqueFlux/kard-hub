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
| Framework/Deploy | Next.js 15 (App Router) → Cloudflare Pages |
| Build adapter | @cloudflare/next-on-pages@1 (via `npx @cloudflare/next-on-pages@1`) |
| Backend/API | Next.js Route Handlers (Edge Runtime) |
| Banco de dados | Supabase (PostgreSQL) — projeto `fkinybthrvkijwwtaqxm` |
| Auth | Supabase Auth (SSR via @supabase/ssr) |
| Storage | Sem upload — arquivos no SharePoint/Google Drive |
| E-mail (reset senha) | Resend (não implementado ainda) |
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
- Campos extras: `convenio` (roteiros/criativos), `uf` (roteiros/criativos), `duration` (tutoriais), `category` (roteiros + tutoriais)
- Categorias de roteiros: Governos, Prefeituras, Tribunais, Previdências
- Categorias de tutoriais: Onboarding, Operacional, Produtos, Marketing

### `menu_items`
- `id`, `label`, `icon`, `url`, `order`, `active`

### `announcements`
- `id`, `title`, `body`, `expires_at`, `active`, `created_at`

---

## Links Rápidos (menu_items no Supabase)

| Label | URL |
|-------|-----|
| Sistema de Digitação | https://portal.konectpay.com.br/WebFIMenuMVC/Login/AC.UI.LOGIN.aspx?FISession=dd8165897407 |
| Grupo do WhatsApp | https://chat.whatsapp.com/F8ytHKyB0huGMwZJWTnkeD |
| Marketing | https://kardbank-my.sharepoint.com/personal/paulo_silva_kardbank_com_br/_layouts/15/onedrive.aspx?id=... |
| Calculadora | https://kard.com.br/calculadora-de-comprometimento/ |
| Drive Corban Kard | https://kardbank-my.sharepoint.com/:f:/g/personal/paulo_silva_kardbank_com_br/IgBBsHaDAAGGRbS0bLg91Zj-AYLHymnrxK2W-LQ3QzBdSuQ?e=v84s0d |
| Indique um Convênio | https://kardbankers.com.br/abertura-de-convenios/ |

**Nota:** "Roteiros" foi removido dos links rápidos (active=false).

---

## Seções de Conteúdo (content_items)

| Seção | Label na UI | Status |
|-------|-------------|--------|
| materiais | Materiais de Suporte | Ativo — grid 3 cols com thumb quando disponível |
| roteiros | Roteiros Operacionais | Ativo — grid 3 cols, card com badge categoria + estado, filtro por categoria, busca |
| instrucoes | Instruções Operacionais | Ativo — grid 3 cols sem thumb |
| criativos | Criativos para Convênios | Ativo — grid 3 cols sem thumb |
| tutoriais | Tutoriais (Em breve) | Bloqueado — ícone cadeado na sidebar |

Links de conteúdo por seção (SharePoint):
- Criativos: https://kardbank-my.sharepoint.com/:f:/g/personal/paulo_silva_kardbank_com_br/IgBhJLHnj8FkRp02nD-0nYQPATAjZkteEdD7mRddk4eOJqM?e=nv0mgO
- Materiais de Suporte: https://kardbank-my.sharepoint.com/:f:/g/personal/paulo_silva_kardbank_com_br/IgC8uzhWXw6ERqmg-SfFts47AZ3VyumE8q1pjJ-HqPrOGyg?e=mklRbN
- Instruções Operacionais: https://kardbank-my.sharepoint.com/:f:/g/personal/paulo_silva_kardbank_com_br/IgCIpuN-1rk2T60USBZqtY0eAXmjYaWBKdB1d8G6JhlGowU?e=yadEUL

---

## Deploy (Cloudflare Pages)

- Projeto: `kard-hub` em `Henrique.oliveira@kard.com.br's Account`
- Repositório: `HenriqueFlux/kard-hub` (branch `master`)
- Build command: `npx @cloudflare/next-on-pages@1`
- Build output directory: `.vercel/output/static`
- URL: `https://kard-hub.pages.dev`
- Env vars necessárias: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`, `NPM_FLAGS=--legacy-peer-deps`

**IMPORTANTE:** `export const runtime = 'edge'` é obrigatório em TODOS os arquivos server-side (pages, layouts, route handlers). Sem isso o build falha no Cloudflare.

---

## Problemas Conhecidos e Soluções

- **Login loop (`/login?error=conta_inativa`)**: Usar `window.location.href = '/dashboard'` no LoginForm, não `router.push()`. RLS do Supabase deve ser simples e não-recursivo.
- **Peer deps conflict**: `npm install --legacy-peer-deps` ou `NPM_FLAGS=--legacy-peer-deps` no Cloudflare.
- **Build local Windows**: `vercel build` falha por symlinks. Usar deploy via Git no Cloudflare Pages.
- **Admin não vê todos os usuários**: `createAdminClient()` deve usar `createClient` do `@supabase/supabase-js` com `SUPABASE_SERVICE_ROLE_KEY` diretamente (não `createServerClient` do SSR). É síncrono — não usar `await`.
- **Usuário criado não aparece na lista**: perfil pode ter sido criado no `auth.users` mas não na tabela `profiles`. Inserir manualmente via SQL: `INSERT INTO profiles (id, name, email, role, active) SELECT id, '...', '...', 'user', true FROM auth.users WHERE email = '...'`

---

## Regras de Desenvolvimento

- Sem upload de arquivos — admin cola URL do SharePoint/Google Drive
- Links externos: sempre `target="_blank" rel="noopener noreferrer"`
- Thumbnails: URL informada pelo admin no cadastro
- Desktop-first; responsivo tablet; mobile com menu hambúrguer
- Supabase RLS ativo em todas as tabelas
- Edge runtime obrigatório em todos os arquivos server-side (Cloudflare)

---

## Critérios de Aceite (MVP)

- [x] Login funcional (user + admin)
- [x] 5 seções com cards e links externos
- [x] Menu lateral com links configuráveis
- [x] Admin: CRUD completo de conteúdo
- [x] Admin: criar/editar/desativar usuários
- [x] Admin: gerenciar comunicados do dashboard
- [x] Identidade visual Kard Hub aplicada
- [x] Responsivo desktop e tablet
- [x] Logout funcional
- [x] Deploy na Cloudflare Pages

---

## Fora do Escopo (MVP)

- Upload direto de arquivos
- Integração API Google Drive
- App mobile nativo
- Chat entre parceiros
- Relatórios analíticos
- Pagamentos / comissões
- IA / agente conversacional
