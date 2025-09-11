import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { quotesService } from '@/services/supabase/quotes';
import { useNavigate } from 'react-router-dom';
import { sendDocumentsRequest } from '@/services/documentsRequestService';

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
          .select('id, status')
          .in('status', ['Importé', 'Terminé']);

        console.log('📊 useImportNotification - Found imports:', imports);

        if (imports) {
          const currentImportIds = new Set(imports.map(imp => imp.id));
          console.log('🆔 Current import IDs:', Array.from(currentImportIds));
          console.log('🆔 Last import IDs:', Array.from(lastImportIds));
          
          // Au premier chargement, initialiser sans notification
          if (!isInitialized) {
            lastImportIds = currentImportIds;
            isInitialized = true;
            console.log('🔧 Initialized with existing imports, no notifications sent');
            return;
          }
          
          // Vérifier s'il y a de nouveaux imports terminés
          for (const id of currentImportIds) {
            if (!lastImportIds.has(id)) {
              console.log('🎉 New import completed:', id);
              
              // Jouer le signal sonore
              playNotificationSound();
              
              try {
                // Récupérer les détails de l'import pour obtenir le rapport d'expertise
                const { data: importData } = await supabase
                  .from('imports')
                  .select(`
                    report_id,
                    expertise_reports (
                      id,
                      report_number,
                      clients (id, first_name, last_name),
                      vehicles (id, license_plate, car_brands(name), car_models(name))
                    )
                  `)
                  .eq('id', id)
                  .single();

                console.log('📋 Import data for conversion:', importData);

                if (importData?.expertise_reports) {
                  const report = importData.expertise_reports;
                  
                  // Vérifier si le rapport a un client et un véhicule (requis pour la conversion)
                  if (report.clients && report.vehicles) {
                    // Envoyer automatiquement la demande de documents
                    try {
                      console.log('📧 Sending documents request for client:', report.clients.id);
                      // Récupérer la company_id du rapport d'expertise
                      const { data: reportData } = await supabase
                        .from('expertise_reports')
                        .select('company_id')
                        .eq('id', report.id)
                        .single();
                      
                      await sendDocumentsRequest(report.clients.id, reportData?.company_id);
                      console.log('✅ Documents request sent successfully');
                    } catch (docError) {
                      console.error('❌ Error sending documents request:', docError);
                    }
                    
                    // Vérifier si un devis existe déjà pour ce rapport
                    const existingQuote = await quotesService.getByReportId(report.id);
                    
                    if (existingQuote) {
                      console.log('📄 Quote already exists for report:', report.id, 'Quote ID:', existingQuote.id);
                      console.log('🚀 Navigating to quote:', `/documents/devis?openQuote=${existingQuote.id}`);
                      
                      // Rediriger vers le devis existant
                      setTimeout(() => {
                        navigate(`/documents/devis?openQuote=${existingQuote.id}`);
                      }, 1000);
                      
                      toast({
                        title: "Import terminé",
                        description: "Redirection vers le devis existant...",
                      });
                    } else {
                      console.log('🔄 Converting report to quote:', report.id);
                      
                      // Convertir le rapport en devis
                      const newQuote = await quotesService.createFromReport(report);
                      console.log('✅ Quote created:', newQuote);
                      console.log('🚀 Navigating to new quote:', `/documents/devis?openQuote=${newQuote.id}`);
                      
                      // Rediriger vers le nouveau devis
                      setTimeout(() => {
                        navigate(`/documents/devis?openQuote=${newQuote.id}`);
                      }, 1000);
                      
                      toast({
                        title: "Import et conversion terminés",
                        description: "Le rapport a été converti en devis automatiquement",
                      });
                    }
                  } else {
                    console.log('⚠️ Cannot convert report: missing client or vehicle data');
                    toast({
                      title: "Import terminé",
                      description: "Le rapport nécessite un client et un véhicule pour être converti en devis",
                    });
                  }
                } else {
                  console.log('⚠️ No expertise report found for import:', id);
                  toast({
                    title: "Import terminé",
                    description: "Un rapport d'expertise a été importé avec succès",
                  });
                }
              } catch (conversionError) {
                console.error('❌ Error during automatic conversion:', conversionError);
                toast({
                  title: "Import terminé",
                  description: "Le rapport a été importé mais la conversion en devis a échoué",
                });
              }
              
              // Invalider les caches pour rafraîchir les données
              queryClient.invalidateQueries({ queryKey: ['expertiseReports'] });
              queryClient.invalidateQueries({ queryKey: ['imports', 'pending'] });
              queryClient.invalidateQueries({ queryKey: ['quotes'] });
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