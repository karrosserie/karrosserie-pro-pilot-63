import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { onboardingService } from '@/services/onboarding/OnboardingService';

/**
 * Hook qui surveille les imports pour détecter la numérisation automatique
 * Doit être utilisé dans un composant monté (ex: layout principal ou page expertise)
 */
export function useOnboardingImportWatcher() {
  const processedImportsRef = useRef<Set<string>>(new Set());

  // Récupérer les imports récents
  const { data: imports } = useQuery({
    queryKey: ['onboarding-import-watcher'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('imports')
        .select('id, status, report_id, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    refetchInterval: 5000, // Vérifier toutes les 5 secondes
  });

  useEffect(() => {
    if (!imports || imports.length === 0) return;

    imports.forEach(async (importRecord) => {
      // Vérifier si cet import a déjà été traité
      if (processedImportsRef.current.has(importRecord.id)) return;

      // Vérifier si l'import est terminé (statut "Terminé", "Completed", "Importé", etc.)
      const completedStatuses = ['Terminé', 'Completed', 'Importé', 'Success'];
      if (!completedStatuses.includes(importRecord.status)) return;

      // Marquer comme traité
      processedImportsRef.current.add(importRecord.id);

      // Récupérer les détails du rapport d'expertise pour obtenir client_id, vehicle_id, etc.
      if (importRecord.report_id) {
        try {
          const { data: report } = await supabase
            .from('expertise_reports')
            .select('id, client_id, vehicle_id')
            .eq('id', importRecord.report_id)
            .single();

          if (report) {
            // Vérifier si un devis a été créé automatiquement
            const { data: quote } = await supabase
              .from('quotes')
              .select('id')
              .eq('report_id', report.id)
              .single();

            // Mettre à jour l'étape d'onboarding
            onboardingService.updateOnboardingStep('tunnel2', 'automaticDigitization', {
              reportId: report.id,
              clientId: report.client_id,
              vehicleId: report.vehicle_id,
              quoteId: quote?.id,
            });

            console.log('[Onboarding] Automatic digitization detected for import:', importRecord.id);
          }
        } catch (error) {
          console.error('[Onboarding] Error fetching report details:', error);
        }
      }
    });
  }, [imports]);

  return null; // Ce hook ne retourne rien, il agit en arrière-plan
}
