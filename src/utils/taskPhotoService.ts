import { supabase } from '@/integrations/supabase/client';

export interface TaskPhoto {
  id: string;
  task_id: string;
  employee_id: string;
  company_id: string;
  vehicle_id: string;
  photo_type: 'start' | 'end';
  file_url: string;
  file_name: string;
  created_at: string;
}

// Constantes pour le mode test
const TEST_USER_ID = 'test1234-1234-1234-1234-123456789abc';
const TEST_EMPLOYEE_ID = 'emp12345-1234-1234-1234-123456789abc';

// Fonction pour simuler temporairement un utilisateur authentifié
function simulateAuthUser() {
  // Créer un objet user temporaire pour les besoins du test
  return {
    id: TEST_USER_ID,
    email: 'test@carrosserie.dev',
    aud: 'authenticated',
    role: 'authenticated',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export async function uploadTaskPhoto(
  taskId: string,
  employeeId: string,
  companyId: string,
  vehicleId: string,
  photoType: 'start' | 'end',
  photoBlob: Blob
): Promise<{ success: boolean; photo?: TaskPhoto; error?: string }> {
  console.log('🔄 [taskPhotoService] Starting photo upload:', {
    taskId,
    employeeId,
    companyId,
    vehicleId,
    photoType,
    blobSize: photoBlob.size
  });

  try {
    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('❌ [taskPhotoService] User not authenticated');
      return { success: false, error: 'Utilisateur non connecté' };
    }

    // Validations strictes
    if (!companyId) {
      console.error('❌ [taskPhotoService] Invalid company ID');
      return { success: false, error: 'ID d\'entreprise non valide' };
    }

    if (!vehicleId) {
      console.error('❌ [taskPhotoService] Invalid vehicle ID');
      return { success: false, error: 'ID de véhicule manquant' };
    }

    if (!taskId) {
      console.error('❌ [taskPhotoService] Invalid task ID');
      return { success: false, error: 'ID de tâche manquant' };
    }

    // Create unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${taskId}_${employeeId}_${timestamp}_${photoType}.jpg`;
    const filePath = `task_photos/${fileName}`;

    console.log('📁 [taskPhotoService] Uploading to storage:', {
      fileName,
      filePath,
      bucket: 'documents'
    });

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, photoBlob, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ [taskPhotoService] Storage upload error:', uploadError);
      return { success: false, error: `Erreur upload: ${uploadError.message}` };
    }

    console.log('✅ [taskPhotoService] File uploaded successfully:', uploadData?.path);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      console.error('❌ [taskPhotoService] Failed to generate public URL');
      return { success: false, error: 'Impossible de générer l\'URL publique' };
    }

    console.log('🔗 [taskPhotoService] Public URL generated:', urlData.publicUrl);

    // Save metadata to database
    const photoRecord = {
      task_id: taskId,
      employee_id: employeeId,
      company_id: companyId,
      vehicle_id: vehicleId,
      photo_type: photoType,
      file_url: urlData.publicUrl,
      file_name: fileName
    };

    console.log('💾 [taskPhotoService] Saving to database:', photoRecord);

    const { data: photoData, error: dbError } = await supabase
      .from('task_photos')
      .insert(photoRecord)
      .select()
      .single();

    if (dbError) {
      console.error('❌ [taskPhotoService] Database insert error:', dbError);
      // Try to cleanup uploaded file
      await supabase.storage.from('documents').remove([filePath]);
      return { success: false, error: `Erreur BDD: ${dbError.message}` };
    }

    console.log('✅ [taskPhotoService] Photo saved successfully:', photoData?.id);

    return { success: true, photo: photoData as TaskPhoto };
  } catch (error) {
    console.error('💥 [taskPhotoService] Upload task photo error:', error);
    return { success: false, error: 'Erreur inattendue lors de l\'upload' };
  }
}

export async function getTaskPhotos(taskId: string, photoType?: 'start' | 'end'): Promise<TaskPhoto[]> {
  try {
    let query = supabase
      .from('task_photos')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });

    if (photoType) {
      query = query.eq('photo_type', photoType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des photos de tâche:', error);
      return [];
    }

    return (data as TaskPhoto[]) || [];
  } catch (error) {
    console.error('Erreur générale:', error);
    return [];
  }
}

export async function getTaskPhotosByVehicle(vehicleId: string, photoType?: 'start' | 'end'): Promise<TaskPhoto[]> {
  try {
    let query = supabase
      .from('task_photos')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('created_at', { ascending: false });

    if (photoType) {
      query = query.eq('photo_type', photoType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des photos de tâche par véhicule:', error);
      return [];
    }

    return (data as TaskPhoto[]) || [];
  } catch (error) {
    console.error('Erreur générale:', error);
    return [];
  }
}

export async function deleteTaskPhoto(photoId: string): Promise<boolean> {
  try {
    // Get photo details first
    const { data: photo, error: fetchError } = await supabase
      .from('task_photos')
      .select('file_name')
      .eq('id', photoId)
      .single();

    if (fetchError || !photo) {
      console.error('Error fetching photo for deletion:', fetchError);
      return false;
    }

    // Delete from storage
    const filePath = `task_photos/${photo.file_name}`;
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([filePath]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('task_photos')
      .delete()
      .eq('id', photoId);

    if (dbError) {
      console.error('Database deletion error:', dbError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete task photo error:', error);
    return false;
  }
}