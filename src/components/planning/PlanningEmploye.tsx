import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlanningTache } from '@/hooks/usePlanningManager';
import { EmployeStats } from '@/components/planning/EmployeStats';
import { TachesSection } from '@/components/planning/TachesSection';
import { PointageModal } from './PointageModal';
import { GestionPointageDropdown } from './GestionPointageDropdown';
import { RetourPauseModal } from './RetourPauseModal';
import { clockIn } from '@/utils/pointageSupabaseUtils';
import { usePointageStatus } from '@/hooks/usePointageStatus';

interface PlanningEmployeProps {
  employe: any;
  taches: PlanningTache[];
  onTerminerTache: (tacheId: string) => void;
  onVoirVehicule: (vehiculeId: number) => void;
  userRole: 'manager' | 'employe';
  companyId: string;
}

export const PlanningEmploye: React.FC<PlanningEmployeProps> = ({
  employe,
  taches,
  onTerminerTache,
  onVoirVehicule,
  userRole,
  companyId
}) => {
  const { toast } = useToast();
  
  console.log('🚀🚀🚀 PlanningEmploye rendu avec:', {
    employeId: employe?.id?.toString(),
    employeNom: employe?.nom,
    userRole,
    tachesLength: taches?.length
  });
  console.log('🔍 DÉTAIL EMPLOYE:', employe);

  // Hook de pointage qui se déclenche à la connexion ET après dépointage
  // MAIS PAS lors des actions de tâches grâce au flag isTaskAction
  const employeeId = employe?.id?.toString() || '';
  const {
    showPointageModal,
    showRetourPauseModal,
    isLoading: pointageLoading,
    closePointageModal,
    closeRetourPauseModal,
    refreshStatus
  } = usePointageStatus({
    employeeId: employeeId,
    userRole: userRole || 'employe',
    isEnabled: !!employeeId && !!userRole,
    isTaskAction: false // Important : pas d'action de tâche en cours
  });

  const handlePointer = async () => {
    console.log('DEBUG - handlePointer called');
    if (employe?.id) {
      const result = await clockIn(employe.id.toString());
      if (result.success) {
        toast({
          title: "✅ Pointage réussi",
          description: result.message,
        });
        console.log('🔄 Pointage réussi, fermeture du modal et refresh du statut');
      } else {
        toast({
          title: "❌ Erreur de pointage",
          description: result.message,
          variant: "destructive",
        });
        console.log('❌ Échec du pointage:', result.message);
      }
    }
    closePointageModal();
    // Forcer la re-vérification après pointage pour détecter un éventuel cycle complet
    setTimeout(() => {
      refreshStatus();
    }, 500);
  };

  const handleDepointer = () => {
    console.log('DEBUG - handleDepointer called');
    // Après dépointage, forcer la re-vérification pour détecter le cycle complet
    setTimeout(() => {
      console.log('🔄 Re-vérification après dépointage');
      refreshStatus();
    }, 500);
  };

  const handlePauseStart = () => {
    console.log('DEBUG - handlePauseStart called');
    // Après démarrage de pause, vérifier l'état
    setTimeout(() => {
      refreshStatus();
    }, 500);
  };

  const handlePauseEnd = () => {
    console.log('DEBUG - handlePauseEnd called');
    // Après fin de pause, vérifier l'état
    setTimeout(() => {
      refreshStatus();
    }, 500);
  };

  const handleRetourPause = () => {
    console.log('DEBUG - handleRetourPause called');
    closeRetourPauseModal();
  };

  // Fonction pour extraire l'heure de début d'une tâche et la convertir en minutes
  const getHeureEnMinutes = (heure: string): number => {
    try {
      // Gestion de différents formats: "9h-10h", "14h-16h30", "8h30-10h", etc.
      const debut = heure.split('-')[0];
      
      // Supprimer les espaces et diviser sur 'h'
      const parts = debut.trim().split('h');
      const heureNum = parseInt(parts[0], 10);
      const minutesNum = parts[1] ? parseInt(parts[1], 10) : 0;
      
      return heureNum * 60 + minutesNum;
    } catch (error) {
      console.warn('Format d\'heure non reconnu:', heure);
      return 999999; // Valeur très haute pour placer les tâches avec heure incorrecte à la fin
    }
  };

  // Utilisation de useMemo pour optimiser le tri et garantir la réactivité
  const tachesTriees = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Filtrer les tâches pour aujourd'hui avec logique améliorée
    const tachesAujourdhui = taches.filter(tache => {
      // 1. Priorité : dateAssignation (données DB mappées)
      if (tache.dateAssignation) {
        return tache.dateAssignation === today;
      }
      
      // 2. Fallback : dateCreation pour les tâches locales
      if (tache.dateCreation) {
        const dateCreation = new Date(tache.dateCreation).toISOString().split('T')[0];
        return dateCreation === today;
      }
      
      // 3. Fallback : tâches d'urgence locales (ancien système)
      if (tache.id.startsWith('urgence_')) {
        return true;
      }
      
      // 4. Fallback ultime : toutes les autres tâches pour aujourd'hui
      // (inclut les tâches DB sans mapping correct)
      return true;
    });

    console.log('DEBUG PlanningEmploye - Tasks filtered for today:', tachesAujourdhui);

    // Tri par ordre chronologique
    return [...tachesAujourdhui].sort((a, b) => {
      const heureA = getHeureEnMinutes(a.heure);
      const heureB = getHeureEnMinutes(b.heure);
      return heureA - heureB;
    });
  }, [taches]); // Se rafraîchit automatiquement quand les tâches changent

  // Filtrage des tâches triées par statut
  const tachesEnCours = useMemo(() => 
    tachesTriees.filter(t => t.status === 'en_cours' || t.status === 'planifie'), 
    [tachesTriees]
  );
  
  const tachesTerminees = useMemo(() => 
    tachesTriees.filter(t => t.status === 'termine'), 
    [tachesTriees]
  );

  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'en_cours': return 'default';
      case 'planifie': return 'secondary';
      case 'termine': return 'default';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'en_cours': return 'En cours';
      case 'planifie': return 'Planifié';
      case 'termine': return 'Terminé';
      default: return 'Inconnu';
    }
  };

  // Wrapper pour terminer une tâche SANS déclencher de vérifications de pointage
  const handleTerminerTacheWrapper = (tacheId: string) => {
    console.log('🎯 PlanningEmploye - terminerTache wrapper called for:', tacheId);
    console.log('🚫 AUCUNE vérification de pointage lors de la completion de tâche');
    console.log('📝 Pointage modal status before task completion:', showPointageModal);
    
    // Marquer temporairement qu'une action de tâche est en cours
    // Ceci empêche le hook de réagir aux changements d'état
    console.log('🔒 Blocage temporaire des vérifications de pointage');
    
    onTerminerTache(tacheId);
    
    console.log('✅ Tâche terminée sans interaction avec le système de pointage');
  };

  return (
      <div className="space-y-6">
        {/* Header avec stats et bouton de gestion des pointages pour les employés */}
        <div className="flex justify-between items-start">
          <EmployeStats 
            userRole={userRole}
            employeNom={employe?.nom || ''}
            tachesEnCours={tachesEnCours.length}
            tachesTerminees={tachesTerminees.length}
            totalTaches={tachesTriees.length}
          />
          
          {userRole === 'employe' && employe?.id && (
            <GestionPointageDropdown
              employeNom={employe?.nom || ''}
              employeId={employe?.id || 0}
              onDepointer={handleDepointer}
              onPauseStart={handlePauseStart}
              onPauseEnd={handlePauseEnd}
            />
          )}
        </div>

        {/* Tâches en cours */}
        <TachesSection
          titre="Tâches en cours"
          icon={<Clock className="w-5 h-5 text-warning" />}
          taches={tachesEnCours}
          onTerminerTache={handleTerminerTacheWrapper}
          onVoirVehicule={onVoirVehicule}
          getStatusVariant={getStatusVariant}
          getStatusLabel={getStatusLabel}
          employeeId={employe?.id?.toString() || ''}
          companyId={companyId}
        />

        {/* Tâches terminées */}
        <TachesSection
          titre="Tâches terminées aujourd'hui"
          icon={<CheckCircle className="w-5 h-5 text-success" />}
          taches={tachesTerminees}
          onTerminerTache={handleTerminerTacheWrapper}
          onVoirVehicule={onVoirVehicule}
          getStatusVariant={getStatusVariant}
          getStatusLabel={getStatusLabel}
          isTerminedSection
          employeeId={employe?.id?.toString() || ''}
          companyId={companyId}
        />

        {/* Message si pas de tâches */}
        {tachesTriees.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <h3 className="font-medium mb-2">Aucune tâche aujourd'hui</h3>
              <p className="text-muted-foreground">
                {userRole === 'employe' 
                  ? 'Vous n\'avez pas de tâches assignées pour aujourd\'hui.' 
                  : 'Cet employé n\'a pas de tâches assignées pour aujourd\'hui.'
                }
              </p>
            </CardContent>
          </Card>
        )}

        {/* Modal de pointage automatique - Géré par le hook usePointageStatus */}
        <PointageModal
          isOpen={(() => {
            console.log('🎭 MODAL STATUS:', { showPointageModal, showRetourPauseModal });
            return showPointageModal;
          })()}
          onPointer={handlePointer}
          employeNom={employe?.nom || ''}
          employeId={employe?.id?.toString() || ''}
        />

        {/* Modal de retour de pause - Géré par le hook usePointageStatus */}
        <RetourPauseModal
          isOpen={showRetourPauseModal}
          onRevenir={handleRetourPause}
          employeNom={employe?.nom || ''}
          employeId={employe?.id || 0}
        />
      </div>
  );
};