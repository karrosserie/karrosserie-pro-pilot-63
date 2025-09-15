
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Car, Users, FileText, ArrowRight, Zap, Camera, Receipt, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { useVehicles } from '@/hooks/use-vehicles';
import { useUserRole } from '@/hooks/use-user-role';
import ImportDialog from '@/components/layout/navbar/ImportDialog';
import VehiclePhotoDialog from './VehiclePhotoDialog';
import ExpenseDialog from '@/components/expenses/ExpenseDialog';

const MobileHomePage = () => {
  console.log('MobileHomePage: Component rendering');
  
  const { dashboardStats } = useDashboardData();
  const { vehicles } = useVehicles();
  const { userRole, isOwner } = useUserRole();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [showVehiclePhotoDialog, setShowVehiclePhotoDialog] = useState(false);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);

  const quickActions = [
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Prendre une photo",
      color: "bg-blue-500",
      path: "/camera"
    },
    // {
    //   icon: <Bot className="h-6 w-6" />,
    //   title: "Assistant IA",
    //   description: "Gestion automatique",
    //   color: "bg-gradient-to-br from-blue-500 to-purple-600",
    //   path: "/ai-assistant"
    // },
    {
      icon: <Car className="h-8 w-8" />,
      title: "Véhicules",
      color: "bg-karrosserie-orange",
      path: "/vehicles"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Clients",
      color: "bg-green-600",
      path: "/clients"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Documents",
      color: "bg-purple-600",
      path: "/documents"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-8 px-6">
        <div className="text-center">
          <div className="mb-4">
            <span className="text-3xl font-bold text-karrosserie-orange">
              Karrosserie
            </span>
            <span className="text-3xl font-bold text-foreground ml-2">
              Pro
            </span>
          </div>
          <p className="text-lg text-muted-foreground mb-2">
            Votre atelier, digitalisé
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-karrosserie-orange" />
            <span>Rapide • Simple • Efficace</span>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-3 gap-4">
          <Card className="border shadow-sm bg-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-karrosserie-orange mb-1">
                {vehicles?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Véhicules</div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm bg-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {vehicles?.filter(v => v.status === 'En cours').length || 0}
              </div>
              <div className="text-xs text-muted-foreground">En cours</div>
            </CardContent>
          </Card>
          <Card className="border shadow-sm bg-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {vehicles?.filter(v => v.status === 'Terminé').length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Terminés</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="flex-1 px-6">
        <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
          Accès rapide
        </h2>
        
        {/* Bouton principal remonté */}
        <div className="mb-8">
          <Button 
            onClick={() => setShowImportDialog(true)}
            className="w-full h-12 bg-karrosserie-orange text-white hover:bg-karrosserie-orange/90 font-medium transition-all duration-300"
          >
            <FileText className="h-4 w-4 mr-2" />
            Importer un rapport d&apos;expertise
          </Button>
        </div>
        
        {/* Bouton Tour de contrôle - uniquement pour les propriétaires */}
        {isOwner && (
          <div className="mb-8">
            <Link to="/tour-de-controle">
              <Button 
                className="w-full h-12 bg-red-600 text-white hover:bg-red-700 font-medium transition-all duration-300"
              >
                <Shield className="h-4 w-4 mr-2" />
                Tour de contrôle
              </Button>
            </Link>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {quickActions.map((action, index) => {
            const isPhotoAction = action.title === "Prendre une photo";
            
            if (isPhotoAction) {
              return (
                <div 
                  key={index}
                  className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer h-28 flex flex-col justify-center"
                  onClick={() => setShowPhotoDialog(true)}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Camera className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-foreground text-xs whitespace-nowrap overflow-hidden text-ellipsis">{action.title}</div>
                    </div>
                  </div>
                </div>
              );
            }
            
            return (
              <Link key={index} to={action.path}>
                <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow h-28 flex flex-col justify-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      action.title === "Véhicules" ? "bg-orange-100" :
                      action.title === "Clients" ? "bg-green-100" :
                      action.title === "Documents" ? "bg-purple-100" : "bg-gray-100"
                    }`}>
                      {React.cloneElement(action.icon, { 
                        className: `h-6 w-6 ${
                          action.title === "Véhicules" ? "text-karrosserie-orange" :
                          action.title === "Clients" ? "text-green-600" :
                          action.title === "Documents" ? "text-purple-600" : "text-gray-600"
                        }`
                      })}
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-foreground text-xs whitespace-nowrap overflow-hidden text-ellipsis">{action.title}</div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bouton accès complet */}
        <div className="space-y-4">
          <Link to="/vehicles">
            <Button variant="outline" className="w-full h-12 border-2 border-border hover:border-karrosserie-orange hover:bg-orange-50 font-medium text-muted-foreground hover:text-karrosserie-orange transition-all duration-300">
              Accéder à l&apos;application complète
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Dialog d'import de rapport d'expertise */}
      <ImportDialog 
        open={showImportDialog} 
        onOpenChange={setShowImportDialog} 
      />

      {/* Dialog pour les options de photo */}
      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Choisir une action</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <Button
              variant="outline"
              className="w-full h-16 flex items-center justify-center space-x-3"
              onClick={() => {
                setShowPhotoDialog(false);
                setShowVehiclePhotoDialog(true);
              }}
            >
              <Car className="h-6 w-6" />
              <span>Véhicule</span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-16 flex items-center justify-center space-x-3"
              onClick={() => {
                setShowPhotoDialog(false);
                setShowExpenseDialog(true);
              }}
            >
              <Receipt className="h-6 w-6" />
              <span>Dépense</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour les photos de véhicule */}
      <VehiclePhotoDialog 
        open={showVehiclePhotoDialog} 
        onOpenChange={setShowVehiclePhotoDialog} 
      />

      {/* Dialog pour ajouter une dépense */}
      <ExpenseDialog
        open={showExpenseDialog}
        onOpenChange={setShowExpenseDialog}
      />
    </div>
  );
};

export default MobileHomePage;
