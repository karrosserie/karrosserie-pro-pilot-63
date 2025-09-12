import { supabase } from '@/integrations/supabase/client';

export const getCurrentCompanyId = async (): Promise<string | null> => {
  try {
    const { data: userCompany } = await supabase
      .from('user_companies')
      .select('company_id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .eq('active', true)
      .single();
    
    return userCompany?.company_id || null;
  } catch (error) {
    console.error('Error getting company ID:', error);
    return null;
  }
};

export const getEmployeePointageData = async (employeId: string) => {
  console.log('getEmployeePointageData called for:', employeId);
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('employee_timesheets')
      .select('*')
      .eq('user_id', employeId)
      .eq('date', today)
      .single();
    return data;
  } catch (error) {
    return null;
  }
};

export const getTodayTimesheet = async (employeId: string): Promise<{pauses?: any[], breaks?: any[]}> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data: timesheet } = await supabase
      .from('employee_timesheets')
      .select('*')
      .eq('user_id', employeId)
      .eq('date', today)
      .single();

    if (!timesheet) return { pauses: [], breaks: [] };

    const { data: breaks } = await supabase
      .from('employee_breaks')
      .select('*')
      .eq('timesheet_id', timesheet.id);

    return { breaks: breaks || [] };
  } catch (error) {
    return { pauses: [], breaks: [] };
  }
};

export const calculateWorkTime = (data: any, employeId?: string) => {
  if (!data?.clock_in_time || !data?.clock_out_time) return 0;
  const clockIn = new Date(data.clock_in_time);
  const clockOut = new Date(data.clock_out_time);
  return Math.floor((clockOut.getTime() - clockIn.getTime()) / (1000 * 60));
};

export const formatWorkTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const shouldShowPointageModal = async (employeId: string): Promise<boolean> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Vérifier s'il y a un pointage pour aujourd'hui
    const { data: timesheet } = await supabase
      .from('employee_timesheets')
      .select('*')
      .eq('user_id', employeId)
      .eq('date', today)
      .single();

    // Si pas de timesheet ou pas d'heure d'arrivée, montrer le modal
    const shouldShow = !timesheet || !timesheet.clock_in_time;
    console.log('🔍 shouldShowPointageModal result:', { employeId, today, hasTimesheet: !!timesheet, hasClockedIn: !!timesheet?.clock_in_time, shouldShow });
    
    return shouldShow;
  } catch (error) {
    console.error('Error checking pointage status:', error);
    return true; // En cas d'erreur, montrer le modal par sécurité
  }
};

export const hasActiveBreak = async (employeId: string): Promise<boolean> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Récupérer le timesheet d'aujourd'hui
    const { data: timesheet } = await supabase
      .from('employee_timesheets')
      .select('*')
      .eq('user_id', employeId)
      .eq('date', today)
      .single();

    if (!timesheet) return false;

    // Vérifier s'il y a une pause active (break_start_time sans break_end_time)
    const { data: activeBreak } = await supabase
      .from('employee_breaks')
      .select('*')
      .eq('timesheet_id', timesheet.id)
      .is('break_end_time', null)
      .single();

    return !!activeBreak;
  } catch (error) {
    console.error('Error checking active break:', error);
    return false;
  }
};

export const clockIn = async (employeId: string): Promise<{success: boolean, message: string}> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    
    // Récupérer l'ID de la compagnie
    const companyId = await getCurrentCompanyId();
    if (!companyId) {
      return { success: false, message: 'Impossible de récupérer les informations de la compagnie' };
    }

    // Vérifier s'il existe déjà un pointage pour aujourd'hui
    const { data: existingTimesheet } = await supabase
      .from('employee_timesheets')
      .select('*')
      .eq('user_id', employeId)
      .eq('date', today)
      .single();

    if (existingTimesheet && existingTimesheet.clock_in_time) {
      return { success: false, message: 'Vous avez déjà pointé aujourd\'hui' };
    }

    if (existingTimesheet) {
      // Mettre à jour le timesheet existant
      const { error } = await supabase
        .from('employee_timesheets')
        .update({
          clock_in_time: now,
          location_verified: true
        })
        .eq('id', existingTimesheet.id);

      if (error) throw error;
    } else {
      // Créer un nouveau timesheet
      const { error } = await supabase
        .from('employee_timesheets')
        .insert({
          company_id: companyId,
          user_id: employeId,
          date: today,
          clock_in_time: now,
          location_verified: true
        });

      if (error) throw error;
    }

    console.log('✅ Pointage d\'arrivée enregistré pour:', employeId);
    return { success: true, message: 'Pointage d\'arrivée enregistré avec succès' };
  } catch (error) {
    console.error('❌ Erreur lors du pointage:', error);
    return { success: false, message: 'Erreur lors du pointage' };
  }
};