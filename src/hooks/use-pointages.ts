import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCompany } from '@/hooks/use-company';

export interface PointageData {
  id: string;
  date: string;
  employe: string;
  matricule: string;
  metier: string;
  chantier: string;
  codeChantier: string;
  latlonChantier: string;
  debut: string | null;
  fin: string | null;
  pauseDebut?: string | null;
  pauseFin?: string | null;
  typePause?: "Repas" | "Demi-journée AM" | "Demi-journée PM" | "";
  gpsDebut?: string;
  gpsFin?: string;
  distDebut?: number | null;
  distFin?: number | null;
  statutDebut: "VALIDE" | "REFUSE";
  statutFin: "VALIDE" | "REFUSE";
  absence?: "" | "CP" | "RTT" | "MAL";
  validationChef?: boolean;
  commentaire?: string;
}

export const usePointages = () => {
  const [pointages, setPointages] = useState<PointageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { companyData } = useCompany();

  const fetchPointages = async () => {
    if (!companyData?.id) return;

    try {
      setIsLoading(true);
      
      // Récupérer les timesheets avec les profils des utilisateurs
      const { data: timesheets, error: timesheetsError } = await supabase
        .from('employee_timesheets')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .eq('company_id', companyData.id)
        .order('date', { ascending: false });

      if (timesheetsError) throw timesheetsError;

      // Récupérer les pauses pour tous les timesheets
      const timesheetIds = timesheets?.map(t => t.id) || [];
      let breaks: any[] = [];
      
      if (timesheetIds.length > 0) {
        const { data: breaksData, error: breaksError } = await supabase
          .from('employee_breaks')
          .select('*')
          .in('timesheet_id', timesheetIds);

        if (breaksError) throw breaksError;
        breaks = breaksData || [];
      }

      // Transformer les données au format attendu
      const transformedData: PointageData[] = (timesheets || []).map((timesheet: any) => {
        const profile = timesheet.profiles;
        const employeeName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Employé inconnu';
        
        // Trouver les pauses pour ce timesheet
        const timesheetBreaks = breaks.filter(b => b.timesheet_id === timesheet.id);
        const mainBreak = timesheetBreaks.find(b => b.break_end_time !== null);
        
        // Déterminer le statut GPS basé sur location_verified
        const gpsStatus: "VALIDE" | "REFUSE" = timesheet.location_verified ? "VALIDE" : "REFUSE";
        
        // Déterminer le type d'absence ou de présence
        let absence: "" | "CP" | "RTT" | "MAL" = "";
        let typePause: "Repas" | "Demi-journée AM" | "Demi-journée PM" | "" = "";
        
        if (!timesheet.clock_in_time && !timesheet.clock_out_time) {
          absence = "MAL"; // Considérer comme maladie si pas de pointage
        } else if (mainBreak) {
          // Déterminer le type de pause basé sur l'heure
          const breakStart = new Date(mainBreak.break_start_time);
          const hour = breakStart.getHours();
          
          if (hour >= 11 && hour <= 14) {
            typePause = "Repas";
          } else if (hour < 12) {
            typePause = "Demi-journée AM";
          } else {
            typePause = "Demi-journée PM";
          }
        }

        return {
          id: timesheet.id,
          date: timesheet.date,
          employe: employeeName,
          matricule: timesheet.user_id.slice(-6), // Utiliser les 6 derniers caractères de l'ID comme matricule
          metier: "Employé", // Valeur par défaut
          chantier: companyData.name || "Atelier Central",
          codeChantier: "ATEL-001", // Valeur par défaut
          latlonChantier: "43.2965,5.3698", // Coordonnées par défaut (Marseille)
          debut: timesheet.clock_in_time,
          fin: timesheet.clock_out_time,
          pauseDebut: mainBreak?.break_start_time || null,
          pauseFin: mainBreak?.break_end_time || null,
          typePause,
          gpsDebut: timesheet.clock_in_latitude && timesheet.clock_in_longitude 
            ? `${timesheet.clock_in_latitude},${timesheet.clock_in_longitude}` 
            : "",
          gpsFin: "", // Pas de GPS de fin dans la table actuelle
          distDebut: 0, // Calculé côté client si nécessaire
          distFin: 0,
          statutDebut: gpsStatus,
          statutFin: gpsStatus,
          absence,
          validationChef: true, // Par défaut validé
          commentaire: ""
        };
      });

      setPointages(transformedData);
    } catch (error) {
      console.error('Error fetching pointages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les pointages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPointages();
  }, [companyData?.id]);

  return {
    pointages,
    isLoading,
    refetch: fetchPointages
  };
};