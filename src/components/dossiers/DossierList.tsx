import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderOpen, User, Car, Building2, Tag, Calendar, MoreHorizontal } from 'lucide-react';
import { Dossier } from '@/types/dossier';
import { DossierCard } from './DossierCard';
import { cn } from '@/lib/utils';

interface DossierListProps {
  dossiers: Dossier[];
  isLoading: boolean;
  onView: (id: string) => void;
  onArchive: (id: string) => void;
  onCreateNew?: () => void;
}

export const DossierList = ({ dossiers, isLoading, onView, onArchive, onCreateNew }: DossierListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        ))}
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
          <Button onClick={onCreateNew} className="gap-2">
            <FolderOpen className="h-4 w-4" />
            Créer un nouveau dossier
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Desktop Table Header */}
      <div className="hidden md:grid md:grid-cols-[180px_1.2fr_1fr_1fr_100px_100px_48px] md:items-center md:gap-4 md:px-5 md:py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5" />
          Référence
        </div>
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          Client
        </div>
        <div className="flex items-center gap-1.5">
          <Car className="h-3.5 w-3.5" />
          Véhicule
        </div>
        <div className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5" />
          Assurance
        </div>
        <div>Statut</div>
        <div>Actions</div>
        <div></div>
      </div>

      {/* Dossier Cards */}
      <div className="space-y-2">
        {dossiers.map((dossier) => (
          <DossierCard
            key={dossier.id}
            dossier={dossier}
            onView={onView}
            onArchive={onArchive}
          />
        ))}
      </div>
    </div>
  );
};
