
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { expertiseReportsService } from '@/services/supabase/expertise-reports';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { useCompanyId } from '@/hooks/use-company-id';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { MovingCar } from '@/components/ui/moving-car';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ExpertiseReportUploaderProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export const ExpertiseReportUploader = ({
  onSuccess,
  onCancel,
  className
}: ExpertiseReportUploaderProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { createReport } = useExpertiseReports();
  const { companyId } = useCompanyId();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [pendingSuccess, setPendingSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const uploadExpertiseReport = async () => {
    if (!selectedFile || !user) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier et vous connecter pour télécharger un rapport d'expertise.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      console.log('Starting expertise report upload...', { 
        fileName: selectedFile.name, 
        fileSize: selectedFile.size, 
        userId: user.id 
      });

      // 1. Générer un nom unique pour le fichier
      const fileExt = selectedFile.name.split('.').pop();
      const reportId = uuidv4();
      const fileName = `${reportId}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/expertise_reports/${fileName}`;

      console.log('Uploading to documents bucket with path:', filePath);

      // 2. Télécharger le fichier dans le bucket documents avec sous-dossier expertise_reports
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      // 3. Obtenir l'URL publique
      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', publicUrlData.publicUrl);

      // 4. Créer une entrée dans expertise_reports
      const newReport = await createReport.mutateAsync({
        document_url: publicUrlData.publicUrl,
        status: 'Importé',
        company_id: companyId
      });

      console.log('Expertise report created:', newReport);
      
      // Onboarding : Rapport importé
      if (newReport?.id) {
        const { onboardingService } = await import('@/services/onboarding/OnboardingService');
        onboardingService.updateOnboardingStep('tunnel2', 'reportImported', { reportId: newReport.id });
        
        // Créer un message de félicitations pour l'utilisateur
        const onboardingState = onboardingService.getOnboardingState();
        if (onboardingState?.id) {
          try {
            console.log('[ExpertiseReportUploader] Creating congratulation message...');
            await supabase
              .from('ai_messages_history')
              .insert({
                session_id: onboardingState.id,
                read: false,
                message: {
                  type: 'ai',
                  content: '🎉 Félicitations ! Votre rapport d\'expertise a été importé avec succès et est en cours d\'analyse. Le système va automatiquement extraire les informations et créer le client, le véhicule et le devis.',
                  tool_calls: [],
                  additional_kwargs: {},
                  response_metadata: {},
                  invalid_tool_calls: []
                }
              });
            console.log('[ExpertiseReportUploader] Congratulation message created');
          } catch (error) {
            console.error('[ExpertiseReportUploader] Error creating congratulation message:', error);
          }
        }
      }

      // 5. Créer une entrée dans la table imports avec le status "En cours d'analyse"
      const { data: importData, error: importError } = await supabase
        .from('imports')
        .insert({
          report_id: null,
          status: 'En cours d\'analyse',
          company_id: companyId,
          document: selectedFile.name
        })
        .select()
        .single();

      if (importError) {
        console.error('Error creating import entry:', importError);
        throw importError;
      }

      console.log('Import entry created:', importData);

      // 6. Appel API externe pour traitement du document
      try {
        console.log('Calling external API for document processing...');
        const apiResponse = await fetch('https://n8n.karrosserie.pro/webhook/38917be3-c64c-46ff-82f9-7959ece86242', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            URL: publicUrlData.publicUrl,
            companyId: companyId,
            importId: importData.id
          }),
        });

        if (!apiResponse.ok) {
          console.error('External API call failed:', apiResponse.status, apiResponse.statusText);
          throw new Error(`API call failed: ${apiResponse.status}`);
        } else {
          console.log('External API call successful');
        }
      } catch (apiError) {
        console.error('Error calling external API:', apiError);
        throw apiError;
      }


      // Afficher la pop-up de félicitations
      setShowSuccessDialog(true);
      setPendingSuccess(true);

      // Rediriger vers la page des rapports d'expertise si on ne s'y trouve pas déjà
      if (!location.pathname.includes('/documents/expertise')) {
        navigate('/documents/expertise');
      }

      // onSuccess sera appelé quand l'utilisateur fermera la pop-up
    } catch (error: any) {
      console.error("Erreur lors de l'importation du rapport:", error);
      toast({
        title: "Erreur",
        description: `Impossible d'importer le rapport d'expertise: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    if (pendingSuccess && onSuccess) {
      onSuccess();
      setPendingSuccess(false);
    }
  };

  return (
    <>
      <AlertDialog open={showSuccessDialog} onOpenChange={handleCloseSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">🎉 Félicitations !</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Votre rapport d'expertise a été importé avec succès.
              <br /><br />
              karrosserie.pro va vous créer entièrement votre devis, créer le client ainsi que la voiture avec tous les détails.
              <br /><br />
              Maintenant tu peux transformer ton devis en ordre de réparation signé par le client.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleCloseSuccessDialog}>
              Compris
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className={className}>
        {/* Fenêtre d'attente - temporairement désactivée
      {isUploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <MovingCar className="mx-auto mb-4" size={48} />
            <h3 className="text-lg font-semibold mb-2">Analyse en cours</h3>
            <p className="text-muted-foreground">
              Veuillez patienter pendant que notre IA analyse votre rapport d'expertise...
            </p>
          </div>
        </div>
      )}
      */}
      
      {selectedFile ? (
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center w-full p-3 sm:p-4 border-2 border-gray-300 border-solid rounded-md">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm sm:text-base truncate">{selectedFile.name}</p>
              <p className="text-xs sm:text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedFile(null)}
              disabled={isUploading}
              className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-col xs:flex-row gap-2 w-full xs:w-auto">
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={isUploading}
              className="w-full xs:w-auto"
            >
              Annuler
            </Button>
            <Button 
              onClick={uploadExpertiseReport}
              disabled={isUploading}
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white w-full xs:w-auto"
            >
              Importer
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3 text-gray-400" />
          <p className="mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-gray-700 text-center">
            Cliquez ou glissez-déposez un fichier
          </p>
          <p className="text-xs text-gray-500 text-center">
            PDF, JPEG, PNG jusqu'à 10MB
          </p>
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            accept=".pdf,.jpg,.jpeg,.png" 
            onChange={handleFileChange}
          />
        </div>
      )}
      </div>
    </>
  );
};
