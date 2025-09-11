
import React, { useState } from 'react';
import { Euro, TrendingUp, CreditCard, Receipt, TrendingDown } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Calculer les périodes selon la sélection
  const currentDate = new Date();
  
  const getPeriodInfo = () => {
    switch (selectedPeriod) {
      case 'monthly':
        const currentMonth = format(currentDate, 'MMMM yyyy', { locale: fr });
        return {
          title: 'du mois',
          period: currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)
        };
      case 'quarterly':
        const quarterStart = startOfQuarter(currentDate);
        const quarterEnd = endOfQuarter(currentDate);
        const quarter = `T${Math.ceil((currentDate.getMonth() + 1) / 3)} ${currentDate.getFullYear()}`;
        return {
          title: 'du trimestre',
          period: quarter
        };
      case 'yearly':
        const year = currentDate.getFullYear().toString();
        return {
          title: "de l'année",
          period: year
        };
      default:
        return {
          title: 'du mois',
          period: format(currentDate, 'MMMM yyyy', { locale: fr })
        };
    }
  };

  const periodInfo = getPeriodInfo();

  const kpis: KpiData[] = [
    {
      title: `Encaissements ${periodInfo.title}`,
      value: formatCurrency(totalReceipts),
      trend: 'Données actuelles',
      trendUp: totalReceipts > 0,
      period: periodInfo.period,
      variant: 'success',
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      title: `Dépenses ${periodInfo.title}`,
      value: formatCurrency(totalExpenses),
      trend: 'Données actuelles',
      trendUp: false,
      period: periodInfo.period,
      variant: 'default',
      icon: <CreditCard className="h-6 w-6" />
    },
    {
      title: 'Bénéfice net',
      value: formatCurrency(balance),
      trend: balance >= 0 ? 'Positif' : 'Négatif',
      trendUp: balance >= 0,
      period: periodInfo.period,
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
    <div className="space-y-6">
      {/* Sélecteur de période */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Indicateurs financiers</h2>
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === 'monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('monthly')}
            className="text-xs"
          >
            Mensuel
          </Button>
          <Button
            variant={selectedPeriod === 'quarterly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('quarterly')}
            className="text-xs"
          >
            Trimestriel
          </Button>
          <Button
            variant={selectedPeriod === 'yearly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('yearly')}
            className="text-xs"
          >
            Annuel
          </Button>
        </div>
      </div>

      {/* Cartes KPI */}
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
