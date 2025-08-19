/// <reference types="vite/client" />

// Extend the WebView HTML element
declare namespace JSX {
  interface WebViewHTMLAttributes<T> extends HTMLAttributes<T> {
    allowpopups?: string | boolean;
    webpreferences?: string;
    src?: string;
    nodeintegration?: string;
  }
}

// Extend the Window interface to include Electron APIs
interface Window {
  electron: {
    send: (channel: string, ...args: any[]) => void;
    receive: (channel: string, func: (...args: any[]) => void) => void;
  };
}

// Extend the HTMLWebViewElement interface
declare global {
  interface HTMLWebViewElement extends HTMLElement {
    src: string;
    getURL(): string;
    reload(): void;
    goBack(): void;
    goForward(): void;
    canGoBack(): boolean;
    canGoForward(): boolean;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void;
  }
}
