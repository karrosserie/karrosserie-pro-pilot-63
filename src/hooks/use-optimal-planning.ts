import { supabase } from '@/integrations/supabase/client';
import { calculateDynamicDurations } from '@/services/planning/taskDurationCalculator';

interface OptimalPlanningData {
  accueil_preparation: { employeeId: string; duration: string; startDateTime?: Date; endDateTime?: Date };
  remplacement_debosselage: { employeeId: string; duration: string; startDateTime?: Date; endDateTime?: Date };
  controle_technique_securite: { employeeId: string; duration: string; startDateTime?: Date; endDateTime?: Date };
  preparation_peinture: { employeeId: string; duration: string; startDateTime?: Date; endDateTime?: Date };
  mise_en_peinture: { employeeId: string; duration: string; startDateTime?: Date; endDateTime?: Date };
  finitions_remontage: { employeeId: string; duration: string; startDateTime?: Date; endDateTime?: Date };
  cloture_livraison: { employeeId: string; duration: string; startDateTime?: Date; endDateTime?: Date };
}

interface EmployeeSchedule {
  id: string;
  employee_id: string;
  start_datetime: string;
  end_datetime: string;
  status: string;
}

const WORKFLOW_STEPS = [
  { key: 'accueil_preparation', qualification: 'Accueil & Préparation du dossier', defaultDuration: '01:00' },
  { key: 'remplacement_debosselage', qualification: 'Remplacement ou débosselage', defaultDuration: '02:30' },
  { key: 'controle_technique_securite', qualification: 'Contrôle technique de sécurité', defaultDuration: '01:30' },
  { key: 'preparation_peinture', qualification: 'Préparation peinture', defaultDuration: '02:30' },
  { key: 'mise_en_peinture', qualification: 'Mise en peinture', defaultDuration: '05:00' },
  { key: 'finitions_remontage', qualification: 'Finitions & remontage', defaultDuration: '02:00' },
  { key: 'cloture_livraison', qualification: 'Clôture du dossier et livraison', defaultDuration: '00:30' }
];

export function useOptimalPlanning(employees: any[] = [], companyId?: string) {

  // Fonction pour vérifier si un employé est disponible sur un créneau
  const isEmployeeAvailable = async (
    employeeId: string, 
    startDateTime: Date, 
    endDateTime: Date, 
    excludeTemporary: Array<{employeeId: string, startDateTime: Date, endDateTime: Date}> = []
  ): Promise<boolean> => {
    if (!companyId) return true;
    
    console.log(`🔍 Vérification disponibilité employé ${employeeId} de ${startDateTime.toLocaleString()} à ${endDateTime.toLocaleString()}`);
    
    try {
      const { data, error } = await (supabase as any)
        .from('employee_schedule')
        .select('id, start_datetime, end_datetime, status')
        .eq('employee_id', employeeId)
        .eq('company_id', companyId)
        .neq('status', 'Terminé'); // Ignorer les tâches terminées

      if (error) throw error;

      console.log(`📅 Trouvé ${data?.length || 0} créneaux existants pour l'employé ${employeeId}`);

      // Vérifier les conflits avec les créneaux en base
      for (const schedule of data || []) {
        const existingStart = new Date(schedule.start_datetime);
        const existingEnd = new Date(schedule.end_datetime);
        
        console.log(`⏰ Conflit check: nouveau (${startDateTime.toLocaleString()} - ${endDateTime.toLocaleString()}) vs existant (${existingStart.toLocaleString()} - ${existingEnd.toLocaleString()})`);
        
        // Vérifier si les créneaux se chevauchent
        if (startDateTime < existingEnd && endDateTime > existingStart) {
          console.log(`❌ CONFLIT détecté avec créneau existant !`);
          return false; // Conflit détecté
        }
      }

      // Vérifier les conflits avec les créneaux temporaires (planifiés dans cette session)
      for (const tempSlot of excludeTemporary) {
        if (tempSlot.employeeId === employeeId) {
          console.log(`⏰ Conflit check temporaire: nouveau (${startDateTime.toLocaleString()} - ${endDateTime.toLocaleString()}) vs temporaire (${tempSlot.startDateTime.toLocaleString()} - ${tempSlot.endDateTime.toLocaleString()})`);
          
          if (startDateTime < tempSlot.endDateTime && endDateTime > tempSlot.startDateTime) {
            console.log(`❌ CONFLIT détecté avec créneau temporaire !`);
            return false;
          }
        }
      }
      
      console.log(`✅ Aucun conflit détecté, créneau disponible`);
      return true; // Pas de conflit
    } catch (error) {
      console.error('Erreur lors de la vérification de disponibilité:', error);
      return false; // En cas d'erreur, considérer comme non disponible pour éviter les conflits
    }
  };

  // Fonction pour trouver le prochain créneau disponible pour un employé
  const findNextAvailableSlot = async (
    employeeId: string, 
    startDateTime: Date, 
    durationMinutes: number,
    excludeTemporary: Array<{employeeId: string, startDateTime: Date, endDateTime: Date}> = []
  ): Promise<Date> => {
    let currentSlot = new Date(startDateTime);
    console.log(`🔍 Recherche créneau pour employé ${employeeId}, durée ${durationMinutes}min, à partir de ${startDateTime.toLocaleString()}`);
    
    let iterations = 0;
    const maxIterations = 100; // Protection contre les boucles infinies
    
    while (iterations < maxIterations) {
      const endSlot = new Date(currentSlot.getTime() + durationMinutes * 60 * 1000);
      
      console.log(`🕐 Test créneau: ${currentSlot.toLocaleString()} - ${endSlot.toLocaleString()}`);
      
      // Vérifier si le créneau respecte les heures ouvrables (8h-17h)
      if (currentSlot.getHours() >= 8 && endSlot.getHours() <= 17 && currentSlot.getDay() >= 1 && currentSlot.getDay() <= 5) {
        const isAvailable = await isEmployeeAvailable(employeeId, currentSlot, endSlot, excludeTemporary);
        if (isAvailable) {
          console.log(`✅ Créneau trouvé: ${currentSlot.toLocaleString()}`);
          return currentSlot;
        }
      }
      
      // Passer au créneau suivant (par heure)
      currentSlot = new Date(currentSlot.getTime() + 60 * 60 * 1000); // +1 heure
      
      // Si on dépasse 17h, aller au lendemain 8h
      if (currentSlot.getHours() >= 17) {
        currentSlot.setDate(currentSlot.getDate() + 1);
        currentSlot.setHours(8, 0, 0, 0);
      }
      
      // Si c'est le weekend, aller au lundi suivant
      if (currentSlot.getDay() === 0) { // Dimanche
        currentSlot.setDate(currentSlot.getDate() + 1);
        currentSlot.setHours(8, 0, 0, 0);
      } else if (currentSlot.getDay() === 6) { // Samedi
        currentSlot.setDate(currentSlot.getDate() + 2);
        currentSlot.setHours(8, 0, 0, 0);
      }
      
      iterations++;
    }
    
    console.error(`❌ Impossible de trouver un créneau disponible après ${maxIterations} itérations`);
    return currentSlot; // Retourner le dernier créneau testé en cas d'échec
  };

  const calculateOptimalPlanning = async (vehicleId?: string): Promise<OptimalPlanningData> => {
    console.log(`🚀 Début de la planification automatique pour véhicule: ${vehicleId || 'non spécifié'}`);
    const now = new Date();
    
    // Récupérer les durées dynamiques basées sur le véhicule
    let dynamicDurations: Record<string, number> | null = null;
    if (vehicleId) {
      try {
        dynamicDurations = await calculateDynamicDurations(vehicleId);
        console.log(`📊 Durées dynamiques récupérées:`, dynamicDurations);
      } catch (error) {
        console.error('Erreur lors du calcul des durées dynamiques, utilisation des valeurs par défaut:', error);
      }
    }
    
    // Calculer le prochain créneau disponible
    const nextAvailableDate = new Date(now);
    
    // Si on est dans les heures ouvrables du jour même
    if (now.getHours() >= 8 && now.getHours() < 17) {
      // Commencer au moins 1 heure après maintenant, arrondi à l'heure suivante
      nextAvailableDate.setHours(now.getHours() + 1, 0, 0, 0);
      
      // Si on dépasse 17h, aller au lendemain 8h
      if (nextAvailableDate.getHours() >= 17) {
        nextAvailableDate.setDate(nextAvailableDate.getDate() + 1);
        nextAvailableDate.setHours(8, 0, 0, 0);
      }
    } else if (now.getHours() >= 17) {
      // Si après 17h, commencer le lendemain
      nextAvailableDate.setDate(nextAvailableDate.getDate() + 1);
      nextAvailableDate.setHours(8, 0, 0, 0);
    } else {
      // Si avant 8h, commencer à 8h le même jour
      nextAvailableDate.setHours(8, 0, 0, 0);
    }
    
    // Si c'est le weekend, aller au lundi suivant
    if (nextAvailableDate.getDay() === 0) { // Dimanche
      nextAvailableDate.setDate(nextAvailableDate.getDate() + 1);
      nextAvailableDate.setHours(8, 0, 0, 0);
    } else if (nextAvailableDate.getDay() === 6) { // Samedi
      nextAvailableDate.setDate(nextAvailableDate.getDate() + 2);
      nextAvailableDate.setHours(8, 0, 0, 0);
    }

    let currentDateTime = new Date(nextAvailableDate);
    console.log(`📅 Planification à partir de: ${currentDateTime.toLocaleString()}`);
    
    const planning: OptimalPlanningData = {
      accueil_preparation: { employeeId: '', duration: '01:00' },
      remplacement_debosselage: { employeeId: '', duration: '02:30' },
      controle_technique_securite: { employeeId: '', duration: '01:30' },
      preparation_peinture: { employeeId: '', duration: '02:30' },
      mise_en_peinture: { employeeId: '', duration: '05:00' },
      finitions_remontage: { employeeId: '', duration: '02:00' },
      cloture_livraison: { employeeId: '', duration: '00:30' }
    };

    // Tableau pour garder trace des créneaux temporaires planifiés dans cette session
    const temporarySlots: Array<{employeeId: string, startDateTime: Date, endDateTime: Date}> = [];

    // Pour chaque étape, calculer le meilleur créneau
    for (const step of WORKFLOW_STEPS) {
      console.log(`🔄 Planification de l'étape: ${step.qualification}`);
      
      const qualifiedEmployees = employees.filter(emp => 
        emp.qualifications?.includes(step.qualification)
      );

      console.log(`👥 ${qualifiedEmployees.length} employés qualifiés trouvés pour ${step.qualification}`);

      if (qualifiedEmployees.length > 0) {
        // Calculer la durée de l'étape en minutes
        let durationMinutes: number;
        
        if (dynamicDurations && dynamicDurations[step.qualification]) {
          // Utiliser la durée dynamique calculée (déjà en minutes)
          durationMinutes = dynamicDurations[step.qualification];
          console.log(`⏱️ Utilisation durée dynamique pour ${step.qualification}: ${durationMinutes}min`);
        } else {
          // Fallback sur la durée par défaut
          const [hours, minutes] = step.defaultDuration.split(':').map(Number);
          durationMinutes = hours * 60 + minutes;
          console.log(`⏱️ Utilisation durée par défaut pour ${step.qualification}: ${durationMinutes}min`);
        }
        
        let bestEmployee = null;
        let bestStartDateTime = null;
        
        // Trouver l'employé avec le créneau le plus tôt disponible à partir de currentDateTime
        for (const employee of qualifiedEmployees) {
          console.log(`👤 Test employé: ${employee.id}`);
          const availableSlot = await findNextAvailableSlot(employee.id, currentDateTime, durationMinutes, temporarySlots);
          
          if (!bestStartDateTime || availableSlot < bestStartDateTime) {
            bestEmployee = employee;
            bestStartDateTime = availableSlot;
            console.log(`🥇 Nouveau meilleur employé: ${employee.id} à ${availableSlot.toLocaleString()}`);
          }
        }
        
        if (bestEmployee && bestStartDateTime) {
          const finalEndDateTime = new Date(bestStartDateTime.getTime() + durationMinutes * 60 * 1000);
          
          // Formater la durée en HH:MM
          const hours = Math.floor(durationMinutes / 60);
          const mins = durationMinutes % 60;
          const durationFormatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
          
          planning[step.key as keyof OptimalPlanningData] = {
            employeeId: bestEmployee.id,
            duration: durationFormatted,
            startDateTime: new Date(bestStartDateTime),
            endDateTime: finalEndDateTime
          };

          // Ajouter ce créneau aux créneaux temporaires pour éviter les conflits
          temporarySlots.push({
            employeeId: bestEmployee.id,
            startDateTime: new Date(bestStartDateTime),
            endDateTime: finalEndDateTime
          });
          
          console.log(`✅ Étape planifiée: ${step.qualification} - Employé ${bestEmployee.id} de ${bestStartDateTime.toLocaleString()} à ${finalEndDateTime.toLocaleString()}`);
          
          // Préparer pour la prochaine étape : elle doit commencer au plus tôt après la fin de cette étape
          currentDateTime = new Date(finalEndDateTime);
        } else {
          console.error(`❌ Impossible de planifier l'étape: ${step.qualification}`);
        }
      } else {
        console.warn(`⚠️ Aucun employé qualifié pour: ${step.qualification}`);
      }
    }

    console.log(`🏁 Planification terminée, ${temporarySlots.length} créneaux planifiés`);
    return planning;
  };

  return {
    calculateOptimalPlanning
  };
}