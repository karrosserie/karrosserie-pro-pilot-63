
import React from 'react';
import { Euro, TrendingUp, CreditCard, Receipt, TrendingDown } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    }
  ];

  const getVariantStyles = (variant: string) => {
    const variantStyles = {
      default: 'bg-white border-gray-200 hover:border-blue-300',
      success: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:border-green-300',
      danger: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:border-red-300',
      warning: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:border-amber-300'
    };
    return variantStyles[variant as keyof typeof variantStyles] || variantStyles.default;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <Card 
          key={index}
          className={cn(
            "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
            getVariantStyles(kpi.variant || 'default')
          )}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{kpi.value}</p>
                <p className="text-xs text-gray-500">{kpi.period}</p>
              </div>
              {kpi.icon && (
                <div className="text-gray-400 opacity-60">
                  {kpi.icon}
                </div>
              )}
            </div>
            
            <div className={cn(
              "flex items-center mt-3 text-sm font-medium",
              kpi.trendUp ? "text-green-600" : "text-red-600"
            )}>
              {kpi.trendUp ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>{kpi.trend}</span>
              <span className="text-gray-500 ml-1">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
