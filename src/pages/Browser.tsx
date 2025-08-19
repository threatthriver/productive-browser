import React, { useRef, useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

// Type for webview element
interface WebViewElement extends HTMLElement {
  src: string;
  getURL(): string;
  reload(): void;
  goBack(): void;
  goForward(): void;
  canGoBack(): boolean;
  canGoForward(): boolean;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

const Browser: React.FC = () => {
  const webviewRef = useRef<WebViewElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const location = useLocation();
  const initialUrl = location.state?.url || 'https://www.google.com';

  // Handle webview events
  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const handleNewWindow = (e: Event) => {
      const event = e as unknown as { url: string };
      try {
        const url = new URL(event.url);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          webview.src = event.url;
        }
      } catch (error) {
        console.error('Invalid URL:', event.url);
      }
    };

    const handleDidStartLoading = () => {
      setIsLoading(true);
      setHasError(false);
    };

    const handleDidStopLoading = () => {
      setIsLoading(false);
    };

    const handleDidFailLoad = (e: Event) => {
      const event = e as unknown as { errorDescription: string };
      console.error('Failed to load URL:', event.errorDescription);
      setHasError(true);
      setIsLoading(false);
    };

    // Add event listeners with type assertions
    (webview as any).addEventListener('new-window', handleNewWindow as EventListener);
    (webview as any).addEventListener('did-start-loading', handleDidStartLoading as EventListener);
    (webview as any).addEventListener('did-stop-loading', handleDidStopLoading as EventListener);
    (webview as any).addEventListener('did-fail-load', handleDidFailLoad as EventListener);

    return () => {
      (webview as any).removeEventListener('new-window', handleNewWindow as EventListener);
      (webview as any).removeEventListener('did-start-loading', handleDidStartLoading as EventListener);
      (webview as any).removeEventListener('did-stop-loading', handleDidStopLoading as EventListener);
      (webview as any).removeEventListener('did-fail-load', handleDidFailLoad as EventListener);
    };
  }, []);

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative'
    }}>
      {isLoading && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'background.paper',
          zIndex: 10
        }}>
          <CircularProgress />
        </Box>
      )}
      
      {hasError ? (
        <Box sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          textAlign: 'center'
        }}>
          <Typography variant="h6" color="error" gutterBottom>
            Failed to load the page
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The page could not be loaded. Please check your internet connection and try again.
          </Typography>
        </Box>
      ) : (
        <webview
          ref={webviewRef}
          src={initialUrl}
          style={{ 
            width: '100%', 
            height: '100%',
            border: 'none',
            backgroundColor: '#fff',
            flex: 1,
            visibility: isLoading ? 'hidden' : 'visible'
          }}
          allowpopups={true as any}
          webpreferences="contextIsolation=no, nodeIntegration=no, webviewTag=yes"
        />
      )}
    </Box>
  );
};

export default Browser;
