# each-one-tech-one — Contexto del proyecto

## Qué es este proyecto
App de noticias tech. Stack: React 19 + TypeScript + Vite + React Query v5 (`@tanstack/react-query`) + Supabase + Bootstrap 5.
Proyecto de un solo desarrollador. Sirve además como proyecto integrador final de un curso de arquitectura front-end.

## Perfil del desarrollador
- Front-end en formación, nivel intermedio subiendo a avanzado.
- Prefiere entender el "por qué" detrás de cada decisión, no solo recetas. Explica el razonamiento, no solo el código.
- Está aplicando conceptos de arquitectura aprendidos: SOLID, MVVM, Feature-Based, Clean Architecture, gestión de estado por capas, puertos y adaptadores.

## Objetivo actual: refactorización en curso
Migrar de una **arquitectura en capas** (componentes / hooks / services horizontales) a **Feature-Based**, con patrones de **Clean Architecture aplicados SOLO en la capa de servicios** (donde el dominio lo justifica).

No es una reescritura. Se hace de forma **progresiva, sin romper lo que funciona en producción** (estrategias: strangler fig / modularización progresiva).

## Estructura objetivo
```
src/
  domain/                  # TS puro, SIN imports de React/Supabase/libs externas
    Article.ts             # interface de entidad
    Event.ts
    Topic.ts               # value objects / TopicId = 0|1|2|3|4|5
    ports/
      ArticleRepository.ts # interface (contrato), NO implementación
  features/
    news/
      components/          # HeadlineCard, NewsList, TopicFilter
      hooks/               # useGetHeadlines, useInfiniteNews
      services/            # SupabaseArticleRepository implements ArticleRepository
      index.ts             # API pública: solo lo exportado es consumible desde fuera
    events/
    reviews/
    newsletter/
  shared/
    components/            # Header, Footer, Pagination, ErrorBoundary
    hooks/                 # useWindowWidth, useDebounce
    lib/
      supabaseClient.ts
      queryConfig.ts       # STALE_TIMES aquí (NO en services/)
  pages/                   # orquestadores, sin lógica de negocio
  router/
```

## Plan por fases (seguir en orden, NO saltar fases)
1. **Fase 1 — Contratos y tipos (sin mover archivos):** crear `domain/` con entidades e interfaces, mover los tipos de dominio desde `services/` a `domain/`, crear `domain/ports/`, estandarizar nomenclatura.
2. **Fase 2 — Estructura de features:** crear `features/<dominio>/` con components/hooks/services, mover archivos, crear `index.ts` por feature.
3. **Fase 3 — Limpiar acoplamientos:** verificar que ninguna feature importa de otra, mover lo común a `shared/`, arreglar el SRP de HomePage, unificar la capa de servicios.
4. **Fase 4 (opcional, solo si se va a testear):** adaptadores que implementen los ports, hooks que reciban el repositorio como dependencia, mock adapters para tests.

## Convenciones
- Componentes: PascalCase. Hooks: camelCase con prefijo `use`.
- Arreglar nomenclatura existente: `MainLayOut` → `MainLayout`, `Newslist` → `NewsList`, `staletimes..ts` → `queryConfig.ts`.
- `domain/` es TS puro. Si un archivo de domain necesita importar React, Supabase o cualquier lib externa, está en el lugar equivocado.
- Los ports son `interface` en `domain/ports/`. Las implementaciones (`SupabaseArticleRepository`) van en `features/<x>/services/` y usan `implements`.
- Las features NO se importan entre sí. Se comunican vía `shared/` o `pages/`.
- Cada feature expone su API pública mediante `index.ts`. Lo no exportado es interno (incluidos los repositorios y las query keys).
- Tipos de dominio = fuente de verdad. Los DTOs de Supabase (response crudo) viven en `services/`, no en `domain/`.

## Problemas conocidos a resolver (diagnóstico del curso)
- `HomePage` viola SRP: orquesta 3 dominios y renderiza todo. Extraer `NewsSection`, `EventsSection` como componentes de feature.
- Tipos de dominio (`SingleNew`, `Events`) viven dentro de `services/` → mover a `domain/`.
- `topic: number | string` es demasiado permisivo → unificar a `TopicId = 0|1|2|3|4|5` (incluir smartphone).
- `useSearchAllCategories` (generado por Copilot): acoplamiento frágil a las query keys de otros hooks. Las query keys deben ser constantes compartidas.
- Inconsistencia en servicios: `fetchNewsWithCache` usa `supabase.functions.invoke()`; `createNewSub` usa `fetch` crudo con headers manuales. Unificar a un único patrón.
- `data || []` enmascara respuestas exitosas pero malformadas → validar con Zod en la frontera (servicio).
- Estilos inline mezclados con Bootstrap → consolidar.
- La adaptación DTO → entidad ocurre en las Edge Functions (servidor). Tenerlo en cuenta al decidir dónde validar en cliente.

## Límites — NO sobreingeniería
Este proyecto NO necesita y NO se debe añadir:
- DDD completo (el dominio no es lo bastante complejo).
- Monorepo (una sola app).
- Micro-frontends (un solo desarrollador, sin problema organizativo).
- Hexagonal completo en toda la app (solo en los repositorios, donde ya existe la frontera natural).
- No abstraer prematuramente los 3 hooks de fetching similares: probablemente divergirán (preferir duplicación sobre abstracción hasta que se demuestre lo contrario).

## Notas de contexto
- La anon key de Supabase es pública por diseño; la seguridad viene de las RLS policies. No tratarla como secreto.
- React Query NO es la capa de servicios: es la capa de sincronización servidor-cliente. Su caché interna actúa como store (modelo Flux).
- Zustand fue desinstalado. Para estado cliente compartido entre features: React Context.

## Cómo trabajar conmigo
- Ir fase por fase del plan. No adelantar fases.
- Antes de mover muchos archivos a la vez, proponer el cambio y esperar confirmación.
- Explicar el razonamiento detrás de cada sugerencia (el desarrollador aprende del "por qué").
- No romper lo que funciona en producción: cambios progresivos y verificables.
