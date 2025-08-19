// Type definitions for Electron's webview tag
interface WebViewElement extends HTMLElement {
  // Loads the webview with the specified URL
  loadURL(url: string): Promise<void>;
  
  // Reloads the current page
  reload(): void;
  
  // Navigation methods
  goBack(): void;
  goForward(): void;
  canGoBack(): boolean;
  canGoForward(): boolean;
  
  // Page information
  getURL(): string;
  getTitle(): string;
  
  // Find in page
  findInPage(text: string, options?: Electron.FindInPageOptions): void;
  stopFindInPage(action: 'clearSelection' | 'keepSelection' | 'activateSelection'): void;
  
  // Event listeners
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: WebViewElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: WebViewElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
  
  // Custom events for Electron's webview
  addEventListener(
    type: 'did-start-loading' | 'did-stop-loading',
    listener: (event: Event) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: 'page-title-updated',
    listener: (event: CustomEvent<{ title: string }>) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: 'did-navigate',
    listener: (event: CustomEvent<{ url: string }>) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: 'page-favicon-updated',
    listener: (event: CustomEvent<{ favicons: string[] }>) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'webview': WebViewElement;
  }
  
  namespace JSX {
    interface IntrinsicElements {
      'webview': React.DetailedHTMLProps<
        React.WebViewHTMLAttributes<WebViewElement> & {
          onDidStartLoading?: (event: Event) => void;
          onDidStopLoading?: (event: Event) => void;
          onPageTitleUpdated?: (event: CustomEvent<{ title: string }>) => void;
          onDidNavigate?: (event: CustomEvent<{ url: string }>) => void;
        },
        WebViewElement
      >;
    }
  }
}
