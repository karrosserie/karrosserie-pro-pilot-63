import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';

export interface EmployeeAlert {
  id: string;
  company_id: string;
  employee_id: string;
  alert_type: string;
  title: string;
  message: string;
  clock_in_time: string;
  created_at: string;
  resolved: boolean;
  resolved_at: string | null;
  employee_name?: string;
}

export const useEmployeeAlerts = () => {
  const [alerts, setAlerts] = useState<EmployeeAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { companyData } = useCompany();

  const fetchAlerts = async () => {
    if (!companyData?.id) return;

    try {
      setIsLoading(true);
      
      // Récupérer les alertes non résolues des dernières 24 heures
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { data: alertsData, error } = await supabase
        .from('employee_alerts')
        .select('*')
        .eq('company_id', companyData.id)
        .eq('resolved', false)
        .gte('created_at', yesterday.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching employee alerts:', error);
        return;
      }

      // Récupérer les noms des employés
      const employeeIds = alertsData?.map(alert => alert.employee_id) || [];
      let profiles: any[] = [];
      
      if (employeeIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', employeeIds);

        if (!profilesError) {
          profiles = profilesData || [];
        }
      }

      // Enrichir les alertes avec les noms des employés
      const enrichedAlerts = alertsData?.map(alert => {
        const profile = profiles.find(p => p.id === alert.employee_id);
        const employeeName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Employé inconnu';
        
        return {
          ...alert,
          employee_name: employeeName
        };
      }) || [];

      setAlerts(enrichedAlerts);
    } catch (error) {
      console.error('Error fetching employee alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('employee_alerts')
        .update({ 
          resolved: true, 
          resolved_at: new Date().toISOString() 
        })
        .eq('id', alertId);

      if (error) {
        console.error('Error resolving alert:', error);
        return false;
      }

      // Mettre à jour la liste locale
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
      return true;
    } catch (error) {
      console.error('Error resolving alert:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [companyData?.id]);

  return {
    alerts,
    isLoading,
    refetch: fetchAlerts,
    resolveAlert
  };
};