import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useImportNotification() {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Créer l'élément audio pour le signal sonore
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+PvuGUdBzuT1vHSeS4FJn/K7tgOQgsXYrfm7KpXFQ1Kn+Xyu2YdCDaR1+/TeSsEGX3K8N2SQgkUY7Pm7qtcFAxKn+LyzGkfCDSR1fHUejEFKHzH7tiSQQcSYrDn7axwHQw/meLyyGsrCzCLxvDXeSsENXzH7NmSSAYMX6zp566DGQ6+fTy/l2+h2qj3mDGqDsVZlXnNOEm4LsDhjxcHwGj9=');
    audioRef.current.volume = 0.7;

    const channel = supabase
      .channel('import-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'imports'
        },
        (payload) => {
          console.log('Import status change detected:', payload);
          
          const newRecord = payload.new as any;
          const oldRecord = payload.old as any;
          
          // Vérifier si le statut est passé à "Importé"
          if (oldRecord?.status !== 'Importé' && newRecord?.status === 'Importé') {
            console.log('Import completed, playing notification sound');
            
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
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Unsubscribing from import status changes');
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return null;
}