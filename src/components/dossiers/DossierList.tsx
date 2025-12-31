import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FolderOpen, 
  User, 
  Car, 
  Building2, 
  Hash, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar
} from 'lucide-react';
import { Dossier } from '@/types/dossier';
import { DossierCard } from './DossierCard';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';

interface DossierListProps {
  dossiers: Dossier[];
  isLoading: boolean;
  onView: (id: string) => void;
  onArchive: (id: string) => void;
  onCreateNew?: () => void;
}

type SortField = 'reference' | 'client' | 'vehicle' | 'insurance' | 'created_at' | null;
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export const DossierList = ({ dossiers, isLoading, onView, onArchive, onCreateNew }: DossierListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Sort dossiers
  const sortedDossiers = useMemo(() => {
    if (!sortField) return dossiers;
    
    return [...dossiers].sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';
      
      switch (sortField) {
        case 'reference':
          aValue = a.reference || a.id;
          bValue = b.reference || b.id;
          break;
        case 'client':
          const aClient = a.clients;
          const bClient = b.clients;
          aValue = aClient?.company_name || `${aClient?.first_name || ''} ${aClient?.last_name || ''}`.trim() || '';
          bValue = bClient?.company_name || `${bClient?.first_name || ''} ${bClient?.last_name || ''}`.trim() || '';
          break;
        case 'vehicle':
          aValue = a.vehicles?.license_plate || '';
          bValue = b.vehicles?.license_plate || '';
          break;
        case 'insurance':
          aValue = a.insurance_companies?.name || '';
          bValue = b.insurance_companies?.name || '';
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const comparison = String(aValue).localeCompare(String(bValue), 'fr', { sensitivity: 'base' });
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [dossiers, sortField, sortDirection]);
  
  const totalPages = Math.ceil(sortedDossiers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDossiers = sortedDossiers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-3 w-3 text-[hsl(var(--karrosserie-orange))]" />
      : <ArrowDown className="h-3 w-3 text-[hsl(var(--karrosserie-orange))]" />;
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border overflow-hidden">
        {/* Header skeleton */}
        <div className="hidden md:grid md:grid-cols-[180px_1.2fr_1fr_1fr_100px_48px] md:items-center md:gap-4 md:px-5 md:py-3 bg-[#F1F5F9] dark:bg-muted/50">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-14" />
          <div />
        </div>
        <div className="divide-y divide-border">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sortedDossiers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/30 rounded-xl border border-dashed">
        <div className="p-4 bg-muted rounded-full mb-4">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">Aucun dossier trouvé</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          Aucun dossier ne correspond à vos critères de recherche ou aucun dossier n'a été créé.
        </p>
        {onCreateNew && (
          <Button onClick={onCreateNew} className="gap-2 bg-[hsl(var(--karrosserie-orange))] hover:bg-[hsl(var(--karrosserie-orange))]/90">
            <FolderOpen className="h-4 w-4" />
            Créer un nouveau dossier
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border overflow-hidden shadow-[var(--shadow-card)]">
      {/* Desktop Table Header - Sortable columns per Figma spec */}
      <div className="hidden md:grid md:grid-cols-[180px_1.2fr_1fr_1fr_100px_48px] md:items-center md:gap-4 md:px-5 md:py-3 bg-[#F1F5F9] dark:bg-muted/50 border-b">
        <button 
          onClick={() => handleSort('reference')}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors group"
        >
          <Hash className="h-3.5 w-3.5" />
          Référence
          <SortIcon field="reference" />
        </button>
        <button 
          onClick={() => handleSort('client')}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors group"
        >
          <User className="h-3.5 w-3.5" />
          Client
          <SortIcon field="client" />
        </button>
        <button 
          onClick={() => handleSort('vehicle')}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors group"
        >
          <Car className="h-3.5 w-3.5" />
          Véhicule
          <SortIcon field="vehicle" />
        </button>
        <button 
          onClick={() => handleSort('insurance')}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors group"
        >
          <Building2 className="h-3.5 w-3.5" />
          Assurance
          <SortIcon field="insurance" />
        </button>
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Statut
        </div>
        <div />
      </div>

      {/* Dossier Rows */}
      <div className="divide-y divide-border">
        {paginatedDossiers.map((dossier) => (
          <DossierCard
            key={dossier.id}
            dossier={dossier}
            onView={onView}
            onArchive={onArchive}
          />
        ))}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t bg-[#F8FAFC] dark:bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Affichage {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, sortedDossiers.length)} sur {sortedDossiers.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              // Show limited page numbers with ellipsis for large page counts
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "h-8 w-8 text-sm",
                    currentPage === pageNum && "bg-[hsl(var(--karrosserie-orange))] hover:bg-[hsl(var(--karrosserie-orange))]/90 border-0"
                  )}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
