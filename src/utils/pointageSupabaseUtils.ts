import { supabase } from '@/integrations/supabase/client';
import { verifyEmployeeLocation } from './geolocationService';

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
      .order('created_at', { ascending: false })
      .limit(1);
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    return null;
  }
};

export const getTodayTimesheet = async (employeId: string): Promise<{pauses?: any[], breaks?: any[]}> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data: timesheets } = await supabase
      .from('employee_timesheets')
      .select('*')
      .eq('user_id', employeId)
      .eq('date', today)
      .order('created_at', { ascending: false })
      .limit(1);

    const timesheet = timesheets && timesheets.length > 0 ? timesheets[0] : null;
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
    
    // Rechercher un timesheet actif (pas encore dépointé)
    const { data: activeTimesheets } = await supabase
      .from('employee_timesheets')
      .select('*')
      .eq('user_id', employeId)
      .eq('date', today)
      .is('clock_out_time', null)
      .order('created_at', { ascending: false })
      .limit(1);

    // Si pas de timesheet actif, montrer le modal
    const hasActiveTimesheet = activeTimesheets && activeTimesheets.length > 0;
    const shouldShow = !hasActiveTimesheet;
    console.log('🔍 shouldShowPointageModal result:', { employeId, today, hasActiveTimesheet, shouldShow });
    
    return shouldShow;
  } catch (error) {
    console.error('Error checking pointage status:', error);
    return true; // En cas d'erreur, montrer le modal par sécurité
  }
};

export const hasActiveBreak = async (employeId: string): Promise<boolean> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Récupérer le timesheet actif d'aujourd'hui
    const { data: activeTimesheets } = await supabase
      .from('employee_timesheets')
      .select('*')
      .eq('user_id', employeId)
      .eq('date', today)
      .is('clock_out_time', null)
      .order('created_at', { ascending: false })
      .limit(1);

    const activeTimesheet = activeTimesheets && activeTimesheets.length > 0 ? activeTimesheets[0] : null;
    if (!activeTimesheet) return false;

    // Vérifier s'il y a une pause active (break_start_time sans break_end_time)
    const { data: activeBreaks } = await supabase
      .from('employee_breaks')
      .select('*')
      .eq('timesheet_id', activeTimesheet.id)
      .is('break_end_time', null)
      .limit(1);

    return activeBreaks && activeBreaks.length > 0;
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

    // Récupérer les informations de l'entreprise pour la géolocalisation
    const { data: company } = await supabase
      .from('company_info')
      .select('latitude, longitude')
      .eq('id', companyId)
      .single();

    if (!company?.latitude || !company?.longitude) {
      return { success: false, message: 'Position de l\'entreprise non configurée. Contactez votre administrateur.' };
    }

    // Vérifier la position de l'employé
    const locationResult = await verifyEmployeeLocation(
      { latitude: company.latitude, longitude: company.longitude },
      100 // Rayon de 100m
    );

    if (!locationResult.success) {
      return { success: false, message: locationResult.message };
    }

    // Vérifier s'il existe déjà un timesheet actif pour aujourd'hui
    const { data: activeTimesheets } = await supabase
      .from('employee_timesheets')
      .select('*')
      .eq('user_id', employeId)
      .eq('date', today)
      .is('clock_out_time', null)
      .order('created_at', { ascending: false })
      .limit(1);

    if (activeTimesheets && activeTimesheets.length > 0) {
      return { success: false, message: 'Vous avez déjà un pointage actif aujourd\'hui' };
    }

    // Créer un nouveau timesheet avec les données de géolocalisation
    const { error } = await supabase
      .from('employee_timesheets')
      .insert({
        company_id: companyId,
        user_id: employeId,
        date: today,
        clock_in_time: now,
        location_verified: true,
        clock_in_latitude: locationResult.userPosition?.latitude,
        clock_in_longitude: locationResult.userPosition?.longitude
      });

    if (error) throw error;

    console.log('✅ Pointage d\'arrivée enregistré pour:', employeId);
    return { success: true, message: `Pointage d'arrivée enregistré avec succès. Distance: ${locationResult.distance}m` };
  } catch (error) {
    console.error('❌ Erreur lors du pointage:', error);
    return { success: false, message: 'Erreur lors du pointage' };
  }
};

export const startBreak = async (employeId: string): Promise<{success: boolean, message: string}> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    
    // Récupérer le timesheet actif d'aujourd'hui
    const { data: activeTimesheets } = await supabase
      .from('employee_timesheets')
      .select('*')
      .eq('user_id', employeId)
      .eq('date', today)
      .is('clock_out_time', null)
      .order('created_at', { ascending: false })
      .limit(1);

    const activeTimesheet = activeTimesheets && activeTimesheets.length > 0 ? activeTimesheets[0] : null;
    if (!activeTimesheet) {
      return { success: false, message: 'Aucun pointage actif trouvé aujourd\'hui' };
    }

    // Vérifier s'il y a déjà une pause active
    const { data: activeBreaks } = await supabase
      .from('employee_breaks')
      .select('*')
      .eq('timesheet_id', activeTimesheet.id)
      .is('break_end_time', null)
      .limit(1);

    if (activeBreaks && activeBreaks.length > 0) {
      return { success: false, message: 'Vous avez déjà une pause en cours' };
    }

    // Créer une nouvelle pause
    const { error } = await supabase
      .from('employee_breaks')
      .insert({
        timesheet_id: activeTimesheet.id,
        break_start_time: now
      });

    if (error) throw error;

    console.log('✅ Pause démarrée pour:', employeId);
    return { success: true, message: 'Pause démarrée avec succès' };
  } catch (error) {
    console.error('❌ Erreur lors du démarrage de la pause:', error);
    return { success: false, message: 'Erreur lors du démarrage de la pause' };
  }
};

export const endBreak = async (employeId: string): Promise<{success: boolean, message: string}> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    
    // Récupérer l'ID de la compagnie pour la vérification de position
    const companyId = await getCurrentCompanyId();
    if (!companyId) {
      return { success: false, message: 'Impossible de récupérer les informations de la compagnie' };
    }

    // Récupérer les informations de l'entreprise pour la géolocalisation
    const { data: company } = await supabase
      .from('company_info')
      .select('latitude, longitude')
      .eq('id', companyId)
      .single();

    if (!company?.latitude || !company?.longitude) {
      return { success: false, message: 'Position de l\'entreprise non configurée. Contactez votre administrateur.' };
    }

    // Vérifier la position de l'employé
    const locationResult = await verifyEmployeeLocation(
      { latitude: company.latitude, longitude: company.longitude },
      100 // Rayon de 100m
    );

    if (!locationResult.success) {
      return { success: false, message: locationResult.message };
    }

    // Récupérer le timesheet actif d'aujourd'hui
    const { data: activeTimesheets } = await supabase
      .from('employee_timesheets')
      .select('*')
      .eq('user_id', employeId)
      .eq('date', today)
      .is('clock_out_time', null)
      .order('created_at', { ascending: false })
      .limit(1);

    const activeTimesheet = activeTimesheets && activeTimesheets.length > 0 ? activeTimesheets[0] : null;
    if (!activeTimesheet) {
      return { success: false, message: 'Aucun pointage actif trouvé aujourd\'hui' };
    }

    // Récupérer la pause active
    const { data: activeBreaks } = await supabase
      .from('employee_breaks')
      .select('*')
      .eq('timesheet_id', activeTimesheet.id)
      .is('break_end_time', null)
      .order('break_start_time', { ascending: false })
      .limit(1);

    const activeBreak = activeBreaks && activeBreaks.length > 0 ? activeBreaks[0] : null;
    if (!activeBreak) {
      return { success: false, message: 'Aucune pause active trouvée' };
    }

    // Terminer la pause
    const { error } = await supabase
      .from('employee_breaks')
      .update({
        break_end_time: now
      })
      .eq('id', activeBreak.id);

    if (error) throw error;

    console.log('✅ Pause terminée pour:', employeId);
    return { success: true, message: `Reprise du travail enregistrée avec succès. Distance: ${locationResult.distance}m` };
  } catch (error) {
    console.error('❌ Erreur lors de la fin de pause:', error);
    return { success: false, message: 'Erreur lors de la fin de pause' };
  }
};