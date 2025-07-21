
import { ProtectedRoute } from "@/components/router/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Receipts from "@/pages/payments/receipts/Receipts";
import Expenses from "@/pages/payments/expenses/Expenses";
import Accounts from "@/pages/payments/accounts/Accounts";

export const paymentRoutes = [
  {
    path: "/payments/receipts",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Receipts />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/payments/expenses",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Expenses />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/payments/accounts",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Accounts />
        </AppLayout>
      </ProtectedRoute>
    )
  }
];
