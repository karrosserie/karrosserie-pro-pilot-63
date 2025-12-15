
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
function categorizeTrade(description: string): 'carrosserie' | 'peinture' | 'mecanique' {
  const desc = description.toLowerCase();
  
  // Peinture
  if (desc.includes('peinture') || desc.includes('ingr') || desc.includes('vernis') || 
      desc.includes('teinte') || desc.includes('laqu')) {
    return 'peinture';
  }
  
  // Carrosserie
  if (desc.includes('tôlerie') || desc.includes('tolerie') || desc.includes('t1') || 
      desc.includes('t2') || desc.includes('t3') || desc.includes('débosselage') ||
      desc.includes('redressage') || desc.includes('soudure') || desc.includes('remplacement')) {
    return 'carrosserie';
  }
  
  // Par défaut: mécanique
  return 'mecanique';
}

// Fonction pour déterminer le niveau de performance
function getPerformanceLevel(productivity: number): 'excellent' | 'bon' | 'correct' | 'a_ameliorer' {
  if (productivity >= 125) return 'excellent';
  if (productivity >= 110) return 'bon';
  if (productivity >= 100) return 'correct';
  return 'a_ameliorer';
}

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

      // 2. Récupérer les timesheets pour la période 2 (période courante)
      const { data: timesheets } = await supabase
        .from('employee_timesheets')
        .select('*')
        .eq('company_id', companyData.id)
        .gte('date', format(period2Start, 'yyyy-MM-dd'))
        .lte('date', format(period2End, 'yyyy-MM-dd'));

      // 3. Récupérer les factures pour calculer le CA RÉEL
      const { data: invoicesP2 } = await supabase
        .from('invoices')
        .select('id, amount, repairs_data')
        .eq('company_id', companyData.id)
        .gte('date', format(period2Start, 'yyyy-MM-dd'))
        .lte('date', format(period2End, 'yyyy-MM-dd'));

      const { data: invoicesP1 } = await supabase
        .from('invoices')
        .select('id, amount, repairs_data')
        .eq('company_id', companyData.id)
        .gte('date', format(period1Start, 'yyyy-MM-dd'))
        .lte('date', format(period1End, 'yyyy-MM-dd'));

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

      // === VÉRIFICATION DES DONNÉES DE POINTAGE ===
      const hasTimesheetData = (timesheets?.length || 0) > 0;
      if (!hasTimesheetData) {
        dataWarnings.push("Aucune donnée de pointage pour cette période - les heures achetées ne peuvent pas être calculées");
      }

      // === CALCUL DES HEURES DEPUIS repairs_data ===
      const soldHoursByTrade = { carrosserie: 0, peinture: 0, mecanique: 0 };
      const soldHoursByTradeP1 = { carrosserie: 0, peinture: 0, mecanique: 0 };
      let invoicesWithRepairsData = 0;
      let invoicesWithRepairsDataP1 = 0;

      invoicesP2?.forEach(invoice => {
        if (invoice.repairs_data && Array.isArray(invoice.repairs_data) && invoice.repairs_data.length > 0) {
          invoicesWithRepairsData++;
          (invoice.repairs_data as any[]).forEach(repair => {
            const trade = categorizeTrade(repair.designation || repair.description || '');
            const hours = parseFloat(repair.quantity) || 0;
            soldHoursByTrade[trade] += hours;
          });
        }
      });

      invoicesP1?.forEach(invoice => {
        if (invoice.repairs_data && Array.isArray(invoice.repairs_data) && invoice.repairs_data.length > 0) {
          invoicesWithRepairsDataP1++;
          (invoice.repairs_data as any[]).forEach(repair => {
            const trade = categorizeTrade(repair.designation || repair.description || '');
            const hours = parseFloat(repair.quantity) || 0;
            soldHoursByTradeP1[trade] += hours;
          });
        }
      });

      const hasRepairsData = invoicesWithRepairsData > 0;
      const totalInvoicesP2 = invoicesP2?.length || 0;
      
      if (totalInvoicesP2 > 0 && invoicesWithRepairsData < totalInvoicesP2) {
        const missingPercentage = Math.round(((totalInvoicesP2 - invoicesWithRepairsData) / totalInvoicesP2) * 100);
        dataWarnings.push(`${missingPercentage}% des factures n'ont pas de détail des heures (${totalInvoicesP2 - invoicesWithRepairsData}/${totalInvoicesP2})`);
      }

      // === CALCUL DES HEURES ACHETÉES RÉELLES (depuis timesheets) ===
      const boughtHoursByEmployee: Record<string, number> = {};
      let totalRealBoughtHours = 0;

      timesheets?.forEach(ts => {
        if (ts.clock_in_time && ts.clock_out_time) {
          const clockIn = new Date(ts.clock_in_time);
          const clockOut = new Date(ts.clock_out_time);
          const hours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
          boughtHoursByEmployee[ts.user_id] = (boughtHoursByEmployee[ts.user_id] || 0) + hours;
          totalRealBoughtHours += hours;
        }
      });

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
      
      // Marge brute : pas de données de coût salarial => on ne peut pas calculer
      // On affiche 0 avec un warning
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
        grossMargin: 0, // Pas calculable sans coûts salariaux réels
        grossMarginEvolution: 0,
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
