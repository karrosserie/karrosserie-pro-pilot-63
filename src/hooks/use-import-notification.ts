import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export function useImportNotification() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
          currentImportIds.forEach(id => {
            if (!lastImportIds.has(id)) {
              console.log('🎉 New import completed:', id);
              
              // Jouer le signal sonore
              playNotificationSound();
              
              // Afficher une notification toast
              toast({
                title: "Import terminé",
                description: "Un rapport d'expertise a été importé avec succès",
              });
              
              // Invalider les caches pour rafraîchir les données
              queryClient.invalidateQueries({ queryKey: ['expertiseReports'] });
              queryClient.invalidateQueries({ queryKey: ['imports', 'pending'] });
            }
          });
          
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