// WebSocket shim for browser compatibility with Node.js ws package
// This replaces the ws module with browser-native WebSocket

const WebSocketShim = function(url, protocols, options) {
  // In browser environment, use native WebSocket
  if (typeof window !== 'undefined' && window.WebSocket) {
    return new window.WebSocket(url, protocols);
  }
  // Fallback for other environments
  return new WebSocket(url, protocols);
};

// Copy properties from native WebSocket
if (typeof WebSocket !== 'undefined') {
  WebSocketShim.prototype = WebSocket.prototype;
  WebSocketShim.CONNECTING = WebSocket.CONNECTING;
  WebSocketShim.OPEN = WebSocket.OPEN;
  WebSocketShim.CLOSING = WebSocket.CLOSING;
  WebSocketShim.CLOSED = WebSocket.CLOSED;
}

// Export as both default and named export
module.exports = WebSocketShim;
module.exports.default = WebSocketShim;
module.exports.WebSocket = WebSocketShim;

// ES6 exports for compatibility
if (typeof exports === 'undefined') {
  window.exports = {};
}
exports.default = WebSocketShim;
exports.WebSocket = WebSocketShim;