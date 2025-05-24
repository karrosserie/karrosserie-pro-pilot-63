
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface VehicleDateStatusProps {
  formData: any;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const VehicleDateStatus: React.FC<VehicleDateStatusProps> = ({
  formData,
  isViewMode,
  onInputChange,
  onSelectChange
}) => {
  const statusOptions = [
    { value: 'En attente', label: 'En attente' },
    { value: 'Diagnostic', label: 'Diagnostic' },
    { value: 'En réparation', label: 'En réparation' },
    { value: 'Terminé', label: 'Terminé' }
  ];

  const handleArrivalDateTimeChange = (date: Date | undefined, time: string) => {
    if (date) {
      const [hours, minutes] = time.split(':');
      const dateTime = new Date(date);
      dateTime.setHours(parseInt(hours), parseInt(minutes));
      
      // Format as ISO string for the backend
      const isoString = dateTime.toISOString();
      onSelectChange('arrivalDate', isoString);
    }
  };

  const getArrivalDateValue = () => {
    if (!formData.arrivalDate) return undefined;
    return new Date(formData.arrivalDate);
  };

  const getArrivalTimeValue = () => {
    if (!formData.arrivalDate) return '09:00';
    const date = new Date(formData.arrivalDate);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-6 md:col-span-3 space-y-2">
        <Label htmlFor="arrivalDate">Date d'arrivée</Label>
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 justify-start text-left font-normal",
                  !getArrivalDateValue() && "text-muted-foreground"
                )}
                disabled={isViewMode}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {getArrivalDateValue() ? (
                  format(getArrivalDateValue()!, "PPP")
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={getArrivalDateValue()}
                onSelect={(date) => handleArrivalDateTimeChange(date, getArrivalTimeValue())}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          <Input
            type="time"
            value={getArrivalTimeValue()}
            onChange={(e) => handleArrivalDateTimeChange(getArrivalDateValue()!, e.target.value)}
            disabled={isViewMode}
            className="w-24"
          />
        </div>
      </div>

      <div className="col-span-6 md:col-span-3 space-y-2">
        <Label htmlFor="startDate">Date de début</Label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          value={formData.startDate || ''}
          onChange={onInputChange}
          disabled={isViewMode}
        />
      </div>

      <div className="col-span-6 md:col-span-3 space-y-2">
        <Label htmlFor="endDate">Date de fin</Label>
        <Input
          id="endDate"
          name="endDate"
          type="date"
          value={formData.endDate || ''}
          onChange={onInputChange}
          disabled={isViewMode}
        />
      </div>

      <div className="col-span-12 md:col-span-3 space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select 
          disabled={isViewMode} 
          value={formData.status || 'En attente'} 
          onValueChange={(value) => onSelectChange('status', value)}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default VehicleDateStatus;
