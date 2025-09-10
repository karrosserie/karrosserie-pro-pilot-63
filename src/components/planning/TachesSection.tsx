import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TacheCard } from './TacheCard';
import { PlanningTache } from '@/hooks/usePlanningManager';
import { Clock } from 'lucide-react';

interface TachesSectionProps {
  titre: string;
  icon: React.ReactNode;
  taches: PlanningTache[];
  onTerminerTache: (tacheId: string) => void;
  onVoirVehicule: (vehiculeId: number) => void;
  getStatusVariant: (status: string) => "default" | "destructive" | "outline" | "secondary";
  getStatusLabel: (status: string) => string;
  isTerminedSection?: boolean;
  employeeId: string;
  companyId: string;
}

export const TachesSection: React.FC<TachesSectionProps> = ({
  titre,
  icon,
  taches,
  onTerminerTache,
  onVoirVehicule,
  getStatusVariant,
  getStatusLabel,
  isTerminedSection = false,
  employeeId,
  companyId
}) => {
  if (taches.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            {titre}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Tri chronologique
            </Badge>
            <Badge variant="secondary">{taches.length}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {taches.map((tache) => (
            <TacheCard
              key={tache.id}
              tache={tache}
              onTerminer={onTerminerTache}
              onVoirVehicule={onVoirVehicule}
              getStatusVariant={getStatusVariant}
              getStatusLabel={getStatusLabel}
              isTerminee={isTerminedSection}
              employeeId={employeeId}
              companyId={companyId}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};