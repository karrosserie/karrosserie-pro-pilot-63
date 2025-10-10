import { supabase } from '@/integrations/supabase/client';

export interface VehiclePhoto {
  id: string;
  vehicle_id: string;
  company_id: string;
  employee_id: string;
  photo_type: string;
  file_url: string;
  file_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PhotoResult {
  success: boolean;
  photoUrl?: string;
  error?: string;
}

export const uploadVehiclePhoto = async (
  vehicleId: string,
  employeeId: string,
  companyId: string,
  photoBlob: Blob,
  description?: string
): Promise<PhotoResult> => {
  try {
    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const fileName = `vehicle_${vehicleId}_${timestamp}.jpg`;
    const filePath = `${companyId}/vehicles/${vehicleId}/${fileName}`;

    // Upload de l'image vers Supabase Storage (bucket employee-tasks)
    console.log('📤 Uploading vehicle photo to employee-tasks bucket:', filePath);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('employee-tasks')
      .upload(filePath, photoBlob, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Erreur upload storage:', uploadError);
      return { success: false, error: 'Erreur lors de l\'upload de l\'image' };
    }

    console.log('✅ Photo uploaded successfully:', uploadData);

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('employee-tasks')
      .getPublicUrl(filePath);
    
    console.log('🔗 Public URL generated:', publicUrl);

    // Sauvegarder en base de données
    const { error: dbError } = await supabase
      .from('vehicle_photos')
      .insert({
        vehicle_id: vehicleId,
        employee_id: employeeId,
        company_id: companyId,
        photo_type: 'workshop',
        file_url: publicUrl,
        file_name: fileName,
        description: description
      });

    if (dbError) {
      console.error('❌ Erreur sauvegarde DB:', dbError);
      // Supprimer le fichier si l'insertion DB échoue
      console.log('🗑️ Rolling back uploaded file...');
      await supabase.storage.from('employee-tasks').remove([filePath]);
      return { success: false, error: 'Erreur lors de la sauvegarde' };
    }

    console.log('✅ Vehicle photo saved successfully to database');

    return { success: true, photoUrl: publicUrl };
  } catch (error) {
    console.error('Erreur générale:', error);
    return { success: false, error: 'Erreur inattendue' };
  }
};

export const getVehiclePhotos = async (vehicleId: string): Promise<VehiclePhoto[]> => {
  try {
    const { data, error } = await supabase
      .from('vehicle_photos')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur récupération photos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur générale:', error);
    return [];
  }
};

export const deleteVehiclePhoto = async (photoId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('vehicle_photos')
      .delete()
      .eq('id', photoId);

    if (error) {
      console.error('Erreur suppression photo:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur générale:', error);
    return false;
  }
};