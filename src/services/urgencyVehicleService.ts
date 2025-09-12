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
      
      console.log('🚨 UrgencyVehicleService: Adding emergency vehicle via Supabase JS:', data);
      
      // 1. Créer ou récupérer le client
      let clientId: string;
      
      // Chercher si le client existe déjà
      const { data: existingClient, error: clientSearchError } = await supabase
        .from('clients')
        .select('id')
        .eq('first_name', prenom)
        .eq('last_name', nom)
        .eq('company_id', companyId)
        .maybeSingle();
      
      if (clientSearchError) {
        console.error('❌ Error searching for client:', clientSearchError);
        return {
          success: false,
          message: `Erreur lors de la recherche du client: ${clientSearchError.message}`
        };
      }
      
      if (existingClient) {
        clientId = existingClient.id;
        console.log('✅ Client existant trouvé:', clientId);
      } else {
        // Créer un nouveau client
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            first_name: prenom,
            last_name: nom,
            company_id: companyId
          })
          .select('id')
          .single();
        
        if (clientError) {
          console.error('❌ Error creating client:', clientError);
          return {
            success: false,
            message: `Erreur lors de la création du client: ${clientError.message}`
          };
        }
        
        clientId = newClient.id;
        console.log('✅ Nouveau client créé:', clientId);
      }
      
      // 2. Créer ou récupérer le véhicule
      let vehicleId: string;
      
      // Chercher si le véhicule existe déjà
      const { data: existingVehicle, error: vehicleSearchError } = await supabase
        .from('vehicles')
        .select('id')
        .eq('license_plate', plaque)
        .eq('company_id', companyId)
        .maybeSingle();
      
      if (vehicleSearchError) {
        console.error('❌ Error searching for vehicle:', vehicleSearchError);
        return {
          success: false,
          message: `Erreur lors de la recherche du véhicule: ${vehicleSearchError.message}`
        };
      }
      
      if (existingVehicle) {
        vehicleId = existingVehicle.id;
        console.log('✅ Véhicule existant trouvé:', vehicleId);
        
        // Mettre à jour le client du véhicule
        const { error: updateError } = await supabase
          .from('vehicles')
          .update({ client_id: clientId })
          .eq('id', vehicleId);
        
        if (updateError) {
          console.warn('⚠️ Warning updating vehicle client:', updateError);
        }
      } else {
        // Créer un nouveau véhicule
        const { data: newVehicle, error: vehicleError } = await supabase
          .from('vehicles')
          .insert({
            license_plate: plaque,
            client_id: clientId,
            company_id: companyId,
            status: 'En attente'
          })
          .select('id')
          .single();
        
        if (vehicleError) {
          console.error('❌ Error creating vehicle:', vehicleError);
          return {
            success: false,
            message: `Erreur lors de la création du véhicule: ${vehicleError.message}`
          };
        }
        
        vehicleId = newVehicle.id;
        console.log('✅ Nouveau véhicule créé:', vehicleId);
      }
      
      // 3. Récupérer l'ID utilisateur réel depuis user_companies
      const { data: userCompany, error: userCompanyError } = await supabase
        .from('user_companies')
        .select('user_id, role, active')
        .eq('id', employeId)
        .eq('company_id', companyId)
        .eq('active', true)
        .maybeSingle();
      
      if (userCompanyError) {
        console.error('❌ Error fetching user_companies:', userCompanyError);
        return {
          success: false,
          message: `Employé non trouvé dans l'entreprise: ${userCompanyError.message}`
        };
      }
      
      if (!userCompany) {
        console.log('❌ Employee ID not found in user_companies:', employeId);
        return {
          success: false,
          message: `L'employé sélectionné n'existe pas ou n'est pas actif dans cette entreprise.`
        };
      }
      
      const actualUserId = userCompany.user_id;
      console.log('✅ Found employee in user_companies:', { employeId, actualUserId, role: userCompany.role });
      
      // 4. Vérifier que l'employé a un profil utilisateur
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('id', actualUserId)
        .maybeSingle();
      
      if (profileCheckError) {
        console.error('❌ Error checking employee profile:', profileCheckError);
        return {
          success: false,
          message: `L'employé sélectionné n'a pas de profil utilisateur valide: ${profileCheckError.message}`
        };
      }
      
      if (!existingProfile) {
        console.log('❌ Employee has no profile in auth system:', actualUserId);
        return {
          success: false,
          message: `L'employé sélectionné n'a pas de profil utilisateur dans le système d'authentification.`
        };
      }
      
      console.log('✅ Employee profile exists:', existingProfile);
      
      // 5. Créer la tâche dans le planning avec gestion des dates
      const today = new Date();
      const currentTime = new Date();
      const [heureStr, minuteStr] = heure.split(':');
      
      // Calculer la date de la tâche
      let taskDate = new Date(today);
      const selectedTime = new Date(today);
      selectedTime.setHours(parseInt(heureStr), parseInt(minuteStr), 0, 0);
      
      // Si l'heure sélectionnée est antérieure à l'heure actuelle, programmer pour le lendemain
      if (selectedTime <= currentTime) {
        taskDate = new Date(today);
        taskDate.setDate(today.getDate() + 1); // Ajouter un jour
        console.log('⏰ Heure sélectionnée antérieure à maintenant, programmé pour demain');
      }
      
      const startDateTime = new Date(taskDate);
      startDateTime.setHours(parseInt(heureStr), parseInt(minuteStr), 0, 0);
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(startDateTime.getHours() + 1); // 1 heure par défaut
      
      console.log('📅 Planning emergency vehicle:', {
        selectedTime: selectedTime.toLocaleString('fr-FR'),
        currentTime: currentTime.toLocaleString('fr-FR'),
        plannedStartTime: startDateTime.toLocaleString('fr-FR'),
        plannedEndTime: endDateTime.toLocaleString('fr-FR')
      });
      
      const { data: newSchedule, error: scheduleError } = await supabase
        .from('employee_schedule')
        .insert({
          company_id: companyId,
          user_id: actualUserId,
          vehicle_id: vehicleId,
          task_type: 'Accueil & Préparation du dossier',
          start_datetime: startDateTime.toISOString(),
          end_datetime: endDateTime.toISOString(),
          status: 'En attente'
        })
        .select('id')
        .single();
      
      if (scheduleError) {
        console.error('❌ Error creating schedule:', scheduleError);
        return {
          success: false,
          message: `Erreur lors de la création de la tâche: ${scheduleError.message}`
        };
      }
      
      console.log('✅ Emergency vehicle created successfully:', {
        clientId,
        vehicleId,
        scheduleId: newSchedule.id
      });
      
      // Déterminer le message selon si c'est programmé aujourd'hui ou demain
      let successMessage = 'Véhicule d\'urgence ajouté avec succès';
      if (selectedTime <= currentTime) {
        successMessage += ` et programmé pour demain à ${heure}`;
      } else {
        successMessage += ` et programmé pour aujourd'hui à ${heure}`;
      }
      
      return {
        success: true,
        message: successMessage,
        clientId,
        vehicleId,
        scheduleId: newSchedule.id
      };
      
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