import { supabase } from '@/integrations/supabase/client';

// Types de complexité
export type ComplexityLevel = 'leger' | 'moyen' | 'lourd';

// Durées de base par phase (en minutes) basées sur le PDF - Sinistre MOYEN (18h total)
const BASE_DURATIONS = {
  'Accueil & Préparation du dossier': 108,  // 10% = 1h48
  'Remplacement ou débosselage': 238,        // 22% = 3h58
  'Contrôle technique de sécurité': 86,      // 8% = 1h26
  'Préparation peinture': 162,               // 15% = 2h42
  'Mise en peinture': 324,                   // 30% = 5h24
  'Finitions & remontage': 130,              // 12% = 2h10
  'Clôture du dossier et livraison': 32      // 3% = 0h32
};

// Coefficients de complexité
const COMPLEXITY_FACTORS = {
  leger: 0.5,   // -50%
  moyen: 1.0,   // base
  lourd: 1.5    // +50%
};

// Seuils pour déterminer la complexité (en heures totales)
const COMPLEXITY_THRESHOLDS = {
  leger: 10,   // < 10h
  lourd: 25    // > 25h
};

interface RepairItem {
  description?: string;
  quantity?: number;
  unitCost?: number;
  t1Hours?: number;
  t2Hours?: number;
  paintHours?: number;
}

/**
 * Calcule les heures totales depuis repairs_data
 */
function calculateTotalHoursFromRepairs(repairsData: string | null | any): number {
  if (!repairsData) return 0;

  try {
    let repairs: RepairItem[] = [];
    
    // Parser repairs_data
    if (typeof repairsData === 'string') {
      repairs = JSON.parse(repairsData);
    } else if (Array.isArray(repairsData)) {
      repairs = repairsData;
    } else {
      repairs = repairsData as any;
    }

    if (!Array.isArray(repairs)) return 0;

    let totalHours = 0;

    repairs.forEach(item => {
      const description = (item.description || '').toLowerCase();
      const quantity = item.quantity || 0;

      // Si les heures sont directement fournies
      if (item.t1Hours) totalHours += item.t1Hours;
      if (item.t2Hours) totalHours += item.t2Hours;
      if (item.paintHours) totalHours += item.paintHours;

      // Sinon, estimer depuis la description et la quantité
      if (!item.t1Hours && !item.t2Hours && !item.paintHours && quantity > 0) {
        if (description.includes('t1') || description.includes('tôlerie t1') || description.includes('tolerie t1')) {
          totalHours += quantity * 1; // 1h par unité T1
        } else if (description.includes('t2') || description.includes('tôlerie t2') || description.includes('tolerie t2')) {
          totalHours += quantity * 1.5; // 1.5h par unité T2
        } else if (description.includes('peinture') || description.includes('paint')) {
          totalHours += quantity * 2; // 2h par unité peinture
        } else {
          totalHours += quantity * 0.5; // 0.5h par unité pour autres
        }
      }
    });

    return totalHours;
  } catch (error) {
    console.error('Error parsing repairs_data:', error);
    return 0;
  }
}

/**
 * Détermine le niveau de complexité basé sur les heures totales
 */
export function determineComplexityLevel(totalHours: number): ComplexityLevel {
  if (totalHours < COMPLEXITY_THRESHOLDS.leger) {
    return 'leger';
  } else if (totalHours > COMPLEXITY_THRESHOLDS.lourd) {
    return 'lourd';
  }
  return 'moyen';
}

/**
 * Récupère les heures totales estimées pour un véhicule
 */
export async function getVehicleTotalHours(vehicleId: string): Promise<number> {
  try {
    // 1. Essayer depuis repair_orders en priorité
    const { data: repairOrder } = await supabase
      .from('repair_orders')
      .select('estimated_hours, repairs_data')
      .eq('vehicle_id', vehicleId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (repairOrder) {
      // Si estimated_hours est renseigné, l'utiliser
      if (repairOrder.estimated_hours && repairOrder.estimated_hours > 0) {
        return repairOrder.estimated_hours;
      }
      
      // Sinon, calculer depuis repairs_data
      const hoursFromRepairs = calculateTotalHoursFromRepairs(repairOrder.repairs_data);
      if (hoursFromRepairs > 0) {
        return hoursFromRepairs;
      }
    }

    // 2. Si pas de repair_order, essayer depuis quotes
    const { data: quote } = await supabase
      .from('quotes')
      .select('repairs_data')
      .eq('vehicle_id', vehicleId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (quote?.repairs_data) {
      return calculateTotalHoursFromRepairs(quote.repairs_data);
    }

    // 3. Fallback: retourner 18h (moyenne)
    return 18;
  } catch (error) {
    console.error('Error fetching vehicle hours:', error);
    return 18; // Fallback sur moyenne
  }
}

/**
 * Calcule les durées ajustées pour toutes les phases selon la complexité
 */
export async function calculateDynamicDurations(vehicleId: string): Promise<Record<string, number>> {
  const totalHours = await getVehicleTotalHours(vehicleId);
  const complexity = determineComplexityLevel(totalHours);
  const factor = COMPLEXITY_FACTORS[complexity];

  console.log(`🎯 Vehicle ${vehicleId} - Total: ${totalHours}h - Complexity: ${complexity} (factor: ${factor})`);

  // Appliquer le coefficient de complexité aux durées de base
  const adjustedDurations: Record<string, number> = {};
  
  Object.entries(BASE_DURATIONS).forEach(([phase, baseMinutes]) => {
    adjustedDurations[phase] = Math.round(baseMinutes * factor);
  });

  return adjustedDurations;
}

/**
 * Obtient la durée pour une phase spécifique d'un véhicule
 */
export async function getTaskDuration(vehicleId: string, taskType: string): Promise<number> {
  const durations = await calculateDynamicDurations(vehicleId);
  return durations[taskType] || BASE_DURATIONS[taskType] || 60; // Fallback 60 minutes
}

/**
 * Met à jour le niveau de complexité dans la table vehicles
 */
export async function updateVehicleComplexity(vehicleId: string): Promise<void> {
  try {
    const totalHours = await getVehicleTotalHours(vehicleId);
    const complexity = determineComplexityLevel(totalHours);

    await supabase
      .from('vehicles')
      .update({ complexity_level: complexity })
      .eq('id', vehicleId);

    console.log(`✅ Updated vehicle ${vehicleId} complexity to: ${complexity} (${totalHours}h)`);
  } catch (error) {
    console.error('Error updating vehicle complexity:', error);
  }
}
