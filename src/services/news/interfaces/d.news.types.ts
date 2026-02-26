export type DateFilterType = "all" | 'today' | 'yesterday' | 'lastWeek';

// Interfaz base para la aplicación (datos de negocio)
export interface SingleNew {
    id_hash: string; // ID corto de 16 caracteres
    titulo: string;
    description: string;
    cont: string;
    categories: number[];
    fechaIso: string;
    fecha: string;
    url: string;
    img?: string | null;
}

export type News = SingleNew[];

// Interfaz extendida para la DB (incluye campos de caché)
export interface NewsCacheRow extends SingleNew {
    search_context: string; // Para filtrado: 'smartphones_lastWeek', 'cat_449_today'
    source: string;
    created_at: string;
    updated_at: string; // Para validar frescura del caché
    fetch_count: number;
}

export interface TechCrunchArticle {
    id: number;
    date: string;
    date_gmt: string;
    guid: {
        rendered: string;
    };
    modified: string;
    modified_gmt: string;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
        protected: boolean;
    };
    excerpt: {
        rendered: string;
        protected: boolean;
    };
    author: number;
    featured_media: number;
    comment_status: string;
    ping_status: string;
    sticky: boolean;
    template: string;
    format: string;
    meta: {
        [key: string]: string | number | boolean | string[];
    };
    categories: number[];
    tags: number[];
    tc_region: any[];
    tc_event: any[];
    tc_storyline_tax: any[];
    coauthors: number[];
    class_list: string[];
    apple_news_notices: any[];
    yoast_head: string;
    yoast_head_json: {
        title: string;
        description: string;
        robots: Record<string, string>;
        canonical: string;
        og_locale: string;
        og_type: string;
        og_title: string;
        og_description: string;
        og_url: string;
        og_site_name: string;
        article_publisher?: string;
        article_published_time?: string;
        article_modified_time?: string;
        og_image?: Array<{
            width: number;
            height: number;
            url: string;
            type: string;
        }>;
        author: string;
        twitter_card: string;
        twitter_creator: string;
        twitter_site: string;
        twitter_misc: Record<string, string>;
        schema: any;
    };
    parsely: {
        version: string;
        canonical_url: string;
        smart_links: {
            inbound: number;
            outbound: number;
        };
        traffic_boost_suggestions_count: number;
        meta: any;
        rendered: string;
        tracker_url: string;
    };
    jetpack_featured_media_url: string;
    jetpack_sharing_enabled: boolean;
}

export interface GuardianFields {
    bodyText: string;
    trailText: string
    thumbnail: string
}

export interface GuardianArticle {
    id: string;
    type: string;
    sectionId: string;
    sectionName: string;
    webPublicationDate: string; // ISO string, convertir a Date si lo deseas
    webTitle: string;
    webUrl: string;
    apiUrl: string;
    tags: string;
    fields: GuardianFields;
    isHosted: boolean;
    pillarId: string;
    pillarName: string;
}


export type TechCrunchArticleArray = TechCrunchArticle[]

export type GuardianArticleArray = GuardianArticle[]