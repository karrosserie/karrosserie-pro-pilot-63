import { supabase } from '@/integrations/supabase/client';

interface OptimalPlanningData {
  accueil_preparation: { employeeId: string; duration: string; startDateTime?: Date; endDateTime?: Date };
  remplacement_debosselage: { employeeId: string; duration: string; startDateTime?: Date; endDateTime?: Date };
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
  { key: 'preparation_peinture', qualification: 'Préparation peinture', defaultDuration: '02:30' },
  { key: 'mise_en_peinture', qualification: 'Mise en peinture', defaultDuration: '05:00' },
  { key: 'finitions_remontage', qualification: 'Finitions & remontage', defaultDuration: '02:00' },
  { key: 'cloture_livraison', qualification: 'Clôture du dossier et livraison', defaultDuration: '00:30' }
];

export function useOptimalPlanning(employees: any[] = [], companyId?: string) {

  // Fonction pour vérifier si un employé est disponible sur un créneau
  const isEmployeeAvailable = async (employeeId: string, startDateTime: Date, endDateTime: Date): Promise<boolean> => {
    if (!companyId) return true;
    
    try {
      const { data, error } = await (supabase as any)
        .from('employee_schedule')
        .select('id, start_datetime, end_datetime, status')
        .eq('employee_id', employeeId)
        .eq('company_id', companyId)
        .neq('status', 'Terminé'); // Ignorer les tâches terminées

      if (error) throw error;

      // Vérifier les conflits de planning
      for (const schedule of data || []) {
        const existingStart = new Date(schedule.start_datetime);
        const existingEnd = new Date(schedule.end_datetime);
        
        // Vérifier si les créneaux se chevauchent
        if (
          (startDateTime < existingEnd && endDateTime > existingStart) ||
          (existingStart < endDateTime && existingEnd > startDateTime)
        ) {
          return false; // Conflit détecté
        }
      }
      
      return true; // Pas de conflit
    } catch (error) {
      console.error('Erreur lors de la vérification de disponibilité:', error);
      return true; // En cas d'erreur, considérer comme disponible
    }
  };

  // Fonction pour trouver le prochain créneau disponible pour un employé
  const findNextAvailableSlot = async (employeeId: string, startDateTime: Date, durationMinutes: number): Promise<Date> => {
    let currentSlot = new Date(startDateTime);
    
    while (true) {
      const endSlot = new Date(currentSlot.getTime() + durationMinutes * 60 * 1000);
      
      // Vérifier si le créneau respecte les heures ouvrables (8h-17h)
      if (currentSlot.getHours() >= 8 && endSlot.getHours() <= 17 && currentSlot.getDay() >= 1 && currentSlot.getDay() <= 5) {
        const isAvailable = await isEmployeeAvailable(employeeId, currentSlot, endSlot);
        if (isAvailable) {
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
    }
  };

  const calculateOptimalPlanning = async (): Promise<OptimalPlanningData> => {
    const now = new Date();
    
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
    
    const planning: OptimalPlanningData = {
      accueil_preparation: { employeeId: '', duration: '01:00' },
      remplacement_debosselage: { employeeId: '', duration: '02:30' },
      preparation_peinture: { employeeId: '', duration: '02:30' },
      mise_en_peinture: { employeeId: '', duration: '05:00' },
      finitions_remontage: { employeeId: '', duration: '02:00' },
      cloture_livraison: { employeeId: '', duration: '00:30' }
    };

    // Pour chaque étape, calculer le meilleur créneau
    for (const step of WORKFLOW_STEPS) {
      const qualifiedEmployees = employees.filter(emp => 
        emp.qualifications?.includes(step.qualification)
      );

      if (qualifiedEmployees.length > 0) {
        // Calculer la durée de l'étape en minutes
        const [hours, minutes] = step.defaultDuration.split(':').map(Number);
        const durationMinutes = hours * 60 + minutes;
        
        let bestEmployee = null;
        let bestStartDateTime = null;
        
        // Trouver l'employé avec le créneau le plus tôt
        for (const employee of qualifiedEmployees) {
          const availableSlot = await findNextAvailableSlot(employee.id, currentDateTime, durationMinutes);
          
          if (!bestStartDateTime || availableSlot < bestStartDateTime) {
            bestEmployee = employee;
            bestStartDateTime = availableSlot;
          }
        }
        
        if (bestEmployee && bestStartDateTime) {
          const finalEndDateTime = new Date(bestStartDateTime.getTime() + durationMinutes * 60 * 1000);
          
          planning[step.key as keyof OptimalPlanningData] = {
            employeeId: bestEmployee.id,
            duration: step.defaultDuration,
            startDateTime: new Date(bestStartDateTime),
            endDateTime: finalEndDateTime
          };
          
          // Préparer pour la prochaine étape (commencer après la fin de cette étape)
          currentDateTime = new Date(finalEndDateTime);
        }
      }
    }

    return planning;
  };

  return {
    calculateOptimalPlanning
  };
}