import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Phone, MoreVertical, Eye, Archive, Car, FolderOpen } from 'lucide-react';
import { Dossier, DOSSIER_STATUS_CONFIG, DossierOverallStatus } from '@/types/dossier';
import { DossierCard } from './DossierCard';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
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
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (dossiers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-1">Aucun dossier trouvé</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Aucun dossier ne correspond à vos critères de recherche
        </p>
        {onCreateNew && (
          <Button onClick={onCreateNew} variant="outline">
            Créer un nouveau dossier
          </Button>
        )}
      </div>
    );
  }

  // Use card-style list for all screen sizes (Figma design)
  return (
    <div className="space-y-3">
      {dossiers.map((dossier) => (
        <DossierCard
          key={dossier.id}
          dossier={dossier}
          onView={onView}
          onArchive={onArchive}
        />
      ))}
    </div>
  );
};
