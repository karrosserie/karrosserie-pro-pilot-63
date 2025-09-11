import React, { useState, useEffect } from 'react';

// Planning Interface Component
import { WorkshopPlanningInterface } from '@/components/planning/WorkshopPlanningInterface';

// Data hooks
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useVehicleData } from '@/hooks/useVehicleData';
import { useWaitingVehicles } from '@/hooks/useWaitingVehicles';
import { usePlanningTasks } from '@/hooks/usePlanningTasks';
import { usePlanningManager } from '@/hooks/usePlanningManager';

// UI Components
import { useToast } from '@/hooks/use-toast';
import { FloatingNotifications, type FloatingNotification } from '@/components/ui/floating-notifications';

// Modals
import { VehiculeUrgenceModal } from '@/components/planning/VehiculeUrgenceModal';
import { PointageModal } from '@/components/PointageModal';
import { DeplacerTacheModal } from '@/components/planning/DeplacerTacheModal';
import { VehicleDetailsModal } from '@/components/planning/VehicleDetailsModal';

// Utilities
import { aPointe as aPointeUtil, enregistrerArrivee, aPauseEnCours, enregistrerDepart, terminerPause } from '@/utils/pointageUtils';

// Auth and role management
import { useAuth } from '@/contexts/AuthContext';
import { useCompanyId } from '@/hooks/use-company-id';
import { useUserRole } from '@/hooks/use-user-role';
import { useViewManagement } from '@/hooks/use-view-management';

const CarrosseriePlanning = () => {
  console.log('🚀 COMPOSANT CARROSSERIE PLANNING CHARGÉ - DEBUT');
  
  // Enhanced state variables for modals and actions
  const [selectedVehicule, setSelectedVehicule] = useState<any>(null);
  const [floatingNotifications, setFloatingNotifications] = useState<FloatingNotification[]>([]);
  
  // Modal states for advanced features
  const [showVehiculeUrgenceModal, setShowVehiculeUrgenceModal] = useState(false);
  const [showPointageModal, setShowPointageModal] = useState(false);
  const [showDeplacerModal, setShowDeplacerModal] = useState(false);
  const [showVehicleDetailsModal, setShowVehicleDetailsModal] = useState(false);
  const [selectedTacheForDeplacement, setSelectedTacheForDeplacement] = useState<any>(null);
  
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
  const { waitingVehicles, loading: waitingVehiclesLoading, refetch: refetchWaitingVehicles } = useWaitingVehicles(companyId);
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

  // Enhanced schedule update handler for WorkshopPlanningInterface
  const handleScheduleUpdate = async (data: any) => {
    console.log('Schedule update:', data);
    
    try {
      // Rafraîchir les données après création d'une tâche
      if (data.action === 'plan' && data.taskId) {
        await refetchPlanning();
        await refetchWaitingVehicles();
        
        // Add notification for user feedback
        setFloatingNotifications(prev => [...prev, {
          id: Date.now().toString(),
          type: 'success' as const,
          title: 'Véhicule planifié',
          message: data.message || 'Le véhicule a été ajouté au planning avec succès',
          duration: 4000
        }]);
      } else {
        // Add notification for user feedback
        setFloatingNotifications(prev => [...prev, {
          id: Date.now().toString(),
          type: 'success' as const,
          title: 'Planning mis à jour',
          message: 'Les modifications ont été enregistrées',
          duration: 3000
        }]);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
      setFloatingNotifications(prev => [...prev, {
        id: Date.now().toString(),
        type: 'error' as const,
        title: 'Erreur',
        message: 'Impossible de rafraîchir les données',
        duration: 4000
      }]);
    }
  };

  // Vehicle details handler
  const handleVehicleDetails = (vehicle: any) => {
    setSelectedVehicule(vehicle);
    setShowVehicleDetailsModal(true);
  };

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
    <div className="space-y-6">
      {/* Main Planning Interface */}
      <WorkshopPlanningInterface
        employees={employes}
        vehicles={vehicles}
        waitingVehicles={waitingVehicles}
        schedules={getTodayTasks()}
        planningTaches={planningTaches}
        companyId={companyId}
        onScheduleUpdate={handleScheduleUpdate}
        onOpenUrgenceModal={() => setShowVehiculeUrgenceModal(true)}
      />

      {/* Enhanced Modals */}
      <VehiculeUrgenceModal
        isOpen={showVehiculeUrgenceModal}
        onClose={() => setShowVehiculeUrgenceModal(false)}
        employes={employes}
        onAjouterVehicule={async (vehiculeUrgence) => {
          console.log('Véhicule urgence ajouté:', vehiculeUrgence);
          if (companyId) {
            try {
              await ajouterVehiculeUrgence(vehiculeUrgence, companyId, {
                refetchEmployees,
                refetchVehicles,
                refetchPlanning
              });
              
              // Forcer le refetch des données de planning et véhicules en attente
              await refetchPlanning();
              await refetchWaitingVehicles();
              
              setFloatingNotifications(prev => [...prev, {
                id: Date.now().toString(),
                type: 'success' as const,
                title: 'Véhicule urgent ajouté',
                message: `${vehiculeUrgence.plaque} ajouté en urgence au planning`,
                duration: 3000
              }]);
            } catch (error) {
              console.error('Erreur ajout véhicule urgence:', error);
              toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible d'ajouter le véhicule en urgence"
              });
            }
          }
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

      <VehicleDetailsModal
        isOpen={showVehicleDetailsModal}
        onClose={() => {
          setShowVehicleDetailsModal(false);
          setSelectedVehicule(null);
        }}
        vehicle={selectedVehicule}
        onPlan={() => {
          console.log('Planifier véhicule:', selectedVehicule);
          setShowVehicleDetailsModal(false);
        }}
        onUnblock={() => {
          console.log('Débloquer véhicule:', selectedVehicule);
          setShowVehicleDetailsModal(false);
        }}
        onModify={() => {
          console.log('Modifier véhicule:', selectedVehicule);
          setShowVehicleDetailsModal(false);
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