export interface Article {
    id_hash: string;
    titulo: string;
    description: string;
    cont: string;
    categories: number[];
    fechaIso: string;
    fecha: string;
    url: string;
    img?: string | null;
}

export type News = Article[];
export type DateFilterType = "all" | "today" | "yesterday" | "lastWeek";
