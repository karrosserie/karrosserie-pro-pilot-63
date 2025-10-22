
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
import { TourGuide } from "@/components/tour/TourGuide";
import { QuoteConversionWarningDialog } from "@/components/quotes/QuoteConversionWarningDialog";
import { useQuoteConversionWarning } from "@/hooks/use-quote-conversion-warning";

const queryClient = new QueryClient();

const AppContent = () => {
  const { shouldShowWarning, unconvertedQuotes, dismissWarning } = useQuoteConversionWarning();

  return (
    <>
      <Toaster />
      <Sonner />
      <OnboardingAgentMessagePopup />
      <OnboardingWatcher />
      <TourGuide />
      <QuoteConversionWarningDialog
        open={shouldShowWarning}
        onClose={dismissWarning}
        unconvertedQuotes={unconvertedQuotes}
      />
      <AppRouter />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ConfirmationProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </ConfirmationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
