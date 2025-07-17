import { supabase } from '@/integrations/supabase/client';

export const storageService = {
  uploadDocument: async (file: File, userId: string, documentType: string, documentId: string) => {
    console.log('Storage service - uploadDocument called with:', { 
      fileName: file.name, 
      fileSize: file.size, 
      userId, 
      documentType, 
      documentId 
    });

    // Vérifier l'authentification
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('Current authenticated user:', user?.id, 'userError:', userError);
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Générer un nom de fichier unique avec timestamp pour éviter les conflits
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileName = `${documentId}_${timestamp}_${randomId}.${fileExt}`;
    const filePath = `${userId}/${documentType}/${fileName}`;
    
    console.log('Generated file path:', filePath);
    
    const { data, error } = await supabase
      .storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Permettre l'écrasement des fichiers
      });
    
    console.log('Upload result:', { data, error });
    
    if (error) {
      console.error('Error uploading document:', error);
      throw new Error(error.message);
    }
    
    const { data: publicUrl } = supabase
      .storage
      .from('documents')
      .getPublicUrl(filePath);
    
    console.log('Generated public URL:', publicUrl.publicUrl);
    
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
