import { DateFilterType, News } from '@/domain/Article';
import { supabase } from '@/shared/lib/supabaseClient';
import { parseList } from '@/shared/lib/parseList';
import { ArticleSchema } from '@/features/news/services/article.schema';
import { mapTechCrunchToArticle } from '@/features/news/services/mappers/mapTechCrunchToArticle';
import { mapGuardianToArticle } from '@/features/news/services/mappers/mapGuardianToArticle';

interface Props {
    topic: number | string;
    dateFilter: DateFilterType;
    page: number;
}

export async function fetchNews({ topic, dateFilter, page }: Props): Promise<News> {
    try {
        const { data, error } = await supabase.functions.invoke('get-news', {
            body: { topic, dateFilter, page },
        });

        if (error) throw error;

        const { source, data: raw } = data;
        const mapped = source === 'techcrunch'
            ? mapTechCrunchToArticle(raw)
            : mapGuardianToArticle(raw);

        return parseList(ArticleSchema, mapped, 'get-news');
    } catch (error) {
        console.error('❌ Error en fetchNews:', error);
        throw error;
    }
}
