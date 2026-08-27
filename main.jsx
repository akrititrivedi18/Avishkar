// Yeh file sabse pehle chalti hai. Isका kaam sirf itna hai:
// App.jsx ko "root" div ke andar render kar dena.
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
