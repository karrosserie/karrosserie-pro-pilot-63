import { useState, useEffect, useRef } from 'react';
import { shouldShowPointageModal, hasActiveBreak } from '@/utils/pointageSupabaseUtils';

interface UsePointageStatusProps {
  employeeId: string | null;
  userRole: string | null;
  isEnabled?: boolean;
  // Nouveau flag pour éviter les vérifications lors des actions de tâches
  isTaskAction?: boolean;
}

interface PointageStatus {
  showPointageModal: boolean;
  showRetourPauseModal: boolean;
  isLoading: boolean;
}

/**
 * Hook dédié pour gérer le statut de pointage d'un employé
 * Se déclenche à la connexion ET après un cycle complet, 
 * MAIS PAS lors des actions de tâches
 */
export function usePointageStatus({ employeeId, userRole, isEnabled = true, isTaskAction = false }: UsePointageStatusProps) {
  console.log('🎯🎯🎯 HOOK usePointageStatus appelé avec:', { employeeId, userRole, isEnabled, isTaskAction });
  const [status, setStatus] = useState<PointageStatus>({
    showPointageModal: false,
    showRetourPauseModal: false,
    isLoading: false
  });
  
  // Flag pour éviter les vérifications multiples POUR LE MÊME EMPLOYÉ
  const lastCheckedEmployeeId = useRef<string | null>(null);
  const isCheckingStatus = useRef(false);
  const hasCompletedCheck = useRef(false); // ✅ Flag pour éviter les re-checks

  // Fonction pour vérifier si l'utilisateur est un employé
  const isEmployeeRole = (role: string | null): boolean => {
    if (!role) return false;
    const employeeRoles = ['employe', 'carrossier', 'carrossier-vehicule de courtoisie'];
    return employeeRoles.includes(role);
  };

  const checkPointageStatus = async (currentEmployeeId: string) => {
    if (!currentEmployeeId || !isEmployeeRole(userRole) || !isEnabled || 
        isCheckingStatus.current || isTaskAction) {
      console.log('🚫 Vérification pointage BLOQUÉE:', {
        employeeId: !!currentEmployeeId,
        userRole,
        isEmployeeRole: isEmployeeRole(userRole),
        isEnabled,
        isChecking: isCheckingStatus.current,
        isTaskAction
      });
      return;
    }

    // ✅ CRITIQUE: Si on a déjà vérifié cet employé avec succès, ne pas re-vérifier
    if (lastCheckedEmployeeId.current === currentEmployeeId && hasCompletedCheck.current) {
      console.log('🔄 Employé déjà vérifié avec succès, ignorer pour éviter la boucle');
      return;
    }

    isCheckingStatus.current = true;
    setStatus(prev => ({ ...prev, isLoading: true }));
    
    try {
      console.log('🔍 Vérification statut pointage pour employé:', currentEmployeeId);
      
      // Vérifier si doit montrer le modal : aucun pointage OU cycle complet
      const doitMontrerModal = await shouldShowPointageModal(currentEmployeeId);
      
      if (doitMontrerModal) {
        console.log('📝 Modal pointage requis');
        setStatus({
          showPointageModal: true,
          showRetourPauseModal: false,
          isLoading: false
        });
        
        // ✅ Marquer comme vérifié après avoir montré le modal
        lastCheckedEmployeeId.current = currentEmployeeId;
        hasCompletedCheck.current = true;
      } else {
        // Employé déjà pointé et en cours de travail, vérifier s'il est en pause
        const enPause = await hasActiveBreak(currentEmployeeId);
        console.log('⏸️ Employé en pause:', enPause);
        
        setStatus({
          showPointageModal: false,
          showRetourPauseModal: enPause,
          isLoading: false
        });
        
        // ✅ IMPORTANT: Marquer comme vérifié même si pas de modal pour éviter les re-checks
        lastCheckedEmployeeId.current = currentEmployeeId;
        hasCompletedCheck.current = true;
        console.log('✅ Employé en cours de travail - Arrêt des vérifications automatiques');
      }
    } catch (error) {
      console.error('❌ Erreur vérification statut pointage:', error);
      setStatus({
        showPointageModal: false,
        showRetourPauseModal: false,
        isLoading: false
      });
    } finally {
      isCheckingStatus.current = false;
    }
  };

  // Vérification quand l'employé change OU au montage initial
  useEffect(() => {
    console.log('🚀 Hook usePointageStatus - useEffect déclenché');
    console.log('📋 Paramètres reçus:', {
      employeeId,
      userRole,
      isEnabled,
      isTaskAction
    });
    
    if (employeeId && isEmployeeRole(userRole) && isEnabled && !isTaskAction) {
      console.log('✅ Conditions remplies - Démarrage vérification statut pointage');
      checkPointageStatus(employeeId);
    } else {
      console.log('🚫 Vérification ignorée - Détail des conditions:', {
        hasEmployeeId: !!employeeId,
        isEmployeeRole: isEmployeeRole(userRole),
        isEnabled,
        isNotTaskAction: !isTaskAction,
        actualUserRole: userRole
      });
      
      // Reset si pas d'employé ou changement de contexte
      if (!employeeId) {
        console.log('🔄 Reset statut car pas d\'employé');
        setStatus({
          showPointageModal: false,
          showRetourPauseModal: false,
          isLoading: false
        });
        lastCheckedEmployeeId.current = null;
        hasCompletedCheck.current = false; // ✅ Reset le flag aussi
      }
    }
  }, [employeeId, userRole, isEnabled]); // Dépendances NÉCESSAIRES pour la connexion

  // Fonctions pour contrôler manuellement les modals
  const closePointageModal = () => {
    console.log('🔐 Fermeture modal pointage');
    setStatus(prev => ({ ...prev, showPointageModal: false }));
  };

  const closeRetourPauseModal = () => {
    console.log('🔐 Fermeture modal retour pause');
    setStatus(prev => ({ ...prev, showRetourPauseModal: false }));
  };

  // Fonction pour forcer une re-vérification après pointage/dépointage
  const refreshStatus = () => {
    console.log('🔄 Force refresh status après action de pointage');
    if (employeeId) {
      lastCheckedEmployeeId.current = null; // Reset pour forcer la vérification
      hasCompletedCheck.current = false; // ✅ Reset le flag aussi
      checkPointageStatus(employeeId);
    }
  };

  return {
    ...status,
    closePointageModal,
    closeRetourPauseModal,
    refreshStatus
  };
}