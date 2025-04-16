import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true, // Opt-in to startTransition wrapping
        v7_relativeSplatPath: true // Opt-in to relative splat path changes
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
