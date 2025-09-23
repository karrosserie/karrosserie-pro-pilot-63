// WebSocket shim for browser compatibility with Supabase Realtime
// This replaces the Node.js 'ws' package with native browser WebSocket

class WebSocketShim extends WebSocket {
  constructor(url, protocols) {
    super(url, protocols);
  }
}

// Export for compatibility with 'ws' package expectations
export default WebSocketShim;