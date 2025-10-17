
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfirmationProvider } from "@/hooks/use-confirmation";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/components/router/AppRouter";
import { OnboardingAgentMessagePopup } from "@/components/onboarding/OnboardingAgentMessagePopup";
import { OnboardingWatcher } from "@/components/onboarding/OnboardingWatcher";
import { OnboardingCompletionDialog } from "@/components/onboarding/OnboardingCompletionDialog";
import { TourGuide } from "@/components/tour/TourGuide";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <ConfirmationProvider>
            <Toaster />
            <Sonner />
            <OnboardingAgentMessagePopup />
            <OnboardingWatcher />
            <OnboardingCompletionDialog />
            <TourGuide />
            <AppRouter />
          </ConfirmationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
