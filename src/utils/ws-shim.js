// WebSocket shim for browser compatibility with Supabase Realtime
// This replaces the Node.js 'ws' package with native browser WebSocket

if (typeof window !== 'undefined') {
  // Browser environment - use native WebSocket
  module.exports = WebSocket;
} else {
  // Node.js environment - fallback (shouldn't be reached in browser)
  module.exports = require('ws');
}