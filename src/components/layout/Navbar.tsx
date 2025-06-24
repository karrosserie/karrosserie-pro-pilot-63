
import React, { useState } from 'react';
import { Bell, Search, Menu, User, LogOut, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BrandLogo from './navbar/BrandLogo';
import SearchBar from './navbar/SearchBar';
import NotificationsPanel from './navbar/NotificationsPanel';
import ImportDialog from './navbar/ImportDialog';
import FAQButton from './navbar/FAQButton';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleImportClick = () => {
    setImportDialogOpen(true);
  };

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "Nouveau devis accepté",
      description: "Le devis #2024-001 a été accepté par le client",
      time: "Il y a 2h",
      read: false
    },
    {
      id: 2,
      title: "Rappel paiement",
      description: "Facture #2024-015 en attente de paiement",
      time: "Il y a 1j",
      read: false
    },
    {
      id: 3,
      title: "Véhicule prêt",
      description: "La réparation du véhicule est terminée",
      time: "Il y a 2j",
      read: true
    }
  ];

  return (
    <>
      <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={onMenuClick}
                className="md:hidden mr-2"
              >
                <Menu className="h-6 w-6" />
              </Button>
              
              <BrandLogo />
              
              <div className="hidden md:block ml-8 flex-1 max-w-md">
                <SearchBar onImportClick={handleImportClick} />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FAQButton />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/faq')}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Centre d'aide</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="md:hidden px-4 pb-3">
          <SearchBar onImportClick={handleImportClick} />
        </div>
      </nav>

      <NotificationsPanel 
        showNotifications={showNotifications} 
        setShowNotifications={setShowNotifications}
        notifications={notifications}
      />

      <ImportDialog 
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />
    </>
  );
};

export default Navbar;
