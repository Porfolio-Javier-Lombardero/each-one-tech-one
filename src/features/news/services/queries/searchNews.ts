import { News } from '@/domain/Article';
import { supabase } from '@/shared/lib/supabaseClient';
import { parseList } from '@/shared/lib/parseList';
import { ArticleSchema } from '@/features/news/services/article.schema';
import { mapTechCrunchToArticle } from '@/features/news/services/mappers/mapTechCrunchToArticle';
import { mapGuardianToArticle } from '@/features/news/services/mappers/mapGuardianToArticle';

interface Props {
    keyword: string;
    page: number;
}

// Sends a free-text keyword query to the edge function. Unlike fetchNews, there is no topic or dateFilter because keyword search spans the full article index. The edge function always uses TechCrunch for search because Guardian does not expose free-text search.
export async function searchNews({ keyword, page }: Props): Promise<News> {
    try {
        const { data, error } = await supabase.functions.invoke('get-news', {
            body: { keyword, page },
        });

        if (error) throw error;

        const { source, data: raw } = data;
        const mapped = source === 'techcrunch'
            ? mapTechCrunchToArticle(raw)
            : mapGuardianToArticle(raw);

        return parseList(ArticleSchema, mapped, 'get-news:search');
    } catch (error) {
        console.error('❌ Error en searchNews:', error);
        throw error;
    }
}
