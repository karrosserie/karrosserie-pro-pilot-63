import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';

interface PlanningEvent {
  id: string;
  title: string;
  vehicleBrand: string;
  vehicleModel: string;
  licensePlate: string;
  client: string;
  technician: string;
  startTime: string;
  endTime: string;
  taskType: string;
  status: 'Planifié' | 'En cours' | 'Terminé' | 'En retard';
}

interface PlanningCalendarProps {
  schedules?: any[];
  employees?: any[];
  vehicles?: any[];
}

export const PlanningCalendar = ({ 
  schedules = [], 
  employees = [], 
  vehicles = [] 
}: PlanningCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [currentWeek, setCurrentWeek] = useState(0);

  // Helper functions
  const findEmployeeName = (userId: string): string => {
    const employee = employees.find(emp => emp.user_id === userId);
    return employee ? employee.nom : 'Technicien non assigné';
  };

  const findVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return {
      brand: vehicle?.car_brands?.name || 'Marque inconnue',
      model: vehicle?.car_models?.name || 'Modèle inconnu',
      licensePlate: vehicle?.license_plate || 'Plaque inconnue',
      client: vehicle?.clients ? `${vehicle.clients.first_name} ${vehicle.clients.last_name}` : 'Client inconnu'
    };
  };

  const mapScheduleStatus = (status: string): PlanningEvent['status'] => {
    switch (status) {
      case 'En cours': return 'En cours';
      case 'Terminé': return 'Terminé';
      case 'En retard': return 'En retard';
      default: return 'Planifié';
    }
  };

  // Convert schedules to events grouped by date
  const eventsByDate = useMemo(() => {
    const events: Record<string, PlanningEvent[]> = {};
    
    schedules.forEach(schedule => {
      if (!schedule.start_datetime) return;
      
      const startDate = new Date(schedule.start_datetime);
      if (isNaN(startDate.getTime())) return; // Skip invalid dates
      
      const dateKey = startDate.toISOString().split('T')[0];
      const vehicleInfo = findVehicleInfo(schedule.vehicle_id);
      
      const event: PlanningEvent = {
        id: schedule.id,
        title: schedule.task_type,
        vehicleBrand: vehicleInfo.brand,
        vehicleModel: vehicleInfo.model,
        licensePlate: vehicleInfo.licensePlate,
        client: vehicleInfo.client,
        technician: findEmployeeName(schedule.user_id),
        startTime: startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        endTime: new Date(schedule.end_datetime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        taskType: schedule.task_type,
        status: mapScheduleStatus(schedule.status)
      };

      if (!events[dateKey]) {
        events[dateKey] = [];
      }
      events[dateKey].push(event);
    });

    return events;
  }, [schedules, employees, vehicles]);

  const getStatusBadge = (status: PlanningEvent['status']) => {
    switch (status) {
      case 'Planifié':
        return <Badge variant="outline">Planifié</Badge>;
      case 'En cours':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'Terminé':
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case 'En retard':
        return <Badge className="bg-red-100 text-red-800">En retard</Badge>;
    }
  };

  const getWeekDays = () => {
    const today = new Date();
    const baseDate = new Date(today);
    baseDate.setDate(today.getDate() + (currentWeek * 7) - today.getDay() + 1); // Start from Monday
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      weekDays.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        dayNumber: date.getDate(),
        monthName: date.toLocaleDateString('fr-FR', { month: 'short' }),
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      });
    }
    return weekDays;
  };

  const weekDays = getWeekDays();
  const selectedEvents = eventsByDate[selectedDate] || [];

  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Planning Atelier</h2>
          <p className="text-muted-foreground">Vue calendrier avec répartition par technicien</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentWeek(prev => prev - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentWeek(prev => prev + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Week Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Semaine du {weekDays[0]?.dayNumber} {weekDays[0]?.monthName} au {weekDays[6]?.dayNumber} {weekDays[6]?.monthName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-2">
            {/* Time column */}
            <div className="space-y-12">
              <div className="h-8"></div> {/* Header space */}
              {timeSlots.map(time => (
                <div key={time} className="text-sm text-muted-foreground text-right pr-2">
                  {time}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map(day => (
              <div key={day.date} className="space-y-2">
                <div 
                  className={`text-center p-2 rounded cursor-pointer transition-colors ${
                    selectedDate === day.date 
                      ? 'bg-primary text-primary-foreground' 
                      : day.isWeekend 
                        ? 'bg-muted text-muted-foreground' 
                        : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedDate(day.date)}
                >
                  <div className="font-medium">{day.dayName}</div>
                  <div className="text-sm">{day.dayNumber}</div>
                </div>
                
                {/* Events for this day */}
                <div className="space-y-1 min-h-[400px]">
                  {(eventsByDate[day.date] || []).map(event => (
                    <div 
                      key={event.id}
                      className="bg-blue-50 border border-blue-200 rounded p-2 text-xs cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                      <div className="font-medium truncate">{event.vehicleBrand} {event.vehicleModel}</div>
                      <div className="text-muted-foreground truncate">{event.taskType}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{event.startTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Details */}
      <Card>
        <CardHeader>
          <CardTitle>
            Détails du {new Date(selectedDate).toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune tâche planifiée pour cette journée
            </div>
          ) : (
            <div className="space-y-4">
              {selectedEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{event.vehicleBrand} {event.vehicleModel}</h4>
                      {getStatusBadge(event.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div>{event.licensePlate} • {event.client}</div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {event.technician}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                    <p className="text-sm">{event.taskType}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};