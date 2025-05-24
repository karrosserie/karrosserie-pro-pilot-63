
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { expertiseReportsService } from '@/services/supabase/expertise-reports';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
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
      const filePath = `${user.id}/${fileName}`;

      console.log('Uploading to expertise_reports bucket with path:', filePath);

      // 2. Télécharger le fichier dans le bucket expertise_reports
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('expertise_reports')
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
        .from('expertise_reports')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', publicUrlData.publicUrl);

      // 4. Créer l'entrée dans la base de données
      const reportReference = `RE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      await createReport.mutateAsync({
        id: reportId,
        user_id: user.id,
        reference: reportReference,
        document_url: publicUrlData.publicUrl,
        status: 'Importé'
      });

      console.log('Database entry created successfully');

      toast({
        title: "Rapport importé",
        description: "Le rapport d'expertise a été importé avec succès."
      });

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
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importation...
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
