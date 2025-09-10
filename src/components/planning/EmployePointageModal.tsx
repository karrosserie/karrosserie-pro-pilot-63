import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatsPointageEmploye } from '@/components/StatsPointageEmploye';
import { Clock, Calendar as CalendarIcon, Activity, Coffee, Play, Pause, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTodayTimesheet, calculateWorkTime, formatWorkTime } from '@/utils/pointageSupabaseUtils';
import { useToast } from '@/hooks/use-toast';

interface EmployePointageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeId: string;
  employeNom: string;
}

interface TimesheetHistory {
  date: string;
  clockInTime: string;
  clockOutTime?: string;
  totalWorkMinutes: number;
  breaks: Array<{
    startTime: string;
    endTime?: string;
    duration: number;
  }>;
}

export const EmployePointageModal: React.FC<EmployePointageModalProps> = ({
  open,
  onOpenChange,
  employeId,
  employeNom
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDayData, setSelectedDayData] = useState<TimesheetHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editClockInTime, setEditClockInTime] = useState('');
  const [editClockOutTime, setEditClockOutTime] = useState('');
  const { toast } = useToast();

  // Charger les données pour la date sélectionnée
  useEffect(() => {
    if (open && employeId && selectedDate) {
      loadSelectedDayData();
    }
  }, [open, employeId, selectedDate]);

  const loadSelectedDayData = async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      // Simuler des données pour la date sélectionnée (remplacer par vraie logique Supabase plus tard)
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Seulement les 7 derniers jours ont des données dans notre simulation
      if (daysDiff >= 0 && daysDiff < 7) {
        const clockIn = new Date(selectedDate);
        clockIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
        
        const clockOut = new Date(selectedDate);
        clockOut.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
        
        const breakStart = new Date(selectedDate);
        breakStart.setHours(12, Math.floor(Math.random() * 30));
        
        const breakEnd = new Date(breakStart);
        breakEnd.setMinutes(breakEnd.getMinutes() + 30 + Math.floor(Math.random() * 30));
        
        const totalWorkMinutes = Math.floor((clockOut.getTime() - clockIn.getTime()) / (1000 * 60)) - 
          Math.floor((breakEnd.getTime() - breakStart.getTime()) / (1000 * 60));
        
        setSelectedDayData({
          date: dateStr,
          clockInTime: format(clockIn, 'HH:mm'),
          clockOutTime: format(clockOut, 'HH:mm'),
          totalWorkMinutes,
          breaks: [{
            startTime: format(breakStart, 'HH:mm'),
            endTime: format(breakEnd, 'HH:mm'),
            duration: Math.floor((breakEnd.getTime() - breakStart.getTime()) / (1000 * 60))
          }]
        });
      } else {
        setSelectedDayData(null);
      }
    } catch (error) {
      console.error('Error loading selected day data:', error);
      setSelectedDayData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (hasWorked: boolean, isToday: boolean) => {
    if (isToday) return hasWorked ? "default" : "secondary";
    return hasWorked ? "outline" : "secondary";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === yesterday.toDateString()) return "Hier";
    return format(date, 'EEEE dd MMMM', { locale: fr });
  };

  const handleEditClick = () => {
    if (selectedDayData) {
      setEditClockInTime(selectedDayData.clockInTime);
      setEditClockOutTime(selectedDayData.clockOutTime || '');
      setEditModalOpen(true);
    }
  };

  const handleSaveEdit = () => {
    // Ici on ajouterait la logique Supabase pour sauvegarder les modifications
    // Pour le moment, on simule juste une mise à jour locale
    if (selectedDayData && editClockInTime) {
      const updatedData = {
        ...selectedDayData,
        clockInTime: editClockInTime,
        clockOutTime: editClockOutTime || undefined
      };
      
      // Recalculer le temps de travail si les deux heures sont disponibles
      if (editClockInTime && editClockOutTime) {
        const [inHours, inMinutes] = editClockInTime.split(':').map(Number);
        const [outHours, outMinutes] = editClockOutTime.split(':').map(Number);
        
        const clockInDate = new Date(selectedDate);
        clockInDate.setHours(inHours, inMinutes);
        
        const clockOutDate = new Date(selectedDate);
        clockOutDate.setHours(outHours, outMinutes);
        
        const workMinutes = Math.floor((clockOutDate.getTime() - clockInDate.getTime()) / (1000 * 60));
        const breakMinutes = selectedDayData.breaks.reduce((total, brk) => total + brk.duration, 0);
        
        updatedData.totalWorkMinutes = Math.max(0, workMinutes - breakMinutes);
      }
      
      setSelectedDayData(updatedData);
      setEditModalOpen(false);
      
      toast({
        title: "Pointage modifié",
        description: "Les heures ont été mises à jour avec succès.",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pointages de {employeNom}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col lg:flex-row gap-6 overflow-hidden">
            {/* Section gauche - Calendrier */}
            <div className="lg:w-1/3 flex flex-col">
              <Card className="flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Sélectionner une date</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border-0 pointer-events-auto"
                    locale={fr}
                  />
                </CardContent>
              </Card>
              
              {/* Bouton Modifier en bas à gauche */}
              {selectedDayData && (
                <div className="mt-4">
                  <Button 
                    onClick={handleEditClick}
                    variant="outline"
                    className="w-full"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                </div>
              )}
            </div>
            
            {/* Section droite - Détails du jour sélectionné */}
            <div className="lg:w-2/3 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Pointage du {formatDate(selectedDate.toISOString().split('T')[0])}
                </h3>
                <Badge variant="outline">
                  {selectedDayData ? 'Données disponibles' : 'Aucune donnée'}
                </Badge>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : selectedDayData ? (
                  <div className="space-y-6">
                    {/* Résumé du jour */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Résumé de la journée</CardTitle>
                          <Badge variant={getStatusBadgeVariant(!!selectedDayData.clockOutTime, selectedDayData.date === new Date().toISOString().split('T')[0])}>
                            {selectedDayData.clockOutTime ? 'Terminé' : 'En cours'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary mb-4">
                          {formatWorkTime(selectedDayData.totalWorkMinutes)}
                          <span className="text-sm font-normal text-muted-foreground ml-2">
                            temps de travail total
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                <Play className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Heure d'arrivée</div>
                                <div className="text-lg font-semibold">{selectedDayData.clockInTime}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                                <Pause className="w-5 h-5 text-red-600" />
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Heure de départ</div>
                                <div className="text-lg font-semibold">{selectedDayData.clockOutTime || '-'}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                                <Coffee className="w-5 h-5 text-orange-600" />
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Nombre de pauses</div>
                                <div className="text-lg font-semibold">{selectedDayData.breaks.length}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                <Activity className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Temps total pause</div>
                                <div className="text-lg font-semibold">
                                  {formatWorkTime(selectedDayData.breaks.reduce((total, brk) => total + brk.duration, 0))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Détail des pauses */}
                    {selectedDayData.breaks.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Détail des pauses</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedDayData.breaks.map((brk, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                                    <Coffee className="w-4 h-4 text-orange-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">Pause {index + 1}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {brk.startTime} - {brk.endTime || 'En cours'}
                                    </div>
                                  </div>
                                </div>
                                <Badge variant="secondary">
                                  {formatWorkTime(brk.duration)}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-8 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun pointage trouvé pour cette date</p>
                    <p className="text-sm mt-2">Sélectionnez une autre date dans le calendrier</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de modification des heures */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier les heures de pointage</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clockin">Heure d'arrivée</Label>
              <Input
                id="clockin"
                type="time"
                value={editClockInTime}
                onChange={(e) => setEditClockInTime(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clockout">Heure de départ</Label>
              <Input
                id="clockout"
                type="time"
                value={editClockOutTime}
                onChange={(e) => setEditClockOutTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit}>
              Valider
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};