import { Article } from '@/domain/Article';

export const ARTICLES_FIXTURE: Article[] = [
    {
        id_hash: 'abc123',
        titulo: 'Test Article One',
        description: 'Description one',
        cont: 'Content one',
        categories: [577047203],
        fechaIso: '2026-06-01T10:00:00Z',
        fecha: '01/06/2026',
        url: 'https://example.com/article-1',
        img: 'https://example.com/img1.jpg',
    },
    {
        id_hash: 'def456',
        titulo: 'Test Article Two',
        description: 'Description two',
        cont: 'Content two',
        categories: [577047203],
        fechaIso: '2026-06-02T10:00:00Z',
        fecha: '02/06/2026',
        url: 'https://example.com/article-2',
        img: null,
    },
];
