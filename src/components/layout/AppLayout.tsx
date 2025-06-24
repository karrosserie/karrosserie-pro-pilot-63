
import React, { useState } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import QuickActions from "@/components/shared/QuickActions";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 w-full">
      <Sidebar isMobile={!!isMobile} isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Quick Actions présentes sur toutes les pages */}
      <QuickActions />
    </div>
  );
};

export default AppLayout;
