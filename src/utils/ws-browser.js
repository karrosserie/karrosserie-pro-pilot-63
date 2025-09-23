// Browser-compatible WebSocket replacement for 'ws' package
// This completely replaces the Node.js 'ws' package with browser WebSocket

class WebSocketBrowser extends WebSocket {
  constructor(url, protocols, options) {
    // Ignore Node.js specific options and use browser WebSocket
    super(url, protocols);
    
    // Add any Node.js ws compatibility methods/properties if needed
    this.readyState = this.readyState;
    this.CONNECTING = WebSocket.CONNECTING;
    this.OPEN = WebSocket.OPEN;
    this.CLOSING = WebSocket.CLOSING;
    this.CLOSED = WebSocket.CLOSED;
  }
}

// Static constants
WebSocketBrowser.CONNECTING = WebSocket.CONNECTING;
WebSocketBrowser.OPEN = WebSocket.OPEN;
WebSocketBrowser.CLOSING = WebSocket.CLOSING;
WebSocketBrowser.CLOSED = WebSocket.CLOSED;

// Export as ES module default
export default WebSocketBrowser;

// Also export as named export for different import patterns
export { WebSocketBrowser as WebSocket };

// CommonJS compatibility for older bundlers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WebSocketBrowser;
  module.exports.default = WebSocketBrowser;
  module.exports.WebSocket = WebSocketBrowser;
}