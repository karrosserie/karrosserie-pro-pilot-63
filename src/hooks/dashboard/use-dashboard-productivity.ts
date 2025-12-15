
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/hooks/use-company';
import { startOfMonth, endOfMonth, format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Constantes
const HOURS_PER_MONTH = 152;
const HOURLY_RATES = {
  carrosserie: 55,
  peinture: 50,
  mecanique: 45
};

export interface EmployeeProductivity {
  id: string;
  name: string;
  trade: 'carrosserie' | 'peinture' | 'mecanique';
  boughtHours: number;
  soldHours: number;
  productivity: number;
  vehiclesCount: number;
  performance: 'excellent' | 'bon' | 'correct' | 'a_ameliorer';
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

      // 3. Récupérer les factures pour calculer les heures vendues
      const { data: invoicesP2 } = await supabase
        .from('invoices')
        .select('*')
        .eq('company_id', companyData.id)
        .gte('date', format(period2Start, 'yyyy-MM-dd'))
        .lte('date', format(period2End, 'yyyy-MM-dd'));

      const { data: invoicesP1 } = await supabase
        .from('invoices')
        .select('*')
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

      // Calculer les heures vendues par métier à partir des factures
      const soldHoursByTrade = { carrosserie: 0, peinture: 0, mecanique: 0 };
      const soldHoursByTradeP1 = { carrosserie: 0, peinture: 0, mecanique: 0 };
      
      // Taux horaire moyen pour estimation
      const avgHourlyRate = (HOURLY_RATES.carrosserie + HOURLY_RATES.peinture + HOURLY_RATES.mecanique) / 3;

      // Parse repairs_data des factures pour extraire les heures vendues
      // Fallback sur le montant si repairs_data est vide
      invoicesP2?.forEach(invoice => {
        if (invoice.repairs_data && Array.isArray(invoice.repairs_data) && invoice.repairs_data.length > 0) {
          (invoice.repairs_data as any[]).forEach(repair => {
            const trade = categorizeTrade(repair.designation || repair.description || '');
            const hours = parseFloat(repair.quantity) || 0;
            soldHoursByTrade[trade] += hours;
          });
        } else if (invoice.amount && invoice.amount > 0) {
          // Fallback: estimer les heures à partir du montant (répartition égale par défaut)
          const estimatedHours = invoice.amount / avgHourlyRate;
          soldHoursByTrade.carrosserie += estimatedHours * 0.5; // 50% carrosserie
          soldHoursByTrade.peinture += estimatedHours * 0.35;   // 35% peinture
          soldHoursByTrade.mecanique += estimatedHours * 0.15;  // 15% mécanique
        }
      });

      invoicesP1?.forEach(invoice => {
        if (invoice.repairs_data && Array.isArray(invoice.repairs_data) && invoice.repairs_data.length > 0) {
          (invoice.repairs_data as any[]).forEach(repair => {
            const trade = categorizeTrade(repair.designation || repair.description || '');
            const hours = parseFloat(repair.quantity) || 0;
            soldHoursByTradeP1[trade] += hours;
          });
        } else if (invoice.amount && invoice.amount > 0) {
          // Fallback: estimer les heures à partir du montant
          const estimatedHours = invoice.amount / avgHourlyRate;
          soldHoursByTradeP1.carrosserie += estimatedHours * 0.5;
          soldHoursByTradeP1.peinture += estimatedHours * 0.35;
          soldHoursByTradeP1.mecanique += estimatedHours * 0.15;
        }
      });

      // Compter les employés par métier (basé sur qualifications ou défaut)
      const employeesByTrade = { carrosserie: 0, peinture: 0, mecanique: 0 };
      const employeeList: EmployeeProductivity[] = [];

      employees?.forEach(emp => {
        const profile = emp.profiles as any;
        const name = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Employé';
        
        // Déterminer le métier basé sur les qualifications ou le rôle
        let trade: 'carrosserie' | 'peinture' | 'mecanique' = 'carrosserie';
        const quals = (emp.qualifications as string[] || []).map(q => q.toLowerCase()).join(' ');
        const role = (emp.role || '').toLowerCase();
        
        if (quals.includes('peinture') || quals.includes('peintre') || quals.includes('mise en peinture') ||
            role.includes('peintre')) {
          trade = 'peinture';
        } else if (quals.includes('mécanicien') || quals.includes('mecanique') || quals.includes('mécanique') ||
                   role.includes('mécanicien')) {
          trade = 'mecanique';
        } else if (quals.includes('carrosserie') || quals.includes('carrossier') || quals.includes('tôlerie') ||
                   quals.includes('débosselage') || quals.includes('remplacement') ||
                   role.includes('carrossier')) {
          trade = 'carrosserie';
        }
        
        employeesByTrade[trade]++;
        
        // Calculer les heures de cet employé
        const empTimesheets = timesheets?.filter(t => t.user_id === emp.user_id) || [];
        let workedHours = 0;
        empTimesheets.forEach(ts => {
          if (ts.clock_in_time && ts.clock_out_time) {
            const clockIn = new Date(ts.clock_in_time);
            const clockOut = new Date(ts.clock_out_time);
            workedHours += (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
          }
        });
        
        // Si pas de timesheet, utiliser la base 152h
        const boughtHours = workedHours > 0 ? workedHours : HOURS_PER_MONTH;
        
        // Répartir les heures vendues proportionnellement aux employés du métier
        const tradeEmployeeCount = employeesByTrade[trade] || 1;
        const soldHours = soldHoursByTrade[trade] / tradeEmployeeCount;
        
        const productivity = boughtHours > 0 ? (soldHours / boughtHours) * 100 : 0;
        
        employeeList.push({
          id: emp.user_id,
          name,
          trade,
          boughtHours: Math.round(boughtHours),
          soldHours: Math.round(soldHours),
          productivity: Math.round(productivity),
          vehiclesCount: Math.round((repairOrdersP2?.length || 0) / (employees?.length || 1)),
          performance: getPerformanceLevel(productivity)
        });
      });

      // Si pas d'employés, ne pas créer de données fictives

      // Calculer les métriques par métier
      const trades: ('carrosserie' | 'peinture' | 'mecanique')[] = ['carrosserie', 'peinture', 'mecanique'];
      const tradeMetrics: TradeMetrics[] = trades.map(trade => {
        const tradeEmployees = employeeList.filter(e => e.trade === trade);
        const employeeCount = tradeEmployees.length || employeesByTrade[trade] || 1;
        const boughtHours = employeeCount * HOURS_PER_MONTH;
        const soldHours = tradeEmployees.reduce((sum, e) => sum + e.soldHours, 0) || soldHoursByTrade[trade];
        const soldHoursP1 = soldHoursByTradeP1[trade] || soldHours * 0.95;
        
        const productivity = boughtHours > 0 ? (soldHours / boughtHours) * 100 : 0;
        const productivityP1 = boughtHours > 0 ? (soldHoursP1 / boughtHours) * 100 : 0;
        
        const revenue = soldHours * HOURLY_RATES[trade];
        const revenueP1 = soldHoursP1 * HOURLY_RATES[trade];
        
        return {
          trade,
          employeeCount,
          boughtHours,
          soldHours: Math.round(soldHours),
          productivity: Math.round(productivity),
          evolution: Math.round(productivity - productivityP1),
          revenue: Math.round(revenue),
          revenueEvolution: revenueP1 > 0 ? Math.round(((revenue - revenueP1) / revenueP1) * 100) : 0,
          revenueShare: 0, // Calculé après
          hourlyRate: HOURLY_RATES[trade]
        };
      });

      // Calculer les parts de CA
      const totalRevenue = tradeMetrics.reduce((sum, t) => sum + t.revenue, 0);
      tradeMetrics.forEach(t => {
        t.revenueShare = totalRevenue > 0 ? Math.round((t.revenue / totalRevenue) * 100) : 0;
      });

      // Totaux
      const totalBoughtHours = tradeMetrics.reduce((sum, t) => sum + t.boughtHours, 0);
      const totalSoldHours = tradeMetrics.reduce((sum, t) => sum + t.soldHours, 0);
      const totalEmployees = employeeList.length;
      
      const globalProductivity = totalBoughtHours > 0 ? (totalSoldHours / totalBoughtHours) * 100 : 0;
      
      // Calcul des évolutions réelles
      const totalSoldHoursP1 = soldHoursByTradeP1.carrosserie + soldHoursByTradeP1.peinture + soldHoursByTradeP1.mecanique;
      const globalProductivityP1 = totalBoughtHours > 0 ? (totalSoldHoursP1 / totalBoughtHours) * 100 : 0;
      const globalProductivityEvolution = Math.round((globalProductivity - globalProductivityP1) * 10) / 10;
      
      const totalRevenueP1 = (soldHoursByTradeP1.carrosserie * HOURLY_RATES.carrosserie) + 
                             (soldHoursByTradeP1.peinture * HOURLY_RATES.peinture) + 
                             (soldHoursByTradeP1.mecanique * HOURLY_RATES.mecanique);
      const revenueEvolution = totalRevenueP1 > 0 ? Math.round(((totalRevenue - totalRevenueP1) / totalRevenueP1) * 100) : 0;
      
      const vehiclesCount = repairOrdersP2?.length || 0;
      const vehiclesCountP1 = repairOrdersP1?.length || 0;
      const vehiclesEvolution = vehiclesCountP1 > 0 ? 
        Math.round(((vehiclesCount - vehiclesCountP1) / vehiclesCountP1) * 100) : 0;
      
      // Marge brute (CA - coûts salariaux estimés)
      const estimatedLaborCost = totalBoughtHours * 25; // Coût horaire moyen estimé
      const grossMargin = totalRevenue > 0 ? ((totalRevenue - estimatedLaborCost) / totalRevenue) * 100 : 0;

      return {
        globalProductivity: Math.round(globalProductivity * 10) / 10,
        globalProductivityEvolution,
        totalRevenue,
        revenueEvolution,
        vehiclesCount,
        vehiclesEvolution,
        grossMargin: Math.round(grossMargin * 10) / 10,
        grossMarginEvolution: totalRevenueP1 > 0 ? Math.round((grossMargin - ((totalRevenueP1 - estimatedLaborCost) / totalRevenueP1) * 100) * 10) / 10 : 0,
        tradeMetrics,
        employees: employeeList,
        totalBoughtHours,
        totalSoldHours,
        totalEmployees,
        period1Label: format(period1Date, 'MMMM yyyy', { locale: fr }),
        period2Label: format(period2Date, 'MMMM yyyy', { locale: fr })
      };
    },
    enabled: !!companyData?.id && !!period1 && !!period2
  });

  return { data, isLoading, error };
};
