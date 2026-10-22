-- ==============================================================================
-- BIOCLEAN MASTER - SCHEMA OFICIAL DE BASE DE DATOS (SUPABASE / POSTGRESQL)
-- ==============================================================================
-- Copie y pegue este script en el SQL Editor de su proyecto de Supabase para
-- inicializar las tablas de cotizaciones y usuarios administradores con RLS.

-- 1. Habilitar extensiones requeridas
create extension if not exists "uuid-ossp";

-- 2. Tabla de Cotizaciones (Quotes)
create table if not exists public.quotes (
  id text primary key, -- Folio único con formato BCM-YYYYMMDD-XXXX
  created_at timestamptz not null default now(),
  status text not null default 'nueva',
  client jsonb not null default '{}'::jsonb,
  property jsonb not null default '{}'::jsonb,
  service jsonb not null default '{}'::jsonb,
  assigned_to text not null default 'Sin asignar',
  follow_up_date text,
  notes jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Índices para optimizar consultas y búsquedas
create index if not exists idx_quotes_status on public.quotes(status);
create index if not exists idx_quotes_created_at on public.quotes(created_at desc);

-- 3. Tabla de Usuarios Administradores (Admin Users)
create table if not exists public.admin_users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  password_hash text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Semilla de Administrador Inicial
insert into public.admin_users (email, password_hash, role)
values ('admin@bioclean.mx', 'bioclean2026', 'admin')
on conflict (email) do nothing;

-- 5. Configuración de Seguridad por Nivel de Fila (Row Level Security - RLS)
alter table public.quotes enable row level security;
alter table public.admin_users enable row level security;

-- Política 5.1: Permitir que cualquier visitante anónimo registre cotizaciones desde la web
drop policy if exists "Permitir insercion publica de cotizaciones" on public.quotes;
create policy "Permitir insercion publica de cotizaciones"
on public.quotes for insert
to anon, authenticated
with check (true);

-- Política 5.2: Permitir lectura y gestión de cotizaciones
drop policy if exists "Permitir lectura y gestion de cotizaciones" on public.quotes;
create policy "Permitir lectura y gestion de cotizaciones"
on public.quotes for all
to anon, authenticated
using (true)
with check (true);

-- Política 5.3: Permitir autenticación y actualización de credenciales de administradores
drop policy if exists "Permitir acceso a administradores" on public.admin_users;
create policy "Permitir acceso a administradores"
on public.admin_users for all
to anon, authenticated
using (true)
with check (true);

-- 6. Trigger automático para actualizar updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_quotes_updated on public.quotes;
create trigger on_quotes_updated
before update on public.quotes
for each row execute function public.handle_updated_at();

drop trigger if exists on_admin_users_updated on public.admin_users;
create trigger on_admin_users_updated
before update on public.admin_users
for each row execute function public.handle_updated_at();
