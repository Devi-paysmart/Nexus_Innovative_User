import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Global Fetch Interceptor to handle Token Expiration
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  if (response.status === 401) {
    if (window.location.pathname !== "/login") {
      localStorage.removeItem("nexus_token");
      localStorage.removeItem("nexus_user");
      window.location.href = "/login";
    }
  }
  return response;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
