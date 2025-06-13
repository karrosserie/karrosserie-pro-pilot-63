
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiTileProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  period: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning';
  onClick?: () => void;
}

export const KpiTile = ({ 
  title, 
  value, 
  trend, 
  trendUp, 
  period, 
  icon,
  variant = 'default',
  onClick 
}: KpiTileProps) => {
  const variantStyles = {
    default: 'bg-white border-gray-200 hover:border-blue-300',
    success: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:border-green-300',
    danger: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:border-red-300',
    warning: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:border-amber-300'
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        variantStyles[variant]
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
            <p className="text-xs text-gray-500">{period}</p>
          </div>
          {icon && (
            <div className="text-gray-400 opacity-60">
              {icon}
            </div>
          )}
        </div>
        
        <div className={cn(
          "flex items-center mt-3 text-sm font-medium",
          trendUp ? "text-green-600" : "text-red-600"
        )}>
          {trendUp ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          <span>{trend}</span>
          <span className="text-gray-500 ml-1">vs mois dernier</span>
        </div>
      </CardContent>
    </Card>
  );
};
