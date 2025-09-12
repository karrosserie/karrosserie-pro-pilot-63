import { supabase } from "@/integrations/supabase/client";
import { format, parse } from "date-fns";

interface DeplacerTacheParams {
  taskId: string;
  nouvelEmployeId: string;
  nouvelleDate: Date;
  nouvelleHeure: string;
}

export const deplacerTacheSupabase = async ({
  taskId,
  nouvelEmployeId,
  nouvelleDate,
  nouvelleHeure
}: DeplacerTacheParams) => {
  try {
    // Créer la nouvelle date et heure combinées
    const [hours, minutes] = nouvelleHeure.split(':').map(Number);
    const newStartDateTime = new Date(nouvelleDate);
    newStartDateTime.setHours(hours, minutes, 0, 0);
    
    // Calculer l'heure de fin (ajouter 1 heure par défaut)
    const newEndDateTime = new Date(newStartDateTime);
    newEndDateTime.setHours(newStartDateTime.getHours() + 1);

    console.log('🔄 Déplacement de la tâche:', {
      taskId,
      nouvelEmployeId,
      newStartDateTime: newStartDateTime.toISOString(),
      newEndDateTime: newEndDateTime.toISOString()
    });

    // Mettre à jour la tâche dans employee_schedule
    const { data, error } = await supabase
      .from('employee_schedule')
      .update({
        user_id: nouvelEmployeId,
        start_datetime: newStartDateTime.toISOString(),
        end_datetime: newEndDateTime.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select();

    if (error) {
      console.error('❌ Erreur Supabase lors du déplacement:', error);
      throw new Error(`Erreur lors du déplacement: ${error.message}`);
    }

    console.log('✅ Tâche déplacée avec succès:', data);
    return data;

  } catch (error) {
    console.error('❌ Erreur lors du déplacement de la tâche:', error);
    throw error;
  }
};