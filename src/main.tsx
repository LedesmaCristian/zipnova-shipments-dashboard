import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createMockState, makeStore } from '@/app/store'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('No se encontró el elemento #root')

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={makeStore(createMockState())}>
      <App />
    </Provider>
  </StrictMode>,
)
