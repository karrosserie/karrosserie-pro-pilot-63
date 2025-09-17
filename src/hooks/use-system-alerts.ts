import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';

export interface SystemAlert {
  id: string;
  company_id: string;
  entity_type: 'employee' | 'vehicle' | 'messagerie';
  employee_id: string | null;
  vehicle_id: string | null;
  repair_order_id: string | null;
  messagerie_id: string | null;
  alert_type: string;
  title: string;
  message: string;
  reason: string | null;
  clock_in_time: string | null;
  created_at: string;
  resolved: boolean;
  resolved_at: string | null;
  employee_name?: string;
  vehicle_info?: string;
  messagerie_info?: {
    title: string;
    priority: number;
    channel: string;
    summary: string;
  };
}

export const useSystemAlerts = () => {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { companyData } = useCompany();

  const fetchAlerts = async () => {
    if (!companyData?.id) return;

    try {
      setIsLoading(true);
      
      // Récupérer les alertes non résolues du dernier mois
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
      
      const { data: alertsData, error } = await supabase
        .from('system_alerts')
        .select('*')
        .eq('company_id', companyData.id)
        .eq('resolved', false)
        .gte('created_at', oneMonthAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching system alerts:', error);
        return;
      }

      // Récupérer les informations complémentaires pour les employés et véhicules
      const enrichedAlerts: SystemAlert[] = [];
      
      for (const alert of alertsData || []) {
        if (alert.entity_type === 'employee' && alert.employee_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', alert.employee_id)
            .single();
          
          const displayName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Employé inconnu';
          
          enrichedAlerts.push({
            ...alert,
            entity_type: 'employee',
            employee_name: displayName
          } as SystemAlert);
        } else if (alert.entity_type === 'vehicle' && alert.vehicle_id) {
          const { data: vehicle } = await supabase
            .from('vehicles')
            .select(`
              license_plate,
              car_brands(name),
              car_models(name)
            `)
            .eq('id', alert.vehicle_id)
            .single();
          
          // Récupérer la raison depuis employee_schedule si elle existe
          let waitingReason = alert.reason;
          const { data: schedule } = await supabase
            .from('employee_schedule')
            .select('waiting_reason')
            .eq('vehicle_id', alert.vehicle_id)
            .not('waiting_reason', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (schedule?.waiting_reason) {
            waitingReason = schedule.waiting_reason;
          }
          
          let displayInfo = 'Véhicule inconnu';
          if (vehicle) {
            displayInfo = `${vehicle.car_brands?.name || 'Marque inconnue'} ${vehicle.car_models?.name || 'Modèle inconnu'} - ${vehicle.license_plate}`;
          }
          
          enrichedAlerts.push({
            ...alert,
            entity_type: 'vehicle',
            vehicle_info: displayInfo,
            reason: waitingReason
          } as SystemAlert);
        } else if (alert.entity_type === 'messagerie' && alert.messagerie_id) {
          const { data: messagerie } = await supabase
            .from('messageries')
            .select('title, priority, channel, summary')
            .eq('id', alert.messagerie_id)
            .single();
          
          enrichedAlerts.push({
            ...alert,
            entity_type: 'messagerie',
            messagerie_info: messagerie || undefined
          } as SystemAlert);
        }
      }

      setAlerts(enrichedAlerts);
    } catch (error) {
      console.error('Error fetching system alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('system_alerts')
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