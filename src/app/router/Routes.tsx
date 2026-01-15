
import { RouteObject } from 'react-router-dom'
import { MainLayOut } from '../../components/shared/layout/MainLayOut'
import { HomePage } from '../../pages/HomePage'
import { TopicPage } from '../../pages/news-related-pages/TopicPage'
import { SingleNewPage } from '../../pages/news-related-pages/SingleNewPage'
import { SearchResults } from '../../pages/news-related-pages/SearchResults'
import { ContactPage } from '../../pages/ContactPage'
import { SubscribePage } from '../../pages/SubscribePage'
import { TechRapsodyPage } from '../../pages/news-related-pages/TechRapsodyPage'
import { NotFound } from '../../pages/NotFound'


export const Routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayOut />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: '/:topic',
                element: <TopicPage />
            },
            {
                path: 'single',
                element: <SingleNewPage />
            },
            {
                path: 'search',
                element: <SearchResults />
            },
            {
                path: 'contact',
                element: <ContactPage />
            },
            {
                path: 'subscribe',
                element: <SubscribePage />
            },
            {
                path: 'tech-rapsody',
                element: <TechRapsodyPage />
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
];
