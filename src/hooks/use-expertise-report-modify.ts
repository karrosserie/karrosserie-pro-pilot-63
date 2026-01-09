import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { expertiseReportsService, ExpertiseReport } from '@/services/supabase/expertise-reports';
import { useCompanyId } from '@/hooks/use-company-id';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { useDetailedTracking } from '@/hooks/tracking/useDetailedTracking';

interface Dependencies {
  hasSignedRepairOrder: boolean;
  quotes: { id: string; reference: string }[];
  repairOrders: { id: string; reference: string; status: string }[];
}

export function useExpertiseReportModify() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { companyId } = useCompanyId();
  const { user } = useAuth();
  const { trackAction } = useDetailedTracking();
  const [isCheckingDependencies, setIsCheckingDependencies] = useState(false);

  // Vérifier les dépendances d'un rapport
  const checkDependencies = async (reportId: string): Promise<Dependencies> => {
    setIsCheckingDependencies(true);
    try {
      return await expertiseReportsService.checkDependencies(reportId);
    } finally {
      setIsCheckingDependencies(false);
    }
  };

  // Convertir un fichier en base64
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

  // Mutation pour modifier le document
  const modifyReport = useMutation({
    mutationFn: async ({ report, file }: { report: ExpertiseReport; file: File }) => {
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // 1. Convertir le fichier en base64
      console.log('📄 Conversion du fichier en base64...');
      const fileBase64 = await fileToBase64(file);
      console.log('✅ Fichier converti en base64, taille:', fileBase64.length, 'caractères');

      // 2. Upload du nouveau fichier
      const fileExt = file.name.split('.').pop();
      const fileName = `${report.id}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/expertise_reports/${fileName}`;

      console.log('📤 Upload du nouveau document:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // 3. Obtenir l'URL publique
      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      console.log('✅ Nouveau document uploadé:', publicUrlData.publicUrl);

      // 4. Mettre à jour le rapport existant (UPDATE, pas INSERT)
      const updatedReport = await expertiseReportsService.modifyDocument(
        report.id,
        publicUrlData.publicUrl
      );

      console.log('✅ Rapport mis à jour:', updatedReport);

      // 5. Créer/mettre à jour l'entrée dans la table imports
      const { data: importData, error: importError } = await supabase
        .from('imports')
        .insert({
          report_id: report.id,
          status: 'En cours d\'analyse',
          company_id: companyId,
          document: file.name
        })
        .select()
        .single();

      if (importError) {
        console.error('Error creating import entry:', importError);
        throw importError;
      }

      console.log('✅ Import créé:', importData);

      // 6. Appeler le webhook n8n avec isUpdate: true
      console.log('📤 Envoi au webhook n8n (modification):', {
        url: publicUrlData.publicUrl,
        companyId,
        importId: importData.id,
        reportId: report.id,
        isUpdate: true
      });

      const apiResponse = await fetch('https://n8n.karrosserie.pro/webhook/aef3a1de-8b92-46bd-8ae4-3e5e11dc554b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          URL: publicUrlData.publicUrl,
          companyId: companyId,
          importId: importData.id,
          fileBase64: fileBase64,
          filename: file.name,
          isUpdate: true,
          reportId: report.id
        }),
      });

      if (!apiResponse.ok) {
        console.error('External API call failed:', apiResponse.status, apiResponse.statusText);
        throw new Error(`API call failed: ${apiResponse.status}`);
      }

      console.log('✅ Webhook n8n appelé avec succès');

      return updatedReport;
    },
    onSuccess: (data, { report }) => {
      queryClient.invalidateQueries({ queryKey: ['expertiseReports'] });
      queryClient.invalidateQueries({ queryKey: ['imports'] });
      
      toast({
        title: "Rapport modifié",
        description: `Le rapport ${report.report_number || report.id} est en cours de ré-analyse.`
      });

      trackAction('expertise_report_updated', {
        report_id: report.id,
        report_number: report.report_number,
        action: 'document_modified'
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: `Impossible de modifier le rapport: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  return {
    modifyReport,
    checkDependencies,
    isCheckingDependencies,
    isModifying: modifyReport.isPending
  };
}
