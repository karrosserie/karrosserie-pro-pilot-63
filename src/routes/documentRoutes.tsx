
import { ProtectedRoute } from "@/components/router/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Documents from "@/pages/Documents";
import ExpertiseReports from "@/pages/documents/expertise/ExpertiseReports";
import Quotes from "@/pages/documents/devis/Quotes";
import RepairOrders from "@/pages/documents/ordres/RepairOrders";
import Invoices from "@/pages/documents/factures/Invoices";
import Credits from "@/pages/documents/avoirs/Credits";
import BonCommande from "@/pages/documents/bon-commande/BonCommande";
import DocumentUploadFlow from "@/pages/documents/upload/DocumentUploadFlow";

export const documentRoutes = [
  {
    path: "/documents",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Documents />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/documents/expertise",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <ExpertiseReports />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/documents/devis",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Quotes />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/documents/ordres",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <RepairOrders />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/documents/factures",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Invoices />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/documents/avoirs",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Credits />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/documents/bon-commande",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <BonCommande />
        </AppLayout>
      </ProtectedRoute>
    )
  },
  {
    path: "/documents/upload/:token",
    element: <DocumentUploadFlow />
  }
];
