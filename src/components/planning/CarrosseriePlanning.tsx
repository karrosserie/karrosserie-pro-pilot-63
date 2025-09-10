import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Data hooks
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useVehicleData } from '@/hooks/useVehicleData';
import { usePlanningTasks } from '@/hooks/usePlanningTasks';
import { usePlanningManager } from '@/hooks/usePlanningManager';

// UI Components
import { useToast } from '@/hooks/use-toast';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { StatusBadge } from '@/components/ui/status-badge';
import { QuickActions, type QuickAction } from '@/components/ui/quick-actions';
import { FloatingNotifications, type FloatingNotification } from '@/components/ui/floating-notifications';

// Modals
import { VehiculeUrgenceModal } from '@/components/VehiculeUrgenceModal';
import { PointageModal } from '@/components/PointageModal';
import { DeplacerTacheModal } from '@/components/planning/DeplacerTacheModal';
import { VehiculeModal } from '@/components/VehiculeModal';

// Utilities
import { aPointe as aPointeUtil, enregistrerArrivee, aPauseEnCours, enregistrerDepart, terminerPause } from '@/utils/pointageUtils';
import { getCurrentCompanyId } from '@/utils/pointageSupabaseUtils';

// Auth and role management
import { useAuth } from '@/contexts/AuthContext';
import { useCompanyId } from '@/hooks/use-company-id';
import { useUserRole } from '@/hooks/use-user-role';
import { useViewManagement } from '@/hooks/use-view-management';

const CarrosseriePlanning = () => {
  console.log('🚀 COMPOSANT CARROSSERIE PLANNING CHARGÉ - DEBUT');
  
  // Enhanced state variables for all modals and actions
  const [showEmployeModal, setShowEmployeModal] = useState(false);
  const [editingEmploye, setEditingEmploye] = useState(null);
  const [showAttenteModal, setShowAttenteModal] = useState(false);
  const [selectedVehicule, setSelectedVehicule] = useState<any>(null);
  const [showVehiculeModal, setShowVehiculeModal] = useState(false);
  const [selectedPlanningTache, setSelectedPlanningTache] = useState<any>(null);
  const [showPlanningModal, setShowPlanningModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('etapes-atelier');
  const [searchFilter, setSearchFilter] = useState('');
  const [floatingNotifications, setFloatingNotifications] = useState<FloatingNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // New modal states for advanced features
  const [showVehiculeUrgenceModal, setShowVehiculeUrgenceModal] = useState(false);
  const [showPointageModal, setShowPointageModal] = useState(false);
  const [showDeplacerModal, setShowDeplacerModal] = useState(false);
  const [selectedTacheForDeplacement, setSelectedTacheForDeplacement] = useState<any>(null);
  const [employePointageInfo, setEmployePointageInfo] = useState<{[key: string]: {aPointe: boolean, enPause: boolean}}>({});
  
  // Supabase authentication and role management
  const { user } = useAuth();
  const { companyId } = useCompanyId();
  const { userRole, isOwner, isResponsable, isCarrossier, isCarrossierCourtesy, canManage, isEmployee } = useUserRole();
  const { 
    currentView, 
    selectedEmployeView, 
    setCurrentView, 
    setSelectedEmployeView,
    canSwitchViews,
    isEmployeeRole,
    canManageUsers
  } = useViewManagement();
  
  const { toast } = useToast();

  // Enhanced floating notifications handler
  const dismissFloatingNotification = (id: string) => {
    setFloatingNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Debug logging
  console.log('🔍 CarrosseriePlanning: Authentication and Role Info:', {
    companyId,
    userId: user?.id,
    userRole,
    isOwner,
    canManage,
    currentView,
    canSwitchViews
  });

  // Data hooks - only load if we have a company ID
  const { employees: employesFromData, loading: employesLoading, createEmployee, refetch: refetchEmployees } = useEmployeeData(companyId);
  const { vehicles, loading: vehiclesLoading, refetch: refetchVehicles } = useVehicleData(companyId);
  const { planningTaches, getTasksForEmployee, getTasksForEmployeeById, getTodayTasks, loading: planningLoading, refetch: refetchPlanning } = usePlanningTasks(companyId);

  console.log('🚀 COMPOSANT CARROSSERIE PLANNING - HOOKS APPELÉS:', {
    employesFromDataLength: employesFromData.length,
    planningTachesLength: planningTaches.length,
    getTodayTasksLength: getTodayTasks().length,
    planningLoading,
    companyId
  });

  const {
    setEmployes,
    notifications,
    setNotifications,
    userRole: localUserRole,
    setUserRole,
    currentEmployeId,
    setCurrentEmployeId,
    calculerPlanningAutomatique,
    assignerTacheAutomatique,
    terminerTache,
    marquerNotificationLue,
    getNotificationsNonLues,
    getPlanningEmploye,
    ajouterVehiculeUrgence,
    deplacerTache
  } = usePlanningManager();

  // Use real employees from database
  const employes = employesFromData;
  
  // Final selected employee view based on role
  const finalSelectedEmployeView = currentView === 'employe' ? (selectedEmployeView || user?.id) : selectedEmployeView;

  // Loading state
  if (employesLoading || planningLoading || !companyId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Chargement du planning...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header avec contrôles de vue */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Planning Carrosserie</h1>
          
          {/* Debug info - temporaire */}
          <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
            {userRole} - {currentView} - {isOwner ? 'Propriétaire' : 'Autre'}
          </div>
        </div>

        {/* Contrôles de vue */}
        {canSwitchViews && (
          <div className="flex gap-2">
            <Button
              variant={currentView === 'manager' ? 'default' : 'outline'}
              onClick={() => setCurrentView('manager')}
              className="min-w-32"
            >
              Vue Manager
            </Button>
            <Button
              variant={currentView === 'employe' ? 'default' : 'outline'}
              onClick={() => setCurrentView('employe')}
              className="min-w-32"
            >
              Vue Employé
            </Button>
          </div>
        )}

        {/* Sélection d'employé pour vue employé */}
        {currentView === 'employe' && (
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium">Employé :</span>
            <Select 
              value={selectedEmployeView || ''} 
              onValueChange={setSelectedEmployeView}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                {employes.map(employe => (
                  <SelectItem key={employe.user_id} value={employe.user_id}>
                    {employe.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <Tabs defaultValue="planning" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="employes">Employés</TabsTrigger>
          <TabsTrigger value="vehicules">Véhicules</TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Planning des tâches</CardTitle>
            </CardHeader>
            <CardContent>
              {currentView === 'manager' ? (
                <div className="space-y-4">
                  <p className="text-green-600 font-medium">🎯 Vue Manager - Accès complet au planning</p>
                  <div className="grid gap-4">
                    {planningTaches.map((tache, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{tache.vehicule}</h4>
                            <p className="text-sm text-muted-foreground">{tache.etape}</p>
                            <p className="text-sm">{tache.client}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{tache.technicien}</p>
                            <p className="text-sm text-muted-foreground">{tache.heure}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-blue-600 font-medium">👤 Vue Employé - Mes tâches</p>
                  {finalSelectedEmployeView ? (
                    <div className="space-y-2">
                      <p className="text-sm">Employé sélectionné : {employes.find(e => e.user_id === finalSelectedEmployeView)?.nom}</p>
                      <div className="grid gap-4">
                        {getTodayTasks()
                          .filter(tache => tache.user_id === finalSelectedEmployeView)
                          .map((tache, index) => (
                            <div key={index} className="p-4 border rounded-lg bg-blue-50">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{tache.vehicule}</h4>
                                  <p className="text-sm text-muted-foreground">{tache.etape}</p>
                                  <p className="text-sm">{tache.client}</p>
                                </div>
                                <StatusBadge status={tache.status} />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Veuillez sélectionner un employé</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des employés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {employes.map((employe, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{employe.nom}</h4>
                        <p className="text-sm text-muted-foreground">{employe.email}</p>
                        <Badge variant="outline">{employe.role}</Badge>
                      </div>
                      <div className="flex gap-2">
                        {canManageUsers && (
                          <Button size="sm" variant="outline">Modifier</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Véhicules en cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {vehicles.map((vehicule, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{vehicule.plaque}</h4>
                        <p className="text-sm text-muted-foreground">{vehicule.modele}</p>
                        <p className="text-sm">{vehicule.client}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={vehicule.status} />
                        <p className="text-sm text-muted-foreground mt-1">{vehicule.etape}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <VehiculeUrgenceModal
        isOpen={showVehiculeUrgenceModal}
        onClose={() => setShowVehiculeUrgenceModal(false)}
        vehicule={selectedVehicule}
        onConfirm={(reason) => {
          console.log('Véhicule marqué urgent:', reason);
          setFloatingNotifications(prev => [...prev, {
            id: Date.now().toString(),
            type: 'success' as const,
            title: 'Véhicule urgent',
            message: `Véhicule ${selectedVehicule?.vehicule} marqué comme urgent`,
            duration: 3000
          }]);
        }}
      />

      <PointageModal
        isOpen={showPointageModal}
        onClose={() => setShowPointageModal(false)}
        employeeName={employes.find(e => e.user_id === selectedEmployeView)?.nom}
        onConfirm={async () => {
          if (selectedEmployeView) {
            const success = await enregistrerArrivee(selectedEmployeView);
            if (success) {
              setFloatingNotifications(prev => [...prev, {
                id: Date.now().toString(),
                type: 'success' as const,
                title: 'Pointage',
                message: 'Pointage enregistré avec succès',
                duration: 3000
              }]);
            }
          }
        }}
      />

      <DeplacerTacheModal
        isOpen={showDeplacerModal}
        onClose={() => {
          setShowDeplacerModal(false);
          setSelectedTacheForDeplacement(null);
        }}
        tache={selectedTacheForDeplacement}
        employes={employes}
        onConfirm={(nouvelEmployeId, nouvelleDate) => {
          console.log('Tâche déplacée:', { nouvelEmployeId, nouvelleDate });
          setFloatingNotifications(prev => [...prev, {
            id: Date.now().toString(),
            type: 'success' as const,
            title: 'Tâche déplacée',
            message: 'Tâche déplacée avec succès',
            duration: 3000
          }]);
        }}
      />

      {/* Floating Notifications */}
      <FloatingNotifications
        notifications={floatingNotifications}
        onDismiss={dismissFloatingNotification}
      />
    </div>
  );
};

export default CarrosseriePlanning;