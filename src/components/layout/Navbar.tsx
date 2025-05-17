
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, Search, User, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen?: boolean;
}

const Navbar = ({ onToggleSidebar, isSidebarOpen = false }: NavbarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

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
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleSidebar}
            className="lg:hidden mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Only show logo in navbar when sidebar is collapsed */}
          {!isSidebarOpen && (
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-karrosserie-orange">
                Karrosserie<span className="text-karrosserie-gray ml-1">Pro</span>
              </span>
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-karrosserie-orange"
          />
          <Button 
            className="absolute right-1 bg-karrosserie-orange text-white hover:bg-karrosserie-orange/90"
            size="sm"
            onClick={() => setImportDialogOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-600 relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Search className="h-5 w-5 md:hidden" />
            <Bell className="h-5 w-5 hidden md:block" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </Button>
          
          {showNotifications && (
            <div className="absolute top-16 right-16 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="flex justify-between items-center p-3 border-b">
                <h3 className="font-semibold">Notifications</h3>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowNotifications(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(notification => (
                  <div key={notification.id} className={`p-3 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                    <div className="flex justify-between">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center border-t">
                <Button variant="link" size="sm" className="text-karrosserie-orange">
                  Voir toutes les notifications
                </Button>
              </div>
            </div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-600"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="flex items-center w-full">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importer un document</DialogTitle>
            <DialogDescription>
              Importez un procès verbal d'expertise au format PDF.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="file-upload" className="text-sm font-medium">
                Fichier PDF
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-karrosserie-orange hover:text-karrosserie-orange/80"
                    >
                      <span>Télécharger un fichier</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" />
                    </label>
                    <p className="pl-1">ou glisser-déposer</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF jusqu'à 10MB
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                Annuler
              </Button>
              <Button>Importer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Navbar;
