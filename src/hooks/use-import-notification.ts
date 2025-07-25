import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export function useImportNotification() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Créer l'élément audio pour le signal sonore
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+PvuGUdBzuT1vHSeS4FJn/K7tgOQgsXYrfm7KpXFQ1Kn+Xyu2YdCDaR1+/TeSsEGX3K8N2SQgkUY7Pm7qtcFAxKn+LyzGkfCDSR1fHUejEFKHzH7tiSQQcSYrDn7axwHQw/meLyyGsrCzCLxvDXeSsENXzH7NmSSAYMX6zp566DGQ6+fTy/l2+h2qj3mDGqDsVZlXnNOEm4LsDhjxcHwGj9=');
    audioRef.current.volume = 0.7;

    // Polling pour vérifier les changements de statut
    let intervalId: NodeJS.Timeout;
    let lastImportIds = new Set<string>();

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
          
          // Vérifier s'il y a de nouveaux imports terminés
          currentImportIds.forEach(id => {
            if (!lastImportIds.has(id)) {
              console.log('🎉 New import completed:', id);
              
              // Jouer le signal sonore
              if (audioRef.current) {
                audioRef.current.play().catch(error => {
                  console.error('Error playing notification sound:', error);
                });
              }
              
              // Afficher une notification toast
              toast({
                title: "Import terminé",
                description: "Un rapport d'expertise a été importé avec succès",
              });
              
              // Invalider les caches pour rafraîchir les données
              queryClient.invalidateQueries({ queryKey: ['expertise-reports'] });
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