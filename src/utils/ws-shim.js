// WebSocket shim for browser compatibility with Supabase Realtime
// This replaces the Node.js 'ws' package with native WebSocket

// Use native WebSocket in browser environment
const WebSocketImpl = typeof window !== 'undefined' ? window.WebSocket : null;

export default WebSocketImpl;
export { WebSocketImpl as WebSocket };