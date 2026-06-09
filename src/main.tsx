import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App'

async function prepare(): Promise<void> {
  if (import.meta.env.VITE_OWM_API_KEY === 'test') {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }
}

prepare().then(() => {
  const rootElement = document.getElementById('root')
  if (!rootElement) throw new Error('Root element not found')
  createRoot(rootElement).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  )
})
