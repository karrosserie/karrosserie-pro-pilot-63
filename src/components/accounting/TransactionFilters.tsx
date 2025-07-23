
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Calendar, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/hooks/use-accounting-data';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

interface TransactionFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedFilter: 'all' | 'receipts' | 'expenses' | 'unpaid';
  setSelectedFilter: (filter: 'all' | 'receipts' | 'expenses' | 'unpaid') => void;
  transactions: Transaction[];
  dateRange?: DateRange;
  setDateRange?: (range: DateRange | undefined) => void;
  paymentMethod?: string;
  setPaymentMethod?: (method: string) => void;
}

export const TransactionFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedFilter, 
  setSelectedFilter,
  transactions,
  dateRange,
  setDateRange,
  paymentMethod,
  setPaymentMethod
}: TransactionFiltersProps) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);

  // Calculer les vrais nombres à partir des données
  const allCount = transactions.length;
  const receiptsCount = transactions.filter(t => t.type === 'Encaissement').length;
  const expensesCount = transactions.filter(t => t.type === 'Dépense').length;
  const unpaidCount = transactions.filter(t => t.status === 'En attente').length;

  // Extraire les méthodes de paiement uniques des transactions
  const paymentMethods = Array.from(new Set(transactions.map(t => t.method).filter(Boolean)));

  const filters = [
    { value: 'all', label: 'Tous', count: allCount },
    { value: 'receipts', label: 'Encaissements', count: receiptsCount },
    { value: 'expenses', label: 'Dépenses', count: expensesCount },
    { value: 'unpaid', label: 'En attente de paiement', count: unpaidCount }
  ] as const;

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange?.(range);
  };

  const clearDateFilter = () => {
    setDateRange?.(undefined);
  };

  const clearPaymentMethodFilter = () => {
    setPaymentMethod?.('all');
  };

  const hasActiveFilters = dateRange?.from || dateRange?.to || (paymentMethod && paymentMethod !== 'all');

  return (
    <div className="space-y-4">
      {/* Sous-onglets principaux */}
      <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-lg">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={selectedFilter === filter.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedFilter(filter.value)}
            className={`gap-2 flex-1 sm:flex-none ${
              selectedFilter === filter.value 
                ? 'bg-white shadow-sm text-gray-900 hover:bg-white' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
          >
            {filter.label}
            <Badge 
              variant="secondary" 
              className="text-xs bg-red-500 text-white"
            >
              {filter.count}
            </Badge>
          </Button>
        ))}
      </div>
      
      {/* Barre de recherche et filtres avancés */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Rechercher une transaction, client, ou référence..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          {/* Bouton Période */}
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "gap-2",
                  (dateRange?.from || dateRange?.to) && "bg-orange-50 border-karrosserie-orange text-karrosserie-orange"
                )}
              >
                <Calendar className="h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    `${format(dateRange.from, 'dd/MM', { locale: fr })} - ${format(dateRange.to, 'dd/MM', { locale: fr })}`
                  ) : (
                    format(dateRange.from, 'dd/MM/yyyy', { locale: fr })
                  )
                ) : (
                  'Période'
                )}
                {(dateRange?.from || dateRange?.to) && (
                  <X 
                    className="h-3 w-3 ml-1 hover:bg-red-100 rounded-full" 
                    onClick={(e) => {
                      e.stopPropagation();
                      clearDateFilter();
                    }}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="range"
                selected={dateRange}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          {/* Bouton Plus de filtres */}
          <Popover open={moreFiltersOpen} onOpenChange={setMoreFiltersOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "gap-2",
                  hasActiveFilters && "bg-orange-50 border-karrosserie-orange text-karrosserie-orange"
                )}
              >
                <Filter className="h-4 w-4" />
                Plus de filtres
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 bg-orange-100 text-karrosserie-orange text-xs">
                    {(dateRange?.from ? 1 : 0) + (paymentMethod ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filtres avancés</h4>
                  <p className="text-sm text-muted-foreground">
                    Affinez vos résultats avec des critères spécifiques.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Méthode de paiement</label>
                    <Select value={paymentMethod || 'all'} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les méthodes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les méthodes</SelectItem>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="pt-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        clearDateFilter();
                        clearPaymentMethodFilter();
                      }}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Effacer tous les filtres
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
