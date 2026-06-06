# Decisiones de arquitectura

Este documento registra **por qué** el proyecto está estructurado como está. Para el cómo (carpetas, scripts), ver el [README](../README.md). Para el contexto de la refactorización en curso, ver [CLAUDE.md](../CLAUDE.md).

---

## 1. De arquitectura en capas a Feature-Based

**Decisión:** migrar de capas horizontales (`components/`, `hooks/`, `services/`) a carpetas verticales por dominio (`features/news`, `features/events`, …).

**Por qué:** en una arquitectura en capas, tocar una funcionalidad (p. ej. noticias) obliga a saltar entre tres carpetas distantes. Agrupando por feature, todo lo que cambia junto vive junto: el componente, su hook y su servicio están en la misma carpeta. La cohesión sube y el acoplamiento accidental baja.

**Estrategia:** migración **progresiva** (strangler fig), sin reescritura. No se rompe lo que funciona en producción; se mueve feature por feature.

**Estado:** la estructura `features/` + `domain/` + `shared/` ya está en su sitio. Las cuatro features (`news`, `events`, `reviews`, `newsletter`) exponen su API pública vía `index.ts`.

---

## 2. Clean Architecture, pero solo donde el dominio lo justifica

**Decisión:** aplicar puertos y adaptadores **únicamente en la capa de servicios**, no en toda la app.

**Por qué:** el valor de un puerto (`interface`) + adaptador (`implements`) es invertir la dependencia hacia el dominio y poder sustituir la implementación (real ↔ mock) sin tocar el consumidor. Eso aporta donde hay una frontera natural con el mundo exterior — la fuente de datos. En el resto de la app (componentes de presentación) esa indirección sería sobreingeniería.

**Cómo se ve en el código:**

```
domain/ports/ArticleRepository.ts        ← interface (contrato), TS puro
  ↑ implements
features/news/services/
  SupabaseArticleRepository.ts            ← adaptador real
shared/mocks/MockArticleRepository.ts     ← adaptador de test
```

El puerto:

```ts
// domain/ports/ArticleRepository.ts
export interface ArticleRepository {
  getHeadlines(params: { topic: TopicId; dateFilter: DateFilterType; page: number }): Promise<Article[]>;
  searchByKeyword(params: { keyword: string; page: number }): Promise<Article[]>;
}
```

El hook **recibe el repositorio como dependencia** con un default, de modo que en producción no hay que inyectar nada, pero un test puede pasar el mock:

```ts
// features/news/hooks/useGetHeadlines.ts
export const useGetHeadlines = (
  { topic, dateFilter }: Props,
  repo: ArticleRepository = supabaseArticleRepository, // ← inyección con default
) => { /* useInfiniteQuery(...) */ };
```

**Límite consciente:** NO se hace DDD completo, ni hexagonal en toda la app, ni micro-frontends. El dominio (noticias/eventos/reviews) no es lo bastante complejo para justificarlo, y es un proyecto de un solo desarrollador.

---

## 3. La capa `domain/` es TypeScript puro

**Decisión:** `domain/` no importa React, Supabase ni ninguna librería externa. Solo tipos e interfaces.

**Por qué:** el dominio es la fuente de verdad y la parte más estable del sistema. Si dependiera de Supabase o React, un cambio de proveedor o de framework lo arrastraría. Manteniéndolo puro, las dependencias apuntan **hacia adentro** (servicios → dominio), nunca al revés.

**Regla práctica:** si un archivo de `domain/` necesita un `import` de una lib externa, está en el lugar equivocado.

**Contenido actual:** `Article.ts`, `Event.ts`, `Review.ts`, `Subscriber.ts`, `Topics.ts` (entidades y value objects) + `ports/` (contratos).

---

## 4. React Query es sincronización, no la capa de servicios

**Decisión:** TanStack React Query v5 gestiona el estado **servidor-cliente**; su caché actúa como store (modelo Flux). No es donde vive la lógica de negocio.

**Por qué:** confundir React Query con la capa de servicios lleva a meter llamadas a la API y mapeos dentro de los hooks. Aquí la separación es estricta:

- **Servicio** (`services/queries/fetchNews.ts`): invoca la Edge Function, mapea DTO → entidad, valida con Zod. No sabe nada de React.
- **Hook** (`hooks/useGetHeadlines.ts`): envuelve el servicio en `useInfiniteQuery`, gestiona caché, paginación y estados de carga.
- **Componente**: consume el hook y renderiza.

**Configuración de caché — detalle importante:**

| Dónde | Valor | Rol |
| --- | --- | --- |
| `app/main.tsx` (`QueryClient` global) | `staleTime: 24h`, `retry: 3`, sin refetch en focus/reconnect | Default para cualquier query sin override |
| `shared/lib/staletimes.ts` (`STALE_TIMES`) | `NEWS: 5h`, `EVENTS: 15d`, `REVIEWS: 24h` | Override por dominio, pasado en cada hook |

Cada hook pasa su `staleTime` explícito desde `STALE_TIMES`, así que el default global solo aplica como red de seguridad. El stale time de noticias (5h) coincide con el TTL del cache de la Edge Function (`STALE_MS = 5h`), para que cliente y servidor no se desincronicen.

> Nota: `STALE_TIMES` vive hoy en `shared/lib/staletimes.ts`. CLAUDE.md propone renombrarlo a `queryConfig.ts`; sigue pendiente.

---

## 5. Estado cliente compartido: React Context (Zustand fue retirado)

**Decisión:** para estado cliente compartido entre features se usa React Context. Zustand se desinstaló.

**Por qué:** la mayor parte del estado de esta app es estado **de servidor** (lo gestiona React Query). El estado puramente cliente que queda (UI: dropdown abierto, etc.) es local o de baja frecuencia, y no justifica una librería de store global. Context cubre el caso sin añadir dependencias.

---

## 6. Validación en la frontera con Zod

**Decisión:** validar la respuesta del servidor con Zod en el servicio, justo donde el dato cruza al cliente.

**Por qué:** el antipatrón `data || []` enmascara respuestas exitosas pero malformadas (un `200` con un shape inesperado pasa silenciosamente como lista vacía). Validar en la frontera convierte un dato corrupto en un error explícito y temprano, en vez de un bug difuso en el render.

**Cómo:** cada servicio valida con un schema que está **atado al tipo de dominio** vía `satisfies`, de modo que si la entidad cambia, el schema deja de compilar:

```ts
// features/news/services/article.schema.ts
export const ArticleSchema = z.object({ /* ... */ }) satisfies z.ZodType<Article>;
```

```ts
// features/news/services/queries/fetchNews.ts
return parseList(ArticleSchema, mapped, 'get-news'); // valida o lanza
```

---

## 7. Tipado fuerte de `Topic`

**Decisión:** el tema de un artículo no es `number | string` libre. Hay dos tipos derivados de constantes en `domain/Topics.ts`:

- `TopicId` — categorías visibles al usuario (`"A.I."`, `"Smartphones"`, …) o `0` (todas).
- `ApiTopicId` — el id numérico que entiende la API externa (o `"smartphone"`).

`getTopicId(topic: TopicId): ApiTopicId` traduce de uno a otro.

**Por qué:** `number | string` es demasiado permisivo y deja pasar valores inválidos en tiempo de compilación. Acotar a un union de literales hace que el compilador rechace temas inexistentes y obliga a manejar todos los casos en el `switch` de traducción.

---

## 8. El backend es Supabase + Edge Functions

**Decisión:** las llamadas a APIs externas (TechCrunch vía RapidAPI, The Guardian) no se hacen desde el cliente, sino desde **Edge Functions** de Supabase (Deno), que además cachean en Postgres.

**Por qué:**

1. **Secretos del lado servidor.** Las API keys de TechCrunch/Guardian y la `SERVICE_ROLE_KEY` viven en el entorno de la Edge Function, nunca en el bundle del cliente.
2. **Cache compartida y barata.** La función guarda el `raw_data` en la tabla `news_cache` con un `search_context` y un TTL de 5h. Si llega otra petición equivalente dentro de la ventana, se sirve de Postgres sin gastar cuota de la API externa.
3. **Adaptación DTO → entidad en el borde.** La forma cruda de cada API se transforma cerca del origen; el cliente recibe algo más estable.

**Flujo completo de una petición de noticias:**

```
Componente (NewsSections)
  → useGetHeadlines               (React Query: caché, paginación, staleTime)
    → supabaseArticleRepository   (adaptador, implements ArticleRepository)
      → fetchNews                 (servicio: invoke + map + validar Zod)
        → supabase.functions.invoke('get-news')
          → Edge Function get-news (Deno)
            → ¿cache fresca en news_cache? → sí: devuelve raw
                                           → no: fetch TechCrunch/Guardian, cachea, devuelve raw
      ← mapTechCrunchToArticle / mapGuardianToArticle  (DTO → Article)
      ← parseList(ArticleSchema)  (validación de frontera)
```

La función `get-news` elige fuente según el modo: búsqueda por keyword y categorías numéricas → TechCrunch; smartphones → The Guardian.

---

## 9. Las features no se conocen entre sí

**Decisión:** ninguna feature importa de otra. Se comunican vía `shared/` o se componen en `pages/`.

**Por qué:** los imports cruzados entre features reintroducen el acoplamiento que la arquitectura Feature-Based busca eliminar. Si `news` importara de `events`, volveríamos a un grafo de dependencias enredado.

**Cómo se compone entonces la home:** `HomePage` (en `pages/`) actúa como orquestador y monta una sección de cada feature, sin lógica de negocio propia:

```tsx
// pages/HomePage.tsx
<NewsSections />   {/* features/news  */}
<EventSection />   {/* features/events */}
<ReviewsSection /> {/* features/reviews */}
```

Cada `index.ts` de feature define qué es público; lo no exportado (repositorios, query keys, mappers, schemas) es interno y no se puede importar desde fuera.

---

## Problemas conocidos / deuda técnica

| Tema | Estado |
| --- | --- |
| `HomePage` violaba SRP (orquestaba y renderizaba 3 dominios) | ✅ Resuelto: cada dominio extraído a `XxxSection` de feature; `HomePage` solo compone |
| `createNewSub` usaba `fetch` crudo con headers manuales | ✅ Resuelto: ahora usa `supabase.from('newsletter_subscribers').insert()` |
| Tipos de dominio dentro de `services/` | ✅ Resuelto: movidos a `domain/` |
| `topic: number \| string` demasiado permisivo | ✅ Resuelto: `TopicId` / `ApiTopicId` como unions de literales |
| `STALE_TIMES` en `staletimes.ts` | ⏳ Pendiente renombrar a `queryConfig.ts` (CLAUDE.md) |
| Estilos inline mezclados con Bootstrap | ⏳ Pendiente consolidar (ver estilos inline en `HomePage`, `NewsSearchForm`) |
| Fase 4 (tests con mock adapters) | 🔜 Parcial: existen `Mock*Repository` y fixtures; hay tests de hooks |
