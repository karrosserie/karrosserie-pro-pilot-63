import { supabase } from '@/integrations/supabase/client';

export interface VehiculeUrgenceData {
  plaque: string;
  nom: string;
  prenom: string;
  heure: string;
  employeId: string;
  companyId: string;
}

export interface VehiculeUrgenceResult {
  success: boolean;
  message: string;
  data?: {
    clientId: string;
    vehicleId: string;
    scheduleId: string;
    pausedTaskId?: string;
    shiftedTasks?: Array<{
      id: string;
      task_type: string;
      old_start: string;
      new_start: string;
      employee_name: string;
    }>;
    conflictsResolved?: number;
  };
}

/**
 * Service pour gérer les véhicules d'urgence avec persistance en base de données
 */
export class UrgencyVehicleService {
  
  /**
   * Ajoute un véhicule d'urgence avec priorité absolue (décale les autres tâches si nécessaire)
   */
  static async ajouterVehiculeUrgence(data: VehiculeUrgenceData): Promise<VehiculeUrgenceResult> {
    console.log('🚨 Service: Adding PRIORITY emergency vehicle:', data);
    
    try {
      // Use the new priority insertion edge function
      console.log('📞 Calling insert-emergency-with-priority edge function...');
      
      const { data: result, error } = await supabase.functions.invoke('insert-emergency-with-priority', {
        body: data
      });

      if (error) {
        console.error('❌ Priority insertion error:', error);
        throw new Error(`Erreur lors de l'insertion prioritaire: ${error.message}`);
      }

      if (!result?.success) {
        console.error('❌ Priority insertion failed:', result);
        throw new Error(result?.message || 'Échec de l\'insertion prioritaire du véhicule d\'urgence');
      }

      console.log('✅ Priority emergency vehicle created successfully:', result);
      
      // Log shifted tasks if any
      if (result.data?.shiftedTasks?.length > 0) {
        console.log(`🔄 Tasks shifted due to priority insertion:`, result.data.shiftedTasks);
      }
      
      return {
        success: true,
        message: result.message + (result.data?.conflictsResolved > 0 ? 
          ` (${result.data.conflictsResolved} tâche(s) décalée(s))` : '') +
          (result.data?.pausedTaskId ? ' - Tâche en cours mise en pause' : ''),
        data: {
          clientId: result.data.clientId,
          vehicleId: result.data.vehicleId,
          scheduleId: result.data.scheduleId,
          pausedTaskId: result.data.pausedTaskId,
          shiftedTasks: result.data.shiftedTasks || [],
          conflictsResolved: result.data.conflictsResolved || 0
        }
      };

    } catch (error) {
      console.error('❌ Priority insertion service error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }
  
  /**
   * Récupère les véhicules d'urgence pour une entreprise
   */
  static async getVehiculesUrgence(companyId: string) {
    try {
      const { data, error } = await supabase
        .from('employee_schedule')
        .select(`
          *,
          vehicles:vehicle_id (
            id,
            license_plate,
            status,
            clients:client_id (
              id,
              first_name,
              last_name
            )
          ),
          profiles:user_id (
            first_name,
            last_name
          )
        `)
        .eq('company_id', companyId)
        .eq('task_type', 'Accueil & Préparation du dossier')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching emergency vehicles:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('❌ UrgencyVehicleService: Error fetching data:', error);
      return [];
    }
  }
}