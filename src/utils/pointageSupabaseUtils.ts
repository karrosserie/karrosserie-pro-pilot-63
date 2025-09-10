import { supabase } from '@/integrations/supabase/client';
import { verifyEmployeeLocation, Position } from './geolocationService';
import { EntrepriseInfo } from '@/hooks/usePlanningManager';

// ✅ CACHE LOCAL pour les employés de test
const testEmployeePointageCache = new Map<string, {
  hasPointedToday: boolean;
  hasDepointedToday: boolean;
  pointageTime?: string;
  depointageTime?: string;
  breaks: any[];
}>();

// Types for Supabase pointage system
export interface TimesheetData {
  id: string;
  employee_id: string;
  company_id: string;
  date: string;
  clock_in_time: string;
  clock_out_time?: string;
  total_work_minutes: number;
  breaks: BreakData[];
}

export interface BreakData {
  id: string;
  timesheet_id: string;
  break_start_time: string;
  break_end_time?: string;
  duration_minutes: number;
}

/**
 * Get test employee company info (for local testing)
 */
function getTestEmployeeCompanyInfo(employeeId: string): EntrepriseInfo | null {
  // Sophie Martin's company info for testing
  if (employeeId === '2') {
    return {
      nom: 'Carrosserie Martin',
      adresse: '134 boulevard Michelet',
      ville: 'Marseille',
      codePostal: '13008',
      latitude: 43.265661399999985,
      longitude: 5.394406769313222,
      rayonGeolocalisation: 1000,
      email: 'sophie.martin@carrosserie-martin.fr',
      telephone: '04.91.73.45.67'
    };
  }
  return null;
}

/**
 * Get the current user's company ID
 */
export async function getCurrentCompanyId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.log('❌ Aucun utilisateur connecté');
    return null;
  }

  const { data: userCompany } = await supabase
    .from('user_companies')
    .select('company_id')
    .eq('user_id', user.id)
    .eq('active', true)
    .single();

  return userCompany?.company_id || null;
}

/**
 * Get today's timesheet for an employee
 * ✅ Gère maintenant le cache local pour les employés de test
 */
export async function getTodayTimesheet(employeeId: string): Promise<TimesheetData | null> {
  const today = new Date().toISOString().split('T')[0];
  
  // ✅ NOUVELLE LOGIQUE: Vérifier d'abord si c'est un employé de test
  const testEmployeeInfo = getTestEmployeeCompanyInfo(employeeId);
  if (testEmployeeInfo) {
    const cacheKey = `${employeeId}-${today}`;
    const cachedData = testEmployeePointageCache.get(cacheKey);
    
    if (!cachedData || !cachedData.hasPointedToday) {
      console.log('📝 Employé test - Aucun pointage en cache');
      return null;
    }
    
    console.log('💾 Employé test - Données trouvées en cache:', cachedData);
    return {
      id: `test-timesheet-${employeeId}`,
      employee_id: employeeId,
      company_id: 'test-company-id',
      date: today,
      clock_in_time: cachedData.pointageTime!,
      clock_out_time: cachedData.hasDepointedToday ? cachedData.depointageTime : undefined,
      total_work_minutes: 0,
      breaks: cachedData.breaks || []
    };
  }
  
  // Pour les vrais employés, utiliser Supabase
  const { data: timesheet } = await supabase
    .from('employee_timesheets')
    .select(`
      *,
      employee_breaks (*)
    `)
    .eq('user_id', employeeId)
    .eq('date', today)
    .maybeSingle();

  if (!timesheet) return null;

  return {
    id: timesheet.id,
    employee_id: timesheet.user_id,
    company_id: timesheet.company_id,
    date: timesheet.date,
    clock_in_time: timesheet.clock_in_time,
    clock_out_time: timesheet.clock_out_time,
    total_work_minutes: timesheet.total_work_minutes,
    breaks: timesheet.employee_breaks?.map((b: any) => ({
      id: b.id,
      timesheet_id: b.timesheet_id,
      break_start_time: b.break_start_time,
      break_end_time: b.break_end_time,
      duration_minutes: b.duration_minutes
    })) || []
  };
}

/**
 * Clock in an employee with location verification
 */
export async function clockIn(employeeId: string): Promise<{ success: boolean; message: string }> {
  try {
    // Check if this is a test employee (local data)
    const testEmployeeInfo = getTestEmployeeCompanyInfo(employeeId);
    
    let companyPosition: Position;
    let locationRadius: number;
    let companyId: string | null = null;

    if (testEmployeeInfo) {
      // Use local test data for Sophie Martin
      companyPosition = {
        latitude: testEmployeeInfo.latitude,
        longitude: testEmployeeInfo.longitude
      };
      locationRadius = testEmployeeInfo.rayonGeolocalisation;
      companyId = 'test-company-id'; // Dummy company ID for test
    } else {
      // Use Supabase data for real employees
      companyId = await getCurrentCompanyId();
      if (!companyId) {
        return { success: false, message: 'Impossible de récupérer les informations de l\'entreprise' };
      }

      // Get company location from Supabase
      const { data: companyInfo } = await supabase
        .from('company_info')
        .select('latitude, longitude, location_radius')
        .eq('id', companyId)
        .single();

      if (!companyInfo?.latitude || !companyInfo?.longitude) {
        return { success: false, message: 'Position de l\'entreprise non configurée' };
      }

      companyPosition = {
        latitude: companyInfo.latitude,
        longitude: companyInfo.longitude
      };
      locationRadius = companyInfo.location_radius || 1000;
    }

    // Verify employee location
    console.log('🔍 Vérification de la géolocalisation pour l\'employé:', employeeId);
    const locationResult = await verifyEmployeeLocation(
      companyPosition, 
      locationRadius
    );

    console.log('📊 Résultat de la géolocalisation:', {
      success: locationResult.success,
      distance: locationResult.distance,
      userPosition: locationResult.userPosition,
      message: locationResult.message
    });

    if (!locationResult.success) {
      console.log('❌ Pointage refusé:', locationResult.message);
      return { success: false, message: locationResult.message };
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Check if already clocked in today
    const existing = await getTodayTimesheet(employeeId);
    if (existing) {
      return { success: false, message: 'Déjà pointé pour aujourd\'hui' };
    }

    // ✅ NOUVELLE LOGIQUE: Pour les employés de test, sauvegarder dans le cache local
    if (testEmployeeInfo) {
      const today = new Date().toISOString().split('T')[0];
      const cacheKey = `${employeeId}-${today}`;
      const pointageTime = new Date().toISOString();
      
      // Mettre à jour le cache local
      testEmployeePointageCache.set(cacheKey, {
        hasPointedToday: true,
        hasDepointedToday: false,
        pointageTime: pointageTime,
        breaks: []
      });
      
      console.log(`✅ Test pointage pour ${testEmployeeInfo.nom} à ${testEmployeeInfo.adresse}`);
      console.log('📍 Coordonnées exactes de l\'employé au moment du pointage:', locationResult.userPosition);
      console.log('🏢 Coordonnées de l\'entreprise:', companyPosition);
      console.log('📏 Distance: ' + Math.round(locationResult.distance!) + 'm');
      console.log('💾 Cache mis à jour:', testEmployeePointageCache.get(cacheKey));
      
      return { 
        success: true, 
        message: `Pointage test enregistré à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
      };
    }

    // Insert timesheet with location data for real employees
    const { error } = await supabase
      .from('employee_timesheets')
      .insert({
        user_id: employeeId,
        company_id: companyId,
        date: today,
        clock_in_time: new Date().toISOString(),
        clock_in_latitude: locationResult.userPosition?.latitude,
        clock_in_longitude: locationResult.userPosition?.longitude,
        location_verified: true
      });

    if (error) throw error;

    return { 
      success: true, 
      message: `Pointage enregistré à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
    };
  } catch (error) {
    console.error('Error clocking in:', error);
    return { success: false, message: 'Erreur lors du pointage' };
  }
}

/**
 * Clock out an employee
 */
export async function clockOut(employeeId: string): Promise<{ success: boolean; message: string }> {
  try {
    const timesheet = await getTodayTimesheet(employeeId);
    if (!timesheet) {
      return { success: false, message: 'Aucun pointage d\'arrivée trouvé pour aujourd\'hui' };
    }

    if (timesheet.clock_out_time) {
      return { success: false, message: 'Déjà dépointé pour aujourd\'hui' };
    }

    // ✅ NOUVELLE LOGIQUE: Gérer le cache local pour les employés de test
    const testEmployeeInfo = getTestEmployeeCompanyInfo(employeeId);
    if (testEmployeeInfo) {
      const today = new Date().toISOString().split('T')[0];
      const cacheKey = `${employeeId}-${today}`;
      const cachedData = testEmployeePointageCache.get(cacheKey);
      
      if (cachedData) {
        cachedData.hasDepointedToday = true;
        cachedData.depointageTime = new Date().toISOString();
        testEmployeePointageCache.set(cacheKey, cachedData);
        
        console.log('💾 Cache dépointage mis à jour:', testEmployeePointageCache.get(cacheKey));
        return { 
          success: true, 
          message: `Dépointage test enregistré à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
        };
      }
    }

    // End any active break for real employees
    const activeBreak = timesheet.breaks.find(b => !b.break_end_time);
    if (activeBreak) {
      await supabase
        .from('employee_breaks')
        .update({ break_end_time: new Date().toISOString() })
        .eq('id', activeBreak.id);
    }

    // Clock out for real employees
    const { error } = await supabase
      .from('employee_timesheets')
      .update({ clock_out_time: new Date().toISOString() })
      .eq('id', timesheet.id);

    if (error) throw error;

    return { 
      success: true, 
      message: `Dépointage enregistré à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
    };
  } catch (error) {
    console.error('Error clocking out:', error);
    return { success: false, message: 'Erreur lors du dépointage' };
  }
}

/**
 * Start a break for an employee
 */
export async function startBreak(employeeId: string): Promise<{ success: boolean; message: string }> {
  try {
    const timesheet = await getTodayTimesheet(employeeId);
    if (!timesheet) {
      return { success: false, message: 'Vous devez d\'abord pointer votre arrivée' };
    }

    if (timesheet.clock_out_time) {
      return { success: false, message: 'Impossible de prendre une pause après avoir dépointé' };
    }

    // Check if already on break
    const activeBreak = timesheet.breaks.find(b => !b.break_end_time);
    if (activeBreak) {
      return { success: false, message: 'Vous êtes déjà en pause' };
    }

    const { error } = await supabase
      .from('employee_breaks')
      .insert({
        timesheet_id: timesheet.id,
        break_start_time: new Date().toISOString()
      });

    if (error) throw error;

    return { 
      success: true, 
      message: `Pause démarrée à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
    };
  } catch (error) {
    console.error('Error starting break:', error);
    return { success: false, message: 'Erreur lors du démarrage de la pause' };
  }
}

/**
 * End a break for an employee
 */
export async function endBreak(employeeId: string): Promise<{ success: boolean; message: string }> {
  try {
    const timesheet = await getTodayTimesheet(employeeId);
    if (!timesheet) {
      return { success: false, message: 'Aucun pointage trouvé pour aujourd\'hui' };
    }

    const activeBreak = timesheet.breaks.find(b => !b.break_end_time);
    if (!activeBreak) {
      return { success: false, message: 'Aucune pause en cours' };
    }

    const { error } = await supabase
      .from('employee_breaks')
      .update({ break_end_time: new Date().toISOString() })
      .eq('id', activeBreak.id);

    if (error) throw error;

    return { 
      success: true, 
      message: `Pause terminée à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
    };
  } catch (error) {
    console.error('Error ending break:', error);
    return { success: false, message: 'Erreur lors de l\'arrêt de la pause' };
  }
}

/**
 * Check if employee has an active break
 */
export async function hasActiveBreak(employeeId: string): Promise<boolean> {
  const timesheet = await getTodayTimesheet(employeeId);
  if (!timesheet) return false;
  
  return timesheet.breaks.some(b => !b.break_end_time);
}

/**
 * Check if employee has clocked in today
 */
export async function hasClockedInToday(employeeId: string): Promise<boolean> {
  const timesheet = await getTodayTimesheet(employeeId);
  return !!timesheet;
}

/**
 * Check if it's the employee's first login today
 */
export async function isFirstLoginToday(employeeId: string): Promise<boolean> {
  return !(await hasClockedInToday(employeeId));
}

/**
 * Determine if the pointage modal should be shown
 * Only in 2 cases: 1) No timesheet today, 2) Complete cycle (clocked in AND out)
 * 
 * IMPORTANT: Cette fonction ne doit PAS être appelée lors des actions de tâches
 * pour éviter d'afficher le modal de pointage inappropriément
 */
export async function shouldShowPointageModal(employeeId: string): Promise<boolean> {
  console.log('🔍 shouldShowPointageModal appelée pour employé:', employeeId);
  
  const timesheet = await getTodayTimesheet(employeeId);
  
  // Cas 1: Aucune heure de pointage (pas de timesheet du tout) → MODAL REQUIS
  if (!timesheet) {
    console.log('📝 Aucun timesheet trouvé - Modal requis (première connexion)');
    return true;
  }
  
  // Cas 2: Employé pointé mais PAS ENCORE dépointé (en cours de travail) → PAS DE MODAL
  if (timesheet.clock_in_time && !timesheet.clock_out_time) {
    console.log('⏰ Employé déjà pointé et en cours de travail - PAS de modal');
    return false;
  }
  
  // Cas 3: Cycle complet (pointé ET dépointé) → MODAL REQUIS pour nouveau cycle
  if (timesheet.clock_in_time && timesheet.clock_out_time) {
    console.log('🔄 Cycle complet détecté - Modal requis pour nouveau cycle');
    return true;
  }
  
  // Cas de sécurité (ne devrait pas arriver)
  console.log('❓ Cas non prévu - Pas de modal par sécurité');
  return false;
}

/**
 * Calculate total work time in minutes for a timesheet
 */
export function calculateWorkTime(timesheet: TimesheetData): number {
  if (!timesheet.clock_out_time) {
    // If not clocked out, calculate current work time
    const now = new Date();
    const clockIn = new Date(timesheet.clock_in_time);
    const workMinutes = Math.floor((now.getTime() - clockIn.getTime()) / (1000 * 60));
    
    // Subtract break time
    const breakMinutes = timesheet.breaks.reduce((total, breakData) => {
      const start = new Date(breakData.break_start_time);
      const end = breakData.break_end_time ? new Date(breakData.break_end_time) : now;
      return total + Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    }, 0);
    
    return Math.max(0, workMinutes - breakMinutes);
  }
  
  return timesheet.total_work_minutes;
}

/**
 * Format time in minutes to human readable format (Xh Ym)
 */
export function formatWorkTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}m`;
  } else if (remainingMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${remainingMinutes}m`;
  }
}