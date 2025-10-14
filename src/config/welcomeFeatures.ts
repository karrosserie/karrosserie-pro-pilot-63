import { WelcomeFeature } from '@/types/welcomeTour';

export const WELCOME_FEATURES: WelcomeFeature[] = [
  {
    id: 'auto-reminders',
    title: 'Relances automatiques impayés',
    description: 'Automatisez vos relances clients en cas de factures impayées',
    icon: 'AlertCircle',
    route: '/settings?tab=relance-ia',
    tourSteps: [
      {
        target: '.invoice-list',
        title: 'Liste des factures',
        content: 'Visualisez toutes vos factures et leur statut de paiement',
        placement: 'right'
      },
      {
        target: '.auto-reminder-toggle',
        title: 'Activation des relances',
        content: 'Activez les relances automatiques pour chaque facture impayée',
        placement: 'bottom'
      }
    ]
  },
  {
    id: 'accounting',
    title: 'Comptabilité et gestion bancaire',
    description: 'Gérez votre comptabilité et connectez vos comptes bancaires',
    icon: 'Calculator',
    route: '/payments/accounting',
    tourSteps: [
      {
        target: '.bank-accounts-section',
        title: 'Comptes bancaires',
        content: 'Ajoutez et gérez vos comptes bancaires professionnels',
        placement: 'top'
      },
      {
        target: '.add-bank-button',
        title: 'Ajouter un compte',
        content: 'Cliquez ici pour connecter un nouveau compte bancaire',
        placement: 'left'
      }
    ]
  },
  {
    id: 'expertise-import',
    title: 'Importation rapports d\'expertise',
    description: 'Importez vos rapports d\'expertise en quelques clics',
    icon: 'FileText',
    route: '/documents/expertise',
    tourSteps: [
      {
        target: '.import-expertise-button',
        title: 'Importer un rapport',
        content: 'Nouvelle interface simplifiée pour importer vos rapports',
        placement: 'bottom'
      },
      {
        target: '.expertise-preview',
        title: 'Prévisualisation',
        content: 'Vérifiez les données extraites avant validation',
        placement: 'right'
      }
    ]
  },
  {
    id: 'painting',
    title: 'Gestion peinture',
    description: 'Module complet pour gérer vos opérations de peinture',
    icon: 'Palette',
    route: 'https://paint.karrosserie.pro/',
    tourSteps: [
      {
        target: '.painting-dashboard',
        title: 'Tableau de bord peinture',
        content: 'Suivez toutes vos opérations de peinture en un coup d\'œil',
        placement: 'top'
      },
      {
        target: '.paint-stock',
        title: 'Gestion des stocks',
        content: 'Gérez vos stocks de peinture et consommables',
        placement: 'right'
      }
    ]
  },
  {
    id: 'registered-mail',
    title: 'Envoi recommandé cession créance',
    description: 'Envoyez des lettres recommandées pour vos cessions de créance',
    icon: 'Mail',
    route: '/cessions',
    tourSteps: [
      {
        target: '.cession-list',
        title: 'Liste des cessions',
        content: 'Gérez toutes vos cessions de créance',
        placement: 'right'
      },
      {
        target: '.send-registered-mail-button',
        title: 'Envoi recommandé',
        content: 'Envoyez une lettre recommandée directement depuis l\'application',
        placement: 'bottom'
      }
    ]
  },
  {
    id: 'loan-vehicle-pv',
    title: 'PV véhicule de prêt',
    description: 'Ajoutez des procès-verbaux aux véhicules de prêt',
    icon: 'Car',
    route: '/fleet',
    tourSteps: [
      {
        target: '.loan-vehicles',
        title: 'Véhicules de prêt',
        content: 'Visualisez tous vos véhicules de prêt',
        placement: 'top'
      },
      {
        target: '.add-pv-button',
        title: 'Ajouter un PV',
        content: 'Documentez les infractions sur les véhicules de prêt',
        placement: 'left'
      }
    ]
  },
  {
    id: 'litigation',
    title: 'Contentieux tribunal',
    description: 'Gérez vos dossiers de contentieux et tribunaux',
    icon: 'Gavel',
    route: '/contentieux/creation-dossier',
    tourSteps: [
      {
        target: '.litigation-dashboard',
        title: 'Tableau de bord contentieux',
        content: 'Suivez tous vos dossiers en cours',
        placement: 'right'
      },
      {
        target: '.create-case-button',
        title: 'Créer un dossier',
        content: 'Créez un nouveau dossier de contentieux',
        placement: 'bottom'
      }
    ]
  },
  {
    id: 'planning',
    title: 'Planning amélioré',
    description: 'Nouveau planning avec vue d\'ensemble et gestion optimisée',
    icon: 'Calendar',
    route: '/planning',
    tourSteps: [
      {
        target: '.workshop-planning-interface',
        title: 'Vue d\'ensemble du planning',
        content: 'Interface complètement repensée pour visualiser toutes les tâches de l\'atelier en un coup d\'œil. Vous pouvez désormais suivre l\'avancement de chaque véhicule à travers les différentes étapes.',
        placement: 'top'
      },
      {
        target: '[role="tablist"]',
        title: 'Navigation par onglets',
        content: 'Quatre vues différentes pour s\'adapter à vos besoins : Étapes atelier (workflow), Planning détaillé (par employé), Véhicules en attente, et Planning Patron (vue globale).',
        placement: 'bottom'
      },
      {
        target: '.employee-task-card',
        title: 'Gestion des tâches',
        content: 'Assignez rapidement des tâches aux employés par simple glisser-déposer. Suivez le temps passé et les qualifications requises pour chaque intervention.',
        placement: 'right'
      },
      {
        target: '.workflow-step',
        title: 'Suivi du workflow',
        content: 'Visualisez instantanément les véhicules à chaque étape du processus : accueil, réparation, peinture, finitions, et livraison. Identifiez les goulots d\'étranglement en temps réel.',
        placement: 'left'
      },
      {
        target: '.planning-filters',
        title: 'Filtres et recherche',
        content: 'Filtrez par date, employé, client ou véhicule pour trouver rapidement l\'information dont vous avez besoin. Gagnez du temps dans la gestion quotidienne.',
        placement: 'bottom'
      }
    ]
  },
  {
    id: 'ai-secretary',
    title: 'Tour de contrôle',
    description: 'Votre assistant intelligent pour automatiser les tâches',
    icon: 'Bot',
    route: '/ai-assistant',
    tourSteps: [
      {
        target: '.mission-control-header',
        title: 'Centre de contrôle intelligent',
        content: 'Mission Control est votre tour de contrôle IA qui surveille en permanence toutes les activités de votre atelier. Il analyse les données en temps réel pour détecter les problèmes et vous alerter instantanément.',
        placement: 'bottom'
      },
      {
        target: '.alert-cards-container',
        title: 'Système d\'alertes intelligentes',
        content: 'L\'IA identifie automatiquement les situations critiques : retards employés, véhicules bloqués trop longtemps, messages clients urgents, factures impayées. Chaque alerte inclut des actions concrètes pour résoudre le problème.',
        placement: 'top'
      },
      {
        target: '.priority-indicator',
        title: 'Priorisation automatique',
        content: 'Les alertes sont classées par priorité (critique, haute, moyenne, faible) pour vous permettre de traiter d\'abord ce qui est le plus urgent. Les alertes critiques nécessitent une action immédiate.',
        placement: 'right'
      },
      {
        target: '.action-buttons',
        title: 'Actions rapides intégrées',
        content: 'Pour chaque problème détecté, l\'IA vous propose des actions directes : appeler un client, envoyer un SMS, créer une relance, assigner une tâche. Tout se fait en un clic depuis le tableau de bord.',
        placement: 'left'
      },
      {
        target: '.analytics-section',
        title: 'Analyse et recommandations',
        content: 'Mission Control analyse les tendances de votre atelier et vous fournit des recommandations pour optimiser vos processus : réduction des temps d\'attente, amélioration de la productivité, anticipation des problèmes récurrents.',
        placement: 'bottom'
      }
    ]
  }
];
