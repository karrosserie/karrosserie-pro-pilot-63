import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WorkflowVehicle {
  id: string;
  brand: string;
  plate: string;
  client: string;
  price: string;
  duration: string;
  status: string;
  inProgress: boolean;
  technician: string | null;
  workflowId?: string;
}

export interface WorkflowStep {
  title: string;
  color: string;
  vehicles: WorkflowVehicle[];
  count: number;
}

export const useVehicleWorkflow = (companyId?: string) => {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWorkflowData = async () => {
    if (!companyId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Récupérer les véhicules avec leurs étapes de workflow
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select(`
          id,
          license_plate,
          client_id,
          brand_id,
          model_id,
          clients (
            first_name,
            last_name
          ),
          car_brands (
            name
          ),
          car_models (
            name
          )
        `)
        .eq('company_id', companyId);

      if (vehiclesError) throw vehiclesError;

      // Récupérer les devis pour calculer les montants
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('vehicle_id, amount, tax_rate')
        .eq('company_id', companyId)
        .in('vehicle_id', vehiclesData?.map(v => v.id) || []);

      if (quotesError) throw quotesError;

      // Récupérer les étapes de workflow pour ces véhicules
      const { data: workflowData, error: workflowError } = await supabase
        .from('vehicle_workflow_steps')
        .select('*')
        .eq('company_id', companyId);

      if (workflowError) throw workflowError;

      // Organiser les données par étapes
      const stepMap = {
        'accueil_preparation': {
          title: "Accueil & Préparation du dossier",
          color: "border-l-karrosserie-orange",
          vehicles: []
        },
        'remplacement_debosselage': {
          title: "Remplacement ou débosselage",
          color: "border-l-green-500",
          vehicles: []
        },
        'preparation_peinture': {
          title: "Préparation peinture",
          color: "border-l-yellow-500",
          vehicles: []
        },
        'mise_en_peinture': {
          title: "Mise en peinture",
          color: "border-l-blue-500",
          vehicles: []
        },
        'finitions_remontage': {
          title: "Finitions & remontage",
          color: "border-l-purple-500",
          vehicles: []
        },
        'cloture_livraison': {
          title: "Clôture du dossier et livraison",
          color: "border-l-red-500",
          vehicles: []
        }
      };

      // Associer seulement les véhicules qui ont une entrée dans vehicle_workflow_steps
      workflowData?.forEach(workflowStep => {
        const vehicle = vehiclesData?.find(v => v.id === workflowStep.vehicle_id);
        if (!vehicle) return;
        
        const currentStep = workflowStep.current_step;
        
        // Trouver le devis associé au véhicule
        const quote = quotesData?.find(q => q.vehicle_id === vehicle.id);
        const amountHT = quote?.amount || 0;
        const taxRate = quote?.tax_rate || 20;
        const amountTTC = amountHT * (1 + taxRate / 100);
        
        if (stepMap[currentStep]) {
          stepMap[currentStep].vehicles.push({
            id: vehicle.id,
            brand: `${vehicle.car_brands?.name || ''} ${vehicle.car_models?.name || ''}`.trim() || 'Véhicule',
            plate: vehicle.license_plate,
            client: `${vehicle.clients?.first_name || ''} ${vehicle.clients?.last_name || ''}`.trim() || 'Client inconnu',
            price: `${amountTTC.toFixed(2).replace('.', ',')}€`,
            duration: "0h", // À calculer selon la configuration
            status: workflowStep.progress_percentage === 100 ? "Terminé" : "En cours",
            inProgress: workflowStep.progress_percentage > 0 && workflowStep.progress_percentage < 100,
            technician: workflowStep.technician_id ? "Assigné" : null,
            workflowId: workflowStep.id
          });
        }
      });

      // Convertir en array avec les counts
      const steps = Object.values(stepMap).map(step => ({
        ...step,
        count: step.vehicles.length
      }));

      setWorkflowSteps(steps);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données de workflow:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflowData();
  }, [companyId]);

  return {
    workflowSteps,
    isLoading,
    error,
    refetch: loadWorkflowData
  };
};