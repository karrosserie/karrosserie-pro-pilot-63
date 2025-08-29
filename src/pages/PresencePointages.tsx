import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Calendar, MapPin, FileText, Filter, Clock, User, Building2, CheckCircle2, XCircle, AlertTriangle, Navigation, Truck, Waypoints, Phone, Mail, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";
import * as XLSX from 'xlsx';

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

  const handleExportExcel = () => {
    // Préparer les données pour l'export
    const excelData = filtered.map((p) => {
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

    // Créer le classeur
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pointages");

    // Ajouter une feuille de résumé avec les KPIs
    const summaryData = [
      { 'Indicateur': 'Total heures', 'Valeur': toHhMm(kpis.total) },
      { 'Indicateur': 'Heures normales', 'Valeur': toHhMm(kpis.normales) },
      { 'Indicateur': 'Heures supplémentaires', 'Valeur': toHhMm(kpis.sup) },
      { 'Indicateur': 'Taux conformité GPS', 'Valeur': `${kpis.tauxGps}%` },
      { 'Indicateur': 'Nombre d\'absences', 'Valeur': kpis.absences },
      { 'Indicateur': 'Total lignes', 'Valeur': kpis.lignes }
    ];
    
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Résumé");

    // Télécharger le fichier
    const fileName = `pointages_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><span>Karrosserie.pro</span><ChevronRight className="w-4 h-4" /><span>RH</span><ChevronRight className="w-4 h-4" /><span>Présence & Pointages</span></div>
          <h1 className="text-2xl font-semibold mt-1">Présence & Pointages (géolocalisé)</h1>
          <p className="text-sm text-muted-foreground">Contrôle GPS, demi-journées, pauses repas, calculs heures normales & supplémentaires, exports paie</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2"><FileText className="w-4 h-4"/> Générer rapport PDF</Button>
          <Button variant="outline" className="gap-2" onClick={handleExportExcel}><Download className="w-4 h-4"/> Export Excel</Button>
          <Button className="gap-2"><Mail className="w-4 h-4"/> Envoyer à l'expert-comptable</Button>
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
        <Card className="shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total heures</CardTitle></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{toHhMm(kpis.total)}</div><div className="text-xs text-muted-foreground">Période filtrée</div></CardContent></Card>
        <Card className="shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Heures normales</CardTitle></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{toHhMm(kpis.normales)}</div><div className="text-xs text-muted-foreground">Seuil {HEURES_JOUR}h/j</div></CardContent></Card>
        <Card className="shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Heures sup.</CardTitle></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{toHhMm(kpis.sup)}</div><div className="text-xs text-muted-foreground">Au-delà du seuil</div></CardContent></Card>
        <Card className="shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Taux conformité GPS</CardTitle></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{kpis.tauxGps}%</div><div className="text-xs text-muted-foreground">{kpis.lignes} lignes</div></CardContent></Card>
        <Card className="shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Absences</CardTitle></CardHeader><CardContent className="pt-0"><div className="text-2xl font-bold">{kpis.absences}</div><div className="text-xs text-muted-foreground">CP/RTT/MAL</div></CardContent></Card>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Heures par jour</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="heures" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Répartition conformité GPS</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anomalies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-1 flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4"/>Pointage manquant</CardTitle>
            <Badge variant="secondary">{filtered.filter(p=>!p.debut || !p.fin).length}</Badge>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {filtered.filter(p=>!p.debut || !p.fin).slice(0,4).map(p=> (
              <div key={p.id} className="flex items-center justify-between">
                <span>{p.employe} · {p.date}</span>
                <Badge variant="outline">Compléter</Badge>
              </div>
            ))}
            {filtered.filter(p=>!p.debut || !p.fin).length === 0 && <div className="text-muted-foreground">Aucune anomalie</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2"><MapPin className="w-4 h-4"/>Hors zone GPS</CardTitle>
            <Badge variant="secondary">{filtered.filter(p=> (p.distDebut||0) > 100 || (p.distFin||0) > 100).length}</Badge>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {filtered.filter(p=> (p.distDebut||0) > 100 || (p.distFin||0) > 100).slice(0,4).map(p=> (
              <div key={p.id} className="flex items-center justify-between">
                <span>{p.employe} · {p.date}</span>
                <Badge variant="destructive">Vérifier</Badge>
              </div>
            ))}
            {filtered.filter(p=> (p.distDebut||0) > 100 || (p.distFin||0) > 100).length === 0 && <div className="text-muted-foreground">Aucune alerte</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1 flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2"><Clock className="w-4 h-4"/>Demi-journées</CardTitle>
            <Badge variant="secondary">{filtered.filter(p=> p.typePause?.startsWith("Demi-journée")).length}</Badge>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {filtered.filter(p=> p.typePause?.startsWith("Demi-journée")).slice(0,4).map(p=> (
              <div key={p.id} className="flex items-center justify-between">
                <span>{p.employe} · {p.date} · {p.typePause}</span>
                <Badge variant="outline">OK</Badge>
              </div>
            ))}
            {filtered.filter(p=> p.typePause?.startsWith("Demi-journée")).length === 0 && <div className="text-muted-foreground">Aucune demi-journée</div>}
          </CardContent>
        </Card>
      </div>

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
                  <th className="text-left p-2">Actions</th>
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
                    <tr key={p.id} className="border-t">
                      <td className="p-2 whitespace-nowrap">{p.date}</td>
                      <td className="p-2 whitespace-nowrap flex items-center gap-2"><User className="w-4 h-4"/>{p.employe}</td>
                      <td className="p-2 whitespace-nowrap flex items-center gap-2"><Building2 className="w-4 h-4"/>{p.chantier}</td>
                      <td className="p-2 whitespace-nowrap">{p.debut ? new Date(p.debut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : "—"} {p.gpsDebut && <span className="text-muted-foreground">({p.gpsDebut})</span>}</td>
                      <td className="p-2 whitespace-nowrap">{p.fin ? new Date(p.fin).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : "—"} {p.gpsFin && <span className="text-muted-foreground">({p.gpsFin})</span>}</td>
                      <td className="p-2 whitespace-nowrap">{pauseTxt || "—"}</td>
                      <td className="p-2 whitespace-nowrap font-medium">{toHhMm(d.duree)}</td>
                      <td className="p-2 whitespace-nowrap">{d.duree.toFixed(2)}</td>
                      <td className="p-2 whitespace-nowrap">{d.normales.toFixed(2)}</td>
                      <td className="p-2 whitespace-nowrap">{d.sup.toFixed(2)}</td>
                      <td className="p-2 whitespace-nowrap">{statutOk ? <Badge className="bg-emerald-600 hover:bg-emerald-600">VALIDE</Badge> : <Badge variant="destructive">REFUSÉ</Badge>}</td>
                      <td className="p-2 whitespace-nowrap">{(p.distDebut ?? 0)} / {(p.distFin ?? 0)} m</td>
                      <td className="p-2 whitespace-nowrap">{p.absence || "—"}</td>
                      <td className="p-2 whitespace-nowrap">{p.validationChef ? <CheckCircle2 className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}</td>
                      <td className="p-2 whitespace-nowrap">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8">Détail</Button>
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
                      </td>
                    </tr>
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
    </div>
  );
}