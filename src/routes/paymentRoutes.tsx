
import { ProtectedRoute } from "@/components/router/ProtectedRoute";
import { RoleProtectedRoute } from "@/components/router/RoleProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Receipts from "@/pages/payments/receipts/Receipts";
import Expenses from "@/pages/payments/expenses/Expenses";
import Accounts from "@/pages/payments/accounts/Accounts";

export const paymentRoutes = [
  {
    path: "/payments/receipts",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Receipts />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/payments/expenses",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Expenses />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/payments/accounts",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Accounts />
        </AppLayout>
      </RoleProtectedRoute>
    )
  }
];
