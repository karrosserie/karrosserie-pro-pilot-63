import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface JudicialCase {
  id: string;
  company_id: string;
  client_id?: string;
  invoice_id?: string;
  reference: string;
  status: string;
  demandeur?: string;
  defendeur?: string;
  relation?: string;
  chronologie?: string;
  contexte?: string;
  obligations?: string;
  references_legales?: string;
  montant_dossier?: number;
  demandes?: string;
  interets: boolean;
  interets_details?: string;
  depens: boolean;
  depens_details?: string;
  pieces?: string;
  created_at: string;
  updated_at: string;
}

export const useJudicialCases = () => {
  const [cases, setCases] = useState<JudicialCase[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('judicial_cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error fetching judicial cases:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les dossiers judiciaires",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCase = async (caseData: Partial<JudicialCase>) => {
    try {
      // Générer une référence unique
      const referenceNumber = `DJ-${new Date().getFullYear()}-${String(cases.length + 1).padStart(3, '0')}`;
      
      const { data, error } = await supabase
        .from('judicial_cases')
        .insert({
          ...caseData,
          reference: referenceNumber,
          company_id: caseData.company_id || '', // Assurer que company_id est présent
        })
        .select()
        .single();

      if (error) throw error;

      setCases([data, ...cases]);
      toast({
        title: "Succès",
        description: "Dossier judiciaire créé avec succès",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating judicial case:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le dossier judiciaire",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateCase = async (id: string, caseData: Partial<JudicialCase>) => {
    try {
      const { data, error } = await supabase
        .from('judicial_cases')
        .update(caseData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCases(cases.map(c => c.id === id ? data : c));
      toast({
        title: "Succès",
        description: "Dossier judiciaire mis à jour",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating judicial case:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le dossier",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return {
    cases,
    loading,
    createCase,
    updateCase,
    refetch: fetchCases,
  };
};