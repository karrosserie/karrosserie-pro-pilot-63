
import { ProtectedRoute } from "@/components/router/ProtectedRoute";
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
      <ProtectedRoute>
        <Documents />
      </ProtectedRoute>
    )
  },
  {
    path: "/documents/expertise",
    element: (
      <ProtectedRoute>
        <ExpertiseReports />
      </ProtectedRoute>
    )
  },
  {
    path: "/documents/devis",
    element: (
      <ProtectedRoute>
        <Quotes />
      </ProtectedRoute>
    )
  },
  {
    path: "/documents/ordres",
    element: (
      <ProtectedRoute>
        <RepairOrders />
      </ProtectedRoute>
    )
  },
  {
    path: "/documents/factures",
    element: (
      <ProtectedRoute>
        <Invoices />
      </ProtectedRoute>
    )
  },
  {
    path: "/documents/avoirs",
    element: (
      <ProtectedRoute>
        <Credits />
      </ProtectedRoute>
    )
  },
  {
    path: "/documents/upload/:token",
    element: <DocumentUploadFlow />
  }
];
