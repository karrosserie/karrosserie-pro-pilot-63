export interface Dossier {
  id: number;
  nom: string;
  prenom: string;
  immatriculation: string;
  mobile: string;
  email?: string;
  dateEntree: string;
  heureEntree: string;
  status: string;
  expertisePrevue?: boolean;
  expertiseEffectuee?: boolean;
  dateExpertise?: string;
  heureExpertise?: string;
  dateFin?: string;
  dateRestitution?: string;
  heureRestitution?: string;
  notes?: string;
  marqueModele?: string;
  vin?: string;
  numeroSinistre?: string;
  kmEntree?: string;
  kmSortie?: string;
  montantTTC?: string;
  resteACharge?: string;
  piecesAttente?: string;
  pvReception?: any;
  dateCloture?: string;
  relances: Array<{ date: string; type: string; msg: string }>;
  historique: Array<{ date: string; action: string; status: string }>;
}

export interface Alert {
  type: string;
  dossier: Dossier;
  countdown?: number;
}

export interface StatusConfig {
  label: string;
  color: string;
  icon: string;
}

export interface AlertConfig {
  label: string;
  color: string;
  icon: string;
  priority: number;
}

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  'entree_atelier': { label: 'Entrée', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300', icon: '🚗' },
  'attente_expertise': { label: 'Att. expertise', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300', icon: '📋' },
  'expertise_planifiee': { label: 'Exp. planifiée', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300', icon: '📅' },
  'expertise_effectuee': { label: 'Exp. effectuée', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300', icon: '✓' },
  'en_reparation': { label: 'En réparation', color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', icon: '🔧' },
  'attente_pieces': { label: 'Att. pièces', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300', icon: '📦' },
  'termine': { label: 'Terminé', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300', icon: '✅' },
  'rdv_restitution': { label: 'RDV restitution', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300', icon: '🔑' },
  'cloture': { label: 'Clôturé', color: 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400', icon: '📁' }
};

export const ALERT_CONFIG: Record<string, AlertConfig> = {
  expertise_24h: { label: 'Expertise < 24h', color: 'text-orange-600', icon: '⚠️', priority: 2 },
  expertise_2h: { label: 'Expertise < 2h', color: 'text-red-600', icon: '🚨', priority: 1 },
  expertise_passee: { label: 'Expertise passée', color: 'text-red-600', icon: '❗', priority: 0 },
  restitution_aujourdhui: { label: "Restitution aujourd'hui", color: 'text-orange-600', icon: '🔑', priority: 2 },
  restitution_passee: { label: 'Restitution passée', color: 'text-red-600', icon: '📞', priority: 0 },
  sans_rdv_restitution: { label: 'Sans RDV', color: 'text-red-600', icon: '⏳', priority: 1 }
};
