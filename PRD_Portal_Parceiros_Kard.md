# PRD — Portal de Parceiros Kard
**Versão:** 1.0  
**Data:** Abril 2026  
**Status:** Draft para revisão

---

## 1. Visão Geral

### 1.1 Objetivo
Criar um portal web centralizado para parceiros (correspondentes bancários, donos de financeira, RHs) da Kard, funcionando como **front-end de acesso a materiais e ferramentas operacionais**. O portal não armazena conteúdo próprio — todo material aponta para links externos (OneDrive, WhatsApp, sistemas internos).

### 1.2 Problema que resolve
Parceiros atualmente acessam materiais de forma dispersa (WhatsApp, e-mail, links avulsos). O portal centraliza tudo em um único ambiente autenticado, organizado e com identidade visual da Kard.

### 1.3 Princípio de design
- **Front-end de navegação**, não de armazenamento
- Cada card/item = link para recurso externo (OneDrive ou ferramenta)
- Simples de manter: atualizar um link no admin já reflete para todos os usuários

---

## 2. Usuários e Permissões

### 2.1 Tipos de usuário

| Perfil | Descrição | Acesso |
|--------|-----------|--------|
| **Usuário Comum** | Parceiro/correspondente ativo | Materiais + links do menu lateral |
| **Admin** | Equipe interna Kard | Tudo do comum + painel de administração |

### 2.2 Fluxo de acesso
- Login com e-mail + senha
- Admin pode criar, editar e desativar contas de usuários comuns
- Sem auto-cadastro: acesso somente por convite/criação pelo admin

---

## 3. Arquitetura de Telas

### 3.1 Estrutura geral
```
Portal
├── Login
├── Dashboard (home)
├── Materiais de Suporte
├── Roteiros Operacionais por Convênio
├── Instruções Operacionais
├── Criativos para Convênios
├── Tutoriais e Conteúdos
└── [Admin] Painel de Administração
```

**Menu lateral fixo** presente em todas as telas autenticadas, com links externos diretos.

---

## 4. Telas — Usuário Comum

### 4.1 Login
- Campo: e-mail + senha
- Link "Esqueci minha senha" (envio por e-mail)
- Sem cadastro público
- Redirecionamento pós-login → Dashboard

---

### 4.2 Dashboard (Home)
**Objetivo:** visão geral e acesso rápido às seções principais.

**Componentes:**
- Saudação personalizada com nome do usuário
- Cards de acesso rápido para as 5 seções principais
- Avisos/comunicados recentes (gerenciado pelo admin — campo de texto simples)
- Logo Kard e identidade visual padrão (azul `#192547` + verde `#01F767`)

---

### 4.3 Materiais de Suporte
**Objetivo:** repositório de arquivos de apoio operacional.

**Tipos de conteúdo suportados:**
- PDFs
- Planilhas (Excel/Google Sheets via link)
- Imagens

**Layout:** grade de cards. Cada card contém:
- Ícone do tipo de arquivo (PDF / planilha / imagem)
- Título do material
- Descrição curta (opcional)
- Botão "Acessar" → abre link do OneDrive em nova aba

**Filtro:** por tipo de arquivo (PDF / Planilha / Imagem)

---

### 4.4 Roteiros Operacionais por Convênio
**Objetivo:** acesso rápido ao roteiro de cada convênio ativo.

**Layout:** lista com busca/filtro por nome do convênio (cidade ou órgão).

Cada item contém:
- Nome do convênio (ex: "Prefeitura de Luziânia")
- Estado/UF
- Botão "Ver Roteiro" → link para PDF no OneDrive

**Campo de busca:** filtra em tempo real por nome do convênio.

> **Nota:** A lista de convênios é cadastrada e atualizada pelo admin.

---

### 4.5 Instruções Operacionais
**Objetivo:** acesso a PDFs com processos internos e procedimentos operacionais.

**Layout:** lista de cards simples.

Cada card:
- Título da instrução
- Data de atualização (opcional)
- Botão "Acessar" → link para PDF no OneDrive

---

### 4.6 Criativos para Convênios
**Objetivo:** banco de imagens/artes prontas para uso pelos parceiros.

**Layout:** galeria em grid (thumbnail das imagens).

Cada item:
- Preview da imagem (thumbnail)
- Nome do convênio/criativo
- Botão "Baixar / Acessar" → link OneDrive

**Filtro:** por convênio (dropdown)

---

### 4.7 Tutoriais e Conteúdos para Parceiros
**Objetivo:** vídeos de treinamento e capacitação.

**Layout:** grade de cards de vídeo.

Cada card:
- Thumbnail do vídeo
- Título
- Duração (opcional)
- Botão "Assistir" → link externo (YouTube, Vimeo ou OneDrive)

**Categorias sugeridas (filtro):**
- Onboarding
- Operacional
- Produtos
- Marketing

---

### 4.8 Menu Lateral (Links Rápidos)
Presente em todas as telas autenticadas. Links abrem em nova aba.

| Item do Menu | Destino |
|---|---|
| 🖥️ Sistema de Digitação | Link externo (sistema interno) |
| 💬 Grupo do WhatsApp | Link de convite WhatsApp |
| 📋 Roteiros Operacionais | Seção interna do portal |
| 🎨 Marketing | Link externo (pasta OneDrive ou ferramenta) |
| 🧮 Calculadora de Comprometimento | Link externo (planilha/app) |
| 📁 Drive Corban Kard | Link OneDrive |
| 📣 Indique um Convênio | Link externo (formulário Google Forms ou similar) |

> **Todos os links do menu são editáveis pelo admin.**

---

## 5. Telas — Admin

### 5.1 Painel Administrativo
Acesso exclusivo via perfil Admin. Abas ou sub-menu separado.

---

### 5.2 Gestão de Usuários
- Listar todos os usuários (nome, e-mail, status ativo/inativo)
- Criar novo usuário (nome, e-mail, senha temporária, perfil)
- Editar usuário (nome, e-mail, ativar/desativar)
- Resetar senha

---

### 5.3 Gestão de Conteúdo
Para cada seção do portal, o admin pode:
- **Adicionar** novo item (título, descrição, link OneDrive, tipo)
- **Editar** item existente
- **Excluir** item
- **Reordenar** itens (drag-and-drop ou campo de ordem)

Seções gerenciáveis:
- Materiais de Suporte
- Roteiros Operacionais (inclui campo: nome do convênio + UF)
- Instruções Operacionais
- Criativos para Convênios
- Tutoriais e Conteúdos

---

### 5.4 Gestão do Menu Lateral
- Editar o link de destino de cada item do menu
- Ativar/desativar itens do menu
- (Opcional) Adicionar novos itens ao menu

---

### 5.5 Comunicados (Dashboard)
- Campo de texto para aviso visível na home de todos os usuários
- Possibilidade de ter 0 a N comunicados ativos
- Cada comunicado: título + texto + data de expiração (opcional)

---

## 6. Requisitos Técnicos

### 6.1 Stack sugerida (para Claude Code)
| Camada | Sugestão |
|--------|----------|
| Frontend | React + Tailwind CSS |
| Backend | Node.js (Express) ou Next.js full-stack |
| Banco de dados | SQLite (MVP) → PostgreSQL (produção) |
| Autenticação | JWT + bcrypt |
| Hospedagem | Vercel / Railway / Render |

> O Henrique deve validar e ajustar a stack conforme preferência.

### 6.2 Integrações externas
- Todos os links de conteúdo são URLs externas — sem integração direta com OneDrive
- Nenhum upload de arquivo dentro do portal (MVP)
- E-mail de reset de senha: NodeMailer + SMTP simples

### 6.3 Responsividade
- Desktop-first, mas responsivo para tablets
- Mobile: menu lateral colapsável (hambúrguer)

---

## 7. Identidade Visual

### 7.1 Cores (conforme Manual de Identidade Kard)
| Token | Valor |
|-------|-------|
| Primary Dark (Azul Kard) | `#192547` |
| Primary Green | `#01F767` |
| Background | `#F4F6FA` (sugestão para área de conteúdo) |
| Text | `#1A1A2E` |
| Border/Divider | `#E2E8F0` |

### 7.2 Tipografia
- Fonte oficial da marca: **Montserrat** (Google Fonts)
- Títulos: Montserrat Bold/ExtraBold
- Corpo: Montserrat Regular/Medium

### 7.3 Componentes visuais
- Cards com sombra suave e bordas arredondadas (8–12px)
- Botão primário: verde `#01F767` com texto azul `#192547`
- Botão secundário: borda azul, fundo transparente
- Ícones: Lucide Icons ou Heroicons (coerente com Tailwind)
- Menu lateral: fundo azul escuro `#192547`, texto branco, item ativo com destaque verde

---

## 8. Funcionalidades Opcionais (Backlog)

Sugestões para iterações futuras, não obrigatórias no MVP:

| Funcionalidade | Valor |
|---|---|
| Notificações de novos materiais | Alerta visual quando admin adiciona conteúdo |
| Histórico de acessos por usuário | Admin visualiza o que cada parceiro acessou |
| Busca global | Campo de busca unificado em todo o portal |
| Upload direto de arquivos | Admin faz upload sem precisar do OneDrive |
| Ranking de parceiros | Gamificação leve para engajamento |
| Integração WhatsApp API | Envio de notificações via WhatsApp Business |
| Onboarding guiado | Tour interativo para novos parceiros |

---

## 9. Critérios de Aceite (MVP)

- [ ] Login funcional com dois perfis (comum e admin)
- [ ] Todas as 5 seções de conteúdo exibem cards com link para OneDrive
- [ ] Menu lateral com os 7 links externos configurados
- [ ] Admin consegue adicionar/editar/excluir itens em todas as seções sem tocar no código
- [ ] Admin consegue criar e desativar usuários
- [ ] Identidade visual alinhada ao Manual Kard (cores + tipografia Montserrat)
- [ ] Responsivo em desktop e tablet
- [ ] Logout funcional com sessão encerrada

---

## 10. Fora do Escopo (MVP)

- Upload de arquivos direto no portal
- Integração com API do OneDrive
- App mobile nativo
- Chat interno entre parceiros
- Relatórios analíticos avançados
- Pagamento ou comissões

---

*PRD elaborado para desenvolvimento via Claude Code. Dúvidas ou ajustes: alinhar com o time Kard antes de iniciar o sprint.*
