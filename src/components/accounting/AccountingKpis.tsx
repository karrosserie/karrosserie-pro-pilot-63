
import React from 'react';
import { KpiTile } from './KpiTile';
import { Euro, TrendingUp, CreditCard, Receipt, AlertTriangle, Calendar } from 'lucide-react';

interface KpiData {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  period: string;
  variant?: 'default' | 'success' | 'danger' | 'warning';
  icon?: React.ReactNode;
}

interface AccountingKpisProps {
  totalReceipts: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

export const AccountingKpis = ({ 
  totalReceipts, 
  totalExpenses, 
  balance, 
  transactionCount 
}: AccountingKpisProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const kpis: KpiData[] = [
    {
      title: 'Encaissements du mois',
      value: formatCurrency(totalReceipts),
      trend: '+12%',
      trendUp: true,
      period: 'Décembre 2024',
      variant: 'success',
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      title: 'Dépenses du mois',
      value: formatCurrency(totalExpenses),
      trend: '+8%',
      trendUp: false,
      period: 'Décembre 2024',
      variant: 'default',
      icon: <CreditCard className="h-6 w-6" />
    },
    {
      title: 'Bénéfice net',
      value: formatCurrency(balance),
      trend: balance >= 0 ? '+15%' : '-5%',
      trendUp: balance >= 0,
      period: 'Décembre 2024',
      variant: balance >= 0 ? 'success' : 'danger',
      icon: <Euro className="h-6 w-6" />
    },
    {
      title: 'Transactions',
      value: transactionCount.toString(),
      trend: '+22%',
      trendUp: true,
      period: 'Décembre 2024',
      variant: 'default',
      icon: <Receipt className="h-6 w-6" />
    },
    {
      title: 'Trésorerie prévisionnelle',
      value: formatCurrency(balance * 1.1),
      trend: '+5%',
      trendUp: true,
      period: 'Janvier 2025',
      variant: 'default',
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      title: 'TVA à payer',
      value: formatCurrency(totalReceipts * 0.2),
      trend: 'Échéance dans 5j',
      trendUp: false,
      period: 'Déclaration Q4',
      variant: 'warning',
      icon: <AlertTriangle className="h-6 w-6" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <KpiTile
          key={index}
          title={kpi.title}
          value={kpi.value}
          trend={kpi.trend}
          trendUp={kpi.trendUp}
          period={kpi.period}
          variant={kpi.variant}
          icon={kpi.icon}
        />
      ))}
    </div>
  );
};
