import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { quotesService } from '@/services/supabase/quotes';

export function useImportNotification() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    // Fonction pour jouer un son de notification simple
    const playNotificationSound = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (error) {
        console.error('Error playing notification sound:', error);
      }
    };

    // Polling pour vérifier les changements de statut
    let intervalId: NodeJS.Timeout;
    let lastImportIds = new Set<string>();
    let isInitialized = false;

    const checkImports = async () => {
      try {
        console.log('🔍 useImportNotification - Checking for completed imports...');
        
        const { data: imports } = await supabase
          .from('imports')
          .select(`
            id, 
            status,
            expertise_reports (
              id,
              client_id,
              vehicle_id,
              report_number
            )
          `)
          .in('status', ['Importé', 'Terminé']);

        console.log('📊 useImportNotification - Found imports:', imports);

        if (imports) {
          const currentImportIds = new Set(imports.map(imp => imp.id));
          console.log('🆔 Current import IDs:', Array.from(currentImportIds));
          console.log('🆔 Last import IDs:', Array.from(lastImportIds));
          
          // Au premier chargement, initialiser et traiter les imports existants sans client/véhicule
          if (!isInitialized) {
            // Traiter les imports existants qui ont un client et un véhicule
            for (const import_item of imports) {
              if (import_item.expertise_reports?.client_id && import_item.expertise_reports?.vehicle_id) {
                try {
                  console.log('🔄 Processing existing import for auto-conversion:', import_item.id);
                  
                  // Vérifier si un devis n'existe pas déjà pour ce rapport
                  const existingQuote = await quotesService.getByReportId(import_item.expertise_reports.id);
                  
                  if (!existingQuote) {
                    console.log('📋 No existing quote found, creating one for existing import');
                    
                    // Récupérer le rapport d'expertise complet pour la conversion
                    const { data: fullReport, error: reportError } = await supabase
                      .from('expertise_reports')
                      .select('*')
                      .eq('id', import_item.expertise_reports.id)
                      .single();
                    
                    if (reportError || !fullReport) {
                      throw new Error('Impossible de récupérer le rapport d\'expertise complet');
                    }
                    
                    // Créer le devis à partir du rapport
                    const newQuote = await quotesService.createFromReport(fullReport);
                    
                    console.log('✅ Quote created from existing import:', newQuote);
                    
                    // Invalider le cache des devis
                    queryClient.invalidateQueries({ queryKey: ['quotes'] });
                    
                    // Afficher un toast de succès pour la conversion
                    toast({
                      title: "Conversion automatique réussie",
                      description: `Le rapport ${import_item.expertise_reports.report_number} a été automatiquement converti en devis ${newQuote.reference}.`,
                    });
                  } else {
                    console.log('📋 Quote already exists for this existing import');
                  }
                } catch (error: any) {
                  console.error('❌ Error during existing import conversion:', error);
                }
              }
            }
            
            lastImportIds = currentImportIds;
            isInitialized = true;
            console.log('🔧 Initialized with existing imports, processed eligible ones');
            return;
          }
          
          // Vérifier s'il y a de nouveaux imports terminés
          for (const import_item of imports) {
            if (!lastImportIds.has(import_item.id)) {
              console.log('🎉 New import completed:', import_item.id);
              
              // Jouer le signal sonore
              playNotificationSound();
              
              // Afficher une notification toast
              toast({
                title: "Import terminé",
                description: "Un rapport d'expertise a été importé avec succès",
              });
              
              // Conversion automatique en devis si le rapport a un client et un véhicule
              if (import_item.expertise_reports?.client_id && import_item.expertise_reports?.vehicle_id) {
                try {
                  console.log('🔄 Converting report to quote automatically...');
                  
                  // Vérifier si un devis n'existe pas déjà pour ce rapport
                  const existingQuote = await quotesService.getByReportId(import_item.expertise_reports.id);
                  
                  if (!existingQuote) {
                    // Récupérer le rapport d'expertise complet pour la conversion
                    const { data: fullReport, error: reportError } = await supabase
                      .from('expertise_reports')
                      .select('*')
                      .eq('id', import_item.expertise_reports.id)
                      .single();
                    
                    if (reportError || !fullReport) {
                      throw new Error('Impossible de récupérer le rapport d\'expertise complet');
                    }
                    
                    // Créer le devis à partir du rapport
                    const newQuote = await quotesService.createFromReport(fullReport);
                    
                    console.log('✅ Quote created automatically:', newQuote);
                    console.log('🔄 Attempting redirect to:', `/documents/devis?openQuote=${newQuote.id}`);
                    
                    // Invalider le cache des devis
                    queryClient.invalidateQueries({ queryKey: ['quotes'] });
                    
                    // Rediriger vers la page des devis avec l'aperçu ouvert
                    setTimeout(() => {
                      console.log('🚀 Executing redirect...');
                      window.location.href = `/documents/devis?openQuote=${newQuote.id}`;
                    }, 100);
                    
                    // Afficher un toast de succès pour la conversion
                    toast({
                      title: "Conversion automatique réussie",
                      description: `Le rapport ${import_item.expertise_reports.report_number} a été automatiquement converti en devis ${newQuote.reference}.`,
                    });
                  } else {
                    console.log('📋 Quote already exists for this report:', existingQuote);
                    
                    // Même si le devis existe déjà, rediriger vers celui-ci
                    setTimeout(() => {
                      console.log('🚀 Redirecting to existing quote:', existingQuote.id);
                      window.location.href = `/documents/devis?openQuote=${existingQuote.id}`;
                    }, 100);
                    
                    toast({
                      title: "Rapport déjà converti",
                      description: `Le rapport ${import_item.expertise_reports.report_number} a déjà un devis existant.`,
                    });
                  }
                } catch (error: any) {
                  console.error('❌ Error during automatic conversion:', error);
                  toast({
                    title: "Erreur de conversion automatique",
                    description: `Impossible de convertir automatiquement le rapport: ${error.message}`,
                    variant: "destructive"
                  });
                }
              }
              
              // Invalider les caches pour rafraîchir les données
              queryClient.invalidateQueries({ queryKey: ['expertiseReports'] });
              queryClient.invalidateQueries({ queryKey: ['imports', 'pending'] });
            }
          }
          
          lastImportIds = currentImportIds;
        }
      } catch (error) {
        console.error('❌ Error checking imports:', error);
      }
    };

    // Vérifier immédiatement puis toutes les 5 secondes
    checkImports();
    intervalId = setInterval(checkImports, 5000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [toast, queryClient]);

  return null;
}