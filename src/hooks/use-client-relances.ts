import { useState, useEffect } from 'react';
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
  client_response?: string;
  response_read: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  clients?: {
    first_name: string;
    last_name: string;
    phone?: string;
    email?: string;
  } | null;
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
      // Données fictives pour les statistiques de relances
      const mockStats: RelanceStats[] = [
        { channel: 'phone', count: 15, en_cours: 3, envoye: 8, recu: 4, echec: 0 },
        { channel: 'email', count: 42, en_cours: 5, envoye: 28, recu: 7, echec: 2 },
        { channel: 'sms', count: 23, en_cours: 2, envoye: 18, recu: 3, echec: 0 },
        { channel: 'whatsapp', count: 31, en_cours: 4, envoye: 22, recu: 5, echec: 0 },
        { channel: 'vms', count: 8, en_cours: 1, envoye: 5, recu: 2, echec: 0 },
        { channel: 'courrier', count: 6, en_cours: 0, envoye: 4, recu: 2, echec: 0 }
      ];

      setStats(mockStats);
    } catch (error) {
      console.error('Error in fetchRelanceStats:', error);
    }
  };

  const fetchRelances = async () => {
    if (!companyData?.id) return;

    try {
      // Données fictives pour les relances clients
      const mockRelances: ClientRelance[] = [
        {
          id: 'rel-1',
          company_id: companyData.id,
          client_id: 'client-1',
          invoice_id: 'inv-1',
          channel: 'email',
          tone: 'amical',
          status: 'envoye',
          subject: 'Rappel facture #2024-001',
          message: 'Bonjour, nous vous rappelons que votre facture arrive à échéance.',
          is_automated: true,
          sent_at: '2024-01-15T10:30:00Z',
          response_read: false,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z',
          clients: {
            first_name: 'Jean',
            last_name: 'Dupont',
            phone: '06.12.34.56.78',
            email: 'jean.dupont@email.com'
          }
        },
        {
          id: 'rel-2',
          company_id: companyData.id,
          client_id: 'client-2',
          invoice_id: 'inv-2',
          channel: 'sms',
          tone: 'serieux',
          status: 'recu',
          subject: 'Facture en retard',
          message: 'Votre facture #2024-002 est en retard de paiement.',
          is_automated: false,
          sent_at: '2024-01-10T14:15:00Z',
          received_at: '2024-01-10T14:16:00Z',
          response_read: true,
          created_at: '2024-01-10T14:15:00Z',
          updated_at: '2024-01-10T14:16:00Z',
          clients: {
            first_name: 'Marie',
            last_name: 'Martin',
            phone: '06.98.76.54.32',
            email: 'marie.martin@email.com'
          }
        },
        {
          id: 'rel-3',
          company_id: companyData.id,
          client_id: 'client-3',
          channel: 'whatsapp',
          tone: 'amical',
          status: 'en_cours',
          subject: 'Devis en attente',
          message: 'Votre devis est prêt, souhaitez-vous le consulter ?',
          is_automated: true,
          response_read: false,
          created_at: '2024-01-20T09:00:00Z',
          updated_at: '2024-01-20T09:00:00Z',
          clients: {
            first_name: 'Pierre',
            last_name: 'Durand',
            phone: '06.11.22.33.44',
            email: 'pierre.durand@email.com'
          }
        }
      ];

      setRelances(mockRelances);
    } catch (error) {
      console.error('Error in fetchRelances:', error);
    }
  };

  const createRelance = async (relanceData: Omit<ClientRelance, 'id' | 'company_id' | 'created_at' | 'updated_at'>) => {
    if (!companyData?.id) return null;

    try {
      // Simuler la création d'une relance
      const mockRelance = {
        id: `rel-${Date.now()}`,
        company_id: companyData.id,
        ...relanceData,
        status: relanceData.status || 'en_attente',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      toast({
        title: "Succès",
        description: "Relance créée avec succès",
      });

      // Rafraîchir les données
      fetchRelanceStats();
      fetchRelances();

      return mockRelance;
    } catch (error) {
      console.error('Error in createRelance:', error);
      return null;
    }
  };

  const updateRelanceStatus = async (relanceId: string, status: ClientRelance['status']) => {
    try {
      // Simuler la mise à jour du statut
      setRelances(prev => prev.map(relance => {
        if (relance.id === relanceId) {
          const updateData: any = { ...relance, status };
          
          // Ajouter les timestamps selon le statut
          if (status === 'en_cours') updateData.sent_at = new Date().toISOString();
          else if (status === 'recu') updateData.received_at = new Date().toISOString();
          else if (status === 'repondu') updateData.responded_at = new Date().toISOString();
          
          return updateData;
        }
        return relance;
      }));

      // Rafraîchir les statistiques
      fetchRelanceStats();
    } catch (error) {
      console.error('Error in updateRelanceStatus:', error);
    }
  };

  const markResponseAsRead = async (relanceId: string) => {
    try {
      // Simuler le marquage comme lu
      setRelances(prev => prev.map(relance => 
        relance.id === relanceId 
          ? { ...relance, response_read: true }
          : relance
      ));
    } catch (error) {
      console.error('Error in markResponseAsRead:', error);
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
    markResponseAsRead,
    refetch: () => {
      fetchRelanceStats();
      fetchRelances();
    }
  };
};