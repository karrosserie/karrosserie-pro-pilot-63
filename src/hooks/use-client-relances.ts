import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';
import { useToast } from '@/components/ui/use-toast';

export interface RelanceStats {
  channel: string;
  count: number;
  en_cours: number;
  envoye: number;
  recu: number;
  echec: number;
}

export interface ClientRelance {
  id: string;
  company_id: string;
  client_id: string;
  invoice_id?: string;
  quote_id?: string;
  channel: 'phone' | 'email' | 'sms' | 'whatsapp' | 'vms' | 'courrier' | 'courrier_recommande';
  tone: 'amical' | 'ferme' | 'serieux' | 'menacant';
  status: 'en_attente' | 'en_cours' | 'envoye' | 'recu' | 'repondu' | 'echec' | 'annule';
  subject?: string;
  message?: string;
  objective?: string;
  cycle_day?: number;
  step_number?: number;
  is_automated: boolean;
  scheduled_at?: string;
  sent_at?: string;
  received_at?: string;
  responded_at?: string;
  channel_data?: any;
  created_at: string;
  updated_at: string;
}

export const useClientRelances = () => {
  const { companyData } = useCompany();
  const [stats, setStats] = useState<RelanceStats[]>([]);
  const [relances, setRelances] = useState<ClientRelance[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRelanceStats = async () => {
    if (!companyData?.id) return;

    try {
      // Récupérer les statistiques par canal
      const { data: statsData, error: statsError } = await supabase
        .from('client_relances')
        .select('channel, status')
        .eq('company_id', companyData.id)
        .in('status', ['en_attente', 'en_cours', 'envoye', 'recu']);

      if (statsError) {
        console.error('Error fetching relance stats:', statsError);
        toast({
          title: "Erreur",
          description: "Impossible de charger les statistiques des relances",
          variant: "destructive",
        });
        return;
      }

      // Traiter les données pour créer les statistiques par canal
      const statsMap = new Map<string, RelanceStats>();
      
      // Initialiser avec tous les canaux
      const channels = ['phone', 'email', 'sms', 'whatsapp', 'vms', 'courrier'];
      channels.forEach(channel => {
        statsMap.set(channel, {
          channel,
          count: 0,
          en_cours: 0,
          envoye: 0,
          recu: 0,
          echec: 0
        });
      });

      // Compter les relances par canal et statut
      statsData?.forEach(relance => {
        const stat = statsMap.get(relance.channel);
        if (stat) {
          stat.count++;
          if (relance.status === 'en_cours') stat.en_cours++;
          else if (relance.status === 'envoye') stat.envoye++;
          else if (relance.status === 'recu') stat.recu++;
          else if (relance.status === 'echec') stat.echec++;
        }
      });

      setStats(Array.from(statsMap.values()));
    } catch (error) {
      console.error('Error in fetchRelanceStats:', error);
    }
  };

  const fetchRelances = async () => {
    if (!companyData?.id) return;

    try {
      const { data, error } = await supabase
        .from('client_relances')
        .select('*')
        .eq('company_id', companyData.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching relances:', error);
        return;
      }

      setRelances(data || []);
    } catch (error) {
      console.error('Error in fetchRelances:', error);
    }
  };

  const createRelance = async (relanceData: Omit<ClientRelance, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    if (!companyData?.id) return null;

    try {
      const { data, error } = await supabase
        .from('client_relances')
        .insert({
          company_id: companyData.id,
          client_id: relanceData.client_id,
          channel: relanceData.channel,
          tone: relanceData.tone,
          status: relanceData.status || 'en_attente',
          subject: relanceData.subject,
          message: relanceData.message,
          objective: relanceData.objective,
          cycle_day: relanceData.cycle_day,
          step_number: relanceData.step_number,
          is_automated: relanceData.is_automated,
          scheduled_at: relanceData.scheduled_at,
          sent_at: relanceData.sent_at,
          received_at: relanceData.received_at,
          responded_at: relanceData.responded_at,
          channel_data: relanceData.channel_data,
          invoice_id: relanceData.invoice_id,
          quote_id: relanceData.quote_id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating relance:', error);
        toast({
          title: "Erreur",
          description: "Impossible de créer la relance",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Succès",
        description: "Relance créée avec succès",
      });

      // Rafraîchir les données
      fetchRelanceStats();
      fetchRelances();

      return data;
    } catch (error) {
      console.error('Error in createRelance:', error);
      return null;
    }
  };

  const updateRelanceStatus = async (relanceId: string, status: ClientRelance['status']) => {
    try {
      const updateData: any = { status };
      
      // Ajouter les timestamps selon le statut
      if (status === 'en_cours') updateData.sent_at = new Date().toISOString();
      else if (status === 'recu') updateData.received_at = new Date().toISOString();
      else if (status === 'repondu') updateData.responded_at = new Date().toISOString();

      const { error } = await supabase
        .from('client_relances')
        .update(updateData)
        .eq('id', relanceId);

      if (error) {
        console.error('Error updating relance status:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le statut de la relance",
          variant: "destructive",
        });
        return;
      }

      // Rafraîchir les données
      fetchRelanceStats();
      fetchRelances();
    } catch (error) {
      console.error('Error in updateRelanceStatus:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRelanceStats(), fetchRelances()]);
      setLoading(false);
    };

    loadData();
  }, [companyData?.id]);

  return {
    stats,
    relances,
    loading,
    createRelance,
    updateRelanceStatus,
    refetch: () => {
      fetchRelanceStats();
      fetchRelances();
    }
  };
};