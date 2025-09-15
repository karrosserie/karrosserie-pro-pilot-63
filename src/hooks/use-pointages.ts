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
      console.log('Chargement des pointages pour la company:', companyData.id);
      
      // D'abord récupérer tous les employés de l'entreprise
      const { data: employees, error: employeesError } = await supabase
        .from('user_companies')
        .select('user_id, role, active')
        .eq('company_id', companyData.id)
        .eq('active', true);

      if (employeesError) {
        console.error('Erreur récupération employés:', employeesError);
        throw employeesError;
      }

      // Récupérer les profils des employés
      const employeeIds = employees?.map(emp => emp.user_id) || [];
      let profiles: any[] = [];
      
      if (employeeIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .in('id', employeeIds);

        if (profilesError) {
          console.error('Erreur récupération profils:', profilesError);
        } else {
          profiles = profilesData || [];
        }
      }

      console.log('Employés trouvés:', employees);
      console.log('Profils trouvés:', profiles);

      // Puis récupérer tous les timesheets récents (derniers 30 jours)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: timesheets, error: timesheetsError } = await supabase
        .from('employee_timesheets')
        .select('*')
        .eq('company_id', companyData.id)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (timesheetsError) {
        console.error('Erreur récupération timesheets:', timesheetsError);
        throw timesheetsError;
      }

      console.log('Timesheets trouvés:', timesheets);

      // Récupérer les pauses pour tous les timesheets
      const timesheetIds = timesheets?.map(t => t.id) || [];
      let breaks: any[] = [];
      
      if (timesheetIds.length > 0) {
        const { data: breaksData, error: breaksError } = await supabase
          .from('employee_breaks')
          .select('*')
          .in('timesheet_id', timesheetIds);

        if (breaksError) {
          console.error('Erreur récupération pauses:', breaksError);
        } else {
          breaks = breaksData || [];
        }
      }

      // Transformer les données au format attendu
      const transformedData: PointageData[] = [];

      // Pour chaque timesheet, créer une entrée de pointage
      (timesheets || []).forEach((timesheet: any) => {
        // Trouver l'employé correspondant
        const employee = employees?.find(emp => emp.user_id === timesheet.user_id);
        const profile = profiles.find(p => p.id === timesheet.user_id);
        const employeeName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Employé inconnu';
        
        // Trouver les pauses pour ce timesheet
        const timesheetBreaks = breaks.filter(b => b.timesheet_id === timesheet.id);
        const mainBreak = timesheetBreaks.find(b => b.break_end_time !== null) || timesheetBreaks[0];
        
        // Déterminer le statut GPS basé sur location_verified
        const gpsStatus: "VALIDE" | "REFUSE" = timesheet.location_verified ? "VALIDE" : "REFUSE";
        
        // Déterminer le type d'absence ou de présence
        let absence: "" | "CP" | "RTT" | "MAL" = "";
        let typePause: "Repas" | "Demi-journée AM" | "Demi-journée PM" | "" = "";
        
        if (!timesheet.clock_in_time && !timesheet.clock_out_time) {
          absence = "MAL"; // Considérer comme maladie si pas de pointage
        } else if (mainBreak) {
          // Déterminer le type de pause basé sur l'heure ou la durée
          if (mainBreak.break_start_time) {
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
        }

        transformedData.push({
          id: timesheet.id,
          date: timesheet.date,
          employe: employeeName,
          matricule: timesheet.user_id.slice(-6), // 6 derniers caractères de l'ID
          metier: employee?.role || "Employé",
          chantier: companyData.name || "Atelier Principal",
          codeChantier: "ATL-001",
          latlonChantier: "43.2965,5.3698", // Coordonnées par défaut
          debut: timesheet.clock_in_time,
          fin: timesheet.clock_out_time,
          pauseDebut: mainBreak?.break_start_time || null,
          pauseFin: mainBreak?.break_end_time || null,
          typePause,
          gpsDebut: timesheet.clock_in_latitude && timesheet.clock_in_longitude 
            ? `${timesheet.clock_in_latitude},${timesheet.clock_in_longitude}` 
            : "",
          gpsFin: "", // Pas de GPS de fin dans la structure actuelle
          distDebut: 0, // À calculer si nécessaire
          distFin: 0,
          statutDebut: gpsStatus,
          statutFin: gpsStatus,
          absence,
          validationChef: true, // Par défaut validé
          commentaire: ""
        });
      });

      console.log('Données transformées:', transformedData);
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