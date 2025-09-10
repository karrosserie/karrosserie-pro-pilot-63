import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DaySchedule {
  day: string;
  dayNumber: number;
  tasks: number;
  isEmpty: boolean;
}

const weekDays: DaySchedule[] = [
  { day: 'Lundi', dayNumber: 0, tasks: 0, isEmpty: true },
  { day: 'Mardi', dayNumber: 0, tasks: 0, isEmpty: true },
  { day: 'Mercredi', dayNumber: 0, tasks: 0, isEmpty: true },
  { day: 'Jeudi', dayNumber: 0, tasks: 0, isEmpty: true },
  { day: 'Vendredi', dayNumber: 0, tasks: 0, isEmpty: true },
  { day: 'Samedi', dayNumber: 0, tasks: 0, isEmpty: true },
  { day: 'Dimanche', dayNumber: 0, tasks: 0, isEmpty: true }
];

const weekSummary = {
  totalTasks: 0,
  vehiclesProcessed: 0,
  techniciansAssigned: 0
};

export const PlanningDetailedView = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Planning Détaillé</h2>
        <p className="text-muted-foreground">Toutes les tâches par véhicule et jour par jour</p>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <Card key={day.day} className="min-h-[200px]">
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-primary">{day.day}</h3>
                <p className="text-sm text-muted-foreground">{day.tasks} tâche(s)</p>
              </div>
              
              {day.isEmpty ? (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <Calendar className="w-8 h-8 mb-2" />
                  <p className="text-sm text-center">Aucune tâche planifiée</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Tasks would be rendered here */}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Week Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5" />
            <h3 className="font-semibold">Résumé de la semaine</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{weekSummary.totalTasks}</div>
              <div className="text-sm text-muted-foreground">Tâches totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{weekSummary.vehiclesProcessed}</div>
              <div className="text-sm text-muted-foreground">Véhicules traités</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{weekSummary.techniciansAssigned}</div>
              <div className="text-sm text-muted-foreground">Techniciens mobilisés</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty state message */}
      {weekSummary.totalTasks === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune planification cette semaine</h3>
            <p className="text-muted-foreground mb-4">Commencez par planifier des véhicules depuis les étapes atelier</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Planifier une tâche
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};