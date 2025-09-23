// Fix for Supabase realtime WebSocket issues in browser
// This patches the WebSocket used by Supabase to work correctly in browser

declare global {
  interface Window {
    WebSocket: typeof WebSocket;
  }
}

// Ensure WebSocket is available globally
if (typeof window !== 'undefined' && window.WebSocket) {
  // Patch the ws module for Supabase
  (window as any).global = window;
  
  // Create a WebSocket implementation that Supabase can use
  const createWebSocket = (url: string | URL, protocols?: string | string[]) => {
    return new WebSocket(url, protocols);
  };
  
  // Make it available as a module-like export
  (window as any).ws = createWebSocket;
  (window as any).WebSocket = WebSocket;
  
  // Override require for ws module if needed
  if (!(window as any).require) {
    (window as any).require = (id: string) => {
      if (id === 'ws') {
        return createWebSocket;
      }
      return null;
    };
  }
}

export {};