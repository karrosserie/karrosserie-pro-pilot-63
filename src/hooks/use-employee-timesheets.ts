import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCompany } from '@/hooks/use-company';

export interface TimesheetEntry {
  id?: string;
  date: string;
  employee_id: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  status?: 'present' | 'sick_leave' | 'absent';
  notes?: string;
  total_work_minutes?: number;
  location_verified?: boolean;
}

export const useEmployeeTimesheets = () => {
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { companyData } = useCompany();

  const fetchTimesheets = async () => {
    if (!companyData?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('employee_timesheets')
        .select('*')
        .eq('company_id', companyData.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setTimesheets(data || []);
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les pointages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createOrUpdateTimesheet = async (entry: TimesheetEntry) => {
    if (!companyData?.id) return null;

    try {
      // Vérifier si un timesheet existe déjà pour cet employé à cette date
      const { data: existing, error: fetchError } = await supabase
        .from('employee_timesheets')
        .select('*')
        .eq('company_id', companyData.id)
        .eq('employee_id', entry.employee_id)
        .eq('date', entry.date)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      let result;

      if (existing) {
        // Mettre à jour l'entrée existante
        const { data, error } = await supabase
          .from('employee_timesheets')
          .update({
            clock_in_time: entry.clock_in_time,
            clock_out_time: entry.clock_out_time,
            total_work_minutes: entry.total_work_minutes,
            location_verified: entry.location_verified || false,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Créer une nouvelle entrée
        const { data, error } = await supabase
          .from('employee_timesheets')
          .insert({
            company_id: companyData.id,
            employee_id: entry.employee_id,
            date: entry.date,
            clock_in_time: entry.clock_in_time,
            clock_out_time: entry.clock_out_time,
            total_work_minutes: entry.total_work_minutes,
            location_verified: entry.location_verified || false
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      // Mettre à jour l'état local
      setTimesheets(prev => {
        const filtered = prev.filter(t => 
          !(t.employee_id === entry.employee_id && t.date === entry.date)
        );
        return [result, ...filtered];
      });

      toast({
        title: "Succès",
        description: "Pointage enregistré avec succès",
      });

      return result;
    } catch (error) {
      console.error('Error creating/updating timesheet:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le pointage",
        variant: "destructive",
      });
      return null;
    }
  };

  const markAsSickLeave = async (employeeId: string, date: string) => {
    return await createOrUpdateTimesheet({
      employee_id: employeeId,
      date: date,
      clock_in_time: null,
      clock_out_time: null,
      status: 'sick_leave',
      total_work_minutes: 0,
      location_verified: false
    });
  };

  const markAsAbsent = async (employeeId: string, date: string) => {
    return await createOrUpdateTimesheet({
      employee_id: employeeId,
      date: date,
      clock_in_time: null,
      clock_out_time: null,
      status: 'absent',
      total_work_minutes: 0,
      location_verified: false
    });
  };

  const calculateWorkMinutes = (clockIn: string, clockOut: string): number => {
    const startTime = new Date(`${new Date().toDateString()} ${clockIn}`);
    const endTime = new Date(`${new Date().toDateString()} ${clockOut}`);
    
    if (endTime <= startTime) {
      return 0;
    }
    
    return Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
  };

  useEffect(() => {
    fetchTimesheets();
  }, [companyData?.id]);

  return {
    timesheets,
    isLoading,
    createOrUpdateTimesheet,
    markAsSickLeave,
    markAsAbsent,
    calculateWorkMinutes,
    refetch: fetchTimesheets
  };
};