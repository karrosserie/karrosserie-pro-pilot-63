import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Car, ArrowRight } from 'lucide-react';
import { PlanningTache } from '@/hooks/usePlanningManager';

interface SimpleTacheCardProps {
  tache: PlanningTache & {
    etape: string;
    modele: string;
    vehicule: string;
    heure: string;
    technicien: string;
    client: string;
  };
  qualifications: Array<{ id: string; name: string; color: string }>;
  onCardClick: () => void;
  onDeplacer?: () => void;
  showDeplacerButton?: boolean;
}

export const SimpleTacheCard: React.FC<SimpleTacheCardProps> = ({
  tache,
  qualifications,
  onCardClick,
  onDeplacer,
  showDeplacerButton = false
}) => {
  const getEtapeColor = (etape: string) => {
    const qual = qualifications.find(q => q.id === etape);
    return qual?.color || 'bg-muted text-muted-foreground';
  };

  const getBorderColor = (etape: string) => {
    switch (etape) {
      case 'accueil': return 'border-l-primary';
      case 'remplacement': return 'border-l-success';
      case 'preparation': return 'border-l-warning';
      case 'peinture': return 'border-l-destructive';
      case 'finitions': return 'border-l-accent';
      default: return 'border-l-muted';
    }
  };

  return (
    <Card 
      className={`
        border-l-4 transition-all duration-200 cursor-pointer hover:bg-muted/50
        ${getBorderColor(tache.etape)}
        hover:shadow-md
      `}
      onClick={onCardClick}
    >
      <CardContent className="p-2 sm:p-3">
        <div className="space-y-2">
          {/* Heure en évidence en haut */}
          <div className="flex items-center gap-1 mb-2">
            <Clock className="w-3 h-3 text-primary" />
            <span className="font-mono text-sm font-bold text-primary">
              {tache.heure}
            </span>
          </div>
          
          <div className="flex justify-between items-start">
            <div className="font-bold text-xs sm:text-sm truncate flex items-center gap-2">
              <Car className="w-3 h-3 text-muted-foreground" />
              {tache.vehicule}
            </div>
          </div>
         
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground truncate">
              {tache.modele}
            </div>
            <div className="text-xs font-medium text-primary">
              {tache.tache}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{tache.technicien}</span>
            </div>
            <div className="text-xs text-muted-foreground truncate">
              Client: {tache.client}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge className={getEtapeColor(tache.etape)} variant="secondary">
              {qualifications.find(q => q.id === tache.etape)?.name}
            </Badge>
            
            {showDeplacerButton && onDeplacer && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeplacer();
                }}
                className="h-7 px-2 text-xs hover:bg-primary/10"
              >
                <ArrowRight className="w-3 h-3 mr-1" />
                Déplacer
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};