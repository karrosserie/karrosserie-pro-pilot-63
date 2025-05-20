
import { supabase } from '@/integrations/supabase/client';

export const storageService = {
  uploadDocument: async (file: File, userId: string, documentType: string, documentId: string) => {
    const filePath = `${userId}/${documentType}/${documentId}/${file.name}`;
    
    const { data, error } = await supabase
      .storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
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
