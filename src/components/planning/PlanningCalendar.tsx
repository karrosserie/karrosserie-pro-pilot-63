import { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Clock, User, MapPin } from 'lucide-react';
import { startOfWeek, addWeeks, format, addDays, isSameWeek, parseISO, isValid, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DeplacerTacheModal } from './DeplacerTacheModal';
import { useToast } from '@/hooks/use-toast';

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
  onWeekChange?: (weekStart: Date, weekEnd: Date) => void;
}

export const PlanningCalendar = ({ 
  schedules = [], 
  employees = [], 
  vehicles = [],
  onWeekChange
}: PlanningCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [showDeplacerModal, setShowDeplacerModal] = useState(false);
  const [selectedTaskForMove, setSelectedTaskForMove] = useState<PlanningTask | null>(null);
  const { toast } = useToast();

  // Helper function pour les couleurs des étapes - définie AVANT useMemo
  const getStageColor = (stage: string): string => {
    switch (stage) {
      case 'Accueil & Préparation du dossier':
      case 'accueil':
        return 'border-l-blue-500 bg-blue-50';
      case 'Remplacement ou débosselage':
      case 'remplacement_debosselage':
        return 'border-l-green-500 bg-green-50';
      case 'Préparation peinture':
      case 'preparation_peinture':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'Mise en peinture':
      case 'mise_en_peinture':
        return 'border-l-red-500 bg-red-50';
      case 'Finitions & remontage':
      case 'finitions_remontage':
        return 'border-l-orange-500 bg-orange-50';
      case 'Clôture du dossier et livraison':
      case 'cloture_livraison':
        return 'border-l-purple-500 bg-purple-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Calculer les dates de la semaine actuelle
  const currentWeekStart = useMemo(() => {
    const today = new Date();
    const mondayOfThisWeek = startOfWeek(today, { weekStartsOn: 1 }); // 1 = Lundi
    return addWeeks(mondayOfThisWeek, currentWeek);
  }, [currentWeek]);

  // Générer les dates pour chaque jour de la semaine
  const weekDates = useMemo(() => {
    return Array.from({ length: 5 }, (_, index) => 
      addDays(currentWeekStart, index)
    );
  }, [currentWeekStart]);

  // Stabiliser la référence de onWeekChange
  const onWeekChangeRef = useRef(onWeekChange);
  onWeekChangeRef.current = onWeekChange;
  const isFirstRenderRef = useRef(true);

  // Notifier le parent du changement de semaine (sauf au premier rendu pour éviter les remounts)
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return; // éviter le refresh initial qui reset l'onglet
    }
    if (onWeekChangeRef.current) {
      const weekEnd = addDays(currentWeekStart, 4);
      onWeekChangeRef.current(currentWeekStart, weekEnd);
    }
  }, [currentWeekStart]);

  // Organiser les vraies données par jour de la semaine
  const tasksByDay = useMemo(() => {
    const days: Record<string, PlanningTask[]> = {
      'lundi': [],
      'mardi': [],
      'mercredi': [],
      'jeudi': [],
      'vendredi': []
    };

    schedules.forEach((schedule) => {
      // Tenter de trouver une date exploitable
      let scheduleDate: Date | null = null;
      const rawDate =
        schedule.start_datetime ||
        schedule.startDate ||
        schedule.date ||
        schedule.dateAssignation ||
        schedule.date_debut ||
        schedule.dateTime;

      if (rawDate) {
        try {
          if (typeof rawDate === 'string') {
            const iso = parseISO(rawDate);
            if (isValid(iso)) {
              scheduleDate = iso;
            } else {
              const frParsed = parse(rawDate, 'dd/MM/yyyy', new Date());
              if (isValid(frParsed)) {
                scheduleDate = frParsed;
              } else {
                scheduleDate = null;
              }
            }
          } else {
            const d = new Date(rawDate);
            scheduleDate = isValid(d) ? d : null;
          }
        } catch {
          scheduleDate = null;
        }
      }

      // Si on a une date valide, filtrer par semaine sélectionnée
      if (scheduleDate) {
        if (!isSameWeek(scheduleDate, currentWeekStart, { weekStartsOn: 1 })) {
          return; // Pas la bonne semaine
        }
      } else {
        // Aucune date: on conserve la tâche et on se base sur `jour` pour l'affecter au bon jour
        // (utile pour les anciennes données qui n'ont pas de date complète)
      }

      // Déterminer le jour cible
      let dayKey: string | null = null;
      if (schedule.jour) {
        const key = String(schedule.jour).toLowerCase();
        if (days[key]) {
          dayKey = key;
        }
      } else if (scheduleDate) {
        const frenchDay = format(scheduleDate, 'EEEE', { locale: fr }).toLowerCase();
        if (days[frenchDay]) {
          dayKey = frenchDay;
        }
      }

      if (!dayKey) return; // Impossible de placer ce task dans la grille

      const task: PlanningTask = {
        id: schedule.id,
        time: schedule.heure || '0h-0h',
        vehicleCode: schedule.vehicule || 'N/A',
        brand: schedule.modele?.split(' ')[0] || 'Marque',
        model: schedule.modele?.split(' ').slice(1).join(' ') || 'Modèle',
        taskType: schedule.tache || 'Tâche',
        technician: schedule.technicien || 'Non assigné',
        client: schedule.client || 'Client',
        stage: schedule.etape || 'Étape',
        color: getStageColor(schedule.etape || '')
      };

      days[dayKey].push(task);
    });

    return days;
  }, [schedules, currentWeekStart, currentWeek]);

  const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
  const weekDaysDisplay = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  const handleMoveTask = (taskId: string) => {
    // Trouver la tâche dans les données actuelles
    const allTasks = Object.values(tasksByDay).flat();
    const task = allTasks.find(t => t.id === taskId);
    
    if (task) {
      setSelectedTaskForMove(task);
      setShowDeplacerModal(true);
    } else {
      console.error('Tâche non trouvée:', taskId);
    }
  };

  const handleConfirmDeplacerTache = async (nouvelEmployeId: string, nouvelleDate: Date, nouvelleHeure: string) => {
    if (!selectedTaskForMove) return;

    try {
      // Ici vous pouvez ajouter la logique pour déplacer la tâche dans Supabase
      console.log('Déplacement de la tâche:', {
        taskId: selectedTaskForMove.id,
        nouvelEmployeId,
        nouvelleDate,
        nouvelleHeure
      });

      toast({
        title: "Tâche déplacée",
        description: `La tâche a été déplacée au ${format(nouvelleDate, "dd/MM/yyyy", { locale: fr })} à ${nouvelleHeure}`,
      });

      // Fermer le modal
      setShowDeplacerModal(false);
      setSelectedTaskForMove(null);

      // Optionnel: déclencher un rafraîchissement des données
      // onWeekChange pourrait être utilisé pour refetch les données
      
    } catch (error) {
      console.error('Erreur lors du déplacement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de déplacer la tâche",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Planning Détaillé</h2>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Toutes les tâches par véhicule et jour par jour</p>
          <div className="text-sm font-medium text-slate-700">
            Semaine du {format(currentWeekStart, 'dd MMMM', { locale: fr })} au {format(addDays(currentWeekStart, 4), 'dd MMMM yyyy', { locale: fr })}
          </div>
        </div>
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
          const dayTasks = tasksByDay[day] || [];
          return (
            <div key={day} className="bg-white border border-slate-200 rounded-lg">
              {/* Day Header */}
              <div className="bg-slate-50 p-4 rounded-t-lg border-b border-slate-200">
                <h3 className="font-semibold text-lg text-blue-600">{weekDaysDisplay[dayIndex]}</h3>
                <p className="text-xs text-slate-500 mb-1">{format(weekDates[dayIndex], 'dd/MM', { locale: fr })}</p>
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

      {/* Modal de déplacement de tâche */}
      <DeplacerTacheModal
        isOpen={showDeplacerModal}
        onClose={() => {
          setShowDeplacerModal(false);
          setSelectedTaskForMove(null);
        }}
        tache={selectedTaskForMove ? {
          id: selectedTaskForMove.id,
          vehicule: selectedTaskForMove.vehicleCode,
          etape: selectedTaskForMove.stage,
          client: selectedTaskForMove.client,
          technicien: selectedTaskForMove.technician
        } : undefined}
        employes={employees}
        onConfirm={handleConfirmDeplacerTache}
      />
    </div>
  );
};