
import { ProtectedRoute } from "@/components/router/ProtectedRoute";
import Receipts from "@/pages/payments/receipts/Receipts";
import Expenses from "@/pages/payments/expenses/Expenses";
import Accounts from "@/pages/payments/accounts/Accounts";

export const paymentRoutes = [
  {
    path: "/payments/receipts",
    element: (
      <ProtectedRoute>
        <Receipts />
      </ProtectedRoute>
    )
  },
  {
    path: "/payments/expenses",
    element: (
      <ProtectedRoute>
        <Expenses />
      </ProtectedRoute>
    )
  },
  {
    path: "/payments/accounts",
    element: (
      <ProtectedRoute>
        <Accounts />
      </ProtectedRoute>
    )
  }
];
