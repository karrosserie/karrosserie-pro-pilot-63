import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Crown, Plus } from 'lucide-react';
import { format, startOfWeek, addWeeks, subWeeks, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OwnerPlanningTabProps {
  schedules?: any[];
  employees?: any[];
  vehicles?: any[];
}

export const OwnerPlanningTab = ({ schedules = [], employees = [], vehicles = [] }: OwnerPlanningTabProps) => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    duration: '',
    description: ''
  });

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

  const handleTaskSubmit = () => {
    // TODO: Implémenter la création de tâche
    console.log('Nouvelle tâche:', newTask);
    setIsModalOpen(false);
    setNewTask({
      name: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      duration: '',
      description: ''
    });
  };

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
            <div className="flex items-center gap-2">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter une tâche
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ajouter une nouvelle tâche</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-name">Nom de la tâche</Label>
                      <Input
                        id="task-name"
                        value={newTask.name}
                        onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nom de la tâche"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-date">Date</Label>
                      <Input
                        id="task-date"
                        type="date"
                        value={newTask.date}
                        onChange={(e) => setNewTask(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-duration">Durée (en heures)</Label>
                      <Input
                        id="task-duration"
                        type="number"
                        step="0.5"
                        min="0.5"
                        value={newTask.duration}
                        onChange={(e) => setNewTask(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="2.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-description">Description (optionnel)</Label>
                      <Textarea
                        id="task-description"
                        value={newTask.description}
                        onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description de la tâche..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsModalOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button 
                        onClick={handleTaskSubmit}
                        disabled={!newTask.name || !newTask.date || !newTask.duration}
                      >
                        Créer la tâche
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToCurrentWeek}
                className="text-xs"
              >
                Semaine actuelle
              </Button>
            </div>
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