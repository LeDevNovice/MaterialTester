import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MaterialTester from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MaterialTester />
  </StrictMode>,
)
