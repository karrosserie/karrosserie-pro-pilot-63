import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface EmployeStatsProps {
  userRole: 'manager' | 'employe';
  employeNom: string;
  tachesEnCours: number;
  tachesTerminees: number;
  totalTaches: number;
}

export const EmployeStats: React.FC<EmployeStatsProps> = ({
  userRole,
  employeNom,
  tachesEnCours,
  tachesTerminees,
  totalTaches
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <User className="w-6 h-6" />
          {userRole === 'employe' ? 'Mon planning' : `Planning de ${employeNom}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">{tachesEnCours}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Tâches en cours</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-success">{tachesTerminees}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Terminées aujourd'hui</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-warning">{totalTaches}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Total du jour</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};