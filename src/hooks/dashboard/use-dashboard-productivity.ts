
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';
import { startOfMonth, endOfMonth, format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface EmployeeProductivity {
  id: string;
  name: string;
  trade: 'carrosserie' | 'peinture' | 'mecanique';
  boughtHours: number;
  soldHours: number;
  productivity: number;
  vehiclesCount: number;
  performance: 'excellent' | 'bon' | 'correct' | 'a_ameliorer';
  hasTimesheetData: boolean;
}

export interface TradeMetrics {
  trade: 'carrosserie' | 'peinture' | 'mecanique';
  employeeCount: number;
  boughtHours: number;
  soldHours: number;
  productivity: number;
  evolution: number;
  revenue: number;
  revenueEvolution: number;
  revenueShare: number;
  hourlyRate: number;
  hasTimesheetData: boolean;
}

export interface DashboardProductivityData {
  // KPIs globaux
  globalProductivity: number;
  globalProductivityEvolution: number;
  totalRevenue: number;
  revenueEvolution: number;
  vehiclesCount: number;
  vehiclesEvolution: number;
  grossMargin: number;
  grossMarginEvolution: number;
  
  // Rentabilité MO
  laborCost: number;
  laborMargin: number;
  grossMarginPercent: number;
  
  // Taux horaires utilisés
  hourlyRates: {
    carrosserie: number;
    peinture: number;
    mecanique: number;
    laborCost: number;
  };
  
  // Par métier
  tradeMetrics: TradeMetrics[];
  
  // Par employé
  employees: EmployeeProductivity[];
  
  // Totaux
  totalBoughtHours: number;
  totalSoldHours: number;
  totalEmployees: number;
  
  // Périodes
  period1Label: string;
  period2Label: string;
  
  // Indicateurs de données manquantes
  hasTimesheetData: boolean;
  hasRepairsData: boolean;
  dataWarnings: string[];
}

// Fonction pour catégoriser les réparations par métier
// Règles : T1, T2, T3, M1, tôlerie = Carrosserie | Peinture (sans ingrédients) = Peinture
function categorizeTrade(description: string): 'carrosserie' | 'peinture' | 'mecanique' {
  const desc = description.toLowerCase();
  
  // Exclure les ingrédients/matériaux de la catégorisation peinture
  const isIngredient = desc.includes('ingrédient') || desc.includes('ingredient') || 
                       desc.includes('métal vernis') || desc.includes('metal vernis');
  
  // Peinture - uniquement si c'est explicitement de la peinture (pas des ingrédients)
  if (!isIngredient && desc.includes('peinture')) {
    return 'peinture';
  }
  
  // Carrosserie - T1, T2, T3, M1, tôlerie, débosselage
  if (desc.includes('tôlerie') || desc.includes('tolerie') ||
      desc.includes('/ mo 1') || desc.includes('/ mo 2') || desc.includes('/ mo 3') ||
      desc.includes('mo 1') || desc.includes('mo 2') || desc.includes('mo 3') ||
      desc.includes(' t1') || desc.includes(' t2') || desc.includes(' t3') ||
      desc.includes('/t1') || desc.includes('/t2') || desc.includes('/t3') ||
      desc.includes('débosselage') || desc.includes('redressage') ||
      desc.includes('soudure') || desc.includes('remplacement')) {
    return 'carrosserie';
  }
  
  // Mécanique - explicitement mécanique
  if (desc.includes('mécanique') || desc.includes('mecanique')) {
    return 'mecanique';
  }
  
  // Par défaut: carrosserie (la plupart des travaux en carrosserie)
  return 'carrosserie';
}

// Fonction pour filtrer les lignes qui sont des heures de travail (exclure pièces, matériaux, ingrédients)
function isHoursLine(repair: any): boolean {
  const desc = ((repair.designation || repair.description || '') as string).toLowerCase();
  
  // Lignes explicitement exclues (matériel, pas des heures)
  const excludedPatterns = [
    'pièce', 'piece', 'fourniture', 'forfait',
    'ingrédient', 'ingredient', 'ingredients',
    'métal vernis', 'metal vernis',
    'consommable', 'matériel', 'materiel', 'produit', 'accessoire',
    'kit', 'ensemble', 'lot', 'jeu de', 'vis', 'boulon', 'écrou',
    'colle', 'mastic', 'apprêt', 'appret', 'diluant', 'durcisseur',
    'rechange', 'enlèvement', 'recyclage', 'déchets'
  ];
  
  // Vérifier si c'est une ligne exclue
  if (excludedPatterns.some(term => desc.includes(term))) {
    return false;
  }
  
  // Lignes explicitement incluses (heures de travail)
  const hoursPatterns = [
    'tôlerie', 'tolerie',
    '/ mo 1', '/ mo 2', '/ mo 3',
    'mo 1', 'mo 2', 'mo 3',
    ' t1', ' t2', ' t3',
    '/t1', '/t2', '/t3',
    'peinture',
    'main d\'œuvre', 'main d\'oeuvre',
    'heure', 'temps',
    'débosselage', 'redressage', 'remplacement',
    'démontage', 'remontage', 'préparation', 'application', 'masticage', 'ponçage'
  ];
  
  // Si contient un terme de travail, c'est des heures
  if (hoursPatterns.some(term => desc.includes(term))) {
    return true;
  }
  
  // Par défaut, on ne compte pas les lignes non reconnues
  return false;
}

// Fonction pour déterminer le niveau de performance
function getPerformanceLevel(productivity: number): 'excellent' | 'bon' | 'correct' | 'a_ameliorer' {
  if (productivity >= 125) return 'excellent';
  if (productivity >= 110) return 'bon';
  if (productivity >= 100) return 'correct';
  return 'a_ameliorer';
}

// Constantes de taux horaires (configurables à terme)
const HOURLY_RATES = {
  carrosserie: 55,
  peinture: 50,
  mecanique: 45,
  laborCost: 19 // Coût salarial moyen par heure
};

// Mapping des types de tâches employee_schedule vers les métiers
const TASK_TYPE_TO_TRADE: Record<string, 'carrosserie' | 'peinture' | 'mecanique' | 'admin'> = {
  'Remplacement ou débosselage': 'carrosserie',
  'Préparation peinture': 'peinture',
  'Mise en peinture': 'peinture',
  'Finitions & remontage': 'carrosserie',
  'Accueil & Préparation du dossier': 'admin',
  'Clôture & livraison': 'admin',
  'Contrôle technique de sécurité': 'admin',
  // Variantes possibles
  'Remplacement': 'carrosserie',
  'Débosselage': 'carrosserie',
  'Peinture': 'peinture',
  'Finitions': 'carrosserie',
  'Remontage': 'carrosserie',
  'Mécanique': 'mecanique',
};

export const useDashboardProductivity = (period1: string, period2: string) => {
  const { companyData } = useCompany();

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-productivity', companyData?.id, period1, period2],
    queryFn: async (): Promise<DashboardProductivityData> => {
      if (!companyData?.id) throw new Error('No company');

      const dataWarnings: string[] = [];

      // Parse les périodes
      const period1Date = parseISO(`${period1}-01`);
      const period2Date = parseISO(`${period2}-01`);
      
      const period1Start = startOfMonth(period1Date);
      const period1End = endOfMonth(period1Date);
      const period2Start = startOfMonth(period2Date);
      const period2End = endOfMonth(period2Date);

      // 1. Récupérer les employés actifs avec leur qualification
      const { data: employees } = await supabase
        .from('user_companies')
        .select(`
          user_id,
          role,
          qualifications,
          profiles!inner(id, first_name, last_name)
        `)
        .eq('company_id', companyData.id)
        .eq('active', true);

      // 2. Récupérer les tâches terminées depuis employee_schedule (SOURCE PRINCIPALE pour heures réalisées)
      const { data: completedTasksP2 } = await supabase
        .from('employee_schedule')
        .select('user_id, task_type, real_start_datetime, real_end_datetime')
        .eq('company_id', companyData.id)
        .eq('status', 'Terminé')
        .not('real_start_datetime', 'is', null)
        .not('real_end_datetime', 'is', null)
        .gte('real_start_datetime', format(period2Start, 'yyyy-MM-dd'))
        .lte('real_end_datetime', format(period2End, 'yyyy-MM-dd\'T\'23:59:59'));

      const { data: completedTasksP1 } = await supabase
        .from('employee_schedule')
        .select('user_id, task_type, real_start_datetime, real_end_datetime')
        .eq('company_id', companyData.id)
        .eq('status', 'Terminé')
        .not('real_start_datetime', 'is', null)
        .not('real_end_datetime', 'is', null)
        .gte('real_start_datetime', format(period1Start, 'yyyy-MM-dd'))
        .lte('real_end_datetime', format(period1End, 'yyyy-MM-dd\'T\'23:59:59'));

      // 2b. Fallback: timesheets (si pas de données employee_schedule)
      const { data: timesheets } = await supabase
        .from('employee_timesheets')
        .select('*')
        .eq('company_id', companyData.id)
        .gte('date', format(period2Start, 'yyyy-MM-dd'))
        .lte('date', format(period2End, 'yyyy-MM-dd'));

      // 3. Récupérer les factures pour calculer le CA RÉEL
      const { data: invoicesP2 } = await supabase
        .from('invoices')
        .select('id, amount')
        .eq('company_id', companyData.id)
        .gte('date', format(period2Start, 'yyyy-MM-dd'))
        .lte('date', format(period2End, 'yyyy-MM-dd'));

      const { data: invoicesP1 } = await supabase
        .from('invoices')
        .select('id, amount')
        .eq('company_id', companyData.id)
        .gte('date', format(period1Start, 'yyyy-MM-dd'))
        .lte('date', format(period1End, 'yyyy-MM-dd'));

      // === LOGIQUE PRIORITÉ: FACTURE > DEVIS > RAPPORT D'EXPERTISE ===
      // Pour éviter les doublons: si facturé → on prend la facture, sinon devis, sinon rapport

      // 3b. Récupérer les factures avec repairs_data (priorité 1)
      const { data: invoicesWithRepairsP2 } = await supabase
        .from('invoices')
        .select('id, repairs_data, repair_order_id')
        .eq('company_id', companyData.id)
        .gte('date', format(period2Start, 'yyyy-MM-dd'))
        .lte('date', format(period2End, 'yyyy-MM-dd'));

      const { data: invoicesWithRepairsP1 } = await supabase
        .from('invoices')
        .select('id, repairs_data, repair_order_id')
        .eq('company_id', companyData.id)
        .gte('date', format(period1Start, 'yyyy-MM-dd'))
        .lte('date', format(period1End, 'yyyy-MM-dd'));

      // 3c. Récupérer les repair_orders pour faire le lien avec les quotes
      const invoiceROIdsP2 = invoicesWithRepairsP2?.map(inv => inv.repair_order_id).filter(Boolean) || [];
      const invoiceROIdsP1 = invoicesWithRepairsP1?.map(inv => inv.repair_order_id).filter(Boolean) || [];
      
      // Récupérer les quote_id des OR facturés
      const { data: invoicedROsP2 } = invoiceROIdsP2.length > 0 ? await supabase
        .from('repair_orders')
        .select('id, quote_id')
        .in('id', invoiceROIdsP2) : { data: [] };

      const { data: invoicedROsP1 } = invoiceROIdsP1.length > 0 ? await supabase
        .from('repair_orders')
        .select('id, quote_id')
        .in('id', invoiceROIdsP1) : { data: [] };

      // IDs des quotes déjà facturées
      const invoicedQuoteIdsP2 = new Set(invoicedROsP2?.map(ro => ro.quote_id).filter(Boolean) || []);
      const invoicedQuoteIdsP1 = new Set(invoicedROsP1?.map(ro => ro.quote_id).filter(Boolean) || []);

      // 3d. Récupérer les devis NON facturés avec repairs_data (priorité 2)
      const { data: quotesP2 } = await supabase
        .from('quotes')
        .select('id, report_id, repairs_data')
        .eq('company_id', companyData.id)
        .gte('created_at', format(period2Start, 'yyyy-MM-dd'))
        .lte('created_at', format(period2End, 'yyyy-MM-dd'));

      const { data: quotesP1 } = await supabase
        .from('quotes')
        .select('id, report_id, repairs_data')
        .eq('company_id', companyData.id)
        .gte('created_at', format(period1Start, 'yyyy-MM-dd'))
        .lte('created_at', format(period1End, 'yyyy-MM-dd'));

      // Filtrer pour ne garder que les devis non facturés
      const nonInvoicedQuotesP2 = quotesP2?.filter(q => !invoicedQuoteIdsP2.has(q.id)) || [];
      const nonInvoicedQuotesP1 = quotesP1?.filter(q => !invoicedQuoteIdsP1.has(q.id)) || [];

      // IDs des rapports couverts par des devis (facturés ou non)
      const quotedReportIdsP2 = new Set(quotesP2?.map(q => q.report_id).filter(Boolean) || []);
      const quotedReportIdsP1 = new Set(quotesP1?.map(q => q.report_id).filter(Boolean) || []);

      // 3e. Récupérer les rapports SANS devis (priorité 3)
      const { data: expertiseP2 } = await supabase
        .from('expertise_reports')
        .select('id, repairs_data')
        .eq('company_id', companyData.id)
        .gte('created_at', format(period2Start, 'yyyy-MM-dd'))
        .lte('created_at', format(period2End, 'yyyy-MM-dd'));

      const { data: expertiseP1 } = await supabase
        .from('expertise_reports')
        .select('id, repairs_data')
        .eq('company_id', companyData.id)
        .gte('created_at', format(period1Start, 'yyyy-MM-dd'))
        .lte('created_at', format(period1End, 'yyyy-MM-dd'));

      // Filtrer pour ne garder que les rapports sans devis
      const nonQuotedExpertiseP2 = expertiseP2?.filter(r => !quotedReportIdsP2.has(r.id)) || [];
      const nonQuotedExpertiseP1 = expertiseP1?.filter(r => !quotedReportIdsP1.has(r.id)) || [];

      // 4. Récupérer les OR terminés/signés pour compter les véhicules
      const { data: repairOrdersP2 } = await supabase
        .from('repair_orders')
        .select('vehicle_id')
        .eq('company_id', companyData.id)
        .in('status', ['Signé', 'En cours'])
        .gte('created_at', format(period2Start, 'yyyy-MM-dd'))
        .lte('created_at', format(period2End, 'yyyy-MM-dd'));

      const { data: repairOrdersP1 } = await supabase
        .from('repair_orders')
        .select('vehicle_id')
        .eq('company_id', companyData.id)
        .in('status', ['Signé', 'En cours'])
        .gte('created_at', format(period1Start, 'yyyy-MM-dd'))
        .lte('created_at', format(period1End, 'yyyy-MM-dd'));

      // === CALCUL DU CA RÉEL (somme des factures) ===
      const totalRevenueP2 = invoicesP2?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;
      const totalRevenueP1 = invoicesP1?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;

      // === CALCUL DES HEURES RÉALISÉES DEPUIS EMPLOYEE_SCHEDULE (SOURCE PRINCIPALE) ===
      const workedHoursByEmployee: Record<string, { carrosserie: number, peinture: number, mecanique: number, total: number }> = {};
      const workedHoursByTradeP2 = { carrosserie: 0, peinture: 0, mecanique: 0 };
      const workedHoursByTradeP1 = { carrosserie: 0, peinture: 0, mecanique: 0 };

      // Calculer heures réalisées P2
      completedTasksP2?.forEach(task => {
        const trade = TASK_TYPE_TO_TRADE[task.task_type];
        if (!trade || trade === 'admin') return; // Exclure les tâches admin
        
        const startTime = new Date(task.real_start_datetime!);
        const endTime = new Date(task.real_end_datetime!);
        const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        
        if (durationHours <= 0 || durationHours > 24) return; // Ignorer les durées invalides
        
        // Par employé
        if (!workedHoursByEmployee[task.user_id]) {
          workedHoursByEmployee[task.user_id] = { carrosserie: 0, peinture: 0, mecanique: 0, total: 0 };
        }
        workedHoursByEmployee[task.user_id][trade] += durationHours;
        workedHoursByEmployee[task.user_id].total += durationHours;
        
        // Par métier global
        workedHoursByTradeP2[trade] += durationHours;
      });

      // Calculer heures réalisées P1
      completedTasksP1?.forEach(task => {
        const trade = TASK_TYPE_TO_TRADE[task.task_type];
        if (!trade || trade === 'admin') return;
        
        const startTime = new Date(task.real_start_datetime!);
        const endTime = new Date(task.real_end_datetime!);
        const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        
        if (durationHours <= 0 || durationHours > 24) return;
        workedHoursByTradeP1[trade] += durationHours;
      });

      const totalWorkedHoursFromTasks = workedHoursByTradeP2.carrosserie + workedHoursByTradeP2.peinture + workedHoursByTradeP2.mecanique;
      const hasScheduleData = totalWorkedHoursFromTasks > 0;

      // Fallback: timesheets si pas de données employee_schedule
      const boughtHoursByEmployeeFromTimesheets: Record<string, number> = {};
      let totalTimesheetHours = 0;

      timesheets?.forEach(ts => {
        const minutes = ts.total_work_minutes || 0;
        const hours = minutes / 60;
        boughtHoursByEmployeeFromTimesheets[ts.user_id] = (boughtHoursByEmployeeFromTimesheets[ts.user_id] || 0) + hours;
        totalTimesheetHours += hours;
      });

      const hasTimesheetData = hasScheduleData || totalTimesheetHours > 0;
      
      if (!hasTimesheetData) {
        dataWarnings.push("Aucune donnée de pointage ou de tâches terminées pour cette période");
      } else if (hasScheduleData) {
        console.log('Dashboard heures réalisées P2 (employee_schedule):', {
          parMetier: workedHoursByTradeP2,
          total: totalWorkedHoursFromTasks,
          nbTaches: completedTasksP2?.length || 0
        });
      }

      // === CALCUL DES HEURES VENDUES AVEC PRIORITÉ: FACTURE > DEVIS > RAPPORT ===
      const soldHoursByTrade = { carrosserie: 0, peinture: 0, mecanique: 0 };
      const soldHoursByTradeP1 = { carrosserie: 0, peinture: 0, mecanique: 0 };
      let sourcesCountP2 = { invoices: 0, quotes: 0, reports: 0 };
      let sourcesCountP1 = { invoices: 0, quotes: 0, reports: 0 };

      // Fonction helper pour parser les heures d'un repairs_data
      const parseRepairsHours = (repairsData: any, target: typeof soldHoursByTrade) => {
        if (!repairsData || !Array.isArray(repairsData)) return false;
        let hasData = false;
        repairsData
          .filter(isHoursLine)
          .forEach((repair: any) => {
            const trade = categorizeTrade(repair.designation || repair.description || '');
            const hours = parseFloat(repair.quantity) || 0;
            target[trade] += hours;
            hasData = true;
          });
        return hasData;
      };

      // PRIORITÉ 1: Heures des factures (P2)
      invoicesWithRepairsP2?.forEach(inv => {
        if (parseRepairsHours(inv.repairs_data, soldHoursByTrade)) {
          sourcesCountP2.invoices++;
        }
      });

      // PRIORITÉ 1: Heures des factures (P1)
      invoicesWithRepairsP1?.forEach(inv => {
        if (parseRepairsHours(inv.repairs_data, soldHoursByTradeP1)) {
          sourcesCountP1.invoices++;
        }
      });

      // PRIORITÉ 2: Heures des devis NON facturés (P2)
      nonInvoicedQuotesP2.forEach(quote => {
        if (parseRepairsHours(quote.repairs_data, soldHoursByTrade)) {
          sourcesCountP2.quotes++;
        }
      });

      // PRIORITÉ 2: Heures des devis NON facturés (P1)
      nonInvoicedQuotesP1.forEach(quote => {
        if (parseRepairsHours(quote.repairs_data, soldHoursByTradeP1)) {
          sourcesCountP1.quotes++;
        }
      });

      // PRIORITÉ 3: Heures des rapports SANS devis (P2)
      nonQuotedExpertiseP2.forEach(report => {
        if (parseRepairsHours(report.repairs_data, soldHoursByTrade)) {
          sourcesCountP2.reports++;
        }
      });

      // PRIORITÉ 3: Heures des rapports SANS devis (P1)
      nonQuotedExpertiseP1.forEach(report => {
        if (parseRepairsHours(report.repairs_data, soldHoursByTradeP1)) {
          sourcesCountP1.reports++;
        }
      });

      const totalSourcesP2 = sourcesCountP2.invoices + sourcesCountP2.quotes + sourcesCountP2.reports;
      const hasRepairsData = totalSourcesP2 > 0;

      // Log pour debug
      console.log('Dashboard heures vendues P2:', {
        sources: sourcesCountP2,
        heures: soldHoursByTrade,
        total: soldHoursByTrade.carrosserie + soldHoursByTrade.peinture + soldHoursByTrade.mecanique
      });

      // Avertissement si peu de données
      const totalDossiersP2 = (invoicesWithRepairsP2?.length || 0) + nonInvoicedQuotesP2.length + nonQuotedExpertiseP2.length;
      if (totalDossiersP2 > 0 && totalSourcesP2 < totalDossiersP2) {
        const missingPercentage = Math.round(((totalDossiersP2 - totalSourcesP2) / totalDossiersP2) * 100);
        dataWarnings.push(`${missingPercentage}% des dossiers n'ont pas de détail des heures (${totalDossiersP2 - totalSourcesP2}/${totalDossiersP2})`);
      }

      // === HEURES ACHETÉES (RÉALISÉES) PAR EMPLOYÉ ===
      // Priorité: employee_schedule > timesheets
      const boughtHoursByEmployee: Record<string, number> = {};
      let totalRealBoughtHours = 0;

      if (hasScheduleData) {
        // Utiliser employee_schedule
        Object.entries(workedHoursByEmployee).forEach(([userId, hours]) => {
          boughtHoursByEmployee[userId] = hours.total;
          totalRealBoughtHours += hours.total;
        });
      } else {
        // Fallback timesheets
        Object.entries(boughtHoursByEmployeeFromTimesheets).forEach(([userId, hours]) => {
          boughtHoursByEmployee[userId] = hours;
          totalRealBoughtHours += hours;
        });
      }

      // === LISTE DES EMPLOYÉS ===
      const employeesByTrade = { carrosserie: 0, peinture: 0, mecanique: 0 };
      const employeeList: EmployeeProductivity[] = [];

      // Rôles non-productifs à exclure du tableau de productivité
      const nonProductiveRoles = ['propriétaire', 'gestionnaire de réservation', 'gestionnaire d\'inventaire', 'administrateur'];

      employees?.forEach(emp => {
        const profile = emp.profiles as any;
        const name = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Employé';
        const role = (emp.role || '').toLowerCase();
        
        // Exclure les rôles non-productifs
        if (nonProductiveRoles.some(npr => role.includes(npr))) {
          return;
        }
        
        // Déterminer le métier basé sur les qualifications réelles
        let trade: 'carrosserie' | 'peinture' | 'mecanique' = 'carrosserie';
        const qualifications = emp.qualifications as string[] || [];
        
        // Mapper les qualifications réelles vers les métiers
        const hasPeintureQual = qualifications.some(q => 
          q.toLowerCase().includes('peinture') || 
          q.toLowerCase().includes('mise en peinture') ||
          q.toLowerCase().includes('préparation peinture')
        );
        
        const hasCarrosserieQual = qualifications.some(q =>
          q.toLowerCase().includes('remplacement') ||
          q.toLowerCase().includes('débosselage') ||
          q.toLowerCase().includes('tôlerie') ||
          q.toLowerCase().includes('tolerie') ||
          q.toLowerCase().includes('finitions') ||
          q.toLowerCase().includes('remontage') ||
          q.toLowerCase().includes('accueil') ||
          q.toLowerCase().includes('préparation du dossier') ||
          q.toLowerCase().includes('clôture') ||
          q.toLowerCase().includes('livraison') ||
          q.toLowerCase().includes('contrôle technique')
        );
        
        const hasMecaniqueQual = qualifications.some(q =>
          q.toLowerCase().includes('mécanique') ||
          q.toLowerCase().includes('mecanique') ||
          q.toLowerCase().includes('mécanicien')
        );
        
        // Priorité : peinture > mécanique > carrosserie (défaut)
        if (hasPeintureQual) {
          trade = 'peinture';
        } else if (hasMecaniqueQual) {
          trade = 'mecanique';
        } else if (hasCarrosserieQual || role.includes('carrossier')) {
          trade = 'carrosserie';
        }
        // Si aucune qualification reconnue, on garde carrosserie par défaut
        
        employeesByTrade[trade]++;
        
        // Heures achetées RÉELLES de cet employé
        const boughtHours = boughtHoursByEmployee[emp.user_id] || 0;
        const hasEmpTimesheetData = boughtHours > 0;
        
        // Répartir les heures vendues proportionnellement aux employés du métier
        const tradeEmployeeCount = employeesByTrade[trade] || 1;
        const soldHours = soldHoursByTrade[trade] / tradeEmployeeCount;
        
        // Productivité seulement si on a les heures achetées
        const productivity = (hasEmpTimesheetData && boughtHours > 0) ? (soldHours / boughtHours) * 100 : 0;
        
        employeeList.push({
          id: emp.user_id,
          name,
          trade,
          boughtHours: Math.round(boughtHours),
          soldHours: Math.round(soldHours),
          productivity: Math.round(productivity),
          vehiclesCount: Math.round((repairOrdersP2?.length || 0) / (employees?.length || 1)),
          performance: hasEmpTimesheetData ? getPerformanceLevel(productivity) : 'a_ameliorer',
          hasTimesheetData: hasEmpTimesheetData
        });
      });

      // === MÉTRIQUES PAR MÉTIER (avec données réelles) ===
      const trades: ('carrosserie' | 'peinture' | 'mecanique')[] = ['carrosserie', 'peinture', 'mecanique'];
      const tradeMetrics: TradeMetrics[] = trades.map(trade => {
        const tradeEmployees = employeeList.filter(e => e.trade === trade);
        const employeeCount = tradeEmployees.length;
        
        // Heures achetées RÉELLES pour ce métier
        const boughtHours = tradeEmployees.reduce((sum, e) => sum + e.boughtHours, 0);
        const hasTradeTimesheetData = boughtHours > 0;
        
        // Heures vendues depuis repairs_data
        const soldHours = soldHoursByTrade[trade];
        const soldHoursP1 = soldHoursByTradeP1[trade];
        
        // Productivité seulement si on a les heures achetées
        const productivity = (hasTradeTimesheetData && boughtHours > 0) ? (soldHours / boughtHours) * 100 : 0;
        const productivityP1 = (hasTradeTimesheetData && boughtHours > 0) ? (soldHoursP1 / boughtHours) * 100 : 0;
        
        // CA réel = part proportionnelle du CA total basée sur les heures vendues
        const totalSoldHours = soldHoursByTrade.carrosserie + soldHoursByTrade.peinture + soldHoursByTrade.mecanique;
        const tradeShare = totalSoldHours > 0 ? soldHours / totalSoldHours : 0;
        const revenue = Math.round(totalRevenueP2 * tradeShare);
        
        const tradeShareP1 = (soldHoursByTradeP1.carrosserie + soldHoursByTradeP1.peinture + soldHoursByTradeP1.mecanique) > 0 
          ? soldHoursP1 / (soldHoursByTradeP1.carrosserie + soldHoursByTradeP1.peinture + soldHoursByTradeP1.mecanique) 
          : 0;
        const revenueP1 = Math.round(totalRevenueP1 * tradeShareP1);
        
        // Taux horaire calculé = CA / heures vendues
        const hourlyRate = soldHours > 0 ? Math.round(revenue / soldHours) : 0;
        
        return {
          trade,
          employeeCount,
          boughtHours: Math.round(boughtHours),
          soldHours: Math.round(soldHours),
          productivity: Math.round(productivity),
          evolution: Math.round(productivity - productivityP1),
          revenue,
          revenueEvolution: revenueP1 > 0 ? Math.round(((revenue - revenueP1) / revenueP1) * 100) : 0,
          revenueShare: totalRevenueP2 > 0 ? Math.round((revenue / totalRevenueP2) * 100) : 0,
          hourlyRate,
          hasTimesheetData: hasTradeTimesheetData
        };
      });

      // === TOTAUX ===
      const totalBoughtHours = Math.round(totalRealBoughtHours);
      const totalSoldHours = Math.round(soldHoursByTrade.carrosserie + soldHoursByTrade.peinture + soldHoursByTrade.mecanique);
      const totalEmployees = employeeList.length;
      
      // Productivité globale seulement si on a les heures achetées
      const globalProductivity = (hasTimesheetData && totalBoughtHours > 0) ? (totalSoldHours / totalBoughtHours) * 100 : 0;
      
      const totalSoldHoursP1 = soldHoursByTradeP1.carrosserie + soldHoursByTradeP1.peinture + soldHoursByTradeP1.mecanique;
      const globalProductivityP1 = (hasTimesheetData && totalBoughtHours > 0) ? (totalSoldHoursP1 / totalBoughtHours) * 100 : 0;
      const globalProductivityEvolution = Math.round((globalProductivity - globalProductivityP1) * 10) / 10;
      
      // Évolution du CA réel
      const revenueEvolution = totalRevenueP1 > 0 ? Math.round(((totalRevenueP2 - totalRevenueP1) / totalRevenueP1) * 100) : 0;
      
      // Véhicules traités
      const vehiclesCount = repairOrdersP2?.length || 0;
      const vehiclesCountP1 = repairOrdersP1?.length || 0;
      const vehiclesEvolution = vehiclesCountP1 > 0 ? 
        Math.round(((vehiclesCount - vehiclesCountP1) / vehiclesCountP1) * 100) : 0;
      
      // === CALCUL DE LA RENTABILITÉ MO ===
      // Coût salarial = heures achetées × taux horaire moyen
      const laborCost = Math.round(totalBoughtHours * HOURLY_RATES.laborCost);
      
      // Marge MO = CA - Coût salarial
      const laborMargin = totalRevenueP2 - laborCost;
      
      // Marge brute en % = (Marge / CA) × 100
      const grossMarginPercent = totalRevenueP2 > 0 
        ? Math.round((laborMargin / totalRevenueP2) * 1000) / 10 
        : 0;

      if (!hasTimesheetData) {
        dataWarnings.push("La marge brute ne peut pas être calculée sans données de pointage");
      }

      return {
        globalProductivity: Math.round(globalProductivity * 10) / 10,
        globalProductivityEvolution,
        totalRevenue: totalRevenueP2,
        revenueEvolution,
        vehiclesCount,
        vehiclesEvolution,
        grossMargin: grossMarginPercent,
        grossMarginEvolution: 0,
        laborCost,
        laborMargin,
        grossMarginPercent,
        hourlyRates: HOURLY_RATES,
        tradeMetrics,
        employees: employeeList,
        totalBoughtHours,
        totalSoldHours,
        totalEmployees,
        period1Label: format(period1Date, 'MMMM yyyy', { locale: fr }),
        period2Label: format(period2Date, 'MMMM yyyy', { locale: fr }),
        hasTimesheetData,
        hasRepairsData,
        dataWarnings
      };
    },
    enabled: !!companyData?.id && !!period1 && !!period2
  });

  return { data, isLoading, error };
};
