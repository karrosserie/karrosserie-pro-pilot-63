import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download, Calendar, MapPin, FileText, Filter, Clock, User, Building2, CheckCircle2, XCircle, AlertTriangle, Navigation, Truck, Waypoints, Phone, Mail, ChevronRight, ArrowLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";
import { useGeneratedReports } from "@/hooks/use-generated-reports";
import { useNavigate } from "react-router-dom";
import { useEmployeeTimesheets } from "@/hooks/use-employee-timesheets";

// ------------------ Types & Helpers ------------------
type Pointage = {
  id: string;
  date: string; // YYYY-MM-DD
  employe: string;
  matricule: string;
  metier: string;
  chantier: string;
  codeChantier: string;
  latlonChantier: string;
  debut: string | null; // ISO
  fin: string | null; // ISO
  pauseDebut?: string | null;
  pauseFin?: string | null;
  typePause?: "Repas" | "Demi-journée AM" | "Demi-journée PM" | "";
  gpsDebut?: string; // lat,lon
  gpsFin?: string;
  distDebut?: number | null; // meters
  distFin?: number | null; // meters
  statutDebut: "VALIDE" | "REFUSE";
  statutFin: "VALIDE" | "REFUSE";
  absence?: "" | "CP" | "RTT" | "MAL";
  validationChef?: boolean;
  commentaire?: string;
};

function toHhMm(decimalHours: number) {
  const h = Math.floor(decimalHours);
  const m = Math.round((decimalHours - h) * 60);
  return `${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")}`;
}

function durationHours(p: Pointage, heuresJour = 7): { duree: number; normales: number; sup: number } {
  // Absences gérées
  if (p.absence === "MAL") return { duree: 0, normales: 0, sup: 0 };
  if (p.statutDebut !== "VALIDE" || p.statutFin !== "VALIDE") return { duree: 0, normales: 0, sup: 0 };
  if (!p.debut || !p.fin) return { duree: 0, normales: 0, sup: 0 };
  const start = new Date(p.debut).getTime();
  const end = new Date(p.fin).getTime();
  let workMs = Math.max(0, end - start);
  if (p.pauseDebut && p.pauseFin) {
    const pb = new Date(p.pauseDebut).getTime();
    const pf = new Date(p.pauseFin).getTime();
    workMs -= Math.max(0, pf - pb);
  }
  const hours = workMs / 3_600_000;
  const normales = Math.min(hours, heuresJour);
  const sup = Math.max(0, hours - heuresJour);
  return { duree: Number(hours.toFixed(2)), normales: Number(normales.toFixed(2)), sup: Number(sup.toFixed(2)) };
}

// ------------------ Sample Data ------------------
const SAMPLE: Pointage[] = [
  {
    id: "P-001",
    date: "2025-08-25",
    employe: "Jean Martin",
    matricule: "EMP001",
    metier: "Carrossier",
    chantier: "Atelier Central",
    codeChantier: "ATEL-001",
    latlonChantier: "43.2965,5.3698",
    debut: "2025-08-25T08:02:00",
    fin: "2025-08-25T16:15:00",
    typePause: "Repas",
    pauseDebut: "2025-08-25T12:00:00",
    pauseFin: "2025-08-25T12:45:00",
    gpsDebut: "43.2966,5.3697",
    gpsFin: "43.2966,5.3697",
    distDebut: 42,
    distFin: 55,
    statutDebut: "VALIDE",
    statutFin: "VALIDE",
    absence: "",
    validationChef: true,
    commentaire: "RAS"
  },
  {
    id: "P-002",
    date: "2025-08-26",
    employe: "Jean Martin",
    matricule: "EMP001",
    metier: "Carrossier",
    chantier: "Atelier Central",
    codeChantier: "ATEL-001",
    latlonChantier: "43.2965,5.3698",
    debut: "2025-08-26T07:58:00",
    fin: "2025-08-26T12:00:00",
    typePause: "Demi-journée AM",
    gpsDebut: "43.2965,5.3698",
    gpsFin: "43.2965,5.3698",
    distDebut: 15,
    distFin: 18,
    statutDebut: "VALIDE",
    statutFin: "VALIDE",
    absence: "",
    validationChef: true,
    commentaire: "Intervention terminée en AM"
  },
  {
    id: "P-003",
    date: "2025-08-25",
    employe: "Sophie Leroy",
    matricule: "EMP002",
    metier: "Mécanicienne",
    chantier: "Atelier Central",
    codeChantier: "ATEL-001",
    latlonChantier: "43.2965,5.3698",
    debut: "2025-08-25T09:03:00",
    fin: "2025-08-25T17:05:00",
    typePause: "Repas",
    pauseDebut: "2025-08-25T12:30:00",
    pauseFin: "2025-08-25T13:15:00",
    gpsDebut: "43.2965,5.3697",
    gpsFin: "43.2965,5.3697",
    distDebut: 30,
    distFin: 25,
    statutDebut: "VALIDE",
    statutFin: "VALIDE",
    absence: "",
    validationChef: true,
    commentaire: ""
  },
  {
    id: "P-004",
    date: "2025-08-26",
    employe: "Sophie Leroy",
    matricule: "EMP002",
    metier: "Mécanicienne",
    chantier: "Atelier Central",
    codeChantier: "ATEL-001",
    latlonChantier: "43.2965,5.3698",
    debut: null,
    fin: null,
    typePause: "",
    gpsDebut: "",
    gpsFin: "",
    distDebut: null,
    distFin: null,
    statutDebut: "REFUSE",
    statutFin: "REFUSE",
    absence: "MAL",
    validationChef: true,
    commentaire: "Arrêt maladie"
  }
];

const HEURES_JOUR = 7; // Paramétrable

// ------------------ UI ------------------
export default function PresencePointages() {
  const [vue, setVue] = useState<"jour" | "semaine" | "mois">("mois");
  const [employe, setEmploye] = useState<string>("tous");
  const [chantier, setChantier] = useState<string>("tous");
  const [statutGps, setStatutGps] = useState<string>("tous");
  const [recherche, setRecherche] = useState("");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [dateDebut, setDateDebut] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dateFin, setDateFin] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formatExport, setFormatExport] = useState<"fec" | "csv">("fec");
  
  // Modal pour compléter les pointages manquants
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [selectedPointage, setSelectedPointage] = useState<Pointage | null>(null);
  const [completionType, setCompletionType] = useState<"present" | "sick_leave" | "absent">("present");
  const [clockInTime, setClockInTime] = useState("");
  const [clockOutTime, setClockOutTime] = useState("");
  
  // Modal pour le récapitulatif des demi-journées
  const [halfDayModalOpen, setHalfDayModalOpen] = useState(false);
  const [selectedHalfDayPointage, setSelectedHalfDayPointage] = useState<Pointage | null>(null);
  
  const { toast } = useToast();
  const { addReport } = useGeneratedReports();
  const navigate = useNavigate();
  const { createOrUpdateTimesheet, markAsSickLeave, markAsAbsent, calculateWorkMinutes } = useEmployeeTimesheets();

  // Gérer l'ouverture du modal de complétion
  const handleCompletePointage = (pointage: Pointage) => {
    setSelectedPointage(pointage);
    setCompletionType("present");
    setClockInTime("08:00");
    setClockOutTime("17:00");
    setCompletionModalOpen(true);
  };

  // Gérer l'ouverture du modal de récapitulatif des demi-journées
  const handleHalfDayRecap = (pointage: Pointage) => {
    setSelectedHalfDayPointage(pointage);
    setHalfDayModalOpen(true);
  };

  // Traiter le problème de demi-journée
  const handleValidateHalfDay = async () => {
    if (!selectedHalfDayPointage) return;

    try {
      toast({
        title: "Problème traité",
        description: `La demi-journée de ${selectedHalfDayPointage.employe} a été validée et traitée.`,
      });

      setHalfDayModalOpen(false);
      setSelectedHalfDayPointage(null);
    } catch (error) {
      console.error('Erreur lors de la validation de la demi-journée:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter le problème. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  // Valider et sauvegarder le pointage
  const handleValidatePointage = async () => {
    if (!selectedPointage) return;

    // Pour l'exemple, on utilise l'ID du pointage comme employee_id
    // Dans un vrai projet, il faudrait mapper les employés aux IDs réels
    const employeeId = selectedPointage.matricule; 

    try {
      if (completionType === "present") {
        const totalMinutes = calculateWorkMinutes(clockInTime, clockOutTime);
        const clockInDateTime = `${selectedPointage.date}T${clockInTime}:00`;
        const clockOutDateTime = `${selectedPointage.date}T${clockOutTime}:00`;
        
        await createOrUpdateTimesheet({
          employee_id: employeeId,
          date: selectedPointage.date,
          clock_in_time: clockInDateTime,
          clock_out_time: clockOutDateTime,
          total_work_minutes: totalMinutes,
          location_verified: true
        });
      } else if (completionType === "sick_leave") {
        await markAsSickLeave(employeeId, selectedPointage.date);
      } else if (completionType === "absent") {
        await markAsAbsent(employeeId, selectedPointage.date);
      }

      setCompletionModalOpen(false);
      setSelectedPointage(null);
    } catch (error) {
      console.error('Erreur lors de la validation du pointage:', error);
    }
  };

  const filtered = useMemo(() => {
    return SAMPLE.filter((p) =>
      (employe === "tous" || p.employe === employe) &&
      (chantier === "tous" || p.chantier === chantier) &&
      (statutGps === "tous" || (statutGps === "valide" ? (p.statutDebut === "VALIDE" && p.statutFin === "VALIDE") : (p.statutDebut !== "VALIDE" || p.statutFin !== "VALIDE"))) &&
      (recherche.trim() === "" || `${p.employe} ${p.matricule} ${p.chantier} ${p.codeChantier}`.toLowerCase().includes(recherche.toLowerCase()))
    );
  }, [employe, chantier, statutGps, recherche]);

  const kpis = useMemo(() => {
    let total = 0, normales = 0, sup = 0, valides = 0, lignes = 0, absences = 0;
    filtered.forEach((p) => {
      const d = durationHours(p, HEURES_JOUR);
      total += d.duree; normales += d.normales; sup += d.sup; lignes += 1;
      if (p.statutDebut === "VALIDE" && p.statutFin === "VALIDE") valides += 1;
      if (p.absence === "CP" || p.absence === "RTT" || p.absence === "MAL") absences += 1;
    });
    const tauxGps = lignes ? Math.round((valides / lignes) * 100) : 0;
    return { total, normales, sup, tauxGps, absences, lignes };
  }, [filtered]);

  const barData = useMemo(() => {
    // Agréger heures par date
    const map = new Map<string, number>();
    filtered.forEach((p) => {
      const d = durationHours(p, HEURES_JOUR).duree;
      map.set(p.date, (map.get(p.date) || 0) + d);
    });
    return Array.from(map.entries()).map(([date, heures]) => ({ date, heures }));
  }, [filtered]);

  const pieData = useMemo(() => {
    const ok = filtered.filter(p => p.statutDebut === "VALIDE" && p.statutFin === "VALIDE").length;
    const ko = filtered.length - ok;
    return [
      { name: "GPS VALIDE", value: ok },
      { name: "GPS REFUSÉ", value: ko },
    ];
  }, [filtered]);

  const employes = Array.from(new Set(SAMPLE.map(s => s.employe)));
  const chantiers = Array.from(new Set(SAMPLE.map(s => s.chantier)));

  const handleGenerateReport = async () => {
    try {
      // Créer le nom du rapport selon le format
      const reportName = formatExport === "csv" ? "Pointages CSV" : "Pointages FEC";
      
      // Ajouter le rapport à la base de données via le hook
      const reportId = await addReport(reportName, new Date(dateDebut), new Date(dateFin));
      
      // Filtrer les données selon la période sélectionnée
      const filteredByDate = filtered.filter(p => {
        return p.date >= dateDebut && p.date <= dateFin;
      });

      if (formatExport === "csv") {
        // Export CSV
        const csvData = filteredByDate.map((p) => {
          const d = durationHours(p, HEURES_JOUR);
          const pauseTxt = p.typePause === "Repas" && p.pauseDebut && p.pauseFin
            ? `${new Date(p.pauseDebut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} – ${new Date(p.pauseFin).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`
            : (p.typePause?.startsWith("Demi-journée") ? p.typePause : "");
          const statutOk = p.statutDebut === "VALIDE" && p.statutFin === "VALIDE";
          
          return {
            'Date': p.date,
            'Employé': p.employe,
            'Matricule': p.matricule,
            'Métier': p.metier,
            'Chantier': p.chantier,
            'Code Chantier': p.codeChantier,
            'Début': p.debut ? new Date(p.debut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '',
            'Fin': p.fin ? new Date(p.fin).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '',
            'Pause': pauseTxt,
            'Durée (HH:MM)': toHhMm(d.duree),
            'Heures décimales': d.duree.toFixed(2),
            'Heures normales': d.normales.toFixed(2),
            'Heures supplémentaires': d.sup.toFixed(2),
            'Statut GPS': statutOk ? 'VALIDE' : 'REFUSÉ',
            'Distance début (m)': p.distDebut ?? 0,
            'Distance fin (m)': p.distFin ?? 0,
            'Absence': p.absence || '',
            'Validation chef': p.validationChef ? 'Oui' : 'Non',
            'GPS Début': p.gpsDebut || '',
            'GPS Fin': p.gpsFin || '',
            'Commentaire': p.commentaire || ''
          };
        });

        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Pointages_CSV");
        
        const fileName = `pointages_csv_${dateDebut}_${dateFin}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        toast({
          title: "Rapport généré avec succès",
          description: `Le rapport ${reportName} a été généré et ajouté à la liste. Fichier ${fileName} téléchargé.`,
        });
      } else {
        // Export FEC
        const fecData = filteredByDate.map((p) => {
          const d = durationHours(p, HEURES_JOUR);
          return {
            'JournalCode': 'PAY',
            'JournalLib': 'Paie',
            'EcritureNum': p.id,
            'EcritureDate': p.date,
            'CompteNum': '641000',
            'CompteLib': 'Rémunérations du personnel',
            'CompAuxNum': p.matricule,
            'CompAuxLib': p.employe,
            'PieceRef': `POINT-${p.date}-${p.matricule}`,
            'PieceDate': p.date,
            'EcritureLib': `Pointage ${p.employe} - ${p.chantier}`,
            'Debit': d.duree * 15, // Exemple: 15€/heure
            'Credit': 0,
            'EcritureLet': '',
            'DateLet': '',
            'ValidDate': p.validationChef ? p.date : '',
            'Montantdevise': '',
            'Idevise': ''
          };
        });

        const ws = XLSX.utils.json_to_sheet(fecData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Export_FEC");
        
        const fileName = `pointages_fec_${dateDebut}_${dateFin}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        toast({
          title: "Rapport généré avec succès",
          description: `Le rapport ${reportName} a été généré et ajouté à la liste. Fichier ${fileName} téléchargé.`,
        });
      }

      setReportDialogOpen(false);
      
      // Navigation vers la page de comptabilité après génération du rapport
      navigate('/payments/accounting');
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/payments/accounting')}
              className="hover:bg-karrosserie-orange/10 hover:text-karrosserie-orange"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
          
          <h1 className="text-2xl font-semibold mt-1 bg-gradient-to-r from-karrosserie-orange to-primary bg-clip-text text-transparent">Présence & Pointages (géolocalisé)</h1>
          <p className="text-sm text-muted-foreground">Contrôle GPS, demi-journées, pauses repas, calculs heures normales & supplémentaires, exports paie</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white border-0">
                <FileText className="w-4 h-4"/>
                Générer un rapport
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Générer un rapport de pointages</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateDebut">Date de début</Label>
                    <Input
                      id="dateDebut"
                      type="date"
                      value={dateDebut}
                      onChange={(e) => setDateDebut(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateFin">Date de fin</Label>
                    <Input
                      id="dateFin"
                      type="date"
                      value={dateFin}
                      onChange={(e) => setDateFin(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>Format d'export</Label>
                  <RadioGroup value={formatExport} onValueChange={(value: "fec" | "csv") => setFormatExport(value)} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fec" id="fec" />
                      <Label htmlFor="fec">Format FEC</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="csv" id="csv" />
                      <Label htmlFor="csv">Format CSV</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleGenerateReport}>
                    Générer le rapport
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <div className="col-span-1">
              <Label>Vue</Label>
              <Select value={vue} onValueChange={(v) => setVue(v as any)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Mois"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="jour">Jour</SelectItem>
                  <SelectItem value="semaine">Semaine</SelectItem>
                  <SelectItem value="mois">Mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1">
              <Label>Employé</Label>
              <Select value={employe} onValueChange={setEmploye}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Tous"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  {employes.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1">
              <Label>Chantier</Label>
              <Select value={chantier} onValueChange={setChantier}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Tous"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  {chantiers.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1">
              <Label>Statut GPS</Label>
              <Select value={statutGps} onValueChange={setStatutGps}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Tous"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous</SelectItem>
                  <SelectItem value="valide">Valide</SelectItem>
                  <SelectItem value="refuse">Refusé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Recherche</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input placeholder="Rechercher (nom, matricule, chantier)" value={recherche} onChange={(e) => setRecherche(e.target.value)} />
                <Button variant="outline" className="gap-2"><Filter className="w-4 h-4"/> Filtres avancés</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="shadow-sm border-l-4 border-l-karrosserie-orange bg-gradient-to-br from-karrosserie-orange/5 to-transparent"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total heures</CardTitle></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold text-karrosserie-orange">{toHhMm(kpis.total)}</div><div className="text-xs text-muted-foreground">Période filtrée</div></CardContent></Card>
        <Card className="shadow-sm border-l-4 border-l-primary bg-gradient-to-br from-primary/5 to-transparent"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Heures normales</CardTitle></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold text-primary">{toHhMm(kpis.normales)}</div><div className="text-xs text-muted-foreground">Seuil {HEURES_JOUR}h/j</div></CardContent></Card>
        <Card className="shadow-sm border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-500/5 to-transparent"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Heures sup.</CardTitle></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold text-amber-600">{toHhMm(kpis.sup)}</div><div className="text-xs text-muted-foreground">Au-delà du seuil</div></CardContent></Card>
        <Card className="shadow-sm border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-500/5 to-transparent"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Taux conformité GPS</CardTitle></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold text-emerald-600">{kpis.tauxGps}%</div><div className="text-xs text-muted-foreground">{kpis.lignes} lignes</div></CardContent></Card>
        <Card className="shadow-sm border-l-4 border-l-red-500 bg-gradient-to-br from-red-500/5 to-transparent"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Absences</CardTitle></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold text-red-600">{kpis.absences}</div><div className="text-xs text-muted-foreground">CP/RTT/MAL</div></CardContent></Card>
      </div>

      {/* Graphique circulaire et cartes d'alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Répartition conformité GPS</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                   <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                     <Cell key="gps-valide" fill="hsl(var(--karrosserie-orange))" />
                     <Cell key="gps-refuse" fill="hsl(var(--karrosserie-gray))" />
                   </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cartes d'alertes empilées verticalement */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-1 flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-500"/>Pointage manquant</CardTitle>
              <Badge variant="secondary">{filtered.filter(p=>!p.debut || !p.fin).length}</Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {filtered.filter(p=>!p.debut || !p.fin).slice(0,1).map(p=> (
                <div key={p.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-orange-600 font-medium">Compléter</div>
                    <div className="text-xs text-muted-foreground">{p.employe} · {p.date}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleCompletePointage(p)}
                  >
                    Compléter
                  </Button>
                </div>
              ))}
              {filtered.filter(p=>!p.debut || !p.fin).length === 0 && (
                <div>
                  <div className="text-orange-600 font-medium">Compléter</div>
                  <div className="text-xs text-muted-foreground">Aucune anomalie</div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-1 flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500"/>Hors zone GPS</CardTitle>
              <Badge variant="secondary">{filtered.filter(p=> (p.distDebut||0) > 100 || (p.distFin||0) > 100).length}</Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {filtered.filter(p=> (p.distDebut||0) > 100 || (p.distFin||0) > 100).length > 0 ? (
                filtered.filter(p=> (p.distDebut||0) > 100 || (p.distFin||0) > 100).slice(0,1).map(p=> (
                  <div key={p.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-red-600 font-medium">Vérifier</div>
                      <div className="text-xs text-muted-foreground">{p.employe} · {p.date}</div>
                    </div>
                    <Badge variant="destructive">Vérifier</Badge>
                  </div>
                ))
              ) : (
                <div>
                  <div className="text-blue-600 font-medium">Aucune alerte</div>
                  <div className="text-xs text-muted-foreground">Tous les GPS sont conformes</div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-1 flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500"/>Demi-journées</CardTitle>
              <Badge variant="secondary">{filtered.filter(p=> p.typePause?.startsWith("Demi-journée")).length}</Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {filtered.filter(p=> p.typePause?.startsWith("Demi-journée")).slice(0,1).map(p=> (
                <div key={p.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-green-600 font-medium">OK</div>
                    <div className="text-xs text-muted-foreground">{p.employe} · {p.date}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleHalfDayRecap(p)}
                  >
                    OK
                  </Button>
                </div>
              ))}
              {filtered.filter(p=> p.typePause?.startsWith("Demi-journée")).length === 0 && (
                <div>
                  <div className="text-green-600 font-medium">OK</div>
                  <div className="text-xs text-muted-foreground">Aucune demi-journée</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Graphique heures par jour */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Heures par jour</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="heures" fill="hsl(var(--karrosserie-orange))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tableau */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Détail des pointages</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Employé</th>
                  <th className="text-left p-2">Chantier</th>
                  <th className="text-left p-2">Début (GPS)</th>
                  <th className="text-left p-2">Fin (GPS)</th>
                  <th className="text-left p-2">Pause</th>
                  <th className="text-left p-2">Durée</th>
                  <th className="text-left p-2">Heures déc.</th>
                  <th className="text-left p-2">Normales</th>
                  <th className="text-left p-2">Sup.</th>
                  <th className="text-left p-2">Statuts</th>
                  <th className="text-left p-2">Distance</th>
                  <th className="text-left p-2">Absence</th>
                  <th className="text-left p-2">Chef</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const d = durationHours(p, HEURES_JOUR);
                  const pauseTxt = p.typePause === "Repas" && p.pauseDebut && p.pauseFin
                    ? `${new Date(p.pauseDebut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} – ${new Date(p.pauseFin).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`
                    : (p.typePause?.startsWith("Demi-journée") ? p.typePause : "");
                  const statutOk = p.statutDebut === "VALIDE" && p.statutFin === "VALIDE";
                  const distMax = Math.max(p.distDebut || 0, p.distFin || 0);
                  return (
                    <Dialog key={p.id}>
                      <DialogTrigger asChild>
                        <tr className="border-t cursor-pointer hover:bg-gradient-to-r hover:from-karrosserie-orange/10 hover:to-primary/10 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 border-l-2 border-l-transparent hover:border-l-karrosserie-orange">
                          <td className="p-2 whitespace-nowrap transition-colors duration-200 hover:text-karrosserie-orange">{p.date}</td>
                          <td className="p-2 whitespace-nowrap flex items-center gap-2 transition-colors duration-200 hover:text-karrosserie-orange"><User className="w-4 h-4"/>{p.employe}</td>
                          <td className="p-2 whitespace-nowrap flex items-center gap-2 transition-colors duration-200 hover:text-primary"><Building2 className="w-4 h-4"/>{p.chantier}</td>
                          <td className="p-2 whitespace-nowrap transition-colors duration-200 hover:text-primary">{p.debut ? new Date(p.debut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : "—"} {p.gpsDebut && <span className="text-muted-foreground">({p.gpsDebut})</span>}</td>
                          <td className="p-2 whitespace-nowrap transition-colors duration-200 hover:text-primary">{p.fin ? new Date(p.fin).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : "—"} {p.gpsFin && <span className="text-muted-foreground">({p.gpsFin})</span>}</td>
                          <td className="p-2 whitespace-nowrap transition-colors duration-200 hover:text-primary">{pauseTxt || "—"}</td>
                          <td className="p-2 whitespace-nowrap font-medium transition-colors duration-200 hover:text-karrosserie-orange">{toHhMm(d.duree)}</td>
                          <td className="p-2 whitespace-nowrap transition-colors duration-200 hover:text-karrosserie-orange">{d.duree.toFixed(2)}</td>
                          <td className="p-2 whitespace-nowrap transition-colors duration-200 hover:text-karrosserie-orange">{d.normales.toFixed(2)}</td>
                          <td className="p-2 whitespace-nowrap transition-colors duration-200 hover:text-karrosserie-orange">{d.sup.toFixed(2)}</td>
                          <td className="p-2 whitespace-nowrap">{statutOk ? <Badge className="bg-emerald-600 hover:bg-emerald-600">VALIDE</Badge> : <Badge variant="destructive">REFUSÉ</Badge>}</td>
                          <td className="p-2 whitespace-nowrap transition-colors duration-200 hover:text-primary">{(p.distDebut ?? 0)} / {(p.distFin ?? 0)} m</td>
                          <td className="p-2 whitespace-nowrap transition-colors duration-200 hover:text-primary">{p.absence || "—"}</td>
                          <td className="p-2 whitespace-nowrap">{p.validationChef ? <CheckCircle2 className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}</td>
                        </tr>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Fiche pointage — {p.employe} · {p.date}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <Card className="border-dashed">
                            <CardHeader className="pb-1"><CardTitle className="text-sm">Chronologie</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Début: {p.debut ? new Date(p.debut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : "—"} <span className="text-muted-foreground">{p.gpsDebut && `(${p.gpsDebut})`}</span></div>
                              {p.pauseDebut && p.pauseFin && (
                                <div className="flex items-center gap-2"><Clock className="w-4 h-4"/> Pause: {new Date(p.pauseDebut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} – {new Date(p.pauseFin).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                              )}
                              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Fin: {p.fin ? new Date(p.fin).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : "—"} <span className="text-muted-foreground">{p.gpsFin && `(${p.gpsFin})`}</span></div>
                              <div className="pt-2 text-muted-foreground">Distance: début {(p.distDebut ?? 0)} m · fin {(p.distFin ?? 0)} m</div>
                            </CardContent>
                          </Card>
                          <Card className="border-dashed">
                            <CardHeader className="pb-1"><CardTitle className="text-sm">Calculs</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 gap-2">
                              <div className="text-muted-foreground">Durée</div><div className="font-medium">{toHhMm(d.duree)} ({d.duree.toFixed(2)})</div>
                              <div className="text-muted-foreground">Normales</div><div>{d.normales.toFixed(2)}</div>
                              <div className="text-muted-foreground">Sup.</div><div>{d.sup.toFixed(2)}</div>
                              <div className="text-muted-foreground">Absence</div><div>{p.absence || "—"}</div>
                              <div className="text-muted-foreground">Chef</div><div>{p.validationChef ? "Validé" : "À valider"}</div>
                            </CardContent>
                          </Card>
                          <Card className="md:col-span-2 border-dashed">
                            <CardHeader className="pb-1"><CardTitle className="text-sm">Justificatifs & actions</CardTitle></CardHeader>
                            <CardContent className="flex flex-wrap items-center gap-2">
                              <Button variant="outline" className="gap-2"><Navigation className="w-4 h-4"/> Voir sur carte</Button>
                              <Button variant="outline" className="gap-2"><Phone className="w-4 h-4"/> Contacter l'employé</Button>
                              <Button variant="outline" className="gap-2"><Mail className="w-4 h-4"/> Demander justificatif</Button>
                              <Button className="gap-2"><CheckCircle2 className="w-4 h-4"/> Valider manuellement</Button>
                            </CardContent>
                          </Card>
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer note */}
      <p className="text-xs text-muted-foreground">
        Artefact UI — Présence & Pointages. Paramétrable: seuil heures normales/jour, tolérance GPS (m), règles d'heures sup. quotidiennes/hebdomadaires, exports (CSV/XLSX/PDF), envoi automatique à l'expert-comptable.
      </p>

      {/* Modal pour compléter les pointages manquants */}
      <Dialog open={completionModalOpen} onOpenChange={setCompletionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compléter le pointage</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {selectedPointage ? `${selectedPointage.employe} • ${selectedPointage.date}` : ''}
            </p>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Type de situation</Label>
              <RadioGroup value={completionType} onValueChange={(value: "present" | "sick_leave" | "absent") => setCompletionType(value)} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="present" id="present" />
                  <Label htmlFor="present" className="text-sm">👤 Employé présent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sick_leave" id="sick_leave" />
                  <Label htmlFor="sick_leave" className="text-sm">🏥 Arrêt maladie</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="absent" id="absent" />
                  <Label htmlFor="absent" className="text-sm">❌ Absent</Label>
                </div>
              </RadioGroup>
            </div>

            {completionType === "present" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="clockIn">Heure d'arrivée</Label>
                    <Input
                      id="clockIn"
                      type="time"
                      value={clockInTime}
                      onChange={(e) => setClockInTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clockOut">Heure de départ</Label>
                    <Input
                      id="clockOut"
                      type="time"
                      value={clockOutTime}
                      onChange={(e) => setClockOutTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    Durée de travail calculée : {clockInTime && clockOutTime 
                      ? `${Math.floor(calculateWorkMinutes(clockInTime, clockOutTime) / 60)}h${String(calculateWorkMinutes(clockInTime, clockOutTime) % 60).padStart(2, '0')}`
                      : '0h00'
                    }
                  </p>
                </div>
              </div>
            )}

            {completionType === "sick_leave" && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">
                  📋 L'employé sera marqué en arrêt maladie pour cette date.
                  Aucune heure ne sera comptabilisée.
                </p>
              </div>
            )}

            {completionType === "absent" && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-800">
                  🚫 L'employé sera marqué comme absent pour cette date.
                  Aucune heure ne sera comptabilisée.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCompletionModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleValidatePointage}>
              ✅ Valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal pour le récapitulatif des demi-journées */}
      <Dialog open={halfDayModalOpen} onOpenChange={setHalfDayModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Récapitulatif - Demi-journée</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {selectedHalfDayPointage ? `${selectedHalfDayPointage.employe} • ${selectedHalfDayPointage.date}` : ''}
            </p>
          </DialogHeader>

          <div className="space-y-4">
            {selectedHalfDayPointage && (
              <div className="space-y-3">
                <Card className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Type de pause :</span>
                      <Badge variant="outline">{selectedHalfDayPointage.typePause}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Employé :</span>
                      <span className="text-sm">{selectedHalfDayPointage.employe}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Date :</span>
                      <span className="text-sm">{selectedHalfDayPointage.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Chantier :</span>
                      <span className="text-sm">{selectedHalfDayPointage.chantier}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Heure début :</span>
                      <span className="text-sm">
                        {selectedHalfDayPointage.debut 
                          ? new Date(selectedHalfDayPointage.debut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
                          : "—"
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Heure fin :</span>
                      <span className="text-sm">
                        {selectedHalfDayPointage.fin 
                          ? new Date(selectedHalfDayPointage.fin).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
                          : "—"
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Durée travaillée :</span>
                      <span className="text-sm font-bold text-karrosserie-orange">
                        {toHhMm(durationHours(selectedHalfDayPointage, HEURES_JOUR).duree)}
                      </span>
                    </div>
                  </div>
                </Card>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-sm text-emerald-800">
                    ✅ La demi-journée a été correctement enregistrée et est conforme aux règles de pointage.
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setHalfDayModalOpen(false)}>
              Fermer
            </Button>
            <Button onClick={handleValidateHalfDay}>
              ✅ Valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}