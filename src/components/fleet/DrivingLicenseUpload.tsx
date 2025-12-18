import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload, Trash2, Eye, FileImage } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { AIAnalysisModal } from './AIAnalysisModal';

interface DrivingLicenseUploadProps {
  frontUrl?: string;
  backUrl?: string;
  onFrontChange: (url: string) => void;
  onBackChange: (url: string) => void;
  onFrontRemove: () => void;
  onBackRemove: () => void;
  onLicenseAnalyzed?: (data: any) => void;
  clientId?: string;
}

export const DrivingLicenseUpload: React.FC<DrivingLicenseUploadProps> = ({
  frontUrl,
  backUrl,
  onFrontChange,
  onBackChange,
  onFrontRemove,
  onBackRemove,
  onLicenseAnalyzed,
  clientId
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileUpload = async (file: File, isFront: boolean) => {
    if (!user) return;

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const side = isFront ? 'front' : 'back';
      const fileName = `${user.id}/license_${side}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(data.path);

      if (isFront) {
        onFrontChange(urlData.publicUrl);
        // Only analyze the front side of the license
        if (clientId) {
          await analyzeLicense(urlData.publicUrl);
        }
      } else {
        onBackChange(urlData.publicUrl);
      }
      
      toast({
        title: "Document ajouté",
        description: `Le ${isFront ? 'recto' : 'verso'} du permis a été uploadé avec succès.`
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

  const analyzeLicense = async (documentUrl: string) => {
    if (!clientId) return;

    try {
      setIsAnalyzing(true);
      
      const { data, error } = await supabase.functions.invoke('analyze-driving-license', {
        body: {
          clientId,
          documentUrl
        }
      });

      if (error) throw error;

      if (data?.success && onLicenseAnalyzed) {
        onLicenseAnalyzed(data.extractedData);
        toast({
          title: "Analyse terminée",
          description: "Les informations du permis ont été extraites automatiquement."
        });
      }
    } catch (error) {
      console.error('Error analyzing license:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser le permis automatiquement.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>, isFront: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type - now accepts PDFs as well
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
      
      handleFileUpload(file, isFront);
    }
  };

  const handleTakePhoto = async (isFront: boolean) => {
    if (!Capacitor.isNativePlatform()) {
      // Fallback for web - trigger file input
      document.getElementById(`camera-input-${isFront ? 'front' : 'back'}`)?.click();
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
        const side = isFront ? 'front' : 'back';
        const fileName = `${user.id}/license_${side}_${Date.now()}.jpg`;
        
        const { data, error } = await supabase.storage
          .from('documents')
          .upload(fileName, blob, {
            contentType: 'image/jpeg'
          });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(data.path);

        if (isFront) {
          onFrontChange(urlData.publicUrl);
          if (clientId) {
            await analyzeLicense(urlData.publicUrl);
          }
        } else {
          onBackChange(urlData.publicUrl);
        }
        
        toast({
          title: "Photo ajoutée",
          description: `Le ${isFront ? 'recto' : 'verso'} du permis a été photographié avec succès.`
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

  const handleRemoveDocument = async (documentUrl: string, isFront: boolean) => {
    if (!documentUrl) return;

    try {
      // Extract file path from URL
      const urlParts = documentUrl.split('/');
      const filePath = urlParts.slice(-2).join('/'); // Get last two parts (user_id/filename)
      
      const { error } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (error) throw error;

      if (isFront) {
        onFrontRemove();
      } else {
        onBackRemove();
      }
      
      toast({
        title: "Document supprimé",
        description: `Le ${isFront ? 'recto' : 'verso'} du permis a été supprimé avec succès.`
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

  const handleViewDocument = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const renderUploadSection = (
    title: string,
    documentUrl: string | undefined,
    isFront: boolean,
    isRequired: boolean = false
  ) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <FileImage className="h-4 w-4" />
        {title} {isRequired && <span className="text-destructive">*</span>}
      </Label>
      
      {!documentUrl ? (
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleTakePhoto(isFront)}
              disabled={isUploading || isAnalyzing}
              className="flex-1"
            >
              <Camera className="h-4 w-4 mr-2" />
              {Capacitor.isNativePlatform() ? 'Photographier' : 'Sélectionner'}
            </Button>
            
            <div className="flex-1">
              <Input
                id={`document-upload-${isFront ? 'front' : 'back'}`}
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleInputFileChange(e, isFront)}
                disabled={isUploading || isAnalyzing}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById(`document-upload-${isFront ? 'front' : 'back'}`)?.click()}
                disabled={isUploading || isAnalyzing}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Uploader
              </Button>
            </div>
          </div>
          
          {/* Hidden input for camera fallback on web */}
          <input
            id={`camera-input-${isFront ? 'front' : 'back'}`}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => handleInputFileChange(e, isFront)}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-accent/10">
          <div className="flex items-center space-x-2">
            <FileImage className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{title} ajouté</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleViewDocument(documentUrl)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveDocument(documentUrl, isFront)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderUploadSection("Recto du permis", frontUrl, true, true)}
        {renderUploadSection("Verso du permis", backUrl, false)}
      </div>
      
      <p className="text-sm text-muted-foreground">
        Formats acceptés: JPEG, PNG, WebP, PDF (max 10MB)
      </p>
      
      {(isUploading || isAnalyzing) && (
        <div className="text-sm text-muted-foreground">
          {isAnalyzing ? 'Analyse IA en cours...' : 'Upload en cours...'}
        </div>
      )}

      <AIAnalysisModal 
        open={isAnalyzing}
        title="Analyse du permis en cours"
        description="Lecture et extraction des informations du permis de conduire..."
      />
    </div>
  );
};