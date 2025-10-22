import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { Quote } from '@/services/supabase/quotes';
import { useQuoteModificatif } from '@/hooks/use-quote-modificatif';
import { useStorage } from '@/hooks/use-storage';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, FileCheck } from 'lucide-react';

interface AttachModificatifDialogProps {
  quote: Quote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AttachModificatifDialog = ({
  quote,
  open,
  onOpenChange,
}: AttachModificatifDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { attachModificatif } = useQuoteModificatif();
  const { uploadDocument } = useStorage();
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleUploadAndAttach = async () => {
    if (!selectedFile || !quote) return;

    setIsUploading(true);
    try {
      // 1. Uploader le fichier dans le storage
      const filePath = await uploadDocument(selectedFile, 'expertise_reports', quote.id);
      
      if (!filePath) {
        throw new Error("Échec de l'upload du fichier");
      }

      // 2. Créer un enregistrement dans expertise_reports
      const { data: reportData, error: reportError } = await supabase
        .from('expertise_reports')
        .insert({
          company_id: quote.company_id,
          client_id: quote.client_id,
          vehicle_id: quote.vehicle_id,
          report_type: 'modificatif',
          report_number: `MOD-${quote.reference}`,
          amount: quote.amount,
          status: 'Importé',
          document_url: filePath,
          claim_number: quote.claim_number,
          policy_number: quote.policy_number,
          report_date: new Date().toISOString(),
          expert_name: quote.expert_name,
          incident_date: quote.incident_date,
        })
        .select()
        .single();

      if (reportError) throw reportError;

      // 3. Attacher le rapport modificatif au devis
      await attachModificatif(quote.id, reportData.id);

      toast({
        title: 'Rapport modificatif attaché',
        description: 'Le rapport modificatif a été enregistré et associé au devis avec succès.',
      });

      setSelectedFile(null);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error uploading modificatif:', error);
      toast({
        title: 'Erreur',
        description: `Impossible d'attacher le rapport modificatif: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!quote) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-success" />
            Joindre le rapport modificatif
          </DialogTitle>
          <DialogDescription>
            Associez le rapport modificatif reçu de l'expert au devis n°{quote.reference}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Informations du devis */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Devis:</span>
              <span className="font-medium">N°{quote.reference}</span>
            </div>
            {quote.vehicles && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Véhicule:</span>
                <span className="font-medium">
                  {quote.vehicles.car_brands?.name} {quote.vehicles.car_models?.name} - {quote.vehicles.license_plate}
                </span>
              </div>
            )}
            {quote.claim_number && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">N° sinistre:</span>
                <span className="font-medium">{quote.claim_number}</span>
              </div>
            )}
          </div>

          {/* Upload du fichier */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Fichier PDF du rapport modificatif
            </label>
            <FileUpload
              onUpload={handleFileSelect}
              accept="application/pdf"
              maxSize={10 * 1024 * 1024} // 10MB
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Fichier sélectionné: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleUploadAndAttach}
            disabled={!selectedFile || isUploading}
            className="bg-success hover:bg-success/90"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <FileCheck className="mr-2 h-4 w-4" />
                Attacher le rapport
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
