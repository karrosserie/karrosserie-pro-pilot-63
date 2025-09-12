import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Coffee, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  active: boolean;
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
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

interface Break {
  id: string;
  break_start_time: string;
  break_end_time?: string;
  duration_minutes?: number;
}

interface EmployeeTimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember;
}

const EmployeeTimesheetModal: React.FC<EmployeeTimesheetModalProps> = ({
  isOpen,
  onClose,
  member
}) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && member.user_id) {
      fetchTimesheets();
    }
  }, [isOpen, member.user_id]);

  const fetchTimesheets = async () => {
    setIsLoading(true);
    try {
      // Récupérer les pointages des 30 derniers jours
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: timesheetsData, error: timesheetsError } = await supabase
        .from('employee_timesheets')
        .select('*')
        .eq('user_id', member.user_id)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (timesheetsError) throw timesheetsError;

      // Récupérer les pauses pour chaque pointage
      const timesheetsWithBreaks = await Promise.all(
        (timesheetsData || []).map(async (timesheet) => {
          const { data: breaksData } = await supabase
            .from('employee_breaks')
            .select('*')
            .eq('timesheet_id', timesheet.id)
            .order('break_start_time', { ascending: true });

          return {
            ...timesheet,
            breaks: breaksData || []
          };
        })
      );

      setTimesheets(timesheetsWithBreaks);
    } catch (error) {
      console.error('Erreur lors de la récupération des pointages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les pointages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  const getWorkStatus = (timesheet: Timesheet) => {
    if (!timesheet.clock_out_time) {
      return { label: 'En cours', variant: 'default' as const };
    }
    return { label: 'Terminé', variant: 'secondary' as const };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pointages de {member.profiles?.first_name} {member.profiles?.last_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : timesheets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun pointage trouvé pour cet employé</p>
            </div>
          ) : (
            timesheets.map((timesheet) => {
              const status = getWorkStatus(timesheet);
              return (
                <Card key={timesheet.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="h-4 w-4" />
                        {formatDate(timesheet.date)}
                      </CardTitle>
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Heures de pointage */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Arrivée:</span>
                        <span className="font-mono">{formatTime(timesheet.clock_in_time)}</span>
                        {timesheet.location_verified && (
                          <Badge variant="outline" className="text-xs">
                            📍 Localisé
                          </Badge>
                        )}
                      </div>
                      
                      {timesheet.clock_out_time && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm font-medium">Départ:</span>
                          <span className="font-mono">{formatTime(timesheet.clock_out_time)}</span>
                        </div>
                      )}
                      
                      {timesheet.total_work_minutes && timesheet.total_work_minutes > 0 && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Total:</span>
                          <span className="font-mono font-medium text-blue-600">
                            {formatDuration(timesheet.total_work_minutes)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Pauses */}
                    {timesheet.breaks && timesheet.breaks.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Coffee className="h-4 w-4" />
                          Pauses ({timesheet.breaks.length})
                        </h4>
                        <div className="grid gap-2">
                          {timesheet.breaks.map((breakItem, index) => (
                            <div key={breakItem.id} className="flex items-center gap-4 p-2 bg-muted/50 rounded-lg">
                              <Badge variant="outline" className="text-xs">
                                Pause {index + 1}
                              </Badge>
                              <div className="flex items-center gap-2 text-sm">
                                <span>{formatTime(breakItem.break_start_time)}</span>
                                <span>→</span>
                                <span>
                                  {breakItem.break_end_time ? 
                                    formatTime(breakItem.break_end_time) : 
                                    'En cours'
                                  }
                                </span>
                                {breakItem.duration_minutes && (
                                  <Badge variant="secondary" className="text-xs ml-auto">
                                    {formatDuration(breakItem.duration_minutes)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeTimesheetModal;