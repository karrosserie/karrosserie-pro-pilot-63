
import React, { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface DocumentUploaderProps {
  bucketName: string;
  folder?: string;
  onUploadComplete: (url: string, file: File) => void;
  acceptedTypes?: string;
  maxSize?: number;
  className?: string;
}

export const DocumentUploader = ({
  bucketName,
  folder = '',
  onUploadComplete,
  acceptedTypes = ".pdf,.jpg,.jpeg,.png",
  maxSize = 10,
  className
}: DocumentUploaderProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Uploader le fichier dans le bucket
      const { error: uploadError, data } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obtenir l'URL publique du fichier
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Appeler le callback avec l'URL
      onUploadComplete(publicUrl, file);

      toast({
        title: "Fichier téléchargé",
        description: "Le document a été téléchargé avec succès."
      });
    } catch (error: any) {
      console.error("Erreur upload:", error);
      toast({
        title: "Erreur",
        description: `Impossible de télécharger le fichier: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={className}>
      {isUploading ? (
        <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
          <Loader2 className="h-6 w-6 text-karrosserie-orange animate-spin mr-2" />
          <span>Téléchargement en cours...</span>
        </div>
      ) : (
        <FileUpload
          onUpload={handleUpload}
          accept={acceptedTypes}
          maxSize={maxSize}
        />
      )}
    </div>
  );
};
