# Decisiones de arquitectura

Este documento explica **por qué** el proyecto está estructurado como está y qué principios guían su mantenimiento y evolución. Para detalles de carpetas y scripts, ver el [README](../README.md). Para reglas operacionales de desarrollo, ver [CLAUDE.md](../CLAUDE.md).

---

## 1. Arquitectura Feature-Based

**Decisión:** organizar el código en carpetas verticales por dominio funcional (`features/news`, `features/events`, `features/reviews`, `features/newsletter`) en lugar de capas horizontales.

**Por qué:** cuando todo lo que cambia junto vive junto (componente, hook y servicio de una feature en la misma carpeta), la cohesión sube y el acoplamiento accidental baja. Tocar noticias no requiere saltar entre tres ubicaciones distantes.

**Estructura:**

```
features/news/
  components/       # NewsList, cards, secciones, filtros
  hooks/            # useGetHeadlines, useSearchNews
  services/         # lógica de fetching, validación, mappers
  index.ts          # API pública de la feature
```

Cada feature solo expone lo de su `index.ts`. Repositorios, query keys, schemas son internos.

---

## 2. Clean Architecture en la capa de servicios

**Decisión:** aplicar puertos y adaptadores **únicamente donde hay una frontera natural con el exterior** — la capa de servicios que habla con fuentes de datos.

**Por qué:** invertir la dependencia (servicios → dominio, nunca al revés) permite cambiar la fuente de datos (Supabase real ↔ mock) sin tocar los consumidores. En otras capas (componentes, hooks de presentación) esa indirección es sobreingeniería.

**Cómo se ve:**

```
domain/ports/ArticleRepository.ts          ← interface (contrato puro)
  ↑ implements
features/news/services/
  SupabaseArticleRepository.ts              ← adaptador real (Supabase)
shared/mocks/MockArticleRepository.ts       ← adaptador de test
```

Los hooks de fetching reciben el repositorio como argumento con default real:

```ts
export const useGetHeadlines = (
  { topic, dateFilter }: Props,
  repo: ArticleRepository = supabaseArticleRepository, // default para producción
) => { /* useInfiniteQuery(...) */ };
```

En tests, se inyecta un mock sin tocar nada más.

---

## 3. La capa `domain/` es TypeScript puro

**Decisión:** `domain/` no importa React, Supabase ni librerías externas. Solo tipos, interfaces y lógica de dominio.

**Por qué:** el dominio es la fuente de verdad y la parte más estable del sistema. Si dependiera de un framework o proveedor, un cambio futuro lo alcanzaría. Manteniéndolo puro, las dependencias apuntan siempre **hacia adentro** (servicios → dominio), nunca al revés.

**Contenido:**
- `Article.ts`, `Event.ts`, `Review.ts`, `Subscriber.ts` — entidades
- `Topics.ts` — value objects (`TopicId`, `ApiTopicId`)
- `ports/` — interfaces (contratos con servicios)

**Regla práctica:** si un archivo de `domain/` necesita importar una lib externa, está en el lugar equivocado.

---

## 4. React Query como capa de sincronización servidor-cliente

**Decisión:** TanStack React Query v5 gestiona estado servidor-cliente (caché, refetch, paginación). No es la capa de servicios.

**Por qué:** separar responsabilidades claramente:

- **Servicio** (`services/queries/fetchNews.ts`): invoca la API, mapea DTO → entidad, valida con Zod. No sabe de React.
- **Hook** (`hooks/useGetHeadlines.ts`): envuelve el servicio en `useInfiniteQuery`, gestiona caché y estados de carga.
- **Componente**: consume el hook, renderiza.

**Configuración de caché:**

| Ubicación | Valor | Rol |
| --- | --- | --- |
| `app/main.tsx` | `staleTime: 24h`, `retry: 3` | Default global para cualquier query |
| `shared/lib/staletimes.ts` | `NEWS: 5h`, `EVENTS: 15d`, `REVIEWS: 24h` | Override específico por dominio |

El stale time de noticias (5h) se sincroniza intencionalmente con el TTL del cache del servidor (Edge Function) para evitar desincronización.

---

## 5. Validación en la frontera servidor-cliente

**Decisión:** validar respuestas del servidor con Zod en el servicio, justo en la frontera donde los datos cruzados del exterior entran al código.

**Por qué:** el antipatrón `data || []` enmascara respuestas malformadas (un 200 con shape inesperado pasa como lista vacía). Validar en la frontera convierte un dato corrupto en un error explícito y temprano, en lugar de un bug difuso al renderizar.

**Implementación:**

```ts
// El schema está atado al tipo de dominio vía satisfies
export const ArticleSchema = z.object({ /* ... */ }) satisfies z.ZodType<Article>;

// El servicio valida y lanza si no coincide
return parseList(ArticleSchema, mapped, 'get-news');
```

Si la entidad cambia pero el schema no, la compilación falla — el contrato se mantiene consistente.

---

## 6. Tipado fuerte de temas

**Decisión:** los temas no son `number | string` libre. Dos tipos derivados de constantes:

- `TopicId` — categorías visibles al usuario (`"A.I."`, `"Smartphones"`, …)
- `ApiTopicId` — ids que entiende la API externa

`getTopicId(topic: TopicId): ApiTopicId` traduce entre ellos.

**Por qué:** `number | string` es demasiado permisivo. Unions de literales hacen que el compilador rechace valores inválidos y obligue a manejar todos los casos en el switch de traducción.

---

## 7. Backend con Supabase + Edge Functions

**Decisión:** las llamadas a APIs externas (TechCrunch vía RapidAPI, The Guardian) no se hacen desde el cliente, sino desde Edge Functions de Supabase (Deno), que además cachean en Postgres.

**Por qué:**

1. **Secretos del lado servidor.** Las API keys y la `SERVICE_ROLE_KEY` viven solo en los secrets de la función, nunca en el bundle del cliente.
2. **Cache compartida.** Una tabla `news_cache` con TTL de 5h evita llamadas redundantes a las APIs externas.
3. **Estabilidad.** La transformación DTO → entidad ocurre en el servidor; el cliente recibe datos más predecibles.

**Flujo completo:**

```
Componente (NewsSections)
  ↓
useGetHeadlines (React Query)
  ↓
supabaseArticleRepository (implements ArticleRepository)
  ↓
fetchNews (servicio: invoke + map + validar)
  ↓
supabase.functions.invoke('get-news')
  ↓
Edge Function Deno
  ↓ ¿Cache fresco?
    → sí: devuelve raw data
    → no: fetch TechCrunch/Guardian, cachea, devuelve raw
  ↓
Mappers y Zod validation en cliente
  ↓
Article[] (entidades validadas)
```

---

## 8. Features aisladas

**Decisión:** ninguna feature importa de otra. Se comunican vía `shared/` o se componen en `pages/`.

**Por qué:** los imports cruzados entre features reintroducen el acoplamiento que Feature-Based busca eliminar. Un grafo de dependencias limpio facilita cambios sin efectos secundarios.

**Cómo se compone:** `HomePage` (en `pages/`) orquesta secciones de diferentes features sin lógica de negocio:

```tsx
<NewsSections />   {/* features/news  */}
<EventSection />   {/* features/events */}
<ReviewsSection /> {/* features/reviews */}
```

---

## 9. Estado compartido con React Context

**Decisión:** para estado cliente compartido entre features se usa React Context. Sin librerías globales de store.

**Por qué:** la mayoría del estado es estado **de servidor** (React Query lo gestiona). El estado puramente cliente (UI: dropdown abierto, modales) es local o poco frecuente, y no justifica dependencias adicionales. Context cubre el caso.

---

## Límites — no sobreingeniería

Este proyecto **no implementa** ni necesita:

- **DDD completo.** El dominio no es lo bastante complejo para justificar bounded contexts, aggregates, etc.
- **Hexagonal completo.** Solo los repositorios necesitan ser invertibles; el resto de la app es más simple.
- **Monorepo o micro-frontends.** Una sola app, un solo desarrollador.
- **Abstracción prematura de hooks similares.** `useGetHeadlines`, `useGetEvents`, `useGetReviews` son parecidos pero probablemente divergirán. Preferir duplicación sobre abstracción hasta demostrar lo contrario.

---

## Deuda técnica conocida

| Tema | Estado |
| --- | --- |
| `STALE_TIMES` en `staletimes.ts` | Pendiente: renombrar a `queryConfig.ts` |
| Hay default global + overrides por dominio en staleTime | Ambos funcionan; el global es red de seguridad |
| Estilos inline (`style={{...}}`) mezclados con Bootstrap | ~12 archivos; consolidar hacia Sass cuando se toquen |
| Testing parcial | Existen mocks y algunos tests; cobertura incompleta |
