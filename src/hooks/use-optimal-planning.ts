interface OptimalPlanningData {
  accueil_preparation: { employeeId: string; duration: string; startDateTime?: Date; endDateTime?: Date };
  remplacement_debosselage: { employeeId: string; duration: string; startDateTime?: Date; endDateTime?: Date };
  preparation_peinture: { employeeId: string; duration: string; startDateTime?: Date; endDateTime?: Date };
  mise_en_peinture: { employeeId: string; duration: string; startDateTime?: Date; endDateTime?: Date };
  finitions_remontage: { employeeId: string; duration: string; startDateTime?: Date; endDateTime?: Date };
  cloture_livraison: { employeeId: string; duration: string; startDateTime?: Date; endDateTime?: Date };
}

const WORKFLOW_STEPS = [
  { key: 'accueil_preparation', qualification: 'Accueil & Préparation du dossier', defaultDuration: '01:00' },
  { key: 'remplacement_debosselage', qualification: 'Remplacement ou débosselage', defaultDuration: '02:30' },
  { key: 'preparation_peinture', qualification: 'Préparation peinture', defaultDuration: '02:30' },
  { key: 'mise_en_peinture', qualification: 'Mise en peinture', defaultDuration: '05:00' },
  { key: 'finitions_remontage', qualification: 'Finitions & remontage', defaultDuration: '02:00' },
  { key: 'cloture_livraison', qualification: 'Clôture du dossier et livraison', defaultDuration: '00:30' }
];

export function useOptimalPlanning(employees: any[] = []) {

  const calculateOptimalPlanning = (): OptimalPlanningData => {
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
        
        // Calculer l'heure de fin
        const endDateTime = new Date(currentDateTime.getTime() + durationMinutes * 60 * 1000);
        
        // Vérifier si on dépasse 17h, si oui passer au lendemain 8h
        if (endDateTime.getHours() >= 17) {
          currentDateTime.setDate(currentDateTime.getDate() + 1);
          currentDateTime.setHours(8, 0, 0, 0);
          
          // Vérifier les weekends
          if (currentDateTime.getDay() === 0) {
            currentDateTime.setDate(currentDateTime.getDate() + 1);
          } else if (currentDateTime.getDay() === 6) {
            currentDateTime.setDate(currentDateTime.getDate() + 2);
          }
        }
        
        // Recalculer l'heure de fin avec la nouvelle heure de début
        const finalEndDateTime = new Date(currentDateTime.getTime() + durationMinutes * 60 * 1000);
        
        planning[step.key as keyof OptimalPlanningData] = {
          employeeId: qualifiedEmployees[0].id,
          duration: step.defaultDuration,
          startDateTime: new Date(currentDateTime),
          endDateTime: finalEndDateTime
        };
        
        // Préparer pour la prochaine étape
        currentDateTime = new Date(finalEndDateTime);
      }
    }

    return planning;
  };

  return {
    calculateOptimalPlanning
  };
}