import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export function useImportNotification() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Fonction pour nettoyer les IDs de plus de 7 jours
    const cleanOldProcessedIds = () => {
      try {
        const stored = localStorage.getItem('processed_import_ids_timestamps');
        if (!stored) return;
        
        const timestamps = JSON.parse(stored);
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        
        const validEntries = Object.entries(timestamps)
          .filter(([_, timestamp]) => (timestamp as number) > oneWeekAgo);
        
        const validIds = validEntries.map(([id, _]) => id);
        const validTimestamps = Object.fromEntries(validEntries);
        
        localStorage.setItem('processed_import_ids', JSON.stringify(validIds));
        localStorage.setItem('processed_import_ids_timestamps', JSON.stringify(validTimestamps));
      } catch (error) {
        console.error('Error cleaning old processed IDs:', error);
      }
    };

    // Fonction pour récupérer les imports déjà traités depuis localStorage
    const getProcessedImportIds = (): Set<string> => {
      try {
        cleanOldProcessedIds();
        const stored = localStorage.getItem('processed_import_ids');
        return stored ? new Set(JSON.parse(stored)) : new Set();
      } catch (error) {
        console.error('Error reading processed imports from localStorage:', error);
        return new Set();
      }
    };

    // Fonction pour ajouter un import traité dans localStorage avec timestamp
    const addProcessedImportId = (id: string) => {
      try {
        const ids = getProcessedImportIds();
        ids.add(id);
        localStorage.setItem('processed_import_ids', JSON.stringify([...ids]));
        
        const timestamps = JSON.parse(localStorage.getItem('processed_import_ids_timestamps') || '{}');
        timestamps[id] = Date.now();
        localStorage.setItem('processed_import_ids_timestamps', JSON.stringify(timestamps));
        
        console.log('✅ Import ID persisted in localStorage:', id);
      } catch (error) {
        console.error('Error saving processed import to localStorage:', error);
      }
    };

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
    let isChecking = false;
    const processedIds = getProcessedImportIds();
    console.log('🔧 Initialized with processed imports from localStorage:', Array.from(processedIds));

    const checkImports = async () => {
      if (!document.hasFocus() || isChecking) {
        return;
      }
      
      isChecking = true;
      
      try {
        console.log('🔍 useImportNotification - Checking for completed imports...');
        
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
        
        const { data: imports } = await supabase
          .from('imports')
          .select('id, status, created_at')
          .in('status', ['Importé', 'Terminé'])
          .gte('created_at', twoHoursAgo);

        console.log('📊 useImportNotification - Found imports:', imports);

        if (imports) {
          const currentImportIds = new Set(imports.map(imp => imp.id));
          const processedIds = getProcessedImportIds();
          console.log('🆔 Current import IDs (< 2h):', Array.from(currentImportIds));
          console.log('🆔 Processed import IDs (from localStorage):', Array.from(processedIds));
          
          for (const id of currentImportIds) {
            if (!processedIds.has(id)) {
              console.log('🎉 New import completed:', id);
              
              addProcessedImportId(id);
              playNotificationSound();
              
              toast({
                title: "Import terminé",
                description: "Le rapport d'expertise a été importé avec succès. Vous pouvez le convertir en devis manuellement.",
              });
              
              // Invalider les caches pour rafraîchir les données
              queryClient.invalidateQueries({ 
                predicate: (query) => 
                  query.queryKey[0] === 'expertiseReports' || 
                  query.queryKey[0] === 'imports'
              });
            }
          }
        }
      } catch (error) {
        console.error('❌ Error checking imports:', error);
      } finally {
        isChecking = false;
      }
    };

    checkImports();
    intervalId = setInterval(checkImports, 20000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkImports();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [toast, queryClient]);

  return null;
}