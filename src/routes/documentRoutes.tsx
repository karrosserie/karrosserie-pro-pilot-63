
import { ProtectedRoute } from "@/components/router/ProtectedRoute";
import { RoleProtectedRoute } from "@/components/router/RoleProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Documents from "@/pages/Documents";
import ExpertiseReports from "@/pages/documents/expertise/ExpertiseReports";
import Quotes from "@/pages/documents/devis/Quotes";
import RepairOrders from "@/pages/documents/ordres/RepairOrders";
import Invoices from "@/pages/documents/factures/Invoices";
import Credits from "@/pages/documents/avoirs/Credits";
import DocumentUploadFlow from "@/pages/documents/upload/DocumentUploadFlow";

export const documentRoutes = [
  {
    path: "/documents",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Documents />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/documents/expertise",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <ExpertiseReports />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/documents/devis",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Quotes />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/documents/ordres",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <RepairOrders />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/documents/factures",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Invoices />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/documents/avoirs",
    element: (
      <RoleProtectedRoute>
        <AppLayout>
          <Credits />
        </AppLayout>
      </RoleProtectedRoute>
    )
  },
  {
    path: "/documents/upload/:token",
    element: <DocumentUploadFlow />
  }
];
