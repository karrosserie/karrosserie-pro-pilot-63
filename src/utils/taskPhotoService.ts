import { supabase } from '@/integrations/supabase/client';

export interface TaskPhoto {
  id: string;
  task_id: string;
  employee_id: string;
  company_id: string;
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
  photoType: 'start' | 'end',
  photoBlob: Blob
): Promise<{ success: boolean; photo?: TaskPhoto; error?: string }> {
  try {
    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    // Vérifier que le companyId est valide
    if (!companyId) {
      return { success: false, error: 'ID d\'entreprise non valide' };
    }
    // Create unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${taskId}_${employeeId}_${timestamp}_${photoType}.jpg`;
    const filePath = `task_photos/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, photoBlob, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return { success: false, error: `Erreur upload: ${uploadError.message}` };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return { success: false, error: 'Impossible de générer l\'URL publique' };
    }

    // Save metadata to database
    const { data: photoData, error: dbError } = await supabase
      .from('task_photos')
      .insert({
        task_id: taskId,
        employee_id: employeeId,
        company_id: companyId,
        photo_type: photoType,
        file_url: urlData.publicUrl,
        file_name: fileName
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Try to cleanup uploaded file
      await supabase.storage.from('documents').remove([filePath]);
      return { success: false, error: `Erreur BDD: ${dbError.message}` };
    }

    return { success: true, photo: photoData as TaskPhoto };
  } catch (error) {
    console.error('Upload task photo error:', error);
    return { success: false, error: 'Erreur inattendue lors de l\'upload' };
  }
}

export async function getTaskPhotos(
  taskId: string,
  photoType?: 'start' | 'end'
): Promise<TaskPhoto[]> {
  try {
    let query = supabase
      .from('task_photos')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (photoType) {
      query = query.eq('photo_type', photoType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching task photos:', error);
      return [];
    }

    return (data as TaskPhoto[]) || [];
  } catch (error) {
    console.error('Get task photos error:', error);
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