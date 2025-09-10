import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Clock, CheckCircle, AlertTriangle, Play, Pause } from 'lucide-react';
import { EmployeStats } from '@/components/planning/EmployeStats';
import { TachesSection } from '@/components/planning/TachesSection';

interface PlanningEmployeProps {
  employeId: string;
  companyId: string;
  planningTaches?: any[];
  onTerminerTache?: (tacheId: string) => void;
  onVoirVehicule?: (vehiculeId: number) => void;
}

export const PlanningEmploye: React.FC<PlanningEmployeProps> = ({
  employeId,
  companyId,
  planningTaches = [],
  onTerminerTache,
  onVoirVehicule
}) => {
  const [aPointe, setAPointe] = useState(false);
  const [enPause, setEnPause] = useState(false);

  // Mock data for employee
  const employe = {
    id: employeId,
    nom: 'Employé',
    role: 'Carrossier'
  };

  // Filter tasks for this employee
  const tachesEmploye = planningTaches.filter(tache => 
    tache.technicien === employe.nom || tache.user_id === employeId
  );

  // Categorize tasks
  const tachesAFaire = tachesEmploye.filter(t => t.status === 'planifie');
  const tachesEnCours = tachesEmploye.filter(t => t.status === 'en_cours');
  const tachesTerminees = tachesEmploye.filter(t => t.status === 'termine');

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'planifie': return 'outline';
      case 'en_cours': return 'default';
      case 'termine': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planifie': return 'À faire';
      case 'en_cours': return 'En cours';
      case 'termine': return 'Terminé';
      default: return status;
    }
  };

  const handlePointage = () => {
    setAPointe(!aPointe);
  };

  const handlePause = () => {
    setEnPause(!enPause);
  };

  return (
    <div className="space-y-6">
      {/* Header with employee info and pointage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Planning de {employe.nom}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={aPointe ? 'default' : 'destructive'}>
                {aPointe ? 'Pointé' : 'Non pointé'}
              </Badge>
              {aPointe && (
                <Badge variant={enPause ? 'destructive' : 'secondary'}>
                  {enPause ? 'En pause' : 'Actif'}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={aPointe ? 'destructive' : 'default'}
              size="sm"
              onClick={handlePointage}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              {aPointe ? 'Dépointer' : 'Pointer'}
            </Button>
            
            {aPointe && (
              <Button
                variant={enPause ? 'default' : 'outline'}
                size="sm"
                onClick={handlePause}
                className="flex items-center gap-2"
              >
                {enPause ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {enPause ? 'Reprendre' : 'Pause'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Employee Stats */}
      <EmployeStats
        employeId={employe.id}
        employeNom={employe.nom}
        tachesAFaire={tachesAFaire.length}
        tachesEnCours={tachesEnCours.length}
        tachesTerminees={tachesTerminees.length}
      />

      {/* Tasks Sections */}
      <div className="space-y-4">
        <TachesSection
          titre="Tâches à faire"
          icon={<AlertTriangle className="h-4 w-4" />}
          taches={tachesAFaire}
          onTerminerTache={onTerminerTache || (() => {})}
          onVoirVehicule={onVoirVehicule || (() => {})}
          getStatusVariant={getStatusVariant}
          getStatusLabel={getStatusLabel}
          employeeId={employeId}
          companyId={companyId}
        />

        <TachesSection
          titre="Tâches en cours"
          icon={<Clock className="h-4 w-4" />}
          taches={tachesEnCours}
          onTerminerTache={onTerminerTache || (() => {})}
          onVoirVehicule={onVoirVehicule || (() => {})}
          getStatusVariant={getStatusVariant}
          getStatusLabel={getStatusLabel}
          employeeId={employeId}
          companyId={companyId}
        />

        <TachesSection
          titre="Tâches terminées"
          icon={<CheckCircle className="h-4 w-4" />}
          taches={tachesTerminees}
          onTerminerTache={onTerminerTache || (() => {})}
          onVoirVehicule={onVoirVehicule || (() => {})}
          getStatusVariant={getStatusVariant}
          getStatusLabel={getStatusLabel}
          isTerminedSection={true}
          employeeId={employeId}
          companyId={companyId}
        />
      </div>
    </div>
  );
};