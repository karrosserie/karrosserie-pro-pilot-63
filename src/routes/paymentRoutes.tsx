
import { ProtectedRoute } from "@/components/router/ProtectedRoute";
import { Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import PaymentManagement from "@/pages/payments/gestion/PaymentManagement";
import Receipts from "@/pages/payments/receipts/Receipts";
import Expenses from "@/pages/payments/expenses/Expenses";
import Accounts from "@/pages/payments/accounts/Accounts";
import PaymentRelances from "@/pages/payments/relances/PaymentRelances";
import Accounting from "@/pages/Accounting";

export const paymentRoutes = [
  {
    path: "/payments/gestion",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <PaymentManagement />
        </AppLayout>
      </ProtectedRoute>
    )
  },
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
  },
  {
    path: "/payments/relances",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <PaymentRelances />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/payments/accounting",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Accounting />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  // Redirection pour maintenir la compatibilité avec l'ancienne URL
  {
    path: "/accounting",
    element: <Navigate to="/payments/accounting" replace />
  }
];
