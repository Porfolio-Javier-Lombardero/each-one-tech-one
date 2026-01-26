import { SingleNew } from "@/lib/types/d.news.types";

export interface CardProps {
    noticia: SingleNew
}

export interface EventProps {
    title:string| undefined;
    location:string |undefined;
    date:string | undefined;
}