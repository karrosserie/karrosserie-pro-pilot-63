import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
}

export interface MessagerieReply {
  id: string;
  messagerie_id: string;
  company_id: string;
  sender_type: 'carrosserie' | 'client' | 'internal';
  sender_id: string | null;
  content: string;
  channel: string;
  actual_communication_date: string;
  is_inbound: boolean;
  sent_at: string;
  read_by_client: boolean;
  read_by_company: boolean;
  created_at: string;
}

export interface Messagerie {
  id: string;
  company_id: string;
  client_id: string | null;
  client?: Client;
  priority: number;
  category: 'sinistre' | 'devis' | 'sav' | 'reclamation' | 'information' | 'facturation' | 'autre';
  status: 'nouveau' | 'en_cours' | 'en_attente_client' | 'planifie' | 'resolu' | 'archive';
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
  replies_count?: number;
  last_reply_at?: string;
  actual_communication_date: string;
  is_inbound: boolean;
  created_at: string;
  updated_at: string;
}

export function useMessageries() {
  const [messageries, setMessageries] = useState<Messagerie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Charger les messageries avec les infos clients
  const fetchMessageries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messageries')
        .select(`
          *,
          client:clients(id, first_name, last_name, email, phone)
        `)
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

      // Cast les types pour correspondre à l'interface
      const typedData = (data || []).map(m => ({
        ...m,
        category: (m.category || 'autre') as Messagerie['category'],
        status: (m.status || 'nouveau') as Messagerie['status'],
      }));

      setMessageries(typedData);
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

  // Récupérer l'historique complet d'un client
  const getClientHistory = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('messageries')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique client:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique du client",
        variant: "destructive",
      });
      return [];
    }
  };

  // Récupérer les réponses d'un fil de conversation
  const fetchReplies = async (messagerieId: string): Promise<MessagerieReply[]> => {
    try {
      const { data, error } = await supabase
        .from('messagerie_replies')
        .select('*')
        .eq('messagerie_id', messagerieId)
        .order('sent_at', { ascending: true });

      if (error) throw error;
      return (data || []) as MessagerieReply[];
    } catch (error) {
      console.error('Erreur lors du chargement des réponses:', error);
      return [];
    }
  };

  // Ajouter une réponse au fil de conversation
  const addReply = async (
    messagerieId: string,
    content: string,
    channel: string,
    senderType: 'carrosserie' | 'client' | 'internal' = 'carrosserie',
    actualCommunicationDate: string = new Date().toISOString(),
    isInbound: boolean = false
  ) => {
    try {
      const messagerie = messageries.find(m => m.id === messagerieId);
      if (!messagerie) throw new Error('Messagerie introuvable');

      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('messagerie_replies')
        .insert({
          messagerie_id: messagerieId,
          company_id: messagerie.company_id,
          sender_type: senderType,
          sender_id: senderType === 'carrosserie' ? userData.user?.id : messagerie.client_id,
          content,
          channel,
          actual_communication_date: actualCommunicationDate,
          is_inbound: isInbound,
          sent_at: actualCommunicationDate,
          read_by_client: false,
          read_by_company: true,
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Échange enregistré avec succès",
      });

      // Rafraîchir les messageries pour mettre à jour replies_count
      await fetchMessageries();
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'échange:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'échange",
        variant: "destructive",
      });
      return false;
    }
  };

  // Créer une nouvelle communication
  const createNewMessage = async (messageData: {
    client_id: string;
    title: string;
    channel: string;
    priority: number;
    message: string;
    tags?: string[];
  }) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data: companyData } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', userData.user?.id)
        .single();

      if (!companyData) throw new Error('Company not found');

      const { data, error } = await supabase
        .from('messageries')
        .insert({
          ...messageData,
          company_id: companyData.company_id,
          summary: messageData.message.substring(0, 100),
          eta: '30min',
          time: new Date().toISOString(),
          date: new Date().toLocaleDateString('fr-FR'),
          resolved: false,
          archived: false,
          tags: messageData.tags || [],
        })
        .select()
        .single();

      if (error) throw error;

      // Créer la première entrée dans messagerie_replies
      if (data) {
        await addReply(data.id, messageData.message, messageData.channel, 'carrosserie');
      }

      toast({
        title: "Succès",
        description: "Communication créée avec succès",
      });

      await fetchMessageries();
      return data;
    } catch (error) {
      console.error('Erreur lors de la création du message:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la communication",
        variant: "destructive",
      });
      return null;
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
    getClientHistory,
    fetchReplies,
    addReply,
    createNewMessage,
  };
}