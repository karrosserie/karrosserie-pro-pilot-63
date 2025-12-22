import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Employee {
  id: string;
  user_id: string;
  company_id: string;
  nom: string;
  email: string;
  telephone: string;
  qualifications: string[];
  actif: boolean;
  role: string;
  planningJour?: any[];
}

export interface QualificationOption {
  id: string;
  name: string;
  color: string;
}

// Classes de métier (système RPG)
export const EMPLOYEE_CLASSES: QualificationOption[] = [
  { id: 'carrossier', name: 'Carrossier', color: 'bg-blue-500/20 text-blue-700' },
  { id: 'peintre', name: 'Peintre', color: 'bg-orange-500/20 text-orange-700' },
  { id: 'mecanicien', name: 'Mécanicien', color: 'bg-green-500/20 text-green-700' }
];

// Qualifications standard de carrosserie (legacy - pour compatibilité)
export const STANDARD_QUALIFICATIONS: QualificationOption[] = EMPLOYEE_CLASSES;

export const useEmployeeData = (companyId: string | null) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [qualifications, setQualifications] = useState<QualificationOption[]>(STANDARD_QUALIFICATIONS);

  useEffect(() => {
    console.log('🚀🚀🚀 useEmployeeData: useEffect TRIGGERED with companyId:', companyId);
    console.log('🔍 useEmployeeData: Type et valeur du companyId:', {
      companyId,
      type: typeof companyId,
      truthy: !!companyId,
      length: companyId?.length,
      isEmpty: !companyId || companyId === ''
    });
    
    if (!companyId) {
      console.log('⚠️⚠️⚠️ useEmployeeData: No companyId provided, setting loading to false');
      setLoading(false);
      return;
    }

    console.log('✅✅✅ useEmployeeData: CompanyId valide, lancement de fetchEmployees');
    fetchEmployees();
  }, [companyId]);

  // Suppression du useEffect qui causait le chargement infini

  const fetchEmployees = async () => {
    try {
      console.log('🚀🚀🚀 useEmployeeData: Starting fetchEmployees with companyId:', companyId);
      setLoading(true);
      
      // Utiliser l'edge function pour contourner les problèmes RLS
      console.log('📡📡📡 useEmployeeData: Calling get-employees edge function...');
      
      const { data, error } = await supabase.functions.invoke('get-employees', {
        body: { companyId }
      });

      console.log('📦📦📦 useEmployeeData: Response from edge function:', { data, error });

      if (error) {
        console.error('❌ Error from edge function:', error);
        setLoading(false);
        return;
      }

      if (!data?.employees || data.employees.length === 0) {
        console.log('⚠️ useEmployeeData: No employees found for company:', companyId);
        setEmployees([]);
        setLoading(false);
        return;
      }

      console.log('✅ Employees loaded via edge function:', data.employees);
      setEmployees(data.employees);

    } catch (error) {
      console.error('❌ Unexpected error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateEmployeeQualifications = async (userId: string, newQualifications: string[]) => {
    try {
      const { error } = await supabase
        .from('user_companies')
        .update({ 
          qualifications: newQualifications,
          updated_at: new Date().toISOString() 
        } as any)
        .eq('user_id', userId)
        .eq('company_id', companyId);

      if (error) {
        console.error('❌ Error updating qualifications:', error);
        return false;
      }

      // Mettre à jour l'état local
      setEmployees(prev => 
        prev.map(emp => 
          emp.user_id === userId 
            ? { ...emp, qualifications: newQualifications }
            : emp
        )
      );

      return true;
    } catch (error) {
      console.error('❌ Unexpected error updating qualifications:', error);
      return false;
    }
  };

  const createEmployee = async (employeeData: { nom: string, email: string, telephone: string, qualifications: string[] }) => {
    try {
      // TODO: Implémenter la création d'employé via invitation email
      // Pour l'instant, on simule une création réussie
      console.log('🔄 useEmployeeData: Creating employee:', employeeData);
      
      // Simuler un employé créé (en attendant l'implémentation complète)
      const newEmployee: Employee = {
        id: `temp_${Date.now()}`,
        user_id: `temp_user_${Date.now()}`,
        company_id: companyId!,
        nom: employeeData.nom,
        email: employeeData.email,
        telephone: employeeData.telephone,
        qualifications: employeeData.qualifications,
        actif: true,
        role: 'carrossier',
        planningJour: []
      };
      
      // Ajouter temporairement à la liste locale
      setEmployees(prev => [...prev, newEmployee]);
      
      // TODO: Remplacer par une vraie création avec invitation email
      console.log('✅ useEmployeeData: Employee created temporarily');
      return true;
    } catch (error) {
      console.error('❌ Error creating employee:', error);
      return false;
    }
  };

  return {
    employees,
    loading,
    qualifications,
    updateEmployeeQualifications,
    createEmployee,
    refetch: fetchEmployees
  };
};