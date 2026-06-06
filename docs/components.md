# Catálogo de componentes

Inventario de los componentes de UI del proyecto, agrupados por feature y por `shared/`. Para cada uno: dónde vive, qué props recibe y de qué se encarga.

Convenciones:
- **Componentes:** PascalCase. **Hooks:** camelCase con prefijo `use`.
- Cada feature solo expone públicamente lo que está en su `index.ts`. El resto es interno.
- La presentación usa Bootstrap 5; las cards y skeletons comparten clases de utilidad.

---

## Feature: `news`

> API pública (`features/news/index.ts`): `NewsSections`, `NewsList`, `Datefilter` + tipo `DateFilterMode`.

### `NewsSections`
[features/news/components/NewsSections.tsx](../src/features/news/components/NewsSections.tsx)

| | |
| --- | --- |
| **Props** | ninguna |
| **Rol** | Compositor: agrupa `LatestNewsSection` + `TrendyNowSection`. Es el punto de entrada que `HomePage` monta. |

### `LatestNewsSection` · `TrendyNowSection`
[LatestNewsSection.tsx](../src/features/news/components/LatestNewsSection.tsx) · [TrendyNowSection.tsx](../src/features/news/components/TrendyNowSection.tsx)

| | |
| --- | --- |
| **Props** | ninguna (internos, consumidos por `NewsSections`) |
| **Rol** | Secciones de la home. Llaman a `useGetHeadlines`, gestionan el `Datefilter` y delegan el render de la lista en `NewsList`. |

### `NewsList`
[features/news/components/NewsList.tsx](../src/features/news/components/NewsList.tsx)

| Prop | Tipo | Descripción |
| --- | --- | --- |
| `news?` | `News` (`Article[]`) | Artículos a mostrar |
| `loadingNews` | `boolean` | Si `true`, muestra skeletons |
| `fetchNext` | `() => void` | Carga la siguiente página (infinite query) |
| `hasNext` | `boolean` | Si hay más páginas |
| `isFetching` | `boolean` | Muestra skeletons de "cargando más" al paginar |
| `emptyMessage?` | `string` | Texto cuando no hay resultados (default `'No articles found'`) |

**Rol:** componente de presentación puro (no llama hooks de datos). Renderiza el primer artículo como `LatestNewsCard` (destacado) y el resto como `OtherNewsCard`. Maneja estados de carga, vacío y "view more". El botón se deshabilita si hay menos de 10 artículos o no hay siguiente página.

### `LatestNewsCard`
[features/news/components/cards/LatestNewsCard.tsx](../src/features/news/components/cards/LatestNewsCard.tsx)

| Prop | Tipo |
| --- | --- |
| `noticia` | `Article` |

**Rol:** card destacada del artículo principal (formato grande, ratio 21:9). Al hacer clic navega al artículo vía `useArticleNavigation`. Usa `LazyImage` para la portada.

### `OtherNewsCard`
[features/news/components/cards/OtherNewsCard.tsx](../src/features/news/components/cards/OtherNewsCard.tsx)

| Prop | Tipo |
| --- | --- |
| `noticia` | `Article` |

**Rol:** card secundaria de la cuadrícula (ratio 4:3). Muestra hasta dos badges de categoría (vía `getTopicName`); clic en un badge navega a `/topic/:value` (con `stopPropagation` para no disparar la navegación al artículo). Clic en la card abre el artículo.

### `TopicCard`
[features/news/components/cards/TopicCard.tsx](../src/features/news/components/cards/TopicCard.tsx)

**Rol:** card usada en la vista de tema (`TopicPage`).

### `Datefilter`
[features/news/components/Datefilter.tsx](../src/features/news/components/Datefilter.tsx)

| Prop | Tipo | Descripción |
| --- | --- | --- |
| `dateFilter` | `DateFilterType` | Filtro activo (`'all' \| 'today' \| 'yesterday' \| 'lastWeek'`) |
| `setDateFilter` | `(d: DateFilterType) => void` | Callback al cambiar de filtro |
| `mode?` | `DateFilterMode` (`'standard' \| 'smartphones'`) | En `smartphones` algunos botones se deshabilitan y cambian de etiqueta |

**Rol:** botonera de filtro por fecha. Internamente usa `DateFilterButton` (botón duplicado para responsive: versión normal vs. `btn-sm`).

---

## Feature: `events`

> API pública (`features/events/index.ts`): `EventSection`.

### `EventSection`
[features/events/components/EventSection.tsx](../src/features/events/components/EventSection.tsx)

| | |
| --- | --- |
| **Props** | ninguna |
| **Rol** | Sección "SAVE THE DATE" de la home. Llama a `useGetEvents`, muestra `OtherNewsSkeleton` mientras carga y mapea cada evento a un `EventCard`. |

### `EventCard`
[features/events/components/EventCard.tsx](../src/features/events/components/EventCard.tsx)

| Prop | Tipo |
| --- | --- |
| `title` | `string` |
| `location` | `string` |
| `date` | `string` |
| `url` | `string` |

**Rol:** fila con fecha + título + ubicación + enlace "+ info". Componente de presentación puro.

---

## Feature: `reviews`

> API pública (`features/reviews/index.ts`): `ReviewsSection`.

### `ReviewsSection`
[features/reviews/components/ReviewsSection.tsx](../src/features/reviews/components/ReviewsSection.tsx)

| | |
| --- | --- |
| **Props** | ninguna |
| **Rol** | Sección "REVIEWS & RELEASES". Llama a `useGetReviews` y mapea cada review a un `VideoPlayer`. |

### `VideoPlayer`
[features/reviews/components/VideoPlayer.tsx](../src/features/reviews/components/VideoPlayer.tsx)

| Prop | Tipo |
| --- | --- |
| `videoId` | `string` |
| `title` | `string` |
| `thumbnailUrl` | `string` |
| `channelTitle` | `string` |

**Rol:** reproductor/embed de un vídeo de review (YouTube).

---

## Feature: `newsletter`

> API pública (`features/newsletter/index.ts`): `useSubscribeNL` (solo el hook; no expone componentes).

El formulario de suscripción vive en la página correspondiente y usa el hook `useSubscribeNL`, que envuelve `createNewSub` en un `useMutation`.

---

## `shared/components` — transversales

### `Header`
[shared/components/Header.tsx](../src/shared/components/Header.tsx)

**Rol:** cabecera con navbar responsive. Orquesta `DesktopNav`, `MobileNav` y `NewsSearchForm`. Gestiona el estado del menú móvil con `useDropdown`.

### `DesktopNav` · `MobileNav`
[DesktopNav.tsx](../src/shared/components/DesktopNav.tsx) · [MobileNav.tsx](../src/shared/components/MobileNav.tsx)

| `MobileNav` Prop | Tipo |
| --- | --- |
| `isOpen` | `boolean` |
| `onClose` | `() => void` |

**Rol:** navegación para desktop y móvil. Los enlaces salen de `shared/components/navConfig.ts`.

### `Footer`
[shared/components/Footer.tsx](../src/shared/components/Footer.tsx)

**Rol:** pie de página global (parte del `MainLayout`).

### `NewsSearchForm`
[shared/components/NewsSearchForm.tsx](../src/shared/components/NewsSearchForm.tsx)

| | |
| --- | --- |
| **Props** | ninguna |
| **Rol** | Formulario de búsqueda. Al enviar, hace `trim`, valida que no esté vacío y navega a `/topic/:term` con el término codificado (`encodeURIComponent`). Es `shared` porque el `Header` (también shared) lo necesita y las features no pueden importarse entre sí. |

### `LazyImage`
[shared/components/LazyImage.tsx](../src/shared/components/LazyImage.tsx)

**Rol:** wrapper de `react-lazy-load-image-component` con efecto `opacity` y `threshold={200}` preconfigurados. Acepta todas las props de `LazyLoadImage`. Usado por las cards de noticias.

### `LatestNewsSkeleton` · `OtherNewsSkeleton`
[LatestNewsSkeleton.tsx](../src/shared/components/LatestNewsSkeleton.tsx) · [OtherNewsSkeleton.tsx](../src/shared/components/OtherNewsSkeleton.tsx)

**Rol:** placeholders de carga que reflejan la forma de `LatestNewsCard` y `OtherNewsCard` respectivamente. Reutilizados por news, events y reviews durante el `isLoading`.

---

## Layout y páginas

### `MainLayout`
[shared/layout/MainLayout.tsx](../src/shared/layout/MainLayout.tsx)

**Rol:** layout raíz de todas las rutas (`Header` + `<Outlet/>` + `Footer`). Definido en `app/router/Routes.tsx` como elemento padre.

### Páginas (`pages/`)
Orquestadores de ruta, **sin lógica de negocio** — componen secciones de features.

| Página | Ruta | Rol |
| --- | --- | --- |
| `HomePage` | `/` | Hero + `NewsSections` + `EventSection` + `ReviewsSection` |
| `TopicPage` | `/topic/:value` | Listado filtrado por tema o término de búsqueda |
| `SingleNewPage` | `/news/:title` | Detalle de un artículo |
| `ContactPage` | `/contact` | Contacto |
| `SubscribePage` | `/subscribe` | Suscripción a newsletter |
| `NotFound` | `*` | 404 |

---

## Hooks (referencia rápida)

| Hook | Ubicación | Devuelve |
| --- | --- | --- |
| `useGetHeadlines` | `features/news/hooks` | `{ news, isLoading, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage }` — infinite query de titulares |
| `useSearchNews` | `features/news/hooks` | Búsqueda por keyword |
| `useArticleNavigation` | `features/news/hooks` | Función para navegar al detalle de un `Article` |
| `useGetEvents` | `features/events/hooks` | `{ events, isLoading }` |
| `useGetReviews` | `features/reviews/hooks` | `{ reviews, isLoading }` |
| `useSubscribeNL` | `features/newsletter/hooks` | Mutation de alta en newsletter |
| `useDropdown` | `shared/hooks` | `{ isOpen, toggle, close }` |
| `useScrollToTop` | `shared/hooks` | Scroll al top en cambio de ruta |
| `useScrollToSection` | `shared/hooks` | Scroll a una sección por id |

> Nota de inyección de dependencias: `useGetHeadlines` (y el resto de hooks de fetching) reciben el repositorio como segundo argumento con un default real (`= supabaseArticleRepository`). En producción no hay que pasar nada; en tests se inyecta un `Mock*Repository`. Ver [architecture.md](architecture.md#2-clean-architecture-pero-solo-donde-el-dominio-lo-justifica).
