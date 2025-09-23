// WebSocket shim for browser compatibility with Node.js ws package
// This provides a browser-compatible WebSocket implementation

// Use native WebSocket in browser
const WebSocketImpl = typeof window !== 'undefined' ? window.WebSocket || WebSocket : WebSocket;

// Create a constructor function that matches the ws package API
function WebSocketShim(url, protocols, options) {
  // In browser, ignore the options parameter and use native WebSocket
  return new WebSocketImpl(url, protocols);
}

// Copy static properties and methods if they exist
if (WebSocketImpl) {
  Object.setPrototypeOf(WebSocketShim.prototype, WebSocketImpl.prototype);
  Object.setPrototypeOf(WebSocketShim, WebSocketImpl);
}

// Export as default to match ws package
export default WebSocketShim;

// Also export as named export for compatibility
export { WebSocketShim };

// Ensure WebSocket is available globally if needed
if (typeof window !== 'undefined' && !window.WebSocket) {
  window.WebSocket = WebSocketImpl;
}