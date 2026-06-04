import { Review } from '@/domain/Review';

export const REVIEWS_FIXTURE: Review[] = [
    {
        video_id: 'vid_001',
        title: 'Best Laptops 2026',
        description: 'Our top picks for this year.',
        thumbnail_url: 'https://example.com/thumb1.jpg',
        channel_title: 'TechOne Reviews',
        published_at: '2026-05-10T12:00:00Z',
        video_kind: 'youtube#video',
    },
    {
        video_id: 'vid_002',
        title: 'Smartphone Comparison',
        description: 'Flagship phones head to head.',
        thumbnail_url: 'https://example.com/thumb2.jpg',
        channel_title: 'TechOne Reviews',
        published_at: '2026-05-20T12:00:00Z',
        video_kind: 'youtube#video',
    },
];
