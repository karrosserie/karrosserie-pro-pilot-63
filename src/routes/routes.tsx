
import { coreRoutes } from './coreRoutes';
import { documentRoutes } from './documentRoutes';
import { paymentRoutes } from './paymentRoutes';
import { authRoutes } from './authRoutes';
import { adminRoutes } from './adminRoutes';

// Export ProtectedRoute for backward compatibility
export { ProtectedRoute } from '@/components/router/ProtectedRoute';

// Combine all routes - authRoutes must be last because it contains the catch-all route
export const routes = [
  ...coreRoutes,
  ...documentRoutes,
  ...paymentRoutes,
  ...adminRoutes,
  ...authRoutes
];
