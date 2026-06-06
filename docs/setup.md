# Guía detallada de entorno

Versión ampliada del apartado de instalación del [README](../README.md). Cubre el entorno cliente, las variables del **servidor** (Edge Functions) y resolución de problemas.

---

## 1. Requisitos

| Herramienta | Versión | Notas |
| --- | --- | --- |
| Node.js | ≥ 20.19 (recomendado 22) | Requisito de Vite 6. El proyecto se desarrolla sobre Node 22. |
| npm | ≥ 10 | Se versiona `package-lock.json`. No hay config de yarn/pnpm. |
| Cuenta Supabase | — | Para la URL y la anon key del cliente. |
| Supabase CLI | última | **Solo** si vas a desplegar o ejecutar las Edge Functions localmente. |

No hay `.nvmrc` ni campo `engines`. Si usas `nvm`, puedes fijar tu versión con `nvm use 22`.

---

## 2. Clonado e instalación

```bash
git clone https://github.com/Porfolio-Javier-Lombardero/each-one-tech-one.git
cd each-one-tech-one
npm install
```

`npm install` usa `package-lock.json`. Para una instalación reproducible (CI), usa `npm ci`.

---

## 3. Variables de entorno del **cliente**

El front-end solo necesita dos variables, ambas con prefijo `VITE_` (Vite solo expone al bundle las que empiezan así).

```bash
cp .env.example .env
```

Edita `.env`:

```dotenv
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-anon-key-publica>
```

Dónde obtenerlas: panel de Supabase → **Project Settings → API** → `Project URL` y `anon`/`publishable key`.

**Sobre la seguridad de la anon key:** es pública por diseño. No es un secreto: la protección de los datos viene de las **RLS policies** de Postgres, no de ocultar esta key. Aun así, **no se versiona el `.env` real** — solo `.env.example` con placeholders. El `.env` está en `.gitignore`.

> **Validación al arrancar:** si falta alguna de las dos variables, [supabaseClient.ts](../src/shared/lib/supabaseClient.ts) lanza un error explícito en el arranque en vez de fallar silenciosamente más tarde.

---

## 4. Arrancar en desarrollo

```bash
npm run dev
```

- Vite sirve en `http://localhost:5173` (puerto por defecto).
- HMR activo: los cambios se reflejan sin recargar.
- En desarrollo se monta el panel de **React Query Devtools** (`initialIsOpen={false}`), útil para inspeccionar el estado de la caché por query key.

---

## 5. Scripts del proyecto

| Comando | Para qué |
| --- | --- |
| `npm run dev` | Desarrollo con HMR. |
| `npm run build` | `tsc -b` (type-check del proyecto) + `vite build` → `dist/`. Falla el build si hay errores de tipos. |
| `npm run preview` | Sirve el `dist/` ya construido, para validar el build de producción en local. |
| `npm run lint` | ESLint sobre todo el repo. |
| `npm run lint:fix` | ESLint con autofix. |
| `npm run type-check` | `tsc --noEmit` — solo comprobación de tipos, sin emitir. |
| `npm run test` | Vitest en modo run (una pasada). |
| `npm run test:watch` | Vitest en watch. |

Flujo recomendado antes de commitear: `npm run type-check && npm run lint && npm run test`.

---

## 6. Testing

- **Runner:** Vitest 4 con entorno `jsdom`.
- **Librerías:** `@testing-library/react`.
- **Dónde:** tests junto a su hook, en carpetas `__tests__/` (p. ej. `features/news/hooks/__tests__/useGetHeadlines.test.tsx`).
- **Mocks:** `shared/mocks/` contiene `Mock*Repository` (implementan los mismos ports que los repositorios reales) y `fixtures/` con datos de ejemplo. Gracias a la inyección de dependencias en los hooks, un test pasa el mock como segundo argumento sin tocar red ni Supabase.

```bash
npm run test          # una pasada
npm run test:watch    # watch durante desarrollo
```

---

## 7. Backend: Supabase y Edge Functions

El cliente **no** llama directamente a las APIs externas (TechCrunch vía RapidAPI, The Guardian, YouTube). Lo hacen las **Edge Functions** de Supabase (Deno), que además cachean en la tabla `news_cache`. Ver el flujo completo en [architecture.md §8](architecture.md#8-el-backend-es-supabase--edge-functions).

Funciones en [supabase/functions/](../supabase/functions/):

| Función | Fuente(s) | Propósito |
| --- | --- | --- |
| `get-news` | TechCrunch (RapidAPI) / The Guardian | Titulares por categoría, búsqueda por keyword, filtros de fecha. |
| `get-events` | — | Eventos ("Save the date"). |
| `get-reviews` | YouTube | Reviews/releases en vídeo. |

### Variables de entorno del **servidor** (secrets de las funciones)

Estas **NO** van en el `.env` del cliente — son secretos del lado servidor, gestionados en Supabase. `get-news` usa:

| Secret | Para qué |
| --- | --- |
| `SUPABASE_URL` | Inyectada por la plataforma. |
| `SUPABASE_SERVICE_ROLE_KEY` | Acceso a `news_cache` saltándose RLS. **Secreto real**, nunca en el cliente. |
| `TECHCRUNCH_API_KEY` | Key de RapidAPI para la API de TechCrunch. |
| `GUARDIAN_API_KEY` | Key de The Guardian. |

> ⚠️ A diferencia de la anon key, `SERVICE_ROLE_KEY` y las keys de las APIs externas **sí son secretos**. No deben aparecer en el repo ni en el bundle. Si alguna se filtró en el historial de git, hay que **rotarla en su proveedor** (borrarla del historial no la invalida).

### Trabajar con las funciones localmente (opcional)

Solo necesario si vas a modificar el backend. Requiere [Supabase CLI](https://supabase.com/docs/guides/local-development):

```bash
# Servir una función en local
supabase functions serve get-news

# Definir los secrets (en remoto)
supabase secrets set TECHCRUNCH_API_KEY=xxxx GUARDIAN_API_KEY=yyyy

# Desplegar
supabase functions deploy get-news
```

Para desarrollo de front-end normal **no hace falta** la CLI: las funciones ya están desplegadas y el cliente las invoca con la URL + anon key del `.env`.

---

## 8. Build de producción

```bash
npm run build     # genera dist/
npm run preview   # valida dist/ en local
```

El `dist/` resultante es estático y se puede servir desde cualquier hosting de estáticos (Vercel, Netlify, Supabase Hosting, etc.). Recuerda definir `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` como variables de entorno en el panel del hosting (se inyectan en build time).

---

## 9. Resolución de problemas

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| Error en arranque: *"Faltan credenciales de Supabase"* | `.env` ausente o variables mal nombradas | Copia `.env.example` a `.env` y revisa que las claves empiecen por `VITE_`. |
| Variables no se leen | Renombraste sin el prefijo `VITE_` o no reiniciaste `dev` | Vite solo expone `VITE_*` y lee el `.env` al arrancar: reinicia `npm run dev` tras editarlo. |
| `npm run build` falla por tipos | Error de TypeScript | `build` corre `tsc -b` antes de empaquetar. Arregla con la pista de `npm run type-check`. |
| Las noticias no cargan / 500 | Edge Function caída o secret del servidor ausente/expirado | Revisa los logs de la función en el panel de Supabase y que `TECHCRUNCH_API_KEY`/`GUARDIAN_API_KEY` sigan válidas. |
| Lista vacía sin error | La API externa devolvió 0 resultados para ese filtro/fecha | Cambia de filtro de fecha o categoría; revisa el rango de fechas que arma `get-news`. |
| Versión de Node incompatible | Node < 20.19 | `nvm use 22` (o instala Node 22). |
