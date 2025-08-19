// This function registers the service worker in the browser
export const register = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      
      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          
          // Check for updates every hour
          setInterval(() => {
            registration.update().catch(err => 
              console.log('ServiceWorker update failed: ', err)
            );
          }, 60 * 60 * 1000);
        })
        .catch(error => {
          console.error('Error during service worker registration:', error);
        });
    });
  }
};

// This function unregisters the service worker
export const unregister = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
};
