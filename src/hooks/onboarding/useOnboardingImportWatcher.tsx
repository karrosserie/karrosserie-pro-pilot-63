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
    console.log('[OnboardingWatcher] useEffect triggered, imports:', imports);
    
    if (!imports || imports.length === 0) {
      console.log('[OnboardingWatcher] No imports found');
      return;
    }

    imports.forEach(async (importRecord) => {
      console.log('[OnboardingWatcher] Processing import:', {
        id: importRecord.id,
        status: importRecord.status,
        report_id: importRecord.report_id,
        alreadyProcessed: processedImportsRef.current.has(importRecord.id)
      });
      
      // Vérifier si cet import a déjà été traité
      if (processedImportsRef.current.has(importRecord.id)) {
        console.log('[OnboardingWatcher] Import already processed:', importRecord.id);
        return;
      }

      // Vérifier si l'import est terminé (statut "Terminé", "Completed", "Importé", etc.)
      const completedStatuses = ['Terminé', 'Completed', 'Importé', 'Success'];
      if (!completedStatuses.includes(importRecord.status)) {
        console.log('[OnboardingWatcher] Import not completed, status:', importRecord.status);
        return;
      }

      console.log('[OnboardingWatcher] Import is completed, marking as processed');
      // Marquer comme traité
      processedImportsRef.current.add(importRecord.id);

      // Récupérer les détails du rapport d'expertise pour obtenir client_id, vehicle_id, etc.
      if (importRecord.report_id) {
        try {
          console.log('[OnboardingWatcher] Fetching report details for:', importRecord.report_id);
          const { data: report } = await supabase
            .from('expertise_reports')
            .select('id, client_id, vehicle_id')
            .eq('id', importRecord.report_id)
            .single();

          console.log('[OnboardingWatcher] Report details:', report);

          if (report) {
            // Vérifier si un devis a été créé automatiquement
            const { data: quote } = await supabase
              .from('quotes')
              .select('id')
              .eq('report_id', report.id)
              .single();

            console.log('[OnboardingWatcher] Quote found:', quote);

            // Mettre à jour l'étape d'onboarding
            onboardingService.updateOnboardingStep('tunnel2', 'automaticDigitization', {
              reportId: report.id,
              clientId: report.client_id,
              vehicleId: report.vehicle_id,
              quoteId: quote?.id,
            });

            // Créer un message d'agent pour féliciter l'utilisateur
            const onboardingState = onboardingService.getOnboardingState();
            console.log('[OnboardingWatcher] Onboarding state:', onboardingState);
            
            if (onboardingState?.id) {
              try {
                console.log('[OnboardingWatcher] Creating congratulation message...');
                const { data: messageData, error: messageError } = await supabase
                  .from('ai_messages_history')
                  .insert({
                    session_id: onboardingState.id,
                    read: false,
                    message: {
                      type: 'ai',
                      content: '🎉 Félicitations ! Votre rapport d\'expertise a été importé avec succès. Le client, le véhicule et le devis ont été automatiquement créés dans votre système. Vous pouvez maintenant consulter ces informations et poursuivre le processus.',
                      tool_calls: [],
                      additional_kwargs: {},
                      response_metadata: {},
                      invalid_tool_calls: []
                    }
                  })
                  .select();
                
                if (messageError) {
                  console.error('[OnboardingWatcher] Error creating message:', messageError);
                } else {
                  console.log('[OnboardingWatcher] Congratulation message created:', messageData);
                }
              } catch (error) {
                console.error('[OnboardingWatcher] Exception creating congratulation message:', error);
              }
            } else {
              console.warn('[OnboardingWatcher] No onboarding state found, cannot create message');
            }

            console.log('[OnboardingWatcher] Automatic digitization detected for import:', importRecord.id);
          }
        } catch (error) {
          console.error('[OnboardingWatcher] Error fetching report details:', error);
        }
      } else {
        console.log('[OnboardingWatcher] No report_id for import:', importRecord.id);
      }
    });
  }, [imports]);

  return null; // Ce hook ne retourne rien, il agit en arrière-plan
}
