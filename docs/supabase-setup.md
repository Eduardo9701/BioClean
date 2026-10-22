# Guía de Conexión y Configuración de Supabase para BioClean Master

Esta guía detalla los pasos para conectar la aplicación web de **BioClean Master** con una base de datos en la nube en **Supabase** (PostgreSQL) para el almacenamiento de cotizaciones y la gestión de usuarios administradores.

---

## 1. Crear el Proyecto en Supabase (Gratuito)

1. Ingresa a [supabase.com](https://supabase.com/) e inicia sesión con tu cuenta de GitHub o correo.
2. Haz clic en **"New Project"**.
3. Completa los datos del proyecto:
   - **Name:** `BioClean-Master`
   - **Database Password:** Elige una contraseña segura (guárdala en un lugar seguro).
   - **Region:** Selecciona `East US (North Virginia)` o la más cercana a México para baja latencia.
   - **Pricing Plan:** Free tier (\$0 USD / mes).
4. Haz clic en **"Create new project"** y espera unos 60 segundos a que se aprovisione la base de datos.

---

## 2. Ejecutar el Script SQL de Inicialización

1. En el panel lateral izquierdo de tu proyecto en Supabase, ve a **SQL Editor** (icono con `>_`).
2. Haz clic en **"New query"**.
3. Copia y pega el contenido completo del archivo [`supabase/schema.sql`](../supabase/schema.sql):

```sql
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

-- 5. Seguridad por Nivel de Fila (RLS)
alter table public.quotes enable row level security;
alter table public.admin_users enable row level security;

create policy "Permitir insercion publica de cotizaciones"
on public.quotes for insert
to anon, authenticated
with check (true);

create policy "Permitir lectura y gestion de cotizaciones"
on public.quotes for all
to anon, authenticated
using (true)
with check (true);

create policy "Permitir acceso a administradores"
on public.admin_users for all
to anon, authenticated
using (true)
with check (true);
```

4. Haz clic en el botón verde **"Run"**. Verás el mensaje `Success. No rows returned`.

---

## 3. Obtener las Claves de API de Supabase

1. En el panel de Supabase, ve a **Project Settings** (icono de engranaje abajo a la izquierda) -> **API**.
2. Encontrarás dos valores clave:
   - **Project URL:** Ejemplo: `https://xyzprojectid.supabase.co`
   - **Project API Keys / `anon` `public`:** Una clave larga que comienza con `eyJ...`

---

## 4. Configurar las Variables en el Proyecto

### En Desarrollo Local:
Crea o edita tu archivo `.env` en la raíz del proyecto:

```env
VITE_STORAGE_MODE="supabase"
VITE_SUPABASE_URL="https://tu-proyecto.supabase.co"
VITE_SUPABASE_ANON_KEY="tu-clave-anon-de-supabase-aqui"
```

### En Vercel (Producción):
1. Ve al Dashboard de tu proyecto en [vercel.com](https://vercel.com/).
2. Ve a **Settings** -> **Environment Variables**.
3. Agrega las dos variables:
   - `VITE_SUPABASE_URL` = `https://tu-proyecto.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `tu-clave-anon...`
4. Guarda y haz un nuevo **Redeploy** para que tomen efecto.

---

## 5. Funcionamiento del Sistema de Respaldo Híbrido

La aplicación cuenta con una arquitectura de **alta resiliencia**:
- **Si Supabase está configurado:** Guarda y sincroniza todas las cotizaciones y credenciales en Supabase Cloud. Además, mantiene un caché local para respuesta instantánea.
- **Si Supabase no está configurado o hay pérdida de conexión:** La aplicación opera transparentemente con **LocalStorage**, garantizando que ningún prospecto pierda su cotización ni se interrumpa el acceso al panel administrativo.
- **Cambio de contraseña:** Al cambiar la contraseña desde el panel administrativo, se actualiza tanto en Supabase (`admin_users`) como en el almacenamiento local.
