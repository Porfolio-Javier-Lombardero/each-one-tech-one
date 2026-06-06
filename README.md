# Each One Tech One

Aplicación web de **noticias tech**: agrega titulares, eventos y reviews de tecnología (IA, gadgets, software, smartphones y tecnología emergente) desde varias fuentes externas, los cachea en Supabase a través de Edge Functions y los muestra en una SPA con filtrado por temas, búsqueda por palabra clave y suscripción a newsletter.


## Documentación

| Documento | Contenido |
| --- | --- |
| [docs/architecture.md](docs/architecture.md) | Decisiones de arquitectura y su *por qué* |
| [docs/components.md](docs/components.md) | Catálogo de componentes y hooks |
| [docs/setup.md](docs/setup.md) | Guía detallada de entorno, Edge Functions y troubleshooting |
| [CLAUDE.md](CLAUDE.md) | Referencia de arquitectura y reglas de mantenimiento (para Claude) |

---

## Stack tecnológico

| Categoría | Tecnología |
| --- | --- |
| Framework UI | [React 19](https://react.dev/) |
| Lenguaje | [TypeScript 5.7](https://www.typescriptlang.org/) |
| Build / dev server | [Vite 6](https://vite.dev/) |
| Datos servidor-cliente | [TanStack React Query v5](https://tanstack.com/query) (`@tanstack/react-query`) |
| Backend / cache | [Supabase](https://supabase.com/) (`@supabase/supabase-js`) + Edge Functions |
| Routing | [React Router v7](https://reactrouter.com/) (`react-router-dom`) |
| Estilos | [Bootstrap 5](https://getbootstrap.com/) + [Sass](https://sass-lang.com/) + Bootstrap Icons |
| Validación | [Zod 4](https://zod.dev/) (validación en la frontera de los servicios) |
| Testing | [Vitest 4](https://vitest.dev/) + [Testing Library](https://testing-library.com/) + jsdom |
| Lint | [ESLint 9](https://eslint.org/) + `typescript-eslint` |

> La capa de estado cliente compartido usa **React Context** (Zustand fue desinstalado). React Query no es la capa de servicios: es la capa de sincronización servidor-cliente y su caché actúa como store.

---

## Requisitos previos

- **Node.js** ≥ 20.19 (o ≥ 22). Vite 6 requiere Node 20.19+ / 22.12+; el proyecto se desarrolla sobre Node 22.
- **npm** ≥ 10 (se usa `npm` y `package-lock.json`; no hay configuración de yarn/pnpm).
- Una cuenta y proyecto de **Supabase** para obtener `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Porfolio-Javier-Lombardero/each-one-tech-one.git
cd each-one-tech-one

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (ver sección siguiente)
cp .env.example .env    # luego edita .env con tus credenciales

# 4. Arrancar el servidor de desarrollo
npm run dev
```

Vite servirá la app en `http://localhost:5173` por defecto.

---

## Scripts disponibles

| Script | Descripción |
| --- | --- |
| `npm run dev` | Arranca el servidor de desarrollo de Vite con HMR. |
| `npm run build` | Type-check (`tsc -b`) y build de producción a `dist/`. |
| `npm run preview` | Sirve localmente el build de producción para validarlo. |
| `npm run lint` | Ejecuta ESLint sobre todo el proyecto. |
| `npm run lint:fix` | Ejecuta ESLint aplicando autofix. |
| `npm run type-check` | Comprueba tipos sin emitir (`tsc --noEmit`). |
| `npm run test` | Ejecuta los tests una vez (`vitest run`). |
| `npm run test:watch` | Ejecuta los tests en modo watch. |

---

## Variables de entorno

Las variables se leen vía `import.meta.env` (prefijo obligatorio `VITE_`). La plantilla está en **[`.env.example`](.env.example)**; cópiala a `.env` y rellena los valores de tu proyecto de Supabase:

```bash
cp .env.example .env
```

| Variable | Descripción |
| --- | --- |
| `VITE_SUPABASE_URL` | URL del proyecto de Supabase (`https://<id>.supabase.co`). |
| `VITE_SUPABASE_ANON_KEY` | Anon/publishable key de Supabase. Es **pública por diseño**: la seguridad la garantizan las RLS policies del proyecto, no el ocultamiento de esta key. |

> ⚠️ **Nunca subas tu `.env` real.** Está incluido en `.gitignore`. Versiona únicamente `.env.example` con placeholders. Si una variable falta, [`supabaseClient.ts`](src/shared/lib/supabaseClient.ts) lanza un error explícito al arrancar.

---

## Estructura de carpetas

Arquitectura **Feature-Based** con Clean Architecture aplicada en la capa de servicios:

```
each-one-tech-one/
├─ public/
├─ src/
│  ├─ app/                       # Bootstrap de la aplicación
│  │  ├─ main.tsx                # Punto de entrada (QueryClient, providers, React Router)
│  │  ├─ App.tsx
│  │  └─ router/
│  │     ├─ Routes.tsx            # Definición de rutas
│  │     └─ index.tsx
│  │
│  ├─ domain/                     # TS puro: SIN React, Supabase ni libs externas
│  │  ├─ Article.ts              # Entidades del dominio
│  │  ├─ Event.ts
│  │  ├─ Review.ts
│  │  ├─ Subscriber.ts
│  │  ├─ Topics.ts               # Value objects (TopicId, ApiTopicId, getTopicId)
│  │  └─ ports/                  # Interfaces (contratos), NO implementaciones
│  │     ├─ ArticleRepository.ts
│  │     ├─ EventRepository.ts
│  │     ├─ ReviewRepository.ts
│  │     └─ SubscriberRepository.ts
│  │
│  ├─ features/                  # Una carpeta por dominio funcional
│  │  ├─ news/
│  │  │  ├─ components/
│  │  │  │  ├─ NewsSections.tsx
│  │  │  │  ├─ LatestNewsSection.tsx
│  │  │  │  ├─ TrendyNowSection.tsx
│  │  │  │  ├─ NewsList.tsx
│  │  │  │  ├─ Datefilter.tsx
│  │  │  │  ├─ TopicCard.tsx
│  │  │  │  └─ cards/
│  │  │  │     ├─ LatestNewsCard.tsx
│  │  │  │     └─ OtherNewsCard.tsx
│  │  │  ├─ hooks/
│  │  │  │  ├─ useGetHeadlines.ts
│  │  │  │  ├─ useSearchNews.ts
│  │  │  │  ├─ useArticleNavigation.ts
│  │  │  │  └─ __tests__/
│  │  │  │     └─ useGetHeadlines.test.tsx
│  │  │  ├─ services/
│  │  │  │  ├─ SupabaseArticleRepository.ts
│  │  │  │  ├─ article.schema.ts
│  │  │  │  ├─ dtos/
│  │  │  │  │  └─ d.news.types.ts
│  │  │  │  ├─ mappers/
│  │  │  │  │  ├─ mapTechCrunchToArticle.ts
│  │  │  │  │  ├─ mapGuardianToArticle.ts
│  │  │  │  │  ├─ formatDate.ts
│  │  │  │  │  └─ generateShortId.ts
│  │  │  │  ├─ queries/
│  │  │  │  │  ├─ fetchNews.ts
│  │  │  │  │  └─ searchNews.ts
│  │  │  │  └─ queryKeys.ts
│  │  │  ├─ utils/
│  │  │  │  ├─ topicUtils.ts
│  │  │  │  ├─ techcrunchHtmlParser.ts
│  │  │  │  └─ getEmptyMessage.ts
│  │  │  └─ index.ts             # API pública: NewsSections, NewsList, Datefilter, hooks
│  │  │
│  │  ├─ events/
│  │  │  ├─ components/
│  │  │  │  ├─ EventSection.tsx
│  │  │  │  └─ EventCard.tsx
│  │  │  ├─ hooks/
│  │  │  │  ├─ useGetEvents.ts
│  │  │  │  └─ __tests__/
│  │  │  │     └─ useGetEvents.test.tsx
│  │  │  ├─ services/
│  │  │  │  ├─ SupabaseEventRepository.ts
│  │  │  │  ├─ event.schema.ts
│  │  │  │  ├─ mappers/
│  │  │  │  │  └─ mapGeminiToEvent.ts
│  │  │  │  └─ queries/
│  │  │  │     └─ fetchEvents.ts
│  │  │  └─ index.ts             # API pública: EventSection
│  │  │
│  │  ├─ reviews/
│  │  │  ├─ components/
│  │  │  │  ├─ ReviewsSection.tsx
│  │  │  │  └─ VideoPlayer.tsx
│  │  │  ├─ hooks/
│  │  │  │  ├─ useGetReviews.ts
│  │  │  │  └─ __tests__/
│  │  │  │     └─ useGetReviews.test.tsx
│  │  │  ├─ services/
│  │  │  │  ├─ SupabaseReviewRepository.ts
│  │  │  │  ├─ review.schema.ts
│  │  │  │  ├─ dtos/
│  │  │  │  │  └─ d.reviews.types.ts
│  │  │  │  ├─ mappers/
│  │  │  │  │  └─ mapYouTubeToReview.ts
│  │  │  │  └─ queries/
│  │  │  │     └─ fetchReviews.ts
│  │  │  └─ index.ts             # API pública: ReviewsSection
│  │  │
│  │  └─ newsletter/
│  │     ├─ hooks/
│  │     │  └─ useSubscribeNL.ts
│  │     ├─ services/
│  │     │  └─ createNewSub.ts
│  │     └─ index.ts             # API pública: useSubscribeNL
│  │
│  ├─ pages/                     # Orquestadores de ruta (sin lógica de negocio)
│  │  ├─ HomePage.tsx
│  │  ├─ ContactPage.tsx
│  │  ├─ SubscribePage.tsx
│  │  ├─ news-related-pages/
│  │  │  ├─ TopicPage.tsx
│  │  │  └─ SingleNewPage.tsx
│  │  └─ error/
│  │     └─ NotFound.tsx
│  │
│  ├─ shared/                    # Código transversal entre features
│  │  ├─ components/
│  │  │  ├─ Header.tsx
│  │  │  ├─ DesktopNav.tsx
│  │  │  ├─ MobileNav.tsx
│  │  │  ├─ Footer.tsx
│  │  │  ├─ NewsSearchForm.tsx
│  │  │  ├─ LazyImage.tsx
│  │  │  ├─ LatestNewsSkeleton.tsx
│  │  │  ├─ OtherNewsSkeleton.tsx
│  │  │  └─ navConfig.ts
│  │  ├─ hooks/
│  │  │  ├─ useDropdown.ts
│  │  │  ├─ useScrollToSection.ts
│  │  │  └─ useScrollToTop.ts
│  │  ├─ layout/
│  │  │  └─ MainLayout.tsx
│  │  ├─ lib/
│  │  │  ├─ supabaseClient.ts    # Cliente Supabase con validación de env vars
│  │  │  ├─ staletimes.ts        # STALE_TIMES por dominio
│  │  │  └─ parseList.ts         # Utilidad de validación Zod
│  │  ├─ mocks/
│  │  │  ├─ MockArticleRepository.ts
│  │  │  ├─ MockEventRepository.ts
│  │  │  ├─ MockReviewRepository.ts
│  │  │  └─ fixtures/
│  │  │     ├─ articles.fixture.ts
│  │  │     ├─ events.fixture.ts
│  │  │     └─ reviews.fixture.ts
│  │  └─ utils/
│  │     └─ scrollToElement.ts
│  │
│  ├─ assets/                    # Fuentes, iconos, imágenes
│  │  ├─ Fonts/
│  │  │  └─ (archivos .woff2)
│  │  ├─ icons/
│  │  │  ├─ SearchIcon.tsx
│  │  │  ├─ MenuIcon.tsx
│  │  │  ├─ Share.tsx
│  │  │  ├─ Facebook.tsx
│  │  │  └─ Tweeter.tsx
│  │  └─ images/
│  │     └─ (imágenes .png, .jpg, .webp)
│  │
│  └─ Styles/                    # Sass/CSS
│     ├─ main.scss
│     ├─ main.css
│     ├─ Custom/
│     │  ├─ _variables.scss
│     │  ├─ _overrides.scss
│     │  └─ _fonts.scss
│     └─ (otros estilos)
│
├─ supabase/
│  ├─ config.toml
│  └─ functions/                 # Edge Functions (Deno): fetch APIs externas + cache
│     ├─ get-news/
│     │  ├─ index.ts
│     │  └─ deno.json
│     ├─ get-events/
│     │  ├─ index.ts
│     │  └─ deno.json
│     └─ get-reviews/
│        ├─ index.ts
│        └─ deno.json
│
├─ .env.example                  # Plantilla de variables de entorno
├─ index.html
├─ vite.config.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.app.tsbuildinfo
├─ eslint.config.js
├─ package.json
└─ package-lock.json
```

### Reglas de la arquitectura

- `domain/` es **TS puro**. Si necesita importar React, Supabase o cualquier lib externa, está en el lugar equivocado.
- Los **ports** son `interface` en `domain/ports/`; las implementaciones (`SupabaseArticleRepository`) viven en `features/<x>/services/` con `implements`.
- Las **features no se importan entre sí**: se comunican vía `shared/` o `pages/`.
- Cada feature expone su API pública mediante su `index.ts`; lo no exportado es interno.
- La validación con **Zod** ocurre en la frontera de los servicios. Los DTOs de Supabase viven en `services/`, no en `domain/`.

---

## Licencias

Iconos: <a href="https://www.onlinewebfonts.com/icon">svg icons</a> con licencia CC BY 4.0.
