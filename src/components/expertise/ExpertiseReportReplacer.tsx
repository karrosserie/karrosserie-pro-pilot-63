import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, RefreshCw, AlertTriangle, FileText, User, Car, Euro, X, Loader2 } from 'lucide-react';
import { useExpertiseReportReplace } from '@/hooks/use-expertise-report-replace';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface ExpertiseReportReplacerProps {
  existingReport: ExpertiseReport;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface Dependencies {
  quotes: { id: string; reference: string; status: string }[];
  repairOrders: { id: string; reference: string; status: string; signed_document_url?: string | null }[];
  hasLinkedDocuments: boolean;
  hasSignedRepairOrder: boolean;
}

export const ExpertiseReportReplacer: React.FC<ExpertiseReportReplacerProps> = ({
  existingReport,
  open,
  onOpenChange,
  onSuccess
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { replaceReport, checkDependencies, isReplacing } = useExpertiseReportReplace();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dependencies, setDependencies] = useState<Dependencies | null>(null);
  const [loadingDeps, setLoadingDeps] = useState(false);

  // Charger les dépendances au montage
  useEffect(() => {
    if (open && existingReport.id) {
      setLoadingDeps(true);
      checkDependencies(existingReport.id)
        .then(setDependencies)
        .catch(console.error)
        .finally(() => setLoadingDeps(false));
    }
  }, [open, existingReport.id]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setDependencies(null);
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Format invalide",
          description: "Veuillez sélectionner un fichier PDF",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleReplace = async () => {
    if (!selectedFile || !user) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier PDF",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // 1. Convertir le fichier en base64
      console.log('📄 Conversion du fichier en base64...');
      const fileBase64 = await fileToBase64(selectedFile);

      // 2. Upload du nouveau fichier
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${uuidv4()}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/expertise_reports/${fileName}`;

      console.log('📤 Upload du nouveau fichier...', filePath);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // 3. Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      console.log('✅ Fichier uploadé:', urlData.publicUrl);

      // 4. Remplacer le rapport
      await replaceReport.mutateAsync({
        reportId: existingReport.id,
        newDocumentUrl: urlData.publicUrl,
        oldDocumentUrl: existingReport.document_url || null,
        documentName: selectedFile.name
      });

      // 5. Créer une entrée import pour l'analyse
      const { data: importData, error: importError } = await supabase
        .from('imports')
        .insert({
          report_id: existingReport.id,
          status: 'En cours d\'analyse',
          document: selectedFile.name,
          company_id: existingReport.company_id
        })
        .select()
        .single();

      if (importError) {
        console.error('Error creating import entry:', importError);
        throw importError;
      }

      console.log('📝 Import entry created:', importData);

      // 6. Appeler le webhook n8n avec flag isUpdate
      try {
        console.log('📤 Envoi au webhook n8n pour mise à jour:', {
          url: urlData.publicUrl,
          companyId: existingReport.company_id,
          importId: importData.id,
          reportId: existingReport.id,
          isUpdate: true
        });
        
        const apiResponse = await fetch('https://n8n.karrosserie.pro/webhook/aef3a1de-8b92-46bd-8ae4-3e5e11dc554b', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            URL: urlData.publicUrl,
            companyId: existingReport.company_id,
            importId: importData.id,
            reportId: existingReport.id,
            fileBase64: fileBase64,
            filename: selectedFile.name,
            isUpdate: true,
            existingClientId: existingReport.client_id,
            existingVehicleId: existingReport.vehicle_id
          }),
        });

        if (!apiResponse.ok) {
          console.error('External API call failed:', apiResponse.status, apiResponse.statusText);
        } else {
          console.log('✅ Webhook n8n appelé avec succès');
        }
      } catch (apiError) {
        console.error('Error calling external API:', apiError);
        // On continue même si le webhook échoue
      }

      toast({
        title: "Modification réussie",
        description: "Le nouveau document est en cours d'analyse par notre IA."
      });

      onSuccess?.();
      onOpenChange(false);
      
    } catch (error: any) {
      console.error('Error replacing report:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de remplacer le rapport",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-';
    return amount.toLocaleString('fr-FR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }) + ' €';
  };

  const isProcessing = isUploading || isReplacing;
  const isBlocked = dependencies?.hasSignedRepairOrder ?? false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-orange-500" />
            Modifier le rapport d'expertise
          </DialogTitle>
          <DialogDescription>
            Importez un nouveau PDF pour mettre à jour ce rapport
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informations du rapport actuel */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Rapport actuel</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="truncate">{existingReport.report_number || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="truncate">
                  {existingReport.clients 
                    ? `${existingReport.clients.first_name} ${existingReport.clients.last_name}`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-gray-400" />
                <span className="truncate">
                  {existingReport.vehicles?.license_plate || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-gray-400" />
                <span>{formatAmount(existingReport.amount)}</span>
              </div>
            </div>
          </div>

          {/* Alertes dépendances */}
          {loadingDeps && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Vérification des dépendances...
            </div>
          )}

          {/* Alerte si OR signé - bloque la modification */}
          {dependencies?.hasSignedRepairOrder && (
            <Alert variant="destructive" className="border-red-300 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <span className="font-medium">Modification impossible</span>
                <p className="text-sm mt-1">
                  Un ordre de réparation lié à ce rapport a déjà été signé.
                  La modification n'est plus autorisée.
                </p>
              </AlertDescription>
            </Alert>
          )}
          
          {dependencies?.hasLinkedDocuments && !dependencies?.hasSignedRepairOrder && (
            <Alert variant="destructive" className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <span className="font-medium">Ce rapport est lié à:</span>
                {dependencies.quotes?.length > 0 && (
                  <p className="text-sm mt-1">• {dependencies.quotes.length} devis</p>
                )}
                {dependencies.repairOrders?.length > 0 && (
                  <p className="text-sm">• {dependencies.repairOrders.length} ordres de réparation (non signés)</p>
                )}
                <p className="text-xs mt-2 opacity-80">
                  La modification conservera les liens existants.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Avertissement */}
          {!dependencies?.hasSignedRepairOrder && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Cette action remplacera le document PDF et relancera l'analyse automatique.
                Les données actuelles seront mises à jour avec les nouvelles informations extraites.
              </AlertDescription>
            </Alert>
          )}

          {/* Upload zone */}
          <input
            id="file-upload-replace"
            type="file"
            className="hidden"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
          
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !isProcessing && document.getElementById('file-upload-replace')?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
              ${selectedFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-primary hover:bg-gray-50'}
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  disabled={isProcessing}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-10 w-10 mx-auto text-gray-400" />
                <p className="font-medium text-gray-700">Glissez votre nouveau PDF ici</p>
                <p className="text-sm text-gray-500">ou cliquez pour parcourir</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Annuler
            </Button>
            <Button
              onClick={handleReplace}
              disabled={!selectedFile || isProcessing || isBlocked}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Modification en cours...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Modifier le PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
