
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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

// Document pages
import ExpertiseReports from "./pages/documents/expertise/ExpertiseReports";
import Quotes from "./pages/documents/devis/Quotes";
import RepairOrders from "./pages/documents/ordres/RepairOrders";
import Invoices from "./pages/documents/factures/Invoices";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";

const queryClient = new QueryClient();

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
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <AppLayout>
                <Index />
              </AppLayout>
            } 
          />
          <Route 
            path="/clients" 
            element={
              <AppLayout>
                <Clients />
              </AppLayout>
            } 
          />
          <Route 
            path="/vehicles" 
            element={
              <AppLayout>
                <Vehicles />
              </AppLayout>
            } 
          />
          <Route 
            path="/documents" 
            element={
              <AppLayout>
                <Documents />
              </AppLayout>
            } 
          />
          <Route 
            path="/documents/expertise" 
            element={
              <AppLayout>
                <ExpertiseReports />
              </AppLayout>
            } 
          />
          <Route 
            path="/documents/devis" 
            element={
              <AppLayout>
                <Quotes />
              </AppLayout>
            } 
          />
          <Route 
            path="/documents/ordres" 
            element={
              <AppLayout>
                <RepairOrders />
              </AppLayout>
            } 
          />
          <Route 
            path="/documents/factures" 
            element={
              <AppLayout>
                <Invoices />
              </AppLayout>
            } 
          />
          <Route 
            path="/fleet" 
            element={
              <AppLayout>
                <Fleet />
              </AppLayout>
            } 
          />
          <Route 
            path="/accounting" 
            element={
              <AppLayout>
                <Accounting />
              </AppLayout>
            } 
          />
          <Route 
            path="/cessions" 
            element={
              <AppLayout>
                <Cessions />
              </AppLayout>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <AppLayout>
                <Settings />
              </AppLayout>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
