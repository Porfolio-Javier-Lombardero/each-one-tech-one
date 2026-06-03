export interface Review {
    video_id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    channel_title: string;
    published_at: string;
    video_kind: string;
}

export type Reviews = Review[];
