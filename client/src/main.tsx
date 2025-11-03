import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered successfully');
        console.log('Scope:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 Service Worker update found');
          
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('✨ New content available, please refresh');
            }
          });
        });
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000);
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
        console.error('Error details:', error.message);
      });
  });
}

// Handle PWA install prompt
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('💡 PWA install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  window.dispatchEvent(new CustomEvent('pwa-install-available'));
});

window.addEventListener('appinstalled', () => {
  console.log('✅ PWA installed successfully');
  deferredPrompt = null;
});
