import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import GlobalStyles from '@/styles/GlobalStyles'

// PWA 서비스 워커 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('Service Worker registered:', registration)
      },
      (error) => {
        console.log('Service Worker registration failed:', error)
      }
    )
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalStyles />
    <App />
  </React.StrictMode>,
)
