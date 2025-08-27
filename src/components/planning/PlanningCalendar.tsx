import { useState } from 'react';
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

const mockEvents: Record<string, PlanningEvent[]> = {
  '2024-01-15': [
    {
      id: '1',
      title: 'Préparation peinture',
      vehicleBrand: 'Peugeot',
      vehicleModel: '308',
      licensePlate: 'AB-789-XY',
      client: 'Mme Moreau',
      technician: 'Sophie Martin',
      startTime: '08:00',
      endTime: '10:30',
      taskType: 'Préparation peinture',
      status: 'En cours'
    },
    {
      id: '2',
      title: 'Débosselage',
      vehicleBrand: 'Audi',
      vehicleModel: 'A4',
      licensePlate: 'VS-901-AB',
      client: 'M. Bernard',
      technician: 'Sophie Martin',
      startTime: '11:00',
      endTime: '13:00',
      taskType: 'Remplacement ou débosselage',
      status: 'Planifié'
    },
    {
      id: '3',
      title: 'Finitions',
      vehicleBrand: 'Volkswagen',
      vehicleModel: 'Golf',
      licensePlate: 'EF-456-UV',
      client: 'Mme Blanc',
      technician: 'Martin Dubois',
      startTime: '14:00',
      endTime: '15:30',
      taskType: 'Finitions & remontage',
      status: 'Planifié'
    }
  ],
  '2024-01-16': [
    {
      id: '4',
      title: 'Mise en peinture',
      vehicleBrand: 'Renault',
      vehicleModel: 'Clio',
      licensePlate: 'CD-123-ZW',
      client: 'M. Petit',
      technician: 'Sophie Martin',
      startTime: '09:00',
      endTime: '13:00',
      taskType: 'Mise en peinture',
      status: 'Planifié'
    },
    {
      id: '5',
      title: 'Contrôle qualité',
      vehicleBrand: 'Ford',
      vehicleModel: 'Focus',
      licensePlate: 'GH-789-ST',
      client: 'M. Roux',
      technician: 'Martin Dubois',
      startTime: '14:30',
      endTime: '15:00',
      taskType: 'Clôture du dossier et livraison',
      status: 'Planifié'
    }
  ]
};

export const PlanningCalendar = () => {
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [currentWeek, setCurrentWeek] = useState(0);

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
    const baseDate = new Date('2024-01-15');
    baseDate.setDate(baseDate.getDate() + (currentWeek * 7));
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      weekDays.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        dayNumber: date.getDate(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      });
    }
    return weekDays;
  };

  const weekDays = getWeekDays();
  const selectedEvents = mockEvents[selectedDate] || [];

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
            Semaine du {weekDays[0]?.dayNumber} au {weekDays[6]?.dayNumber} janvier 2024
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
                  {(mockEvents[day.date] || []).map(event => (
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