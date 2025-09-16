import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  reponse?: string;
  contact?: string;
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
      const { data, error } = await supabase
        .from('messageries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des messageries:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les messageries",
          variant: "destructive",
        });
        return;
      }

      setMessageries(data || []);
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

      const { error } = await supabase
        .from('messageries')
        .update({ resolved: !messagerie.resolved })
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le message",
          variant: "destructive",
        });
        return;
      }

      setMessageries(prev => 
        prev.map(m => 
          m.id === id ? { ...m, resolved: !m.resolved } : m
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

      const { error } = await supabase
        .from('messageries')
        .update({ archived: !messagerie.archived })
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de l\'archivage:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'archiver le message",
          variant: "destructive",
        });
        return;
      }

      setMessageries(prev => 
        prev.map(m => 
          m.id === id ? { ...m, archived: !m.archived } : m
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

      const { error } = await supabase
        .from('messageries')
        .update({ priority: newPriority })
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de l\'escalade:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'escalader le message",
          variant: "destructive",
        });
        return;
      }

      setMessageries(prev => 
        prev.map(m => 
          m.id === id ? { ...m, priority: newPriority } : m
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

      const { error } = await supabase
        .from('messageries')
        .update({ resolved: true })
        .eq('id', id);

      if (error) {
        console.error('Erreur lors du traitement auto:', error);
        toast({
          title: "Erreur",
          description: "Impossible de traiter automatiquement le message",
          variant: "destructive",
        });
        return;
      }

      setMessageries(prev => 
        prev.map(m => 
          m.id === id ? { ...m, resolved: true } : m
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