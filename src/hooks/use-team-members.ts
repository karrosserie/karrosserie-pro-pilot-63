import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';
import { toast } from '@/hooks/use-toast';

export interface TeamMember {
  id: string;
  user_id: string;
  company_id: string;
  role: string;
  active: boolean;
  qualifications: string[];
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

export interface CreateTeamMemberData {
  user_id: string;
  role: string;
  qualifications: string[];
}

export interface UpdateTeamMemberData {
  role?: string;
  qualifications?: string[];
  active?: boolean;
}

export const useTeamMembers = () => {
  const { companyInfo } = useCompany();
  const queryClient = useQueryClient();

  // Récupérer tous les membres d'équipe
  const {
    data: teamMembers = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['team-members', companyInfo?.id],
    queryFn: async () => {
      if (!companyInfo?.id) return [];

      try {
        const { data, error } = await supabase
          .from('user_companies')
          .select(`
            id,
            user_id,
            company_id,
            role,
            active,
            qualifications,
            created_at,
            updated_at
          `)
          .eq('company_id', companyInfo.id)
          .eq('active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Enrichir avec les profils utilisateur
        const enrichedData = await Promise.all(
          (data || []).map(async (userCompany) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name, last_name, email')
              .eq('id', userCompany.user_id)
              .single();

            return {
              ...userCompany,
              profiles: profile
            };
          })
        );

        return enrichedData as TeamMember[];
      } catch (error) {
        console.error('Error fetching team members:', error);
        return [];
      }
    },
    enabled: !!companyInfo?.id
  });

  // Mettre à jour un membre d'équipe
  const updateTeamMember = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTeamMemberData }) => {
      const { data: teamMember, error } = await supabase
        .from('user_companies')
        .update(data)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return teamMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast({
        title: "Succès",
        description: "Membre d'équipe modifié avec succès"
      });
    },
    onError: (error: any) => {
      console.error('Error updating team member:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la modification du membre d'équipe",
        variant: "destructive"
      });
    }
  });

  // Désactiver un membre d'équipe (au lieu de le supprimer)
  const removeTeamMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_companies')
        .update({ active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast({
        title: "Succès",
        description: "Membre d'équipe retiré avec succès"
      });
    },
    onError: (error: any) => {
      console.error('Error removing team member:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors du retrait du membre d'équipe",
        variant: "destructive"
      });
    }
  });

  return {
    teamMembers,
    isLoading,
    error,
    updateTeamMember,
    removeTeamMember
  };
};