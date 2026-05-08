// Interfaz base para la aplicación
export interface EventProps {
    title: string;
    location: string;
    date: string;
    url: string;
}

export type Events = EventProps[];

