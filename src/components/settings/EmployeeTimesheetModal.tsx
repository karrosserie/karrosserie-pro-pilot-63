import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Coffee, X, ChevronLeft, ChevronRight, Play, Square, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import EditTimesheetModal from './EditTimesheetModal';

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && member.user_id) {
      fetchTimesheets();
    }
  }, [isOpen, member.user_id]);

  const fetchTimesheets = async () => {
    setIsLoading(true);
    try {
      // Récupérer les pointages du mois courant
      const startDate = startOfMonth(currentMonth);
      const endDate = endOfMonth(currentMonth);

      const { data: timesheetsData, error: timesheetsError } = await supabase
        .from('employee_timesheets')
        .select('*')
        .eq('user_id', member.user_id)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
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

  useEffect(() => {
    if (isOpen && member.user_id) {
      fetchTimesheets();
    }
  }, [currentMonth, isOpen, member.user_id]);

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const hasTimesheetForDate = (date: Date) => {
    return timesheets.some(timesheet => 
      isSameDay(new Date(timesheet.date), date)
    );
  };

  const getTimesheetForDate = (date: Date) => {
    return timesheets.find(timesheet => 
      isSameDay(new Date(timesheet.date), date)
    );
  };

  const selectedTimesheet = getTimesheetForDate(selectedDate);

  const formatTime = (timeString: string) => {
    return format(new Date(timeString), 'HH:mm');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
  };

  const getTotalBreakTime = (breaks: Break[]) => {
    return breaks.reduce((total, breakItem) => {
      return total + (breakItem.duration_minutes || 0);
    }, 0);
  };

  const getWorkStatus = (timesheet: Timesheet) => {
    if (!timesheet.clock_out_time) {
      return { label: 'En cours', variant: 'default' as const, color: 'bg-blue-500' };
    }
    return { label: 'Terminé', variant: 'secondary' as const, color: 'bg-green-500' };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentMonth(subMonths(currentMonth, 1));
    } else {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const handleEditTimesheet = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveTimesheet = () => {
    fetchTimesheets(); // Recharger les données après modification
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pointages de {member.profiles?.first_name} {member.profiles?.last_name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-6 flex-1 min-h-0">
          {/* Calendrier */}
          <div className="w-80 flex-shrink-0">
            <div className="mb-4">
              <h3 className="font-medium mb-3">Sélectionner une date</h3>
              
              {/* Navigation du mois */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h4 className="font-medium">
                  {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Grille du calendrier */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['lu', 'ma', 'me', 'je', 've', 'sa', 'di'].map((day) => (
                  <div key={day} className="text-xs text-center text-muted-foreground p-2 font-medium">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth().map((date) => {
                  const isSelected = isSameDay(date, selectedDate);
                  const hasTimesheet = hasTimesheetForDate(date);
                  const isToday = isSameDay(date, new Date());
                  
                  return (
                    <Button
                      key={date.toISOString()}
                      variant={isSelected ? "default" : "ghost"}
                      size="sm"
                      className={`
                        h-8 p-0 text-sm relative
                        ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}
                        ${hasTimesheet ? 'font-semibold' : ''}
                        ${!isSameMonth(date, currentMonth) ? 'text-muted-foreground/50' : ''}
                      `}
                      onClick={() => setSelectedDate(date)}
                    >
                      {format(date, 'd')}
                      {hasTimesheet && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full" onClick={handleEditTimesheet}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </div>

          {/* Détails du pointage */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Pointage du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
                </h3>
                {selectedTimesheet && (
                  <Badge variant={getWorkStatus(selectedTimesheet).variant}>
                    {getWorkStatus(selectedTimesheet).label}
                  </Badge>
                )}
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : selectedTimesheet ? (
                <>
                  {/* Résumé de la journée */}
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-medium mb-4">Résumé de la journée</h4>
                      
                      <div className="text-3xl font-bold text-primary mb-6">
                        {selectedTimesheet.total_work_minutes ? 
                          formatDuration(selectedTimesheet.total_work_minutes) : 
                          '0h 00m'
                        }
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                          temps de travail total
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Heure d'arrivée */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Play className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Heure d'arrivée</p>
                            <p className="font-semibold">{formatTime(selectedTimesheet.clock_in_time)}</p>
                          </div>
                        </div>

                        {/* Heure de départ */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Square className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Heure de départ</p>
                            <p className="font-semibold">
                              {selectedTimesheet.clock_out_time ? 
                                formatTime(selectedTimesheet.clock_out_time) : 
                                '--:--'
                              }
                            </p>
                          </div>
                        </div>

                        {/* Nombre de pauses */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Coffee className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Nombre de pauses</p>
                            <p className="font-semibold">{selectedTimesheet.breaks?.length || 0}</p>
                          </div>
                        </div>

                        {/* Temps total pause */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Clock className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Temps total pause</p>
                            <p className="font-semibold">
                              {selectedTimesheet.breaks ? 
                                formatDuration(getTotalBreakTime(selectedTimesheet.breaks)) : 
                                '0h 00m'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Détail des pauses */}
                  {selectedTimesheet.breaks && selectedTimesheet.breaks.length > 0 && (
                    <Card>
                      <CardContent className="p-6">
                        <h4 className="font-medium mb-4">Détail des pauses</h4>
                        <div className="space-y-3">
                          {selectedTimesheet.breaks.map((breakItem, index) => (
                            <div key={breakItem.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                  <Coffee className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                  <p className="font-medium">Pause {index + 1}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatTime(breakItem.break_start_time)} - {' '}
                                    {breakItem.break_end_time ? 
                                      formatTime(breakItem.break_end_time) : 
                                      'En cours'
                                    }
                                  </p>
                                </div>
                              </div>
                              {breakItem.duration_minutes && (
                                <Badge variant="secondary">
                                  {formatDuration(breakItem.duration_minutes)}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h4 className="text-lg font-medium mb-2">Aucun pointage</h4>
                    <p className="text-muted-foreground">
                      Aucune donnée disponible pour le {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>

        {/* Modal de modification */}
        <EditTimesheetModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          timesheet={selectedTimesheet}
          onSave={handleSaveTimesheet}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeTimesheetModal;