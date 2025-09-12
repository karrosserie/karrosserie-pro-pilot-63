import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Coffee, Save, X, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Break {
  id: string;
  break_start_time: string;
  break_end_time?: string;
  duration_minutes?: number;
}

interface Timesheet {
  id: string;
  date: string;
  clock_in_time: string;
  clock_out_time?: string;
  total_work_minutes?: number;
  location_verified?: boolean;
  breaks?: Break[];
}

interface EditTimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  timesheet: Timesheet | null;
  onSave: () => void;
}

const EditTimesheetModal: React.FC<EditTimesheetModalProps> = ({
  isOpen,
  onClose,
  timesheet,
  onSave
}) => {
  const [clockInTime, setClockInTime] = useState('');
  const [clockOutTime, setClockOutTime] = useState('');
  const [breaks, setBreaks] = useState<Break[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (timesheet && isOpen) {
      // Convertir les timestamps en format time pour les inputs
      setClockInTime(format(new Date(timesheet.clock_in_time), 'HH:mm'));
      setClockOutTime(timesheet.clock_out_time ? format(new Date(timesheet.clock_out_time), 'HH:mm') : '');
      setBreaks(timesheet.breaks || []);
    }
  }, [timesheet, isOpen]);

  const formatTimeForDatabase = (timeString: string, date: string) => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(':');
    const dateObj = new Date(date);
    dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return dateObj.toISOString();
  };

  const updateBreakTime = (breakId: string, field: 'break_start_time' | 'break_end_time', value: string) => {
    setBreaks(prev => prev.map(breakItem => 
      breakItem.id === breakId 
        ? { ...breakItem, [field]: formatTimeForDatabase(value, timesheet?.date || '') || undefined }
        : breakItem
    ));
  };

  const addBreak = () => {
    const newBreak: Break = {
      id: `temp-${Date.now()}`,
      break_start_time: formatTimeForDatabase('12:00', timesheet?.date || '') || '',
      break_end_time: formatTimeForDatabase('13:00', timesheet?.date || '') || ''
    };
    setBreaks(prev => [...prev, newBreak]);
  };

  const removeBreak = async (breakId: string) => {
    if (breakId.startsWith('temp-')) {
      // Pause temporaire, juste la retirer de l'état
      setBreaks(prev => prev.filter(b => b.id !== breakId));
    } else {
      // Pause existante, la supprimer de la base de données
      try {
        const { error } = await supabase
          .from('employee_breaks')
          .delete()
          .eq('id', breakId);

        if (error) throw error;
        
        setBreaks(prev => prev.filter(b => b.id !== breakId));
        toast({
          title: "Succès",
          description: "Pause supprimée avec succès"
        });
      } catch (error) {
        console.error('Erreur lors de la suppression de la pause:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la pause",
          variant: "destructive"
        });
      }
    }
  };

  const handleSave = async () => {
    if (!timesheet) return;

    setIsSubmitting(true);
    try {
      // Mettre à jour le pointage principal
      const updateData: any = {
        clock_in_time: formatTimeForDatabase(clockInTime, timesheet.date),
      };

      if (clockOutTime) {
        updateData.clock_out_time = formatTimeForDatabase(clockOutTime, timesheet.date);
      }

      const { error: timesheetError } = await supabase
        .from('employee_timesheets')
        .update(updateData)
        .eq('id', timesheet.id);

      if (timesheetError) throw timesheetError;

      // Traiter les pauses
      for (const breakItem of breaks) {
        if (breakItem.id.startsWith('temp-')) {
          // Nouvelle pause - l'insérer
          const { error: insertError } = await supabase
            .from('employee_breaks')
            .insert({
              timesheet_id: timesheet.id,
              break_start_time: breakItem.break_start_time,
              break_end_time: breakItem.break_end_time
            });

          if (insertError) throw insertError;
        } else {
          // Pause existante - la mettre à jour
          const { error: updateError } = await supabase
            .from('employee_breaks')
            .update({
              break_start_time: breakItem.break_start_time,
              break_end_time: breakItem.break_end_time
            })
            .eq('id', breakItem.id);

          if (updateError) throw updateError;
        }
      }

      toast({
        title: "Succès",
        description: "Horaires modifiés avec succès"
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeForInput = (timeString: string) => {
    if (!timeString) return '';
    return format(new Date(timeString), 'HH:mm');
  };

  if (!timesheet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Modifier le pointage du {format(new Date(timesheet.date), 'dd MMMM yyyy', { locale: fr })}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Horaires de pointage */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Horaires de pointage</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Heure d'arrivée</label>
                  <Input
                    type="time"
                    value={clockInTime}
                    onChange={(e) => setClockInTime(e.target.value)}
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Heure de départ</label>
                  <Input
                    type="time"
                    value={clockOutTime}
                    onChange={(e) => setClockOutTime(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pauses */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Pauses ({breaks.length})</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addBreak}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une pause
                </Button>
              </div>

              {breaks.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                  Aucune pause enregistrée
                </p>
              ) : (
                <div className="space-y-4">
                  {breaks.map((breakItem, index) => (
                    <div key={breakItem.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Coffee className="h-4 w-4 text-orange-600" />
                          <Badge variant="outline">Pause {index + 1}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBreak(breakItem.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Début de pause</label>
                          <Input
                            type="time"
                            value={formatTimeForInput(breakItem.break_start_time)}
                            onChange={(e) => updateBreakTime(breakItem.id, 'break_start_time', e.target.value)}
                            className="font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Fin de pause</label>
                          <Input
                            type="time"
                            value={breakItem.break_end_time ? formatTimeForInput(breakItem.break_end_time) : ''}
                            onChange={(e) => updateBreakTime(breakItem.id, 'break_end_time', e.target.value)}
                            className="font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTimesheetModal;