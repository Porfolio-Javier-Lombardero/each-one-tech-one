# Flujo de datos - Feature news (ruta useGetHeadlines)

---

## 1. Diagrama de secuencia

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario
    participant Nav as DesktopNav
    participant RR as React Router
    participant TP as TopicPage
    participant Hook as useGetHeadlines
    participant QC as React Query Cache
    participant Repo as SupabaseArticleRepository
    participant Fetch as fetchNews
    participant Edge as Edge Function
    participant Ext as API Externa
    participant List as NewsList
    participant SNP as SingleNewPage

    U->>Nav: Click en categoria
    Nav->>RR: navigate /topic/A.I.
    RR->>TP: monta ruta /topic/:value
    TP->>Hook: useGetHeadlines topic dateFilter

    Hook->>QC: busca queryKey en cache
    alt cache fresca menor a 5h
        QC-->>Hook: Article[] sin llamada a red
    else sin cache o expirada
        Hook->>Repo: getHeadlines topic dateFilter page
        Repo->>Repo: getTopicId - A.I. a 577047203
        Repo->>Fetch: fetchNews apiId dateFilter page
        Fetch->>Edge: supabase.functions.invoke get-news
        Edge->>Edge: comprueba news_cache
        alt raw cacheado fresco
            Edge-->>Fetch: source + data raw
        else cache expirada
            Edge->>Ext: fetch TechCrunch o Guardian
            Ext-->>Edge: articulos crudos DTO
            Edge->>Edge: guarda en news_cache
            Edge-->>Fetch: source + data raw
        end
        Fetch->>Fetch: mapea DTO a Article
        Fetch->>Fetch: valida con Zod parseList
        Fetch-->>Repo: Article[] validado
        Repo-->>Hook: Article[]
        Hook->>QC: guarda en cache
    end

    Hook-->>TP: news flatNews fetchNextPage
    TP->>List: pasa news como prop
    List-->>U: LatestNewsCard y OtherNewsCard

    U->>List: click en card
    List->>RR: navigate con state article
    RR->>SNP: monta /news/:title
    alt hay article en state
        SNP-->>U: renderiza titulo descripcion contenido
    else sin state o refresh
        SNP-->>U: muestra skeleton
    end
```

---

## 2. Diagrama de capas

```mermaid
flowchart TD
    subgraph domain["domain/"]
        Article["Article.ts"]
        Topics["Topics.ts"]
        Port["ArticleRepository.ts interface"]
    end

    subgraph shared["shared/"]
        Nav["DesktopNav.tsx"]
        Router["Routes.tsx"]
        Stale["staletimes.ts"]
        ParseList["parseList.ts"]
        Supa["supabaseClient.ts"]
    end

    subgraph pages["pages/"]
        TopicPage["TopicPage.tsx"]
        SingleNewPage["SingleNewPage.tsx"]
    end

    subgraph feature["features/news/"]
        Hook["useGetHeadlines.ts"]
        ArtNav["useArticleNavigation.ts"]
        Keys["queryKeys.ts"]
        RepoImpl["SupabaseArticleRepository.ts"]
        FetchNews["fetchNews.ts"]
        Schema["article.schema.ts"]
        Mappers["mappers"]
        NewsList["NewsList.tsx"]
        Cards["Cards"]
    end

    subgraph server["Servidor"]
        Edge["Edge Function get-news"]
        Ext["TechCrunch / Guardian"]
        Cache[("news_cache")]
    end

    Nav --> Topics
    Nav --> Router
    Router --> TopicPage
    Router --> SingleNewPage
    TopicPage --> Hook
    TopicPage --> NewsList
    Hook --> RepoImpl
    Hook --> Keys
    Hook --> Stale
    Hook -.-> Port
    RepoImpl -.-> Port
    RepoImpl --> Topics
    RepoImpl --> FetchNews
    FetchNews --> Supa
    FetchNews --> Mappers
    FetchNews --> Schema
    FetchNews --> ParseList
    Supa --> Edge
    Edge --> Cache
    Edge --> Ext
    NewsList --> Cards
    Cards --> ArtNav
    ArtNav --> SingleNewPage
    Hook --> Article
    RepoImpl --> Article
    Mappers --> Article
```

---

## 3. Transformacion del dato

```mermaid
flowchart LR
    A["TopicId legible - A.I."]
    B["ApiTopicId - 577047203"]
    C["DTO crudo"]
    D["Article mapeado"]
    E["Article validado Zod"]
    F["flatNews React Query"]
    G["Article en router state"]
    H["HTML renderizado"]

    A -->|getTopicId| B
    B -->|Edge + API| C
    C -->|mappers| D
    D -->|Zod schema| E
    E -->|flatMap| F
    F -->|navigate state| G
    G -->|SingleNewPage| H
```

---

# Rama useSearchNews (busqueda por keyword)

La busqueda NO usa una ruta /search propia: reutiliza /topic/:value.
El formulario navega a /topic/termino y TopicPage discrimina si es
categoria conocida o keyword libre.

## 4. Diagrama de secuencia - busqueda

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario
    participant Form as NewsSearchForm
    participant RR as React Router
    participant TP as TopicPage
    participant Hook as useSearchNews
    participant QC as React Query Cache
    participant Repo as SupabaseArticleRepository
    participant Fetch as searchNews
    participant Edge as Edge Function
    participant TC as TechCrunch API
    participant List as NewsList
    participant SNP as SingleNewPage

    U->>Form: escribe termino y submit
    Form->>Form: trim + encodeURIComponent
    Form->>RR: navigate /topic/termino
    RR->>TP: monta ruta /topic/:value
    TP->>TP: isKnownCategory? NO -> isKeywordSearch
    TP->>TP: oculta Datefilter
    TP->>Hook: useSearchNews term

    Hook->>Hook: term = keyword.trim
    alt term vacio
        Hook-->>TP: enabled false, no dispara query
    else term con texto
        Hook->>QC: queryKey [news-search, term]
        alt cache fresca menor a 5h
            QC-->>Hook: Article[] sin red
        else sin cache o expirada
            Hook->>Repo: searchByKeyword keyword page
            Repo->>Fetch: searchNews keyword page
            Note over Repo: sin getTopicId, texto libre
            Fetch->>Edge: invoke get-news body keyword page
            Edge->>Edge: isSearch true -> source techcrunch
            Edge->>Edge: comprueba news_cache kw_term_pN
            alt raw cacheado fresco
                Edge-->>Fetch: source + data raw
            else cache expirada
                Edge->>TC: WordPress search sin ventana de fechas
                TC-->>Edge: articulos crudos DTO
                Edge->>Edge: guarda en news_cache
                Edge-->>Fetch: source + data raw
            end
            Fetch->>Fetch: mapea DTO a Article
            Fetch->>Fetch: valida con Zod parseList
            Fetch-->>Repo: Article[] validado
            Repo-->>Hook: Article[]
            Hook->>QC: guarda en cache
        end
    end

    Hook-->>TP: news keywordNews fetchNextPage
    TP->>List: pasa keywordNews como prop
    List-->>U: cards de resultados

    U->>List: click en card
    List->>RR: navigate con state article
    RR->>SNP: monta /news/:title
    SNP-->>U: renderiza articulo o skeleton
```

---

## 5. Comparativa de las dos ramas

```mermaid
flowchart TD
    Start["/topic/:value"]
    Disc{"value esta en Categories?"}
    Cat["Rama categoria"]
    Kw["Rama keyword"]

    Start --> Disc
    Disc -->|si| Cat
    Disc -->|no| Kw

    Cat --> C1["useGetHeadlines"]
    C1 --> C2["queryKey top-headlines topic dateFilter"]
    C2 --> C3["getHeadlines"]
    C3 --> C4["getTopicId traduce a id"]
    C4 --> C5["body topic dateFilter page"]
    C5 --> C6["source TechCrunch o Guardian"]
    C6 --> C7["filtra por fecha, Datefilter visible"]

    Kw --> K1["useSearchNews enabled term"]
    K1 --> K2["queryKey news-search term"]
    K2 --> K3["searchByKeyword"]
    K3 --> K4["sin traduccion, texto libre"]
    K4 --> K5["body keyword page"]
    K5 --> K6["source siempre TechCrunch"]
    K6 --> K7["sin fecha, Datefilter oculto"]

    C7 --> Tail["NewsList, Cards, navigate state, SingleNewPage"]
    K7 --> Tail
```

---

## Notas de la rama de busqueda

- **Origen distinto**: la categoria nace de un NavLink del nav; la busqueda nace
  del formulario NewsSearchForm en el Header. Ambas terminan en /topic/:value.
- **El discriminador vive en TopicPage**: isKnownCategory compara value contra
  Object.values(Categories). Si no coincide, se trata como keyword. Riesgo:
  buscar literalmente "Smartphones" o "A.I." cae en la rama de categoria.
- **enabled: term.length > 0**: TopicPage monta ambos hooks siempre; este guard
  evita que useSearchNews dispare una query vacia cuando estamos en una categoria.
- **Sin traduccion de dominio**: searchByKeyword NO usa getTopicId; el termino va
  como texto libre al servidor (a diferencia de la rama de categoria).
- **Servidor**: en busqueda la Edge Function siempre usa TechCrunch (endpoint
  WordPress con search=), sin ventana de fechas, y cachea con clave kw_term_pN.
- **La cola es identica** a la rama de headlines: NewsList, cards, navegacion por
  state y SingleNewPage.
- **encodeURIComponent**: el formulario codifica el termino antes de navegar, asi
  un termino con / (ej. iOS 18/19) no rompe la ruta. useParams lo decodifica.
- **/search eliminada**: la antigua pagina SearchResults era codigo muerto y se
  retiro; la busqueda funciona reutilizando /topic/:value.
```
