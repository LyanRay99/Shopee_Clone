//* Library
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'

//* Utils + Components
import App from './App'
import './index.css'
import { AppProvider } from './Contexts/app.context'
import ErrorBoundary from './Components/Error_Boundary'
import 'src/i18n/i18Next'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      //* ko call lại Api khi lần call trước error
      retry: 0
    }
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* React Helmet Async */}
      <HelmetProvider>
        {/* Cửa sổ Devtool của React Query */}
        <QueryClientProvider client={queryClient}>
          {/* React Context API */}
          <AppProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </AppProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
)
