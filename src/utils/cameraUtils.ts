import { Camera, CameraResultType, CameraSource, CameraPermissionState } from '@capacitor/camera';
import { supabase } from '@/integrations/supabase/client';

export interface PhotoResult {
  success: boolean;
  photoUrl?: string;
  error?: string;
}

const checkAndRequestPermissions = async (): Promise<boolean> => {
  try {
    // Vérifier les permissions actuelles
    const permission = await Camera.checkPermissions();
    
    if (permission.camera === 'granted') {
      return true;
    }
    
    // Demander les permissions si nécessaire
    if (permission.camera === 'prompt' || permission.camera === 'prompt-with-rationale') {
      const requestResult = await Camera.requestPermissions();
      return requestResult.camera === 'granted';
    }
    
    return false;
  } catch (error) {
    console.error('Erreur permissions caméra:', error);
    return false;
  }
};

export const takeTaskPhoto = async (userId: string, taskId: string, type: 'start' | 'end'): Promise<PhotoResult> => {
  try {
    // Vérifier et demander les permissions
    const hasPermission = await checkAndRequestPermissions();
    
    if (!hasPermission) {
      return { 
        success: false, 
        error: 'Permission d\'accès à la caméra refusée. Veuillez autoriser l\'accès dans les paramètres de l\'application.' 
      };
    }

    // Prendre la photo
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      width: 800,
      height: 600
    });

    if (!image.dataUrl) {
      return { success: false, error: 'Impossible de capturer la photo' };
    }

    // Convertir dataUrl en blob
    const response = await fetch(image.dataUrl);
    const blob = await response.blob();

    // Créer le nom du fichier
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${userId}/${taskId}_${type}_${timestamp}.jpg`;

    // Uploader vers Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('employee-tasks')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (uploadError) {
      console.error('Erreur upload:', uploadError);
      return { success: false, error: 'Erreur lors de l\'upload de la photo' };
    }

    // Obtenir l'URL publique
    const { data: urlData } = supabase.storage
      .from('employee-tasks')
      .getPublicUrl(fileName);

    return { success: true, photoUrl: urlData.publicUrl };

  } catch (error: any) {
    console.error('Erreur prise de photo:', error);
    
    // Gérer les erreurs spécifiques
    if (error?.message?.includes('cancelled')) {
      return { success: false, error: 'Prise de photo annulée' };
    }
    
    return { success: false, error: 'Erreur lors de la prise de photo' };
  }
};