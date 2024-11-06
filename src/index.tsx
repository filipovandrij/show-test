import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { MemoryRouter } from 'react-router-dom'
// import * as Sentry from '@sentry/react'
import { App } from './App'
import { AppContextComponent } from './app/appContext'

// Sentry.init({
//     dsn: 'https://edb18a6d06bb4bb94399786aab4f628e@o4506693719425024.ingest.sentry.io/4506693790990336',
//     integrations: [
//         new Sentry.BrowserTracing({
//             tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
//         }),
//         Sentry.replayIntegration({
//             maskAllText: false,
//             blockAllMedia: false,
//         }),
//     ],
//     transport: Sentry.makeBrowserOfflineTransport(Sentry.makeFetchTransport),
//     // Performance Monitoring
//     tracesSampleRate: 1.0,
//     replaysSessionSampleRate: 0.1,
//     replaysOnErrorSampleRate: 1.0,
// })

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <MemoryRouter>
      <AppContextComponent>
        <App />
      </AppContextComponent>
    </MemoryRouter>
  </React.StrictMode>
)
