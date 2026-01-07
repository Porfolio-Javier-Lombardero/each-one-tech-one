
import { RouteObject } from 'react-router-dom'
import { MainLayOut } from '../../shared/Layout/MainLayOut'
import { HomePage } from '../../features/news/pages/HomePage'
import { TopicPage } from '../../features/news/pages/TopicPage'
import { SingleNewPage } from '../../features/news/pages/SingleNewPage'
import { SearchResults } from '../../features/news/pages/SearchResults'
import { ContactPage } from '../../features/contact/pages/ContactPage'
import { SubscribePage } from '../../features/newsletter/pages/SubscribePage'
import { TechRapsodyPage } from '../../features/techrapshody/pages/TechRapsodyPage'
import { NotFound } from '../../shared/pages/NotFound'


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
                path: 'topic/:topic',
                element: <TopicPage />
            },
            {
                path: 'news/:id',
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
