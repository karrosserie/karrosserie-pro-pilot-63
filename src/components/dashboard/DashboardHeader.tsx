
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DashboardHeaderProps {
  period1: string;
  period2: string;
  onPeriod1Change: (value: string) => void;
  onPeriod2Change: (value: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const DashboardHeader = ({
  period1,
  period2,
  onPeriod1Change,
  onPeriod2Change,
  onRefresh,
  isLoading
}: DashboardHeaderProps) => {
  const formatPeriodLabel = () => {
    try {
      const date1 = parseISO(`${period1}-01`);
      const date2 = parseISO(`${period2}-01`);
      const label1 = format(date1, 'MMMM yyyy', { locale: fr });
      const label2 = format(date2, 'MMMM yyyy', { locale: fr });
      return `${label1} → ${label2}`;
    } catch {
      return 'Sélectionnez les périodes';
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl p-8 mb-8 shadow-sm">
      <h1 className="text-3xl font-bold text-foreground mb-2">🚗 Tableau de Bord Carrosserie</h1>
      <p className="text-muted-foreground text-lg mb-6">
        Suivi de la rentabilité et de la productivité mensuelle
      </p>
      
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            📅 Période 1 (de)
          </label>
          <input
            type="month"
            value={period1}
            onChange={(e) => onPeriod1Change(e.target.value)}
            className="px-4 py-3 border-2 border-white/80 rounded-2xl text-base bg-white/90 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            📅 Période 2 (à)
          </label>
          <input
            type="month"
            value={period2}
            onChange={(e) => onPeriod2Change(e.target.value)}
            className="px-4 py-3 border-2 border-white/80 rounded-2xl text-base bg-white/90 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <Button 
          onClick={onRefresh}
          disabled={isLoading}
          className="h-12 px-6 rounded-2xl font-semibold"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>
      
      <div className="mt-5 inline-block px-5 py-3 bg-white/70 dark:bg-background/70 rounded-2xl font-semibold text-foreground">
        📊 Période comparée : <span className="text-primary">{formatPeriodLabel()}</span>
      </div>
    </div>
  );
};
