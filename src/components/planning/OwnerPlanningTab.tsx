import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import { format, startOfWeek, addWeeks, subWeeks, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OwnerPlanningTabProps {
  schedules?: any[];
  employees?: any[];
  vehicles?: any[];
}

export const OwnerPlanningTab = ({ schedules = [], employees = [], vehicles = [] }: OwnerPlanningTabProps) => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const goToPreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  // Générer les jours de la semaine (lundi à vendredi)
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(currentWeek, i));

  // Filtrer les tâches pour la semaine actuelle
  const weekSchedules = schedules.filter(schedule => {
    if (!schedule.scheduled_date) return false;
    const scheduleDate = new Date(schedule.scheduled_date);
    return weekDays.some(day => isSameDay(scheduleDate, day));
  });

  return (
    <div className="space-y-6">
      {/* En-tête avec navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              <span>Planning Patron</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToCurrentWeek}
              className="text-xs"
            >
              Semaine actuelle
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousWeek}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Semaine précédente
            </Button>
            
            <div className="text-center">
              <h3 className="font-semibold text-lg">
                {format(currentWeek, 'MMMM yyyy', { locale: fr })}
              </h3>
              <p className="text-sm text-muted-foreground">
                Semaine du {format(currentWeek, 'dd', { locale: fr })} au {format(addDays(currentWeek, 4), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextWeek}
              className="flex items-center gap-2"
            >
              Semaine suivante
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Grille du planning hebdomadaire */}
          <div className="grid grid-cols-5 gap-4">
            {weekDays.map((day, index) => {
              const daySchedules = weekSchedules.filter(schedule => 
                isSameDay(new Date(schedule.scheduled_date), day)
              );
              
              const isToday = isSameDay(day, new Date());
              
              return (
                <div key={index} className="space-y-2">
                  {/* En-tête du jour */}
                  <div className={`p-3 rounded-lg text-center ${
                    isToday 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <div className="font-medium">
                      {format(day, 'EEEE', { locale: fr })}
                    </div>
                    <div className="text-sm">
                      {format(day, 'dd/MM', { locale: fr })}
                    </div>
                  </div>

                  {/* Tâches du jour */}
                  <div className="space-y-2 min-h-[200px]">
                    {daySchedules.length === 0 ? (
                      <div className="p-2 text-center text-sm text-muted-foreground border border-dashed rounded">
                        Aucune tâche
                      </div>
                    ) : (
                      daySchedules.map((schedule, idx) => {
                        const employee = employees.find(emp => emp.user_id === schedule.employee_id);
                        const vehicle = vehicles.find(v => v.id === schedule.vehicle_id);
                        
                        return (
                          <Card key={idx} className="p-2 border-l-4 border-l-primary">
                            <div className="space-y-1">
                              <div className="font-medium text-sm">
                                {schedule.task_type || 'Tâche'}
                              </div>
                              {employee && (
                                <div className="text-xs text-muted-foreground">
                                  👤 {employee.full_name}
                                </div>
                              )}
                              {vehicle && (
                                <div className="text-xs text-muted-foreground">
                                  🚗 {vehicle.license_plate}
                                </div>
                              )}
                              {schedule.scheduled_start_time && (
                                <div className="text-xs text-muted-foreground">
                                  ⏰ {schedule.scheduled_start_time}
                                </div>
                              )}
                            </div>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques de la semaine */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistiques de la semaine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{weekSchedules.length}</div>
              <div className="text-sm text-muted-foreground">Tâches total</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {weekSchedules.filter(s => s.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Terminées</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {weekSchedules.filter(s => s.status === 'in_progress').length}
              </div>
              <div className="text-sm text-muted-foreground">En cours</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {weekSchedules.filter(s => s.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">En attente</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};