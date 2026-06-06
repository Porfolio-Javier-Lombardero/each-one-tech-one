import { useNavigate } from 'react-router-dom';
import { Article } from '@/domain/Article';

// Passes the full Article object via router state so SingleNewPage can render immediately without a new API call.
// The URL slug in /news/:title is only for the address bar — it is not used as a data lookup key.
export const useArticleNavigation = () => {
    const navigate = useNavigate();
    return (article: Article) =>
        navigate(`/news/${article.titulo}`, { state: { new: article } });
};
