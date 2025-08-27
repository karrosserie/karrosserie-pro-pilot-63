
import { coreRoutes } from './coreRoutes';
import { documentRoutes } from './documentRoutes';
import { paymentRoutes } from './paymentRoutes';
import { authRoutes } from './authRoutes';
import { adminRoutes } from './adminRoutes';

// Export ProtectedRoute for backward compatibility
export { ProtectedRoute } from '@/components/router/ProtectedRoute';

// Combine all routes
export const routes = [
  ...authRoutes,
  ...coreRoutes,
  ...documentRoutes,
  ...paymentRoutes,
  ...adminRoutes
];
