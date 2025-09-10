import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, TrendingUp, User } from 'lucide-react';

interface StatsPointageEmployeProps {
  employeId: string;
  employeNom: string;
}

export const StatsPointageEmploye: React.FC<StatsPointageEmployeProps> = ({
  employeId,
  employeNom
}) => {
  // Mock data - in real app, this would come from API
  const stats = {
    heuresAujourdhui: '7h 30min',
    heuresSemaine: '35h 15min',
    tauxPresence: '95%',
    derniereArrivee: '08:15',
    dernierDepart: '17:45',
    pausesDuJour: 2,
    dureePausesTotale: '45min'
  };

  return (
    <div className="space-y-4">
      {/* Stats générales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="text-xs text-muted-foreground">Aujourd'hui</div>
            </div>
            <div className="text-lg font-bold">{stats.heuresAujourdhui}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="text-xs text-muted-foreground">Cette semaine</div>
            </div>
            <div className="text-lg font-bold">{stats.heuresSemaine}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div className="text-xs text-muted-foreground">Taux présence</div>
            </div>
            <div className="text-lg font-bold text-green-600">{stats.tauxPresence}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="text-xs text-muted-foreground">Pauses</div>
            </div>
            <div className="text-lg font-bold">{stats.pausesDuJour}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Détails du jour */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Détails du jour</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Dernière arrivée</span>
            <Badge variant="outline">{stats.derniereArrivee}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Dernier départ</span>
            <Badge variant="outline">{stats.dernierDepart}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Durée des pauses</span>
            <Badge variant="secondary">{stats.dureePausesTotale}</Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Historique récent */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historique récent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Aujourd'hui</span>
              <span>08:15 - 17:45</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Hier</span>
              <span>08:20 - 17:30</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Lundi</span>
              <span>08:10 - 17:40</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};