import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initializeConfig } from './config'
import { EducationApp } from './EducationApp'
import './index.css'

const root = document.getElementById('root')!

initializeConfig()
  .then(() => {
    createRoot(root).render(
      <StrictMode>
        <EducationApp />
      </StrictMode>
    )
  })
  .catch((err) => {
    console.error('[Education] Failed to initialize config:', err)
    createRoot(root).render(
      <StrictMode>
        <EducationApp />
      </StrictMode>
    )
  })
