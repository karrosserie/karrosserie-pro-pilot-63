import React from 'react';
import { X, Calendar, Clock, User, Car, FileText, Settings, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ isOpen, onClose, task }) => {
  if (!task) return null;

  const startTime = new Date(task.start_datetime);
  const endTime = new Date(task.end_datetime);
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)); // in minutes

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    return mins > 0 ? `${hours}h${mins}min` : `${hours}h`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente': return 'bg-gray-100 text-gray-800';
      case 'En cours': return 'bg-orange-100 text-orange-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            Détails de la tâche
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations principales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Type de tâche :</span>
                  <p className="font-medium">{task.task_type}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Statut :</span>
                  <div className="mt-1">
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Date :</span>
                  <p className="font-medium">
                    {startTime.toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Horaires :</span>
                  <p className="font-medium">
                    {startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - 
                    {endTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Durée estimée :</span>
                  <p className="font-medium">{formatDuration(duration)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations véhicule */}
          {task.vehicle && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Véhicule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Plaque d'immatriculation :</span>
                    <p className="font-medium">{task.vehicle.license_plate}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Marque & Modèle :</span>
                    <p className="font-medium">
                      {task.vehicle.car_brands?.name || ''} {task.vehicle.car_models?.name || ''}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Client :</span>
                    <p className="font-medium">
                      {task.vehicle.clients 
                        ? `${task.vehicle.clients.first_name || ''} ${task.vehicle.clients.last_name || ''}`.trim()
                        : 'Client inconnu'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informations employé */}
          {task.employee && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Technicien assigné
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <span className="text-sm text-muted-foreground">Nom :</span>
                  <p className="font-medium">
                    {task.employee.user_companies?.profiles?.first_name && 
                     task.employee.user_companies?.profiles?.last_name
                      ? `${task.employee.user_companies.profiles.first_name} ${task.employee.user_companies.profiles.last_name}`
                      : 'Employé'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Temps réels si la tâche est commencée ou terminée */}
          {(task.real_start_datetime || task.real_end_datetime) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Temps réels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {task.real_start_datetime && (
                  <div>
                    <span className="text-sm text-muted-foreground">Heure de début réelle :</span>
                    <p className="font-medium">
                      {new Date(task.real_start_datetime).toLocaleString('fr-FR')}
                    </p>
                  </div>
                )}
                {task.real_end_datetime && (
                  <div>
                    <span className="text-sm text-muted-foreground">Heure de fin réelle :</span>
                    <p className="font-medium">
                      {new Date(task.real_end_datetime).toLocaleString('fr-FR')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;