// WebSocket shim for browser compatibility with Node.js ws package
export default class WebSocketShim extends WebSocket {
  constructor(url, protocols) {
    super(url, protocols);
  }
}

// Export both named and default for compatibility
export { WebSocketShim };

// Override the ws module for browser compatibility
if (typeof window !== 'undefined') {
  window.WebSocket = window.WebSocket || WebSocket;
}