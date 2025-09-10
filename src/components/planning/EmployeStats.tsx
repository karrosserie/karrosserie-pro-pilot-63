import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface EmployeStatsProps {
  employeId: string;
  employeNom: string;
  tachesAFaire: number;
  tachesEnCours: number;
  tachesTerminees: number;
}

export const EmployeStats: React.FC<EmployeStatsProps> = ({
  employeId,
  employeNom,
  tachesAFaire,
  tachesEnCours,
  tachesTerminees
}) => {
  const totalTaches = tachesAFaire + tachesEnCours + tachesTerminees;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <User className="w-6 h-6" />
          Planning de {employeNom}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">{tachesAFaire}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">À faire</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{tachesEnCours}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">En cours</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{tachesTerminees}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Terminées</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};