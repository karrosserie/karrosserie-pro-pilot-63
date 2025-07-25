
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { expertiseReportsService } from '@/services/supabase/expertise-reports';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { MovingCar } from '@/components/ui/moving-car';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';

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
  const navigate = useNavigate();
  const location = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
        user_id: user.id
      });

      console.log('Expertise report created:', newReport);

      // 5. Créer une entrée dans la table imports avec le status "En cours d'analyse"
      const { data: importData, error: importError } = await supabase
        .from('imports')
        .insert({
          report_id: newReport.id,
          status: 'En cours d\'analyse',
          error: null,
          user_id: user.id,
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
            userId: user.id,
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

      toast({
        title: "Rapport importé",
        description: "Le rapport d'expertise a été importé avec succès."
      });

      // Rediriger vers la page des rapports d'expertise si on ne s'y trouve pas déjà
      if (!location.pathname.includes('/documents/expertise')) {
        navigate('/documents/expertise');
      }

      if (onSuccess) {
        onSuccess();
      }
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

  return (
    <div className={className}>
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
      
      {selectedFile ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center w-full p-4 border-2 border-gray-300 border-solid rounded-md">
            <FileText className="w-8 h-8 mr-3 text-blue-600" />
            <div className="flex-1">
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedFile(null)}
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={isUploading}
            >
              Annuler
            </Button>
            <Button 
              onClick={uploadExpertiseReport}
              disabled={isUploading}
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white"
            >
              {isUploading ? (
                <>
                  <MovingCar className="mr-2" size={16} />
                  Analyse en cours...
                </>
              ) : (
                'Importer'
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="w-12 h-12 mb-3 text-gray-400" />
          <p className="mb-2 text-sm font-medium text-gray-700">
            Cliquez ou glissez-déposez un fichier
          </p>
          <p className="text-xs text-gray-500">
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
  );
};
