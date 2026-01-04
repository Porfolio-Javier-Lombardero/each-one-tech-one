
import { createRoot } from 'react-dom/client'

import "./Styles/main.scss"
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { LayOut } from './Layout/LayOut';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={new QueryClient()}>
    <BrowserRouter>
      <LayOut>
          <App />
      </LayOut>
    </BrowserRouter>,
  </QueryClientProvider>
)
