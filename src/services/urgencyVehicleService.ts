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
  clientId?: string;
  vehicleId?: string;
  scheduleId?: string;
}

/**
 * Service pour gérer les véhicules d'urgence avec persistance en base de données
 */
export class UrgencyVehicleService {
  
  /**
   * Ajoute un véhicule d'urgence complet en base de données
   */
  static async ajouterVehiculeUrgence(data: VehiculeUrgenceData): Promise<VehiculeUrgenceResult> {
    try {
      const { plaque, nom, prenom, heure, employeId, companyId } = data;
      
      console.log('🚨 UrgencyVehicleService: Adding emergency vehicle via edge function:', data);
      
      // Utiliser supabase.functions.invoke au lieu de fetch direct pour éviter le rate limiting
      const { data: result, error } = await supabase.functions.invoke('create-emergency-vehicle', {
        body: {
          plaque,
          nom,
          prenom,
          heure,
          employeId,
          companyId
        }
      });

      if (error) {
        console.error('❌ Edge function error:', error);
        return {
          success: false,
          message: `Erreur du serveur: ${error.message || 'Erreur inconnue'}`
        };
      }
      
      if (result.success) {
        console.log('✅ Emergency vehicle created successfully:', result.data);
        
        // Attendre un peu pour que les données soient bien persistées
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          message: result.message,
          clientId: result.data.clientId,
          vehicleId: result.data.vehicleId,
          scheduleId: result.data.scheduleId
        };
      } else {
        console.error('❌ Edge function returned error:', result.message);
        return {
          success: false,
          message: result.message
        };
      }
      
    } catch (error) {
      console.error('❌ UrgencyVehicleService: Unexpected error:', error);
      return {
        success: false,
        message: `Erreur inattendue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
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