export interface Article {
    /** Stable key generated from the article URL (hash). The API does not return a consistent ID across calls, so this is derived client-side. */
    id_hash: string;
    titulo: string;
    description: string;
    /** Article body content ("contenido"). Abbreviated field name. */
    cont: string;
    /** Array of numeric TechCrunch tag IDs. Guardian articles always receive [] because Guardian does not use this category system. */
    categories: number[];
    /** Raw ISO-8601 date as returned by the API. Kept separate from `fecha` for server-side date-filter comparisons. */
    fechaIso: string;
    /** Pre-formatted date string for display (e.g. "jun, 6, 2026"). Derived from fechaIso by the mapper. */
    fecha: string;
    url: string;
    /** Cover image URL. Optional because not all articles include one; Guardian provides it via fields.thumbnail, TechCrunch via yoast_head_json.og_image[0]. */
    img?: string | null;
}

export type News = Article[];
export type DateFilterType = "all" | "today" | "yesterday" | "lastWeek";
