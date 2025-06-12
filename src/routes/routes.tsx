import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Pages
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Clients from "@/pages/Clients";
import Vehicles from "@/pages/Vehicles";
import Documents from "@/pages/Documents";
import Fleet from "@/pages/Fleet";
import Settings from "@/pages/Settings";
import Accounting from "@/pages/Accounting";
import Cessions from "@/pages/Cessions";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Activity from "@/pages/Activity";

// Document pages
import ExpertiseReports from "@/pages/documents/expertise/ExpertiseReports";
import Quotes from "@/pages/documents/devis/Quotes";
import RepairOrders from "@/pages/documents/ordres/RepairOrders";
import Invoices from "@/pages/documents/factures/Invoices";
import Credits from "@/pages/documents/avoirs/Credits";

// Payment pages
import Receipts from "@/pages/payments/receipts/Receipts";
import Expenses from "@/pages/payments/expenses/Expenses";
import Accounts from "@/pages/payments/accounts/Accounts";

// Wrapper component for protected routes
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // Display a loading screen while checking authentication
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }
  
  // Redirect to login page if user is not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Route definitions
export const routes = [
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "/auth/reset-password",
    element: <Auth />
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    )
  },
  {
    path: "/activity",
    element: (
      <ProtectedRoute>
        <Activity />
      </ProtectedRoute>
    )
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: "/clients",
    element: (
      <ProtectedRoute>
        <Clients />
      </ProtectedRoute>
    )
  },
  {
    path: "/vehicles",
    element: (
      <ProtectedRoute>
        <Vehicles />
      </ProtectedRoute>
    )
  },
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
  },
  {
    path: "/fleet",
    element: (
      <ProtectedRoute>
        <Fleet />
      </ProtectedRoute>
    )
  },
  {
    path: "/accounting",
    element: (
      <ProtectedRoute>
        <Accounting />
      </ProtectedRoute>
    )
  },
  {
    path: "/cessions",
    element: (
      <ProtectedRoute>
        <Cessions />
      </ProtectedRoute>
    )
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    )
  },
  {
    path: "*",
    element: <NotFound />
  }
];
