import React from 'react';
import { Clock, User, Calendar, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/types/planning';
import { usePlanning } from '@/contexts/PlanningContext';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const { actions } = usePlanning();

  const handleSchedule = () => {
    actions.scheduleVehicle(vehicle.id);
  };

  const handleMarkUrgent = () => {
    actions.markUrgent(vehicle.id);
  };

  const handleOpenScheduleModal = () => {
    actions.openScheduleModal(vehicle);
  };

  return (
    <Card className={`p-4 transition-all hover:shadow-md ${vehicle.urgency ? 'border-red-500 bg-red-50' : ''}`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{vehicle.brand} {vehicle.model}</h4>
              {vehicle.urgency && (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{vehicle.plate}</p>
            <p className="text-sm text-muted-foreground">{vehicle.client}</p>
          </div>
          <div className="text-right">
            <div className="font-semibold text-green-600">{vehicle.price}€</div>
            <div className="text-sm text-muted-foreground flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {vehicle.duration}h
            </div>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground cursor-pointer hover:text-primary" 
             onClick={handleOpenScheduleModal}>
          {vehicle.status}
        </div>
        
        {vehicle.technician && (
          <div className="flex items-center text-sm cursor-pointer hover:text-primary"
               onClick={handleOpenScheduleModal}>
            <User className="w-3 h-3 mr-1" />
            {vehicle.technician}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          {vehicle.inProgress ? (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
              En cours
            </Badge>
          ) : (
            <span className="text-sm text-muted-foreground">À planifier</span>
          )}
          
          <div className="flex gap-2">
            {!vehicle.inProgress && (
              <Button size="sm" variant="outline" onClick={handleSchedule}>
                <Calendar className="w-3 h-3 mr-1" />
                Planifier
              </Button>
            )}
            <Button 
              size="sm" 
              variant={vehicle.urgency ? "destructive" : "outline"}
              onClick={handleMarkUrgent}
            >
              <AlertTriangle className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VehicleCard;