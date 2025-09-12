import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Clock, User, MapPin } from 'lucide-react';

interface PlanningTask {
  id: string;
  time: string;
  vehicleCode: string;
  brand: string;
  model: string;
  taskType: string;
  technician: string;
  client: string;
  stage: string;
  color: string;
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
  const [currentWeek, setCurrentWeek] = useState(0);

  // Données de test correspondant à l'image
  const mockTasks: Record<string, PlanningTask[]> = {
    'lundi': [
      {
        id: '1',
        time: '10h-12h',
        vehicleCode: 'VS-901-AB',
        brand: 'Audi',
        model: 'A4',
        taskType: 'Débosselage portière',
        technician: 'Sophie Martin',
        client: 'M. Bernard',
        stage: 'Remplacement ou débosselage',
        color: 'border-l-green-500 bg-green-50'
      },
      {
        id: '2',
        time: '14h-16h30',
        vehicleCode: 'AB-789-XY',
        brand: 'Peugeot',
        model: '308',
        taskType: 'Ponçage aile avant',
        technician: 'Sophie Martin',
        client: 'Mme Moreau',
        stage: 'Préparation peinture',
        color: 'border-l-yellow-500 bg-yellow-50'
      },
      {
        id: '3',
        time: '9h-10h',
        vehicleCode: 'EZ-787-KL',
        brand: 'Citroën',
        model: 'C4',
        taskType: 'Accueil & Préparation',
        technician: 'Martin Dubois',
        client: 'M. Durand',
        stage: 'Accueil & Préparation du dossier',
        color: 'border-l-blue-500 bg-blue-50'
      }
    ],
    'mardi': [
      {
        id: '4',
        time: '14h-15h30',
        vehicleCode: 'EF-456-UV',
        brand: 'Volkswagen',
        model: 'Golf',
        taskType: 'Polissage final',
        technician: 'Martin Dubois',
        client: 'Mme Blanc',
        stage: 'Finitions & remontage',
        color: 'border-l-orange-500 bg-orange-50'
      },
      {
        id: '5',
        time: '8h-9h',
        vehicleCode: 'QR-345-ST',
        brand: 'Mercedes',
        model: 'Classe C',
        taskType: 'Accueil & Préparation du dossier',
        technician: 'Martin Dubois',
        client: 'Mme Leclerc',
        stage: 'Accueil & Préparation du dossier',
        color: 'border-l-blue-500 bg-blue-50'
      },
      {
        id: '6',
        time: '9h-13h',
        vehicleCode: 'CD-123-ZW',
        brand: 'Renault',
        model: 'Clio',
        taskType: 'Application base peinture',
        technician: 'Sophie Martin',
        client: 'M. Petit',
        stage: 'Mise en peinture',
        color: 'border-l-red-500 bg-red-50'
      }
    ],
    'mercredi': [
      {
        id: '7',
        time: '11h-11h30',
        vehicleCode: 'GH-789-ST',
        brand: 'Ford',
        model: 'Focus',
        taskType: 'Contrôle qualité',
        technician: 'Martin Dubois',
        client: 'M. Roux',
        stage: 'Clôture du dossier et livraison',
        color: 'border-l-purple-500 bg-purple-50'
      },
      {
        id: '8',
        time: '14h-15h',
        vehicleCode: 'CD-123-ZW',
        brand: 'Renault',
        model: 'Clio',
        taskType: 'Finitions peinture',
        technician: 'Sophie Martin',
        client: 'M. Petit',
        stage: 'Finitions & remontage',
        color: 'border-l-orange-500 bg-orange-50'
      },
      {
        id: '9',
        time: '8h-11h',
        vehicleCode: 'HT-556-GH',
        brand: 'BMW',
        model: 'Série 1',
        taskType: 'Remplacement pare-chocs',
        technician: 'Sophie Martin',
        client: 'M. Rousseau',
        stage: 'Remplacement ou débosselage',
        color: 'border-l-green-500 bg-green-50'
      }
    ],
    'jeudi': [
      {
        id: '10',
        time: '14h-16h',
        vehicleCode: 'EZ-787-KL',
        brand: 'Citroën',
        model: 'C4',
        taskType: 'Débosselage léger',
        technician: 'Martin Dubois',
        client: 'M. Durand',
        stage: 'Remplacement ou débosselage',
        color: 'border-l-green-500 bg-green-50'
      },
      {
        id: '11',
        time: '9h-12h',
        vehicleCode: 'AB-789-XY',
        brand: 'Peugeot',
        model: '308',
        taskType: 'Application peinture',
        technician: 'Sophie Martin',
        client: 'Mme Moreau',
        stage: 'Mise en peinture',
        color: 'border-l-red-500 bg-red-50'
      },
      {
        id: '12',
        time: '14h-14h30',
        vehicleCode: 'EZ-787-KL',
        brand: 'Citroën',
        model: 'C4',
        taskType: 'Livraison client',
        technician: 'Martin Dubois',
        client: 'M. Durand',
        stage: 'Clôture du dossier et livraison',
        color: 'border-l-purple-500 bg-purple-50'
      }
    ],
    'vendredi': [
      {
        id: '13',
        time: '10h-12h',
        vehicleCode: 'AB-789-XY',
        brand: 'Peugeot',
        model: '308',
        taskType: 'Finitions & remontage',
        technician: 'Martin Dubois',
        client: 'Mme Moreau',
        stage: 'Finitions & remontage',
        color: 'border-l-orange-500 bg-orange-50'
      },
      {
        id: '14',
        time: '8h-10h',
        vehicleCode: 'HT-556-GH',
        brand: 'BMW',
        model: 'Série 1',
        taskType: 'Préparation peinture',
        technician: 'Sophie Martin',
        client: 'M. Rousseau',
        stage: 'Préparation peinture',
        color: 'border-l-yellow-500 bg-yellow-50'
      }
    ]
  };

  const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
  const weekDaysDisplay = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  const handleMoveTask = (taskId: string) => {
    console.log('Déplacer tâche:', taskId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Planning Détaillé</h2>
        <p className="text-muted-foreground">Toutes les tâches par véhicule et jour par jour</p>
      </div>

      {/* Week Navigation */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setCurrentWeek(prev => prev - 1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setCurrentWeek(prev => prev + 1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Planning Grid */}
      <div className="grid grid-cols-5 gap-4">
        {weekDays.map((day, dayIndex) => {
          const dayTasks = mockTasks[day] || [];
          return (
            <div key={day} className="bg-white border border-slate-200 rounded-lg">
              {/* Day Header */}
              <div className="bg-slate-50 p-4 rounded-t-lg border-b border-slate-200">
                <h3 className="font-semibold text-lg text-blue-600">{weekDaysDisplay[dayIndex]}</h3>
                <p className="text-sm text-slate-600">{dayTasks.length} tâche{dayTasks.length !== 1 ? 's' : ''}</p>
              </div>

              {/* Tasks */}
              <div className="p-4 space-y-3">
                {dayTasks.map((task) => (
                  <div key={task.id} className={`border-l-4 ${task.color} rounded-r-lg p-3 bg-white shadow-sm`}>
                    {/* Time and Vehicle Code */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium">{task.time}</span>
                      </div>
                      <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                        {task.vehicleCode}
                      </span>
                    </div>

                    {/* Vehicle Info */}
                    <div className="mb-2">
                      <h4 className="font-semibold text-slate-900">{task.brand} {task.model}</h4>
                      <p className="text-sm text-slate-600">{task.taskType}</p>
                    </div>

                    {/* Technician */}
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-600">{task.technician}</span>
                    </div>

                    {/* Client */}
                    <div className="text-sm text-slate-600 mb-2">
                      Client: {task.client}
                    </div>

                    {/* Stage and Action */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{task.stage}</span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs h-7"
                        onClick={() => handleMoveTask(task.id)}
                      >
                        Déplacer
                      </Button>
                    </div>
                  </div>
                ))}

                {dayTasks.length === 0 && (
                  <div className="text-center text-slate-400 py-8">
                    Aucune tâche
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};