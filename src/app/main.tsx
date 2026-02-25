
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App';
import "../Styles/main.scss"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24,
      refetchOnWindowFocus: false, // Evita refetch al cambiar de pestaña
      refetchOnReconnect: false, // Evita refetch al reconectar
      retry: 3, // Número de reintentos en caso de error
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
     <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)
