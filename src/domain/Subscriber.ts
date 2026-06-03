export interface Subscriber {
    email: string;
    topics: "all" | "smartphones" | "app" | "gadgets" | "a.i." | "policies & reg";
    frecuency: "daily" | "weekly" | "monthly";
}
