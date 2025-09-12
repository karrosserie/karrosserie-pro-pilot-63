import { Camera, CameraResultType, CameraSource, CameraPermissionState } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

export interface PhotoResult {
  success: boolean;
  photoUrl?: string;
  error?: string;
}

const checkAndRequestPermissions = async (): Promise<boolean> => {
  try {
    // Sur le web, utiliser l'API native
    if (Capacitor.getPlatform() === 'web') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (error) {
        console.error('Permission caméra web refusée:', error);
        return false;
      }
    }
    
    // Sur mobile, utiliser Capacitor
    const permission = await Camera.checkPermissions();
    
    if (permission.camera === 'granted') {
      return true;
    }
    
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

const takePhotoWeb = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Créer les éléments DOM
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const modal = document.createElement('div');
    const button = document.createElement('button');
    const cancelButton = document.createElement('button');
    
    // Styles pour le modal
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.9);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `;
    
    video.style.cssText = `
      width: 90vw;
      max-width: 400px;
      height: auto;
      border-radius: 8px;
    `;
    
    button.style.cssText = `
      margin: 20px 10px;
      padding: 12px 24px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
    `;
    
    cancelButton.style.cssText = `
      margin: 20px 10px;
      padding: 12px 24px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
    `;
    
    button.textContent = 'Prendre la photo';
    cancelButton.textContent = 'Annuler';
    
    // Ajouter au DOM
    modal.appendChild(video);
    const buttonContainer = document.createElement('div');
    buttonContainer.appendChild(button);
    buttonContainer.appendChild(cancelButton);
    modal.appendChild(buttonContainer);
    document.body.appendChild(modal);
    
    // Démarrer la caméra
    navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment',
        width: { ideal: 800 },
        height: { ideal: 600 }
      } 
    })
    .then(stream => {
      video.srcObject = stream;
      video.play();
      
      button.onclick = () => {
        // Configurer le canvas
        canvas.width = video.videoWidth || 800;
        canvas.height = video.videoHeight || 600;
        
        // Dessiner l'image
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        // Convertir en dataURL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // Nettoyer
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
        
        resolve(dataUrl);
      };
      
      cancelButton.onclick = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
        reject(new Error('Prise de photo annulée'));
      };
    })
    .catch(error => {
      document.body.removeChild(modal);
      reject(error);
    });
  });
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

    let dataUrl: string;

    // Prendre la photo selon la plateforme
    if (Capacitor.getPlatform() === 'web') {
      dataUrl = await takePhotoWeb();
    } else {
      // Mobile avec Capacitor
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
      
      dataUrl = image.dataUrl;
    }

    // Convertir dataUrl en blob
    const response = await fetch(dataUrl);
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
    if (error?.message?.includes('cancelled') || error?.message?.includes('annulée')) {
      return { success: false, error: 'Prise de photo annulée' };
    }
    
    return { success: false, error: 'Erreur lors de la prise de photo' };
  }
};