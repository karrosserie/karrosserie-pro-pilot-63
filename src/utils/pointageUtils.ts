import { format } from 'date-fns';
import { 
  clockIn as supabaseClockIn, 
  clockOut as supabaseClockOut, 
  startBreak as supabaseStartBreak, 
  endBreak as supabaseEndBreak,
  hasActiveBreak as supabaseHasActiveBreak,
  hasClockedInToday as supabaseHasClockedInToday,
  isFirstLoginToday as supabaseIsFirstLoginToday,
  getTodayTimesheet,
  calculateWorkTime,
  formatWorkTime,
  type TimesheetData
} from './pointageSupabaseUtils';

// Legacy types pour les données de pointage (localStorage)
export interface PointageData {
  employeId: number;
  date: string;
  heureArrivee?: string;
  heureDepart?: string;
  pauses: PauseData[];
}

export interface PauseData {
  id: string;
  heureDebut: string;
  heureFin?: string;
}

// Export types from Supabase utils for compatibility
export type { TimesheetData } from './pointageSupabaseUtils';

/**
 * Récupère les données de pointage pour un employé à une date donnée
 */
export const getPointageData = (employeId: number, date?: Date): PointageData => {
  const dateStr = format(date || new Date(), 'yyyy-MM-dd');
  const key = `pointage_data_${employeId}_${dateStr}`;
  
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Erreur lors de la lecture des données de pointage:', error);
    }
  }
  
  // Retourner une structure par défaut
  return {
    employeId,
    date: dateStr,
    pauses: []
  };
};

/**
 * Sauvegarde les données de pointage
 */
export const savePointageData = (data: PointageData): void => {
  const key = `pointage_data_${data.employeId}_${data.date}`;
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Enregistre l'heure d'arrivée d'un employé (hybrid: Supabase first, then localStorage)
 */
export const enregistrerArrivee = async (employeId: string | number): Promise<string> => {
  // Try Supabase first
  try {
    const result = await supabaseClockIn(employeId.toString());
    if (result.success) {
      return result.message;
    }
  } catch (error) {
    console.warn('Supabase clock-in failed, falling back to localStorage:', error);
  }

  // Fallback to localStorage
  const heureActuelle = new Date().toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const data = getPointageData(Number(employeId));
  
  // Vérifier si déjà pointé
  if (data.heureArrivee) {
    return 'Vous avez déjà pointé aujourd\'hui';
  }
  
  data.heureArrivee = heureActuelle;
  savePointageData(data);
  
  return `Pointage enregistré à ${heureActuelle}`;
};

/**
 * Enregistre l'heure de départ d'un employé (hybrid: Supabase first, then localStorage)
 */
export const enregistrerDepart = async (employeId: string | number): Promise<string> => {
  // Try Supabase first
  try {
    const result = await supabaseClockOut(employeId.toString());
    if (result.success) {
      return result.message;
    }
  } catch (error) {
    console.warn('Supabase clock-out failed, falling back to localStorage:', error);
  }

  // Fallback to localStorage
  const heureActuelle = new Date().toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const data = getPointageData(Number(employeId));
  
  // Vérifier si l'employé a pointé son arrivée
  if (!data.heureArrivee) {
    return 'Vous devez d\'abord pointer votre arrivée';
  }
  
  // Vérifier si déjà dépointé
  if (data.heureDepart) {
    return 'Vous avez déjà dépointé aujourd\'hui';
  }
  
  data.heureDepart = heureActuelle;
  
  // Fermer toute pause en cours
  const pauseEnCours = data.pauses.find(p => !p.heureFin);
  if (pauseEnCours) {
    pauseEnCours.heureFin = heureActuelle;
  }
  
  // Sauvegarder une dernière fois avec l'heure de départ
  savePointageData(data);
  
  // Nettoyer les données de pointage pour forcer un nouveau pointage à la prochaine connexion
  nettoyerPointageJour(Number(employeId));
  
  return `Dépointage enregistré à ${heureActuelle}`;
};

/**
 * Démarre une pause pour un employé (hybrid: Supabase first, then localStorage)
 */
export const demarrerPause = async (employeId: number): Promise<string> => {
  // Try Supabase first
  try {
    const result = await supabaseStartBreak(employeId.toString());
    if (result.success) {
      return result.message;
    }
  } catch (error) {
    console.warn('Supabase start break failed, falling back to localStorage:', error);
  }

  // Fallback to localStorage
  const heureActuelle = new Date().toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const data = getPointageData(employeId);
  
  // Vérifier si l'employé a pointé son arrivée
  if (!data.heureArrivee) {
    return 'Vous devez d\'abord pointer votre arrivée';
  }
  
  // Vérifier si déjà dépointé
  if (data.heureDepart) {
    return 'Impossible de prendre une pause après avoir dépointé';
  }
  
  // Vérifier qu'il n'y a pas déjà une pause en cours
  const pauseEnCours = data.pauses.find(p => !p.heureFin);
  if (pauseEnCours) {
    return 'Vous êtes déjà en pause';
  }
  
  // Créer une nouvelle pause
  const nouvellePause: PauseData = {
    id: `pause_${Date.now()}`,
    heureDebut: heureActuelle
  };
  
  data.pauses.push(nouvellePause);
  savePointageData(data);
  
  return `Pause démarrée à ${heureActuelle}`;
};

/**
 * Termine la pause en cours (hybrid: Supabase first, then localStorage)
 */
export const terminerPause = async (employeId: string | number): Promise<string | null> => {
  // Try Supabase first
  try {
    const result = await supabaseEndBreak(employeId.toString());
    if (result.success) {
      return result.message;
    }
  } catch (error) {
    console.warn('Supabase end break failed, falling back to localStorage:', error);
  }

  // Fallback to localStorage
  const heureActuelle = new Date().toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const data = getPointageData(Number(employeId));
  
  // Trouver la pause en cours
  const pauseEnCours = data.pauses.find(p => !p.heureFin);
  if (!pauseEnCours) {
    return null;
  }
  
  pauseEnCours.heureFin = heureActuelle;
  savePointageData(data);
  
  return `Pause terminée à ${heureActuelle}`;
};

/**
 * Vérifie s'il y a une pause en cours (hybrid: Supabase first, then localStorage)
 */
export const aPauseEnCours = async (employeId: string | number): Promise<boolean> => {
  // Skip Supabase for numeric IDs (test data), use localStorage directly
  if (typeof employeId === 'number' && employeId < 1000) {
    const data = getPointageData(employeId);
    return data.pauses.some(p => !p.heureFin);
  }

  // Try Supabase first for UUID employees
  try {
    return await supabaseHasActiveBreak(employeId.toString());
  } catch (error) {
    console.warn('Supabase hasActiveBreak failed, falling back to localStorage:', error);
  }

  // Fallback to localStorage
  const data = getPointageData(Number(employeId));
  return data.pauses.some(p => !p.heureFin);
};

/**
 * Vérifie si l'employé a pointé aujourd'hui (hybrid: Supabase first, then localStorage)
 */
export const aPointe = async (employeId: string | number): Promise<boolean> => {
  // Skip Supabase for numeric IDs (test data), use localStorage directly
  if (typeof employeId === 'number' && employeId < 1000) {
    const data = getPointageData(employeId);
    console.log(`DEBUG aPointe for employeId ${employeId}:`, data);
    const result = !!data.heureArrivee;
    console.log(`DEBUG aPointe result for employeId ${employeId}:`, result);
    return result;
  }

  // Try Supabase first for UUID employees
  try {
    return await supabaseHasClockedInToday(employeId.toString());
  } catch (error) {
    console.warn('Supabase hasClockedInToday failed, falling back to localStorage:', error);
  }

  // Fallback to localStorage
  const data = getPointageData(Number(employeId));
  return !!data.heureArrivee;
};

/**
 * Vérifie si c'est la première connexion de l'employé pour la journée (hybrid: Supabase first, then localStorage)
 */
export const estPremiereConnexionJour = async (employeId: number): Promise<boolean> => {
  // Try Supabase first
  try {
    return await supabaseIsFirstLoginToday(employeId.toString());
  } catch (error) {
    console.warn('Supabase isFirstLoginToday failed, falling back to localStorage:', error);
  }

  // Fallback to localStorage
  const data = getPointageData(employeId);
  return !data.heureArrivee;
};

/**
 * Calcule le temps de travail total en minutes
 */
export const calculerTempsTravail = (data: PointageData): number => {
  if (!data.heureArrivee) return 0;
  
  const heureArrivee = parseHeureEnMinutes(data.heureArrivee);
  const heureDepart = data.heureDepart ? parseHeureEnMinutes(data.heureDepart) : parseHeureEnMinutes(new Date().toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }));
  
  const tempsTotalPresence = heureDepart - heureArrivee;
  
  // Calculer le temps total des pauses
  const tempsPauses = data.pauses.reduce((total, pause) => {
    if (pause.heureFin) {
      const debutPause = parseHeureEnMinutes(pause.heureDebut);
      const finPause = parseHeureEnMinutes(pause.heureFin);
      return total + (finPause - debutPause);
    }
    return total;
  }, 0);
  
  return Math.max(0, tempsTotalPresence - tempsPauses);
};

/**
 * Convertit une heure au format "HH:MM" en minutes depuis minuit
 */
const parseHeureEnMinutes = (heure: string): number => {
  const [heures, minutes] = heure.split(':').map(Number);
  return heures * 60 + minutes;
};

/**
 * Convertit des minutes en format "Xh Ym"
 */
export const formatTempsEnHeures = (minutes: number): string => {
  const heures = Math.floor(minutes / 60);
  const minutesRestantes = minutes % 60;
  
  if (heures === 0) {
    return `${minutesRestantes}m`;
  } else if (minutesRestantes === 0) {
    return `${heures}h`;
  } else {
    return `${heures}h ${minutesRestantes}m`;
  }
};

/**
 * Nettoie toutes les données de pointage pour un employé à une date donnée
 */
export const nettoyerPointageJour = (employeId: number, date?: Date): void => {
  const dateStr = format(date || new Date(), 'yyyy-MM-dd');
  const key = `pointage_data_${employeId}_${dateStr}`;
  localStorage.removeItem(key);
  
  // Nettoyer aussi les anciennes clés pour compatibilité
  const oldKeys = [
    `pointage_${employeId}_${dateStr}`,
    `pause_${employeId}_${dateStr}`,
    `retour_pause_${employeId}_${dateStr}`,
    `depointage_${employeId}_${dateStr}`
  ];
  
  oldKeys.forEach(key => localStorage.removeItem(key));
};