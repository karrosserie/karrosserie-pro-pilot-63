
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import MobileMenuButton from './navbar/MobileMenuButton';
import BrandLogo from './navbar/BrandLogo';
import SearchBar from './navbar/SearchBar';
import NotificationsPanel from './navbar/NotificationsPanel';
import UserProfileMenu from './navbar/UserProfileMenu';
import ImportDialog from './navbar/ImportDialog';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen?: boolean;
}

const Navbar = ({ onToggleSidebar, isSidebarOpen = false }: NavbarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { user } = useAuth();

  // Données mockées pour les alertes
  const notifications = [
    { id: 1, title: 'Nouveau message', description: 'Jean Dupont a commenté votre devis', time: 'Il y a 5 min', read: false },
    { id: 2, title: 'Rappel', description: 'Véhicule à livrer aujourd\'hui', time: 'Il y a 1 heure', read: false },
    { id: 3, title: 'Document signé', description: 'Marie Martin a signé l\'ordre de réparation', time: 'Il y a 3 heures', read: true },
  ];

  return (
    <div className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <MobileMenuButton onClick={onToggleSidebar} />
          
          {/* Only show logo in navbar when sidebar is collapsed */}
          <BrandLogo show={!isSidebarOpen} />
        </div>

        <SearchBar onImportClick={() => setImportDialogOpen(true)} />

        <div className="flex items-center space-x-1 md:space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-600 md:hidden"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <NotificationsPanel 
            showNotifications={showNotifications} 
            setShowNotifications={setShowNotifications}
            notifications={notifications}
          />
          
          <UserProfileMenu />
        </div>
      </div>

      <ImportDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} />
    </div>
  );
};

export default Navbar;
