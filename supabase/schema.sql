-- ============================================================
-- KARD HUB — Schema Supabase
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================================

-- Extensão necessária
create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────────────────────────
-- PROFILES (estende auth.users)
-- ──────────────────────────────────────────────────────────
create type user_role as enum ('user', 'admin');

create table profiles (
  id        uuid primary key references auth.users(id) on delete cascade,
  name      text not null,
  email     text not null,
  role      user_role not null default 'user',
  active    boolean not null default true,
  created_at timestamptz not null default now()
);

-- Trigger: cria profile automaticamente no signup (via admin API)
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  -- Profile criado manualmente via API admin, não precisa de trigger automático
  return new;
end;
$$;

-- RLS
alter table profiles enable row level security;

create policy "Users can read their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can update profiles"
  on profiles for update
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can insert profiles"
  on profiles for insert
  with check (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ──────────────────────────────────────────────────────────
-- CONTENT ITEMS
-- ──────────────────────────────────────────────────────────
create type content_section as enum (
  'materiais', 'roteiros', 'instrucoes', 'criativos', 'tutoriais'
);

create type content_type as enum (
  'pdf', 'planilha', 'imagem', 'video', 'link'
);

create table content_items (
  id            uuid primary key default uuid_generate_v4(),
  section       content_section not null,
  title         text not null,
  description   text,
  url           text not null,
  thumbnail_url text,
  type          content_type not null default 'link',
  tags          text[],
  "order"       integer not null default 0,
  active        boolean not null default true,
  -- Extras por seção
  convenio      text,
  uf            char(2),
  duration      text,
  category      text,
  created_at    timestamptz not null default now()
);

-- RLS
alter table content_items enable row level security;

create policy "Authenticated users can read active content"
  on content_items for select
  to authenticated
  using (active = true);

create policy "Admins can read all content"
  on content_items for select
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can insert content"
  on content_items for insert
  with check (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update content"
  on content_items for update
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete content"
  on content_items for delete
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ──────────────────────────────────────────────────────────
-- MENU ITEMS
-- ──────────────────────────────────────────────────────────
create table menu_items (
  id      uuid primary key default uuid_generate_v4(),
  label   text not null,
  icon    text not null default 'link',
  url     text not null,
  "order" integer not null default 0,
  active  boolean not null default true
);

-- RLS
alter table menu_items enable row level security;

create policy "Authenticated users can read active menu"
  on menu_items for select
  to authenticated
  using (active = true);

create policy "Admins can read all menu items"
  on menu_items for select
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can update menu"
  on menu_items for update
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Seed: 7 links padrão
insert into menu_items (label, icon, url, "order") values
  ('Sistema de Digitação', 'sistema',    'https://', 1),
  ('Grupo do WhatsApp',    'whatsapp',   'https://', 2),
  ('Marketing',            'marketing',  'https://', 3),
  ('Calculadora',          'calculadora','https://', 4),
  ('Drive Corban Kard',    'drive',      'https://', 5),
  ('Indique um Convênio',  'indicacao',  'https://', 6),
  ('Roteiros',             'sistema',    '/roteiros',7);

-- ──────────────────────────────────────────────────────────
-- ANNOUNCEMENTS
-- ──────────────────────────────────────────────────────────
create table announcements (
  id         uuid primary key default uuid_generate_v4(),
  title      text not null,
  body       text not null,
  expires_at timestamptz,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

-- RLS
alter table announcements enable row level security;

create policy "Authenticated users can read active announcements"
  on announcements for select
  to authenticated
  using (active = true and (expires_at is null or expires_at > now()));

create policy "Admins can manage announcements"
  on announcements for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
