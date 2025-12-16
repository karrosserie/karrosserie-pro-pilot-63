
import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useImpersonation } from '@/hooks/use-impersonation';
import MobileMenuButton from './navbar/MobileMenuButton';
import SearchBar from './navbar/SearchBar';
import NotificationsPanel from './navbar/NotificationsPanel';
import UserProfileMenu from './navbar/UserProfileMenu';
import ImportDialog from './navbar/ImportDialog';
import { NewDossierModal } from '@/components/atelier/modals/NewDossierModal';

interface CapturedPhoto {
  blob: Blob;
  preview: string;
}

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen?: boolean;
}

const Navbar = ({ onToggleSidebar, isSidebarOpen = false }: NavbarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [atelierModalOpen, setAtelierModalOpen] = useState(false);
  const { user } = useAuth();
  const { isImpersonating, impersonationData, exitImpersonation } = useImpersonation();
  const navigate = useNavigate();

  // Données mockées pour les alertes
  const notifications = [
    { id: 1, title: 'Nouveau message', description: 'Jean Dupont a commenté votre devis', time: 'Il y a 5 min', read: false },
    { id: 2, title: 'Rappel', description: 'Véhicule à livrer aujourd\'hui', time: 'Il y a 1 heure', read: false },
    { id: 3, title: 'Document signé', description: 'Marie Martin a signé l\'ordre de réparation', time: 'Il y a 3 heures', read: true },
  ];

  const handleAtelierSubmit = (data: any, entryPhotos: CapturedPhoto[]) => {
    setAtelierModalOpen(false);
    navigate('/gestion-atelier', { 
      state: { newDossier: data, entryPhotos } 
    });
  };

  return (
    <div className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 h-16 sm:h-16 flex items-center justify-between gap-3">
        <div className="flex items-center min-w-0">
          <MobileMenuButton onClick={onToggleSidebar} />
        </div>

        <div className="hidden sm:block flex-1 max-w-md mx-6">
          <SearchBar 
            onImportClick={() => setImportDialogOpen(true)} 
            onAtelierClick={() => setAtelierModalOpen(true)}
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {isImpersonating && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={exitImpersonation}
              className="hidden sm:flex items-center gap-2 bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Retour Admin</span>
              <span className="md:hidden">Admin</span>
            </Button>
          )}
          
          <div className="hidden">
            <NotificationsPanel 
              showNotifications={showNotifications} 
              setShowNotifications={setShowNotifications}
              notifications={notifications}
            />
          </div>
          
          <UserProfileMenu />
        </div>
      </div>

      <ImportDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} />
      
      <NewDossierModal
        open={atelierModalOpen}
        onOpenChange={setAtelierModalOpen}
        onSubmit={handleAtelierSubmit}
      />
    </div>
  );
};

export default Navbar;
