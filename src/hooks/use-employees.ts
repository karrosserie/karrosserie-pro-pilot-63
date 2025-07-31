import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';
import { toast } from '@/hooks/use-toast';

export interface Employee {
  id: string;
  company_id: string;
  team_member_id: string | null;
  qualifications: string[];
  created_at: string;
  updated_at: string;
  user_companies?: {
    id: string;
    role: string;
    profiles?: {
      first_name: string;
      last_name: string;
      email: string;
    } | null;
  } | null;
}

export interface CreateEmployeeData {
  team_member_id: string;
  qualifications: string[];
}

export interface UpdateEmployeeData {
  team_member_id?: string;
  qualifications?: string[];
}

export const useEmployees = () => {
  const { companyInfo } = useCompany();
  const queryClient = useQueryClient();

  // Récupérer tous les employés
  const {
    data: employees = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['employees', companyInfo?.id],
    queryFn: async () => {
      if (!companyInfo?.id) return [];

      try {
        // D'abord récupérer les employés
        const { data: employeesData, error: employeesError } = await supabase
          .from('employees')
          .select('*')
          .eq('company_id', companyInfo.id)
          .order('created_at', { ascending: false });

        if (employeesError) throw employeesError;

        // Ensuite enrichir avec les données des membres d'équipe
        const enrichedEmployees = await Promise.all(
          (employeesData || []).map(async (employee) => {
            if (!employee.team_member_id) {
              return { ...employee, user_companies: null };
            }

            const { data: userCompany } = await supabase
              .from('user_companies')
              .select('id, role, user_id')
              .eq('id', employee.team_member_id)
              .single();

            if (!userCompany) {
              return { ...employee, user_companies: null };
            }

            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name, last_name, email')
              .eq('id', userCompany.user_id)
              .single();

            return {
              ...employee,
              user_companies: {
                id: userCompany.id,
                role: userCompany.role,
                profiles: profile
              }
            };
          })
        );

        return enrichedEmployees as Employee[];
      } catch (error) {
        console.error('Error fetching employees:', error);
        return [];
      }
    },
    enabled: !!companyInfo?.id
  });

  // Créer un employé
  const createEmployee = useMutation({
    mutationFn: async (data: CreateEmployeeData) => {
      if (!companyInfo?.id) throw new Error('Company ID not found');

      const { data: employee, error } = await supabase
        .from('employees')
        .insert({
          company_id: companyInfo.id,
          team_member_id: data.team_member_id,
          qualifications: data.qualifications
        })
        .select('*')
        .single();

      if (error) throw error;
      return employee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Succès",
        description: "Employé ajouté avec succès"
      });
    },
    onError: (error: any) => {
      console.error('Error creating employee:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout de l'employé",
        variant: "destructive"
      });
    }
  });

  // Mettre à jour un employé
  const updateEmployee = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEmployeeData }) => {
      const { data: employee, error } = await supabase
        .from('employees')
        .update(data)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return employee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Succès",
        description: "Employé modifié avec succès"
      });
    },
    onError: (error: any) => {
      console.error('Error updating employee:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la modification de l'employé",
        variant: "destructive"
      });
    }
  });

  // Supprimer un employé
  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Succès",
        description: "Employé supprimé avec succès"
      });
    },
    onError: (error: any) => {
      console.error('Error deleting employee:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression de l'employé",
        variant: "destructive"
      });
    }
  });

  return {
    employees,
    isLoading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee
  };
};