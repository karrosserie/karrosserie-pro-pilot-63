import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, User, Car, Wrench, Play } from 'lucide-react';
import { TaskWaitingActions } from './TaskWaitingActions';

interface WaitingTask {
  id: string;
  vehicule: string;
  modele: string;
  client: string;
  technicien: string;
  tache: string;
  etape: string;
  heure: string;
  dateAssignation: string;
  reason?: string;
  status: string;
}

interface WaitingTasksTabProps {
  waitingTasks: WaitingTask[];
  loading?: boolean;
  onResumeTask?: (taskId: string) => Promise<{ success: boolean; error?: any }>;
}

export const WaitingTasksTab = ({
  waitingTasks = [],
  loading = false,
  onResumeTask
}: WaitingTasksTabProps) => {
  // Grouper les tâches par raison d'attente
  const groupedTasks = waitingTasks.reduce((acc, task) => {
    const reason = task.reason || 'Raison non spécifiée';
    if (!acc[reason]) {
      acc[reason] = [];
    }
    acc[reason].push(task);
    return acc;
  }, {} as Record<string, WaitingTask[]>);

  const getReasonIcon = (reason: string) => {
    if (reason.toLowerCase().includes('pièces')) return <Wrench className="w-4 h-4" />;
    if (reason.toLowerCase().includes('client')) return <User className="w-4 h-4" />;
    if (reason.toLowerCase().includes('expert')) return <AlertTriangle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const getReasonColor = (reason: string) => {
    if (reason.toLowerCase().includes('pièces')) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (reason.toLowerCase().includes('client')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (reason.toLowerCase().includes('expert')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Chargement des tâches en attente...</p>
        </div>
      </div>
    );
  }

  if (waitingTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          Aucune tâche en attente
        </h3>
        <p className="text-sm text-muted-foreground">
          Toutes les tâches sont en cours ou terminées.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-orange-800">
            {waitingTasks.length} tâche{waitingTasks.length > 1 ? 's' : ''} en attente
          </h3>
        </div>
        <div className="text-sm text-orange-700">
          {Object.keys(groupedTasks).map((reason, index) => (
            <span key={reason}>
              {reason}: {groupedTasks[reason].length}
              {index < Object.keys(groupedTasks).length - 1 ? ' • ' : ''}
            </span>
          ))}
        </div>
      </div>

      {/* Tâches groupées par raison */}
      {Object.entries(groupedTasks).map(([reason, tasks]) => (
        <div key={reason} className="space-y-3">
          <div className="flex items-center gap-2">
            {getReasonIcon(reason)}
            <h4 className="font-semibold text-lg">{reason}</h4>
            <Badge variant="secondary" className="ml-2">
              {tasks.length} tâche{tasks.length > 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <Card key={task.id} className="border-l-4 border-l-orange-400">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        {task.vehicule}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {task.modele}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getReasonColor(reason)}
                    >
                      En attente
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Client:</span>
                      <span>{task.client}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Tâche:</span>
                      <span>{task.tache}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Technicien:</span>
                      <span>{task.technicien}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Horaire prévu:</span>
                      <span>{task.heure}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <TaskWaitingActions
                      taskId={task.id}
                      taskName={task.tache}
                      vehiclePlate={task.vehicule}
                      isWaiting={true}
                      onResume={onResumeTask}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};