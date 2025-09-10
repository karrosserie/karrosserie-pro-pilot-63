import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Play, 
  Pause, 
  Square, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  User
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { fr } from "date-fns/locale";

interface HorairesEmployeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeNom: string;
  employeId: number;
}

interface HoraireData {
  pointage?: string;
  depointage?: string;
  pauses: Array<{
    debut: string;
    fin?: string;
  }>;
}

export const HorairesEmployeModal: React.FC<HorairesEmployeModalProps> = ({
  isOpen,
  onClose,
  employeNom,
  employeId
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fonction pour récupérer les horaires d'un employé pour une date donnée
  const getHorairesEmploye = (date: Date): HoraireData => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Récupérer le pointage
    const pointageKey = `pointage_${employeId}_${dateStr}`;
    const pointage = localStorage.getItem(pointageKey);
    
    // Récupérer le dépointage
    const depointageKey = `depointage_${employeId}_${dateStr}`;
    const depointage = localStorage.getItem(depointageKey);
    
    // Récupérer les pauses
    const pauseKey = `pause_${employeId}_${dateStr}`;
    const retourPauseKey = `retour_pause_${employeId}_${dateStr}`;
    
    const pauseDebut = localStorage.getItem(pauseKey);
    const pauseFin = localStorage.getItem(retourPauseKey);
    
    const pauses: Array<{ debut: string; fin?: string }> = [];
    
    if (pauseDebut) {
      pauses.push({
        debut: pauseDebut,
        fin: pauseFin || undefined
      });
    }
    
    return {
      pointage: pointage || undefined,
      depointage: depointage || undefined,
      pauses
    };
  };

  const horairesData = useMemo(() => getHorairesEmploye(selectedDate), [selectedDate, employeId, employeNom]);

  // Calculer le temps total travaillé
  const calculerTempsTotal = (horaires: HoraireData): string => {
    if (!horaires.pointage || !horaires.depointage) {
      return "Non disponible";
    }
    
    const [heurePointage, minutePointage] = horaires.pointage.split(':').map(Number);
    const [heureDepointage, minuteDepointage] = horaires.depointage.split(':').map(Number);
    
    const minutesPointage = heurePointage * 60 + minutePointage;
    const minutesDepointage = heureDepointage * 60 + minuteDepointage;
    
    let minutesTotales = minutesDepointage - minutesPointage;
    
    // Soustraire le temps de pause
    horaires.pauses.forEach(pause => {
      if (pause.fin) {
        const [heurePauseDebut, minutePauseDebut] = pause.debut.split(':').map(Number);
        const [heurePauseFin, minutePauseFin] = pause.fin.split(':').map(Number);
        
        const minutesPauseDebut = heurePauseDebut * 60 + minutePauseDebut;
        const minutesPauseFin = heurePauseFin * 60 + minutePauseFin;
        
        minutesTotales -= (minutesPauseFin - minutesPauseDebut);
      }
    });
    
    const heures = Math.floor(minutesTotales / 60);
    const minutes = minutesTotales % 60;
    
    return `${heures}h${minutes.toString().padStart(2, '0')}`;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(current => 
      direction === 'prev' ? subDays(current, 1) : addDays(current, 1)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Horaires de travail - {employeNom}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Navigation des dates */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">
                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Résumé de la journée */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Arrivée</div>
                  <div className="font-bold text-lg">
                    {horairesData.pointage || '--:--'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Départ</div>
                  <div className="font-bold text-lg">
                    {horairesData.depointage || '--:--'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Temps total</div>
                  <div className="font-bold text-lg text-primary">
                    {calculerTempsTotal(horairesData)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détail des horaires */}
          <div className="space-y-3">
            {/* Pointage d'arrivée */}
            {horairesData.pointage ? (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Pointage d'arrivée</div>
                  <div className="text-sm text-muted-foreground">Début de journée</div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  {horairesData.pointage}
                </Badge>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-muted/30 border border-dashed rounded-lg">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-muted-foreground">Pointage d'arrivée</div>
                  <div className="text-sm text-muted-foreground">Aucun pointage enregistré</div>
                </div>
              </div>
            )}

            {/* Pauses */}
            {horairesData.pauses.map((pause, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Pause className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Début de pause {index + 1}</div>
                    <div className="text-sm text-muted-foreground">Interruption de travail</div>
                  </div>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                    {pause.debut}
                  </Badge>
                </div>
                
                {pause.fin ? (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg ml-11">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Retour de pause {index + 1}</div>
                      <div className="text-sm text-muted-foreground">Reprise du travail</div>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      {pause.fin}
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-muted/30 border border-dashed rounded-lg ml-11">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-muted-foreground">Retour de pause {index + 1}</div>
                      <div className="text-sm text-muted-foreground">En pause (pas encore de retour)</div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Dépointage */}
            {horairesData.depointage ? (
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Square className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Dépointage</div>
                  <div className="text-sm text-muted-foreground">Fin de journée</div>
                </div>
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                  {horairesData.depointage}
                </Badge>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-muted/30 border border-dashed rounded-lg">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Square className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-muted-foreground">Dépointage</div>
                  <div className="text-sm text-muted-foreground">Pas encore dépointé</div>
                </div>
              </div>
            )}
          </div>

          {/* Message si aucune donnée */}
          {!horairesData.pointage && !horairesData.depointage && horairesData.pauses.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">Aucune donnée</h3>
                <p className="text-sm text-muted-foreground">
                  Aucun horaire enregistré pour cette date
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};