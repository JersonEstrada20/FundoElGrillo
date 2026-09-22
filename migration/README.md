# Migración: Base44 → Supabase + Cloudflare R2 + GitHub

Guía completa para migrar Cabañas Fundo El Grillo fuera de Base44.

## Stack destino

| Capa | Origen (Base44) | Destino |
|------|-----------------|----------|
| Frontend | React + Vite (en Base44) | React + Vite (GitHub, deploy en Cloudflare Pages o Vercel) |
| Base de datos | Base44 entities | Supabase (PostgreSQL) |
| Auth | Base44 Auth | Supabase Auth (email/password + Google) |
| Storage de imágenes | Base44 files | Cloudflare R2 (estáticas) + Supabase Storage (firmas dinámicas) |
| Backend functions | Base44 functions | Supabase Edge Functions (Deno) |
| Emails | Base44 SendEmail | Resend |
| Notificaciones | Base44 workflows | Supabase database triggers + pg_cron |

## Prerrequisitos

1. **Supabase** — crea cuenta en supabase.com, un proyecto nuevo
2. **Cloudflare** — crea cuenta, un bucket R2 para las imágenes estáticas
3. **GitHub** — repo nuevo para el código
4. **Resend** — cuenta gratuita para emails (resend.com)

## Paso 1 — Supabase: esquema de base de datos

1. Ve a Supabase → SQL Editor
2. Pega y ejecuta `supabase/schema.sql` (crea tablas, RLS, triggers)
3. Pega y ejecuta `supabase/seed.sql` (datos iniciales de cabañas — opcional si vas a exportar desde Base44)

## Paso 2 — Supabase: configurar Auth

1. Authentication → Providers → habilita **Email** y **Google**
2. Authentication → URL Configuration:
   - Site URL: `https://tu-dominio.cl`
   - Redirect URLs: `https://tu-dominio.cl/**`
3. Crea buckets de Storage:
   - `public` (público, para firmas y archivos)
   - `private` (privado, si necesitas archivos privados)

## Paso 3 — Cloudflare R2: bucket de imágenes

1. Cloudflare → R2 → crea bucket `fundo-el-grillo`
2. R2 → Settings → habilita acceso público (Public access) o usa dominio personalizado
3. Crea API token: R2 → Manage R2 API Tokens → Create API Token
   - Permisos: Object Read & Write
   - Guarda: `Account ID`, `Access Key ID`, `Secret Access Key`, `endpoint URL`

## Paso 4 — Variables de entorno

Copia `.env.example` a `.env` en la raíz del proyecto y completa:

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # solo para edge functions
RESEND_API_KEY=re_...               # para emails
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=fundo-el-grillo
R2_PUBLIC_URL=https://pub-xxx.r2.dev   # o tu dominio custom
```

## Paso 5 — Migrar imágenes a R2

```bash
cd migration/scripts
npm install
node migrate-images-to-r2.js
```

Esto descarga las 67 fotos desde Base44, las sube a R2, y genera `image-url-mapping.json` con las URLs nuevas.

Luego actualiza las URLs en el código (busca y reemplaza las URLs viejas por las nuevas del JSON).

## Paso 6 — Migrar datos desde Base44

```bash
node export-data.js
```

Esto descarga todas las entidades (Cabin, BookingRequest, VisitorEntry, User) como JSON.
Luego importa a Supabase con:

```bash
node import-data-to-supabase.js
```

## Paso 7 — Instalar dependencias del nuevo proyecto

```bash
npm install @supabase/supabase-js
```

## Paso 8 — Reemplazar el cliente

Copia `src/api/base44Client.js` del paquete de migración sobre el existente.
Este archivo exporta el mismo objeto `base44` con la misma API, pero respaldado por Supabase.

**No necesitas cambiar ningún componente** — todos los `import { base44 } from '@/api/base44Client'` siguen funcionando.

## Paso 9 — Reemplazar AuthContext

Copia `src/lib/AuthContext.jsx` del paquete de migración. Usa Supabase Auth en lugar de Base44 Auth.

## Paso 10 — Desplegar Edge Functions

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login y link
supabase login
supabase link --project-ref tu-project-ref

# Desplegar funciones
supabase functions deploy notifyNewBooking
supabase functions deploy manageBooking
supabase functions deploy deleteAccount
```

## Paso 11 — Configurar notificaciones automáticas

En Supabase → SQL Editor, ejecuta:

```sql
-- Trigger: cuando se crea una booking_request, llama a la edge function
CREATE OR REPLACE FUNCTION notify_new_booking()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://xxx.supabase.co/functions/v1/notifyNewBooking',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.service_role'),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object('booking_id', NEW.id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_booking_created
  AFTER INSERT ON booking_request
  FOR EACH ROW EXECUTE FUNCTION notify_new_booking();
```

## Paso 12 — Desplegar frontend

**Opción A: Cloudflare Pages**
1. Cloudflare → Pages → Create project → Connect to Git
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variables: las `VITE_*` de arriba

**Opción B: Vercel**
1. Vercel → New Project → Import from Git
2. Framework: Vite
3. Environment variables: las `VITE_*`

## Paso 13 — Dominio personalizado

1. Cloudflare Pages (o Vercel) → Custom domains → añade `fundoelgrillo.cl` (o el que tengas)
2. Configura DNS según las instrucciones
3. En Supabase → Authentication → URL Configuration → actualiza Site URL

## Checklist final

- [ ] Supabase: schema.sql ejecutado
- [ ] Supabase: Auth providers configurados (Email + Google)
- [ ] Supabase: Storage buckets creados (public, private)
- [ ] R2: bucket creado y público
- [ ] R2: API token creado
- [ ] .env completado
- [ ] Imágenes migradas a R2
- [ ] Datos migrados a Supabase
- [ ] base44Client.js reemplazado
- [ ] AuthContext.jsx reemplazado
- [ ] Edge functions desplegadas
- [ ] Trigger de notificación creado
- [ ] Frontend desplegado
- [ ] Dominio configurado
- [ ] Login funciona (email + Google)
- [ ] Panel admin funciona (registro de ingresos)
- [ ] Formulario de reserva funciona
- [ ] Emails de notificación llegan