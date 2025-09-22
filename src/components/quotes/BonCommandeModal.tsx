import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Camera, Upload, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BonCommandeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string;
  quoteReference: string;
}

const BonCommandeModal = ({ open, onOpenChange, quoteId, quoteReference }: BonCommandeModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleValidate = async () => {
    if (!selectedFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Créer un nom de fichier unique
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `bon-commande-${quoteReference}-${Date.now()}.${fileExtension}`;
      const filePath = `bon-commande/${fileName}`;

      // Upload du fichier vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      toast({
        title: "Succès",
        description: `Bon de commande associé au devis ${quoteReference} avec succès.`
      });

      // Reset et fermer la modal
      setSelectedFile(null);
      setPreviewUrl(null);
      onOpenChange(false);

    } catch (error: any) {
      console.error('Erreur lors de l\'upload:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'uploader le bon de commande.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onOpenChange(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un bon de commande</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ajoutez un bon de commande pour le devis n°{quoteReference}
          </p>

          {!selectedFile ? (
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex-col gap-2"
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                <Upload className="w-6 h-6" />
                Importer un fichier
              </Button>
              
              <Button 
                variant="outline" 
                className="h-24 flex-col gap-2"
                onClick={handleCameraClick}
                disabled={isUploading}
              >
                <Camera className="w-6 h-6" />
                Prendre une photo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">{selectedFile.name}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {previewUrl && selectedFile.type.startsWith('image/') && (
                  <div className="mt-2">
                    <img 
                      src={previewUrl} 
                      alt="Aperçu" 
                      className="max-w-full h-32 object-contain rounded border"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isUploading}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleValidate}
              disabled={!selectedFile || isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Upload en cours...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Valider
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Inputs cachés pour les fichiers */}
        <Input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
};

export default BonCommandeModal;