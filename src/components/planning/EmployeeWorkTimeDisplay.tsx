import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEmployeeWorkTime, type EmployeeWorkTime } from '@/hooks/use-employee-work-time';
import { cn } from '@/lib/utils';

interface EmployeeWorkTimeDisplayProps {
  userId: string;
  employeeName: string;
  compact?: boolean;
}

export const EmployeeWorkTimeDisplay: React.FC<EmployeeWorkTimeDisplayProps> = ({
  userId,
  employeeName,
  compact = false
}) => {
  const { data: workTimeData } = useEmployeeWorkTime(userId);

  // Since userId is provided, data will be a single object
  const workTime = workTimeData as EmployeeWorkTime | null;

  if (!workTime) return null;

  const hoursWorked = Math.floor(workTime.current_total_minutes / 60);
  const minutesWorked = Math.floor(workTime.current_total_minutes % 60);

  // Alert if less than 6h of work and it's already 4pm
  const currentHour = new Date().getHours();
  const shouldShowWarning = currentHour >= 16 && hoursWorked < 6 && !workTime.is_currently_working;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className={cn(
          "font-medium",
          workTime.is_currently_working && "text-green-600 animate-pulse"
        )}>
          {workTime.formatted_duration}
        </span>
        {workTime.is_currently_working && (
          <Badge className="bg-green-500 text-white">En cours</Badge>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5" />
          Temps de travail - {employeeName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total time today */}
        <div className="p-4 bg-primary/5 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Temps total aujourd'hui</span>
            {workTime.is_currently_working && (
              <Badge className="bg-green-500 text-white animate-pulse">
                En cours
              </Badge>
            )}
          </div>
          <div className="text-3xl font-bold text-primary">
            {hoursWorked}h {minutesWorked}min
          </div>
          {workTime.current_task_type && (
            <div className="mt-2 text-sm text-muted-foreground">
              Tâche actuelle : {workTime.current_task_type}
              {workTime.current_vehicle_plate && ` - ${workTime.current_vehicle_plate}`}
            </div>
          )}
        </div>

        {/* Alert if low work time */}
        {shouldShowWarning && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-800">
              Temps de travail inférieur à 6h aujourd'hui
            </span>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Temps total</div>
            <div className="text-lg font-semibold">
              {Math.floor(workTime.total_work_minutes / 60)}h {Math.floor(workTime.total_work_minutes % 60)}min
            </div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Statut</div>
            <div className="text-sm font-medium">
              {workTime.is_currently_working ? (
                <span className="text-green-600">⚡ Actif</span>
              ) : (
                <span className="text-gray-600">⏸️ En pause</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
