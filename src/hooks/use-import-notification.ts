import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { quotesService } from '@/services/supabase/quotes';
import { useNavigate } from 'react-router-dom';
import { sendDocumentsRequest } from '@/services/documentsRequestService';
import { useClientValidation } from './use-client-validation';

export function useImportNotification() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { checkMissingClientData, validateClientData } = useClientValidation();

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
                    // Récupérer les données complètes du client pour vérifier les champs manquants
                    const { data: fullClientData } = await supabase
                      .from('clients')
                      .select('*')
                      .eq('id', report.clients.id)
                      .single();
                    
                    if (fullClientData) {
                      // 1. Vérifier les champs manquants
                      const missingValidation = checkMissingClientData(fullClientData);
                      
                      // 2. Valider la véracité des données présentes
                      const dataValidation = await validateClientData(fullClientData);
                      
                      console.log('🔍 Client data validation:', { 
                        missing: missingValidation.missingCount,
                        errors: dataValidation.errors.length,
                        warnings: dataValidation.warnings.length
                      });
                      
                      // Récupérer le company_id du rapport pour les actions futures
                      const { data: reportData } = await supabase
                        .from('expertise_reports')
                        .select('company_id')
                        .eq('id', report.id)
                        .single();
                      
                      // Si des erreurs de validation critiques
                      if (!dataValidation.isValid) {
                        toast({
                          title: "⚠️ Données client invalides détectées",
                          description: `${dataValidation.errors.length} erreur(s) critique(s) détectée(s)`,
                          variant: "destructive",
                        });
                        
                        console.error('❌ Critical validation errors:', dataValidation.errors);
                        console.error('⚠️ Client:', fullClientData.first_name, fullClientData.last_name);
                        console.error('📋 Errors list:', dataValidation.errors.join(' | '));
                      }
                      
                      // Afficher les avertissements (non bloquants)
                      if (dataValidation.hasWarnings) {
                        toast({
                          title: "⚠️ Avertissements sur les données client",
                          description: dataValidation.warnings.join(', '),
                        });
                        console.warn('⚠️ Validation warnings:', dataValidation.warnings);
                      }
                      
                      // N'envoyer la demande de documents QUE si :
                      // - Des données manquent
                      // - ET les données présentes sont valides (pas d'erreurs critiques)
                      if (!missingValidation.isComplete && dataValidation.isValid) {
                        console.log('📧 Sending documents request - Missing fields:', missingValidation.missingFields);
                        
                        try {
                          await sendDocumentsRequest(fullClientData.id, reportData?.company_id);
                          
                          toast({
                            title: "Import terminé - Documents demandés",
                            description: `${missingValidation.missingCount} information(s) manquante(s). Une demande a été envoyée : ${missingValidation.missingFields.join(', ')}`,
                          });
                        } catch (docError) {
                          console.error('❌ Error sending documents request:', docError);
                        }
                      } else if (missingValidation.isComplete && dataValidation.isValid) {
                        console.log('✅ Client data is complete and valid');
                        toast({
                          title: "✅ Import terminé - Données complètes",
                          description: "Toutes les informations client sont présentes et validées.",
                        });
                      }
                    }
                    
                    // Vérifier si un devis existe déjà pour ce rapport
                    const existingQuote = await quotesService.getByReportId(report.id);
                    
                    if (existingQuote) {
                      console.log('📄 Quote already exists for report:', report.id, 'Quote ID:', existingQuote.id);
                      console.log('🚀 Navigating to quote:', `/documents/devis?openQuote=${existingQuote.id}`);
                      
                      // Rediriger vers le devis existant (après 3s pour laisser le temps à la pop-up d'onboarding)
                      setTimeout(() => {
                        navigate(`/documents/devis?openQuote=${existingQuote.id}`);
                      }, 3000);
                      
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
                      
                      // Rediriger vers le nouveau devis (après 3s pour laisser le temps à la pop-up d'onboarding)
                      setTimeout(() => {
                        navigate(`/documents/devis?openQuote=${newQuote.id}`);
                      }, 3000);
                      
                      // Message de conversion adapté selon l'état de validation
                      if (fullClientData) {
                        const missingValidation = checkMissingClientData(fullClientData);
                        const dataValidation = await validateClientData(fullClientData);
                        
                        if (missingValidation.isComplete && dataValidation.isValid) {
                          toast({
                            title: "Import et conversion terminés",
                            description: "Le rapport a été converti en devis. Toutes les données client sont complètes et validées !",
                          });
                        }
                      }
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