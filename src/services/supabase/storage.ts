import { supabase } from '@/integrations/supabase/client';

export const storageService = {
  uploadDocument: async (file: File, userId: string, documentType: string, documentId: string) => {
    // Générer un nom de fichier unique avec timestamp pour éviter les conflits
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileName = `${documentId}_${timestamp}_${randomId}.${fileExt}`;
    const filePath = `${userId}/${documentType}/${fileName}`;
    
    const { data, error } = await supabase
      .storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Permettre l'écrasement des fichiers
      });
    
    if (error) {
      console.error('Error uploading document:', error);
      throw new Error(error.message);
    }
    
    const { data: publicUrl } = supabase
      .storage
      .from('documents')
      .getPublicUrl(filePath);
    
    return publicUrl.publicUrl;
  },
  
  getDocumentUrl: (filePath: string) => {
    const { data } = supabase
      .storage
      .from('documents')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  },
  
  deleteDocument: async (filePath: string) => {
    const { error } = await supabase
      .storage
      .from('documents')
      .remove([filePath]);
      
    if (error) {
      console.error('Error deleting document:', error);
      throw new Error(error.message);
    }
    
    return true;
  },
  
  listDocuments: async (userId: string, documentType: string, documentId: string) => {
    const prefix = `${userId}/${documentType}/${documentId}/`;
    
    const { data, error } = await supabase
      .storage
      .from('documents')
      .list(prefix);
      
    if (error) {
      console.error('Error listing documents:', error);
      throw new Error(error.message);
    }
    
    return data;
  }
};
