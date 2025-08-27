import { RoleProtectedRoute } from "@/components/router/RoleProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import AdminAccounts from "@/pages/admin/AdminAccounts";

export const adminRoutes = [
  {
    path: "/admin/accounts",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <AdminAccounts />
        </AppLayout>
      </RoleProtectedRoute>
    )
  }
];