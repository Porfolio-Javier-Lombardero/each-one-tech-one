# each-one-tech-one — Referencia para Claude

Documento de referencia para mantener, escalar y ampliar el proyecto. Este archivo describe cómo es el proyecto **hoy** y las reglas a respetar al tocarlo.

Documentación complementaria:
- [README.md](README.md) — instalación, scripts, estructura.
- [docs/architecture.md](docs/architecture.md) — las decisiones de arquitectura y su *por qué*.
- [docs/components.md](docs/components.md) — catálogo de componentes y hooks.
- [docs/setup.md](docs/setup.md) — entorno detallado, Edge Functions, troubleshooting.

## Qué es este proyecto
App de noticias tech (titulares, eventos, reviews en vídeo, newsletter). Proyecto de un solo desarrollador.
Stack: React 19 + TypeScript + Vite 6 + React Query v5 (`@tanstack/react-query`) + Supabase (cliente + Edge Functions Deno) + Bootstrap 5 + Sass + Zod 4. Tests con Vitest + Testing Library.

## Perfil del desarrollador
- Front-end en formación, nivel intermedio subiendo a avanzado.
- Prefiere entender el "por qué" detrás de cada decisión, no solo recetas. **Explica el razonamiento, no solo el código.**
- Aplica conceptos de arquitectura: SOLID, Feature-Based, Clean Architecture (puertos y adaptadores), gestión de estado por capas.

## Arquitectura actual (estado real, ya migrado)
Feature-Based con Clean Architecture aplicada **solo en la capa de servicios** (donde hay frontera natural con el exterior). Detalle y razonamiento en [docs/architecture.md](docs/architecture.md).

```
src/
  app/                     # bootstrap: main.tsx (QueryClient, providers), App.tsx, router/
  domain/                  # TS puro, SIN React/Supabase/libs externas
    Article.ts Event.ts Review.ts Subscriber.ts
    Topics.ts              # TopicId / ApiTopicId (unions de literales) + getTopicId()
    ports/                 # interfaces (contratos): ArticleRepository, EventRepository, ...
  features/
    news/  events/  reviews/  newsletter/
      components/ hooks/ services/ index.ts
      services/            # SupabaseXxxRepository (implements port), schemas Zod, dtos/, mappers/, queries/, queryKeys
  shared/
    components/ hooks/ layout/ lib/ mocks/
    lib/supabaseClient.ts  # valida env vars al arrancar
    lib/staletimes.ts      # STALE_TIMES (NEWS 5h, EVENTS 15d, REVIEWS 24h)
    mocks/                 # Mock*Repository (implementan los ports) + fixtures/
  pages/                   # orquestadores de ruta, SIN lógica de negocio
supabase/functions/        # get-news, get-events, get-reviews (Deno): fetch APIs externas + cache en news_cache
```

## Reglas al mantener / ampliar (NO romper estos invariantes)
- **`domain/` es TS puro.** Si un archivo de `domain/` necesita importar React, Supabase o cualquier lib externa, está en el lugar equivocado. Los tipos de dominio son la fuente de verdad.
- **Ports vs. implementaciones.** Los ports son `interface` en `domain/ports/`. Las implementaciones (`SupabaseArticleRepository`) van en `features/<x>/services/` con `implements`/`satisfies`. Los DTOs crudos de la API viven en `services/dtos/`, NUNCA en `domain/`.
- **Las features NO se importan entre sí.** Se comunican vía `shared/` o se componen en `pages/`. Si dos features necesitan algo común, va a `shared/`.
- **API pública por `index.ts`.** Cada feature solo expone lo de su `index.ts`. Repositorios, query keys, mappers y schemas son internos: no importarlos desde fuera de la feature.
- **Validar en la frontera con Zod.** Todo servicio que recibe datos del servidor valida con su schema (atado al tipo de dominio vía `satisfies`) antes de devolver. Nada de `data || []` para enmascarar respuestas malformadas; usar `parseList`.
- **React Query = sincronización servidor-cliente, NO la capa de servicios.** La lógica (invoke + map + validar) vive en `services/`; el hook solo la envuelve en `useQuery`/`useInfiniteQuery`. El `staleTime` por dominio sale de `STALE_TIMES`, no se hardcodea en el hook.
- **Inyección de dependencias en hooks de fetching.** Los hooks reciben el repositorio como argumento con default real (`= supabaseArticleRepository`). Mantener este patrón para poder inyectar `Mock*Repository` en tests.
- **Secretos.** La anon key de Supabase es pública por diseño (la seguridad viene de las RLS policies); NO tratarla como secreto. En cambio `SERVICE_ROLE_KEY` y las keys de APIs externas (TechCrunch/Guardian/YouTube) son secretos del servidor: viven solo en los secrets de las Edge Functions, nunca en el cliente ni en el repo.
- **Estado cliente compartido = React Context** (Zustand fue desinstalado). No reintroducir una librería de store global sin justificación.

## Cómo añadir cosas nuevas
- **Nueva feature:** crear `features/<x>/` con `components/ hooks/ services/ index.ts`. Si toca el exterior, definir su port en `domain/ports/` y su entidad en `domain/`. Exponer solo lo necesario por `index.ts`.
- **Nueva fuente de datos externa:** añadir/extender una Edge Function en `supabase/functions/` (el fetch y los secrets viven ahí, no en el cliente); en el cliente, un servicio que la invoque + mapper DTO→entidad + schema Zod.
- **Nuevo componente de presentación:** si lo usa una sola feature, va en esa feature; si lo comparten varias (o lo usa algo de `shared/`, como el `Header`), va en `shared/components/`.

## Límites — NO sobreingeniería
Este proyecto NO necesita y NO se debe añadir:
- DDD completo (el dominio no es lo bastante complejo).
- Monorepo ni micro-frontends (una sola app, un solo desarrollador).
- Hexagonal completo en toda la app (solo en los repositorios, donde ya existe la frontera natural).
- No abstraer prematuramente los hooks de fetching similares (`useGetHeadlines`, `useGetEvents`, `useGetReviews`): probablemente divergirán. Preferir duplicación sobre abstracción hasta demostrar lo contrario.

## Deuda técnica conocida (pendiente, NO inventar que está resuelta)
- `STALE_TIMES` vive en `shared/lib/staletimes.ts`; el plan original era renombrarlo a `queryConfig.ts`. Sigue pendiente.
- Hay un default global de `staleTime: 24h` en `app/main.tsx` además de los `STALE_TIMES` por dominio; el global solo actúa de red de seguridad porque cada hook pasa su valor explícito.
- Estilos inline (`style={{...}}`) mezclados con Bootstrap en ~12 archivos (p. ej. `HomePage`, `NewsSearchForm`, las cards). Consolidar hacia clases/Sass cuando se toquen.
- Fase de testing parcial: existen `Mock*Repository`, fixtures y tests de hooks; la cobertura no es completa.

## Cómo trabajar conmigo
- **Explicar el razonamiento** detrás de cada sugerencia (el desarrollador aprende del "por qué"), no solo dar el código.
- Antes de mover/renombrar muchos archivos a la vez, proponer el cambio y esperar confirmación.
- No romper lo que funciona en producción: cambios progresivos y verificables (`npm run type-check && npm run lint && npm run test`).
- Respetar los invariantes de arquitectura de arriba. Si una petición los contradice, señalarlo antes de implementar.
