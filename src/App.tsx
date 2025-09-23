
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfirmationProvider } from "@/hooks/use-confirmation";
import { AuthProvider } from "@/contexts/AuthContext";
import AppRouter from "@/components/router/AppRouter";
// import { TrackingProvider } from "@/components/tracking/TrackingProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <ConfirmationProvider>
          <Toaster />
          <Sonner />
          <AppRouter />
        </ConfirmationProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
