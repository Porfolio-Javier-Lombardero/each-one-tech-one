import { useNavigate } from 'react-router-dom';
import { Article } from '@/domain/Article';

export const useArticleNavigation = () => {
    const navigate = useNavigate();
    return (article: Article) =>
        navigate(`/news/${article.titulo}`, { state: { new: article } });
};
