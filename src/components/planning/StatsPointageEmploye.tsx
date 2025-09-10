import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Coffee, Play, Square, User } from 'lucide-react';
import { 
  getPointageData, 
  calculerTempsTravail, 
  formatTempsEnHeures, 
  type PointageData 
} from '@/utils/pointageUtils';
import { 
  getTodayTimesheet, 
  calculateWorkTime, 
  formatWorkTime 
} from '@/utils/pointageSupabaseUtils';
interface StatsPointageEmployeProps {
  employeId: number;
  employeNom: string;
  date?: Date;
}
export const StatsPointageEmploye: React.FC<StatsPointageEmployeProps> = ({
  employeId,
  employeNom,
  date
}) => {
  const [data, setData] = useState<any>(null);
  const [tempsTravail, setTempsTravail] = useState(0);
  const [pauseEnCours, setPauseEnCours] = useState<any>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to get data from Supabase first
        const supabaseData = await getTodayTimesheet(employeId.toString());
        if (supabaseData) {
          const workTime = calculateWorkTime(supabaseData);
          setTempsTravail(workTime);
          setPauseEnCours(supabaseData.breaks.find(b => !b.break_end_time));
          setData(supabaseData);
        } else {
          // Fallback to localStorage data
          const localData = getPointageData(employeId, date);
          const workTime = calculerTempsTravail(localData);
          setTempsTravail(workTime);
          setPauseEnCours(localData.pauses.find(p => !p.heureFin));
          setData(localData);
        }
      } catch (error) {
        console.error('Error loading pointage data:', error);
        // Fallback to localStorage only
        const localData = getPointageData(employeId, date);
        const workTime = calculerTempsTravail(localData);
        setTempsTravail(workTime);
        setPauseEnCours(localData.pauses.find(p => !p.heureFin));
        setData(localData);
      }
    };
    
    loadData();
  }, [employeId, employeNom, date]);

  if (!data) {
    return <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-4 h-4" />
          {employeNom}
        </CardTitle>
        <CardDescription>Chargement des données...</CardDescription>
      </CardHeader>
    </Card>;
  }

  return <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-4 h-4" />
          {employeNom}
        </CardTitle>
        <CardDescription>
          Statistiques de pointage pour aujourd'hui
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-emerald-500" />
            <div>
              <p className="text-sm text-muted-foreground">Arrivée</p>
              <p className="font-medium">
                {data.heureArrivee || data.clock_in_time ? 
                  (data.heureArrivee || new Date(data.clock_in_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })) 
                  : 'Non pointé'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Square className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Départ</p>
              <p className="font-medium">
                {data.heureDepart || data.clock_out_time ? 
                  (data.heureDepart || new Date(data.clock_out_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })) 
                  : 'Non dépointé'
                }
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Temps travaillé</p>
            <p className="font-medium">
              {data.clock_in_time ? formatWorkTime(tempsTravail) : formatTempsEnHeures(tempsTravail)}
            </p>
          </div>
        </div>
        
        {pauseEnCours && (
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Pause en cours</p>
              <p className="font-medium">
                Depuis {pauseEnCours.heureDebut || 
                  new Date(pauseEnCours.break_start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        )}
        
        <div className="pt-2">
          <Badge variant={pauseEnCours ? 'secondary' : (data.heureArrivee || data.clock_in_time ? 'default' : 'outline')}>
            {pauseEnCours ? 'En pause' : (data.heureArrivee || data.clock_in_time ? 'Présent' : 'Absent')}
          </Badge>
        </div>
      </CardContent>
    </Card>;
};