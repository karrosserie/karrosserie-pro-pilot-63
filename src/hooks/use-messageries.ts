import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { STATIC_MESSAGERIES, mockApiDelay } from "@/data/staticData";

export interface Messagerie {
  id: string;
  company_id: string;
  priority: number;
  title: string;
  channel: string;
  eta: string;
  time: string;
  date: string;
  summary: string;
  message: string;
  tags: string[];
  resolved: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

export function useMessageries() {
  const [messageries, setMessageries] = useState<Messagerie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Charger les messageries
  const fetchMessageries = async () => {
    try {
      setLoading(true);
      
      // Utiliser les données statiques au lieu de Supabase
      await mockApiDelay(800); // Simuler un délai d'API
      
      const staticData = [...STATIC_MESSAGERIES].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setMessageries(staticData);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Marquer comme résolu/non résolu
  const toggleResolved = async (id: string) => {
    try {
      const messagerie = messageries.find(m => m.id === id);
      if (!messagerie) return;

      // Simuler un délai d'API
      await mockApiDelay(300);

      setMessageries(prev => 
        prev.map(m => 
          m.id === id ? { ...m, resolved: !m.resolved, updated_at: new Date().toISOString() } : m
        )
      );

      toast({
        title: "Succès",
        description: messagerie.resolved 
          ? "Message marqué comme non résolu" 
          : "Message envoyé dans les messages traités !",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  // Archiver/désarchiver
  const toggleArchived = async (id: string) => {
    try {
      const messagerie = messageries.find(m => m.id === id);
      if (!messagerie) return;

      // Simuler un délai d'API
      await mockApiDelay(300);

      setMessageries(prev => 
        prev.map(m => 
          m.id === id ? { ...m, archived: !m.archived, updated_at: new Date().toISOString() } : m
        )
      );

      toast({
        title: "Succès",
        description: messagerie.archived 
          ? "Message désarchivé" 
          : "Le message a bien été archivé !",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  // Escalader (augmenter la priorité)
  const escalateMessage = async (id: string) => {
    try {
      const messagerie = messageries.find(m => m.id === id);
      if (!messagerie) return;

      if (messagerie.priority === 1) {
        toast({
          title: "Information",
          description: "Le message est déjà en priorité 1 et ne peut pas être escaladé davantage.",
        });
        return;
      }

      const newPriority = messagerie.priority - 1;

      // Simuler un délai d'API
      await mockApiDelay(300);

      setMessageries(prev => 
        prev.map(m => 
          m.id === id ? { ...m, priority: newPriority, updated_at: new Date().toISOString() } : m
        )
      );

      toast({
        title: "Succès",
        description: "Le niveau d'urgence a bien été augmenté !",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  // Traitement automatique
  const autoManage = async (id: string) => {
    try {
      const messagerie = messageries.find(m => m.id === id);
      if (!messagerie || messagerie.priority === 1) return;

      // Simuler un délai d'API plus long pour le traitement automatique
      await mockApiDelay(1200);

      setMessageries(prev => 
        prev.map(m => 
          m.id === id ? { ...m, resolved: true, updated_at: new Date().toISOString() } : m
        )
      );

      toast({
        title: "Succès",
        description: "Le message a bien été traité automatiquement !",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  // Actions pour les boutons
  const handleReply = (id: string) => {
    const messagerie = messageries.find(m => m.id === id);
    toast({
      title: "Répondre",
      description: `Répondre à: ${messagerie?.title}`,
    });
  };

  const handleSemiAuto = (id: string) => {
    toast({
      title: "Semi Auto",
      description: "Un brouillon de réponse a été généré pour vous !",
    });
  };

  // Charger les données au montage
  useEffect(() => {
    fetchMessageries();
  }, []);

  return {
    messageries,
    loading,
    toggleResolved,
    toggleArchived,
    escalateMessage,
    autoManage,
    handleReply,
    handleSemiAuto,
    refetch: fetchMessageries,
  };
}