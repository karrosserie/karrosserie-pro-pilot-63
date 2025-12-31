import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderOpen, User, Car, Building2, Hash, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dossier } from '@/types/dossier';
import { DossierCard } from './DossierCard';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface DossierListProps {
  dossiers: Dossier[];
  isLoading: boolean;
  onView: (id: string) => void;
  onArchive: (id: string) => void;
  onCreateNew?: () => void;
}

const ITEMS_PER_PAGE = 10;

export const DossierList = ({ dossiers, isLoading, onView, onArchive, onCreateNew }: DossierListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(dossiers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDossiers = dossiers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  if (dossiers.length === 0) {
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
      {/* Desktop Table Header - Light gray background per spec */}
      <div className="hidden md:grid md:grid-cols-[180px_1.2fr_1fr_1fr_100px_48px] md:items-center md:gap-4 md:px-5 md:py-3 bg-[#F1F5F9] dark:bg-muted/50 border-b">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Hash className="h-3.5 w-3.5" />
          Référence
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <User className="h-3.5 w-3.5" />
          Client
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Car className="h-3.5 w-3.5" />
          Véhicule
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Building2 className="h-3.5 w-3.5" />
          Assurance
        </div>
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
            Affichage {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, dossiers.length)} sur {dossiers.length}
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
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="icon"
                className={cn(
                  "h-8 w-8 text-sm",
                  currentPage === i + 1 && "bg-[hsl(var(--karrosserie-orange))] hover:bg-[hsl(var(--karrosserie-orange))]/90 border-0"
                )}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
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
