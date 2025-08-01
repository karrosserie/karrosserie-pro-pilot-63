interface OptimalPlanningData {
  accueil_preparation: { employeeId: string; duration: string };
  remplacement_debosselage: { employeeId: string; duration: string };
  preparation_peinture: { employeeId: string; duration: string };
  mise_en_peinture: { employeeId: string; duration: string };
  finitions_remontage: { employeeId: string; duration: string };
  cloture_livraison: { employeeId: string; duration: string };
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
    const planning: OptimalPlanningData = {
      accueil_preparation: { employeeId: '', duration: '01:00' },
      remplacement_debosselage: { employeeId: '', duration: '02:30' },
      preparation_peinture: { employeeId: '', duration: '02:30' },
      mise_en_peinture: { employeeId: '', duration: '05:00' },
      finitions_remontage: { employeeId: '', duration: '02:00' },
      cloture_livraison: { employeeId: '', duration: '00:30' }
    };

    // Pour chaque étape, sélectionner le premier employé qualifié disponible
    for (const step of WORKFLOW_STEPS) {
      const qualifiedEmployees = employees.filter(emp => 
        emp.qualifications?.includes(step.qualification)
      );

      if (qualifiedEmployees.length > 0) {
        // Pour le moment, on prend le premier employé qualifié
        // Dans une version plus avancée, on pourrait vérifier les disponibilités
        planning[step.key as keyof OptimalPlanningData] = {
          employeeId: qualifiedEmployees[0].id,
          duration: step.defaultDuration
        };
      }
    }

    return planning;
  };

  return {
    calculateOptimalPlanning
  };
}