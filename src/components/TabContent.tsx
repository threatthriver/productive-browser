import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { addHistory } from '../utils/historyManager';

// Define the shape of the ref
export interface TabContentHandle {
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  navigateTo: (url: string) => void;
}

interface WebViewElement extends HTMLElement {
  src: string;
  getURL(): string;
  reload(): void;
  goBack(): void;
  goForward(): void;
  canGoBack(): boolean;
  canGoForward(): boolean;
  stopFindInPage(action: 'clearSelection'): void;
  findInPage(text: string): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

interface TabContentProps {
  tabId: string;
  url: string;
  onUrlChange: (url: string) => void;
  onTitleChange: (title: string) => void;
  onLoadingChange: (loading: boolean) => void;
  onNavigationState: (canGoBack: boolean, canGoForward: boolean) => void;
  onFaviconChange: (favicon?: string) => void;
}

const TabContent = forwardRef<TabContentHandle, TabContentProps>(({
  url,
  onUrlChange,
  onTitleChange,
  onLoadingChange,
  onNavigationState,
  onFaviconChange,
}, ref) => {
  const webviewRef = useRef<WebViewElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [canGoBack, setCanGoBack] = React.useState(false);
  const [canGoForward, setCanGoForward] = React.useState(false);

  // Expose navigation methods via ref
  useImperativeHandle(ref, () => ({
    goBack: () => {
      if (webviewRef.current && webviewRef.current.canGoBack()) {
        webviewRef.current.goBack();
      }
    },
    goForward: () => {
      if (webviewRef.current && webviewRef.current.canGoForward()) {
        webviewRef.current.goForward();
      }
    },
    reload: () => {
      if (webviewRef.current) {
        webviewRef.current.reload();
      }
    },
    navigateTo: (newUrl: string) => {
      if (webviewRef.current) {
        let targetUrl = newUrl;
        if (!/^https?:\/\//i.test(newUrl)) {
          targetUrl = `https://${newUrl}`;
        }
        webviewRef.current.src = targetUrl;
      }
    },
  }));

  // Update parent about navigation state changes
  useEffect(() => {
    onNavigationState(canGoBack, canGoForward);
  }, [canGoBack, canGoForward, onNavigationState]);

  // Update parent about loading state changes
  useEffect(() => {
    onLoadingChange(isLoading);
  }, [isLoading, onLoadingChange]);

  // Set up webview event listeners
  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleLoadStop = () => {
      setIsLoading(false);
      updateNavigationState();
    };

    const handleTitleUpdated = (e: Event) => {
      const title = (e as CustomEvent<{title: string}>).detail?.title || '';
      onTitleChange(title);
      if (url && title) {
        addHistory({ url, title });
      }
    };

    const handleDidNavigate = (e: Event) => {
      const navigatedUrl = (e as CustomEvent<{url: string}>).detail?.url || '';
      if (navigatedUrl && navigatedUrl !== 'about:blank') {
        onUrlChange(navigatedUrl);
      }
      updateNavigationState();
    };

    const handleFaviconUpdated = (e: Event) => {
      const icons = (e as CustomEvent<{ favicons: string[] }>).detail?.favicons || [];
      onFaviconChange(icons[0]);
    };

    webview.addEventListener('did-start-loading', handleLoadStart as EventListener);
    webview.addEventListener('did-stop-loading', handleLoadStop as EventListener);
    webview.addEventListener('page-title-updated', handleTitleUpdated as EventListener);
    webview.addEventListener('did-navigate', handleDidNavigate as EventListener);
    webview.addEventListener('page-favicon-updated', handleFaviconUpdated as EventListener);

    return () => {
      webview.removeEventListener('did-start-loading', handleLoadStart as EventListener);
      webview.removeEventListener('did-stop-loading', handleLoadStop as EventListener);
      webview.removeEventListener('page-title-updated', handleTitleUpdated as EventListener);
      webview.removeEventListener('did-navigate', handleDidNavigate as EventListener);
      webview.removeEventListener('page-favicon-updated', handleFaviconUpdated as EventListener);
    };
  }, [onTitleChange, onUrlChange, onFaviconChange]);

  const updateNavigationState = () => {
    if (webviewRef.current) {
      setCanGoBack(webviewRef.current.canGoBack());
      setCanGoForward(webviewRef.current.canGoForward());
    }
  };

  return (
    <Box sx={{ flexGrow: 1, position: 'relative', minHeight: 0 }}>
      <webview
        ref={webviewRef}
        src={url}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundColor: 'transparent',
          display: 'block',
        }}
        allowpopups="true"
        webpreferences="contextIsolation=no"
      />
    </Box>
  );
});

export default TabContent;
