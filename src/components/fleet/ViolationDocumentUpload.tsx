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
  onDocumentAnalyzed?: (data: any) => void;
  violationId?: string;
  companyId?: string;
}

export const ViolationDocumentUpload: React.FC<ViolationDocumentUploadProps> = ({
  documentUrl,
  onDocumentChange,
  onDocumentRemove,
  onDocumentAnalyzed,
  violationId,
  companyId
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

      // Call the analyze function if it's an image and we have companyId
      // We can analyze even without violationId during creation
      if (file.type.startsWith('image/') && companyId) {
        await analyzeViolation(urlData.publicUrl);
      }
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

  const analyzeViolation = async (documentUrl: string) => {
    if (!companyId) return;

    try {
      console.log('Starting document analysis:', { documentUrl, companyId, violationId });
      
      toast({
        title: "Analyse en cours...",
        description: "Extraction des informations du document en cours."
      });

      const { data, error } = await supabase.functions.invoke('analyze-violation-simple', {
        body: {
          violationId: violationId || null, // Allow null for new violations
          documentUrl,
          companyId
        }
      });

      console.log('Analysis response:', { data, error });

      if (error) {
        console.error('Analysis error:', error);
        throw error;
      }

      if (data?.success && onDocumentAnalyzed) {
        console.log('Analysis successful, calling onDocumentAnalyzed with:', data.extractedData);
        onDocumentAnalyzed(data.extractedData);
        toast({
          title: "Analyse terminée",
          description: "Les informations ont été extraites automatiquement de l'image."
        });
      } else if (data?.extractedData && onDocumentAnalyzed) {
        // Fallback: even if success is not explicitly true, use extracted data if available
        console.log('Analysis data available, calling onDocumentAnalyzed with:', data.extractedData);
        onDocumentAnalyzed(data.extractedData);
        toast({
          title: "Analyse terminée",
          description: "Les informations ont été extraites automatiquement de l'image."
        });
      } else {
        console.log('No analysis data available or callback missing:', { 
          hasData: !!data?.extractedData, 
          hasCallback: !!onDocumentAnalyzed,
          data 
        });
        toast({
          title: "Analyse terminée",
          description: "Aucune donnée n'a pu être extraite du document.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error analyzing violation:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser l'image automatiquement. Détails: " + (error as Error).message,
        variant: "destructive"
      });
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

        // Call the analyze function if we have companyId
        if (companyId) {
          await analyzeViolation(urlData.publicUrl);
        }
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

  const handleViewDocument = async () => {
    if (!documentUrl) return;

    try {
      // For better compatibility, try to download the file and create a blob URL
      const urlParts = documentUrl.split('/');
      const filePath = urlParts.slice(-2).join('/'); // Get last two parts (user_id/filename)
      
      console.log('Attempting to view document:', filePath);
      
      // Download the file as blob
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('violations')
        .download(filePath);

      if (downloadError) {
        console.error('Download error:', downloadError);
        throw downloadError;
      }

      if (fileData) {
        // Create blob URL and open in new tab
        const blobUrl = URL.createObjectURL(fileData);
        const newWindow = window.open(blobUrl, '_blank');
        
        // Clean up blob URL after a delay
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 60000);

        if (!newWindow) {
          toast({
            title: "Bloqueur de fenêtres",
            description: "Veuillez autoriser les fenêtres contextuelles pour voir le document.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      toast({
        title: "Erreur d'accès",
        description: "Impossible d'accéder au document. Vérifiez vos extensions de navigateur (bloqueurs de pub).",
        variant: "destructive"
      });
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