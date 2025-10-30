import { 
  Car, Mail, Phone, MessageSquare, FileText, Euro, AlertTriangle, Info, HelpCircle 
} from "lucide-react";

export type MessageCategory = 'sinistre' | 'devis' | 'sav' | 'reclamation' | 'information' | 'facturation' | 'autre';
export type MessageStatus = 'nouveau' | 'en_cours' | 'en_attente_client' | 'planifie' | 'resolu' | 'archive';

export const CATEGORY_CONFIG = {
  sinistre: {
    label: 'Sinistre',
    icon: Car,
    emoji: '🚗',
    color: 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    gradient: 'from-red-500 to-red-600',
  },
  devis: {
    label: 'Devis',
    icon: FileText,
    emoji: '💰',
    color: 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    gradient: 'from-green-500 to-green-600',
  },
  sav: {
    label: 'SAV',
    icon: AlertTriangle,
    emoji: '🔧',
    color: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    gradient: 'from-blue-500 to-blue-600',
  },
  reclamation: {
    label: 'Réclamation',
    icon: AlertTriangle,
    emoji: '⚠️',
    color: 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    gradient: 'from-orange-500 to-orange-600',
  },
  information: {
    label: 'Information',
    icon: Info,
    emoji: 'ℹ️',
    color: 'bg-cyan-50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
    gradient: 'from-cyan-500 to-cyan-600',
  },
  facturation: {
    label: 'Facturation',
    icon: Euro,
    emoji: '📄',
    color: 'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    gradient: 'from-purple-500 to-purple-600',
  },
  autre: {
    label: 'Autre',
    icon: HelpCircle,
    emoji: '📦',
    color: 'bg-gray-50 dark:bg-gray-950/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800',
    gradient: 'from-gray-500 to-gray-600',
  },
};

export const STATUS_CONFIG = {
  nouveau: {
    label: 'Nouveau',
    emoji: '🆕',
    color: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  },
  en_cours: {
    label: 'En cours',
    emoji: '⏳',
    color: 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  },
  en_attente_client: {
    label: 'En attente client',
    emoji: '⏸️',
    color: 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  },
  planifie: {
    label: 'Planifié',
    emoji: '📅',
    color: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  },
  resolu: {
    label: 'Résolu',
    emoji: '✅',
    color: 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  },
  archive: {
    label: 'Archivé',
    emoji: '🗃️',
    color: 'bg-gray-50 dark:bg-gray-950/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800',
  },
};

export const getCategoryConfig = (category: MessageCategory) => {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.autre;
};

export const getStatusConfig = (status: MessageStatus) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG.nouveau;
};
