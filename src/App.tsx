
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfirmationProvider } from "@/hooks/use-confirmation";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/components/router/AppRouter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <ConfirmationProvider>
            <Toaster />
            <Sonner />
            <AppRouter />
          </ConfirmationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
