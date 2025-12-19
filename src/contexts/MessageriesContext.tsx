import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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

interface MessageriesContextType {
  messageries: Messagerie[];
  loading: boolean;
  updateStatus: (id: string, newStatus: Messagerie['status']) => Promise<void>;
  toggleResolved: (id: string) => Promise<void>;
  toggleArchived: (id: string) => Promise<void>;
  escalateMessage: (id: string) => Promise<void>;
  autoManage: (id: string) => Promise<void>;
  handleReply: (id: string) => void;
  handleSemiAuto: (id: string) => void;
  refetch: () => Promise<void>;
  getClientHistory: (clientId: string) => Promise<any[]>;
  fetchReplies: (messagerieId: string) => Promise<MessagerieReply[]>;
  addReply: (
    messagerieId: string,
    content: string,
    channel: string,
    senderType?: 'carrosserie' | 'client' | 'internal',
    actualCommunicationDate?: string,
    isInbound?: boolean
  ) => Promise<boolean>;
  createNewMessage: (messageData: {
    client_id: string;
    title: string;
    channel: string;
    priority: number;
    message: string;
    tags?: string[];
    category?: Messagerie['category'];
    is_outbound?: boolean;
  }) => Promise<Messagerie | null>;
}

const MessageriesContext = createContext<MessageriesContextType | null>(null);

export function MessageriesProvider({ children }: { children: React.ReactNode }) {
  const [messageries, setMessageries] = useState<Messagerie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMessageries = useCallback(async () => {
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
  }, [toast]);

  const getClientHistory = useCallback(async (clientId: string) => {
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
  }, [toast]);

  const fetchReplies = useCallback(async (messagerieId: string): Promise<MessagerieReply[]> => {
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
  }, []);

  const addReply = useCallback(async (
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
  }, [messageries, fetchMessageries, toast]);

  const createNewMessage = useCallback(async (messageData: {
    client_id: string;
    title: string;
    channel: string;
    priority: number;
    message: string;
    tags?: string[];
    category?: Messagerie['category'];
    is_outbound?: boolean;
  }): Promise<Messagerie | null> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data: companyData } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', userData.user?.id)
        .single();

      if (!companyData) throw new Error('Company not found');

      const isInbound = !messageData.is_outbound;

      const { data, error } = await supabase
        .from('messageries')
        .insert({
          client_id: messageData.client_id,
          title: messageData.title,
          channel: messageData.channel,
          priority: messageData.priority,
          message: messageData.message,
          tags: messageData.tags || [],
          category: messageData.category || 'autre',
          company_id: companyData.company_id,
          summary: messageData.message.substring(0, 100),
          eta: '30min',
          time: new Date().toISOString(),
          date: new Date().toLocaleDateString('fr-FR'),
          actual_communication_date: new Date().toISOString(),
          resolved: false,
          archived: false,
          is_inbound: isInbound,
          status: 'nouveau',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Communication créée avec succès",
      });

      await fetchMessageries();
      
      // Cast pour correspondre au type Messagerie
      return data ? {
        ...data,
        category: (data.category || 'autre') as Messagerie['category'],
        status: (data.status || 'nouveau') as Messagerie['status'],
      } : null;
    } catch (error) {
      console.error('Erreur lors de la création du message:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la communication",
        variant: "destructive",
      });
      return null;
    }
  }, [fetchMessageries, toast]);

  const updateStatus = useCallback(async (id: string, newStatus: Messagerie['status']) => {
    try {
      const { error } = await supabase
        .from('messageries')
        .update({ 
          status: newStatus,
          resolved: newStatus === 'resolu',
        })
        .eq('id', id);

      if (error) throw error;

      setMessageries(prev => 
        prev.map(m => 
          m.id === id 
            ? { ...m, status: newStatus, resolved: newStatus === 'resolu' }
            : m
        )
      );

      toast({
        title: "Statut mis à jour",
        description: `Le message est maintenant "${newStatus}"`,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  }, [toast]);

  const toggleResolved = useCallback(async (id: string) => {
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
  }, [messageries, toast]);

  const toggleArchived = useCallback(async (id: string) => {
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
  }, [messageries, toast]);

  const escalateMessage = useCallback(async (id: string) => {
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
  }, [messageries, toast]);

  const autoManage = useCallback(async (id: string) => {
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
  }, [messageries, toast]);

  const handleReply = useCallback((id: string) => {
    const messagerie = messageries.find(m => m.id === id);
    toast({
      title: "Répondre",
      description: `Répondre à: ${messagerie?.title}`,
    });
  }, [messageries, toast]);

  const handleSemiAuto = useCallback((id: string) => {
    toast({
      title: "Semi Auto",
      description: "Un brouillon de réponse a été généré pour vous !",
    });
  }, [toast]);

  // Une seule souscription temps réel centralisée
  useEffect(() => {
    fetchMessageries();

    const channel = supabase
      .channel('messageries-realtime-central')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messageries'
        },
        (payload) => {
          console.log('Messagerie mise à jour (realtime central):', payload);
          fetchMessageries();
        }
      )
      .subscribe();

    // Un seul polling de secours
    const interval = setInterval(() => {
      if (document.hasFocus()) {
        fetchMessageries();
      }
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchMessageries]);

  const value: MessageriesContextType = {
    messageries,
    loading,
    updateStatus,
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

  return (
    <MessageriesContext.Provider value={value}>
      {children}
    </MessageriesContext.Provider>
  );
}

export function useMessageriesContext() {
  const context = useContext(MessageriesContext);
  if (!context) {
    throw new Error('useMessageriesContext must be used within a MessageriesProvider');
  }
  return context;
}
