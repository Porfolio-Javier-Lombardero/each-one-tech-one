import { DateFilterType, News } from '@/domain/Article';
import { ApiTopicId } from '@/domain/Topics';
import { supabase } from '@/shared/lib/supabaseClient';
import { parseList } from '@/shared/lib/parseList';
import { ArticleSchema } from '@/features/news/services/article.schema';
import { mapTechCrunchToArticle } from '@/features/news/services/mappers/mapTechCrunchToArticle';
import { mapGuardianToArticle } from '@/features/news/services/mappers/mapGuardianToArticle';

interface Props {
    topic: ApiTopicId;
    dateFilter: DateFilterType;
    page: number;
}

export async function fetchNews({ topic, dateFilter, page }: Props): Promise<News> {
    try {
        const { data, error } = await supabase.functions.invoke('get-news', {
            body: { topic, dateFilter, page },
        });

        if (error) throw error;

        // The edge function returns { source, data } where source is 'techcrunch' or 'guardian'. Source determines which mapper to apply because each API returns a different DTO shape.
        const { source, data: raw } = data;
        const mapped = source === 'techcrunch'
            ? mapTechCrunchToArticle(raw)
            : mapGuardianToArticle(raw);

        // parseList validates each item against ArticleSchema individually. Invalid items are discarded with a warning instead of failing the whole response.
        return parseList(ArticleSchema, mapped, 'get-news');
    } catch (error) {
        console.error('❌ Error en fetchNews:', error);
        throw error;
    }
}
