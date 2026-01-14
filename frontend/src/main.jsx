import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Debug logging
console.log('🚀 Starting Virtual Savings Bank...')

// Check if root element exists
const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('❌ ERROR: No element with id="root" found!')
  document.body.innerHTML = '<h1 style="color: red; padding: 20px;">ERROR: No root element found!</h1>'
} else {
  console.log('✅ Root element found')
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App /> {/* Just App, no BrowserRouter wrapper */}
    </React.StrictMode>,
  )
  
  console.log('✅ App rendered successfully')
}