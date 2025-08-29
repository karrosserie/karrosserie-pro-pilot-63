import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload, File, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

interface ViolationDocumentUploadProps {
  documentUrl?: string;
  onDocumentChange: (url: string) => void;
  onDocumentRemove: () => void;
}

export const ViolationDocumentUpload: React.FC<ViolationDocumentUploadProps> = ({
  documentUrl,
  onDocumentChange,
  onDocumentRemove
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileUpload = async (file: File) => {
    if (!user) return;

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('violations')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('violations')
        .getPublicUrl(data.path);

      onDocumentChange(urlData.publicUrl);
      
      toast({
        title: "Document ajouté",
        description: "Le document a été uploadé avec succès."
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'uploader le document.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Type de fichier non supporté",
          description: "Veuillez sélectionner une image (JPEG, PNG, WebP) ou un PDF.",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille du fichier ne doit pas dépasser 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      handleFileUpload(file);
    }
  };

  const handleTakePhoto = async () => {
    if (!Capacitor.isNativePlatform()) {
      // Fallback for web - trigger file input
      document.getElementById('camera-input')?.click();
      return;
    }

    try {
      setIsUploading(true);
      
      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl && user) {
        // Convert data URL to blob
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        
        // Upload the blob directly with a filename
        const fileName = `${user.id}/${Date.now()}.jpg`;
        
        // Upload directly via storage API
        const { data, error } = await supabase.storage
          .from('violations')
          .upload(fileName, blob, {
            contentType: 'image/jpeg'
          });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('violations')
          .getPublicUrl(data.path);

        onDocumentChange(urlData.publicUrl);
        
        toast({
          title: "Photo ajoutée",
          description: "La photo a été prise et uploadée avec succès."
        });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      toast({
        title: "Erreur",
        description: "Impossible de prendre la photo.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveDocument = async () => {
    if (!documentUrl) return;

    try {
      // Extract file path from URL
      const urlParts = documentUrl.split('/');
      const filePath = urlParts.slice(-2).join('/'); // Get last two parts (user_id/filename)
      
      const { error } = await supabase.storage
        .from('violations')
        .remove([filePath]);

      if (error) throw error;

      onDocumentRemove();
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès."
      });
    } catch (error) {
      console.error('Error removing document:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document.",
        variant: "destructive"
      });
    }
  };

  const handleViewDocument = () => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  };

  const getFileIcon = (url: string) => {
    if (url.toLowerCase().includes('.pdf')) {
      return <File className="h-4 w-4" />;
    }
    return <Eye className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <Label>Document de la contravention</Label>
      
      {!documentUrl ? (
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleTakePhoto}
              disabled={isUploading}
              className="flex-1"
            >
              <Camera className="h-4 w-4 mr-2" />
              {Capacitor.isNativePlatform() ? 'Prendre une photo' : 'Sélectionner une image'}
            </Button>
            
            <div className="flex-1">
              <Input
                id="document-upload"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleInputFileChange}
                disabled={isUploading}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('document-upload')?.click()}
                disabled={isUploading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Uploader un fichier
              </Button>
            </div>
          </div>
          
          {/* Hidden input for camera fallback on web */}
          <input
            id="camera-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleInputFileChange}
            className="hidden"
          />
          
          <p className="text-sm text-muted-foreground">
            Formats acceptés: JPEG, PNG, WebP, PDF (max 10MB)
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-accent/10">
          <div className="flex items-center space-x-2">
            {getFileIcon(documentUrl)}
            <span className="text-sm font-medium">Document ajouté</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleViewDocument}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveDocument}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {isUploading && (
        <div className="text-sm text-muted-foreground">
          Upload en cours...
        </div>
      )}
    </div>
  );
};