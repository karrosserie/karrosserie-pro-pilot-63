import { Button } from '@/components/ui/button';
import { RefreshCw, Calendar, BarChart3 } from 'lucide-react';
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
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Tableau de Bord Productivité</h1>
        <p className="text-muted-foreground text-sm">
          Suivi de la rentabilité et de la productivité mensuelle
        </p>
      </div>
      
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            Période 1
          </label>
          <input
            type="month"
            value={period1}
            onChange={(e) => onPeriod1Change(e.target.value)}
            className="px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            Période 2
          </label>
          <input
            type="month"
            value={period2}
            onChange={(e) => onPeriod2Change(e.target.value)}
            className="px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <Button 
          onClick={onRefresh}
          disabled={isLoading}
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BarChart3 className="w-4 h-4" />
        <span>Période comparée : <span className="font-medium text-foreground">{formatPeriodLabel()}</span></span>
      </div>
    </div>
  );
};
