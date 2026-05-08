
import { RouteObject } from 'react-router-dom'

import { HomePage } from '../../pages/HomePage'
import { TopicPage } from '../../pages/news-related-pages/TopicPage'
import { SingleNewPage } from '../../pages/news-related-pages/SingleNewPage'
import { SearchResults } from '../../pages/news-related-pages/SearchResults'
import { ContactPage } from '../../pages/ContactPage'
import { SubscribePage } from '../../pages/SubscribePage'

import { NotFound } from '../../pages/error/NotFound'
import { MainLayOut } from '@/layout/MainLayOut'


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
                path: "/topic/:value",
                element: <TopicPage />,
            },
            {
                path: "/topic/*",
                element: <NotFound />
            },
            {
                path: '/news/:title',
                element: <SingleNewPage />
            },
            {
                path: '/news/*',
                element: <NotFound />
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
                path: '*',
                element: <NotFound />
            },

        ]
    }
];
