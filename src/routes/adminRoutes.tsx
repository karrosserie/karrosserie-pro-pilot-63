import { ProtectedRoute } from "@/components/router/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import AdminAccounts from "@/pages/admin/AdminAccounts";

export const adminRoutes = [
  {
    path: "/admin/accounts",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <AdminAccounts />
        </AppLayout>
      </ProtectedRoute>
    )
  }
];