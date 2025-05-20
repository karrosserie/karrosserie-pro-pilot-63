
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Clients from "./pages/Clients";
import Vehicles from "./pages/Vehicles";
import Documents from "./pages/Documents";
import Fleet from "./pages/Fleet";
import Settings from "./pages/Settings";
import Accounting from "./pages/Accounting";
import Cessions from "./pages/Cessions";
import Auth from "./pages/Auth";

// Document pages
import ExpertiseReports from "./pages/documents/expertise/ExpertiseReports";
import Quotes from "./pages/documents/devis/Quotes";
import RepairOrders from "./pages/documents/ordres/RepairOrders";
import Invoices from "./pages/documents/factures/Invoices";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

const queryClient = new QueryClient();

// Composant pour protéger les routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // Afficher un écran de chargement pendant la vérification de l'authentification
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }
  
  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isMobile={!!isMobile} isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Wrapper pour ajouter l'AuthProvider autour des routes
const AppWithAuth = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Index />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/clients" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Clients />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vehicles" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Vehicles />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/documents" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Documents />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/documents/expertise" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <ExpertiseReports />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/documents/devis" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Quotes />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/documents/ordres" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <RepairOrders />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/documents/factures" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Invoices />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/fleet" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Fleet />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/accounting" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Accounting />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cessions" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Cessions />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppWithAuth />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
