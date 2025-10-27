
import React, { useState } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import QuickActions from "@/components/shared/QuickActions";
import AccessRestriction from "./AccessRestriction";
import SubscriptionExpiryAlert from "@/components/subscription/SubscriptionExpiryAlert";
import TokenLowAlert from "@/components/subscription/TokenLowAlert";
import { useSubscription } from '@/hooks/use-subscription';
import { useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { hasFullAccess, tokensRemaining, companySubscription } = useSubscription();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Pages qui ne nécessitent pas d'accès complet (toujours accessibles)
  const publicPages = ['/settings'];
  const isPublicPage = publicPages.some(page => location.pathname.startsWith(page));
  
  // Pages qui nécessitent un accès complet
  const requiresFullAccess = !isPublicPage;

  return (
    <div className="flex h-screen bg-gray-50 w-full">
      <Sidebar isMobile={!!isMobile} isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col">
            <div className="flex-1">
              <AccessRestriction requiresFullAccess={requiresFullAccess}>
                {children}
              </AccessRestriction>
            </div>
            <Footer />
          </div>
        </main>
      </div>

      {/* Quick Actions présentes sur toutes les pages */}
      <QuickActions />
      
      {/* Alertes d'expiration d'abonnement */}
      <SubscriptionExpiryAlert />
      
      {/* Alertes de jetons faibles */}
      {companySubscription?.company_id && (
        <TokenLowAlert 
          tokensRemaining={tokensRemaining} 
          companyId={companySubscription.company_id} 
        />
      )}
    </div>
  );
};

export default AppLayout;
