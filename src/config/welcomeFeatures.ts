import { WelcomeFeature } from '@/types/welcomeTour';

export const WELCOME_FEATURES: WelcomeFeature[] = [
  {
    id: 'auto-reminders',
    title: 'Relances automatiques impayés',
    description: 'Automatisez vos relances clients en cas de factures impayées',
    icon: 'AlertCircle',
    route: '/documents/factures',
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
    route: '/planning',
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
        title: 'Interface de planning',
        content: 'Visualisez et gérez toutes vos tâches atelier en un seul endroit. Interface modernisée avec onglets pour faciliter la navigation.',
        placement: 'top'
      },
      {
        target: '[role="tablist"]',
        title: 'Navigation par onglets',
        content: 'Accédez rapidement aux différentes vues : Étapes atelier, Planning détaillé, Véhicules en attente, Planning Patron.',
        placement: 'bottom'
      }
    ]
  },
  {
    id: 'ai-secretary',
    title: 'Secrétariat IA',
    description: 'Votre assistant intelligent pour automatiser les tâches',
    icon: 'Bot',
    route: '/ai-assistant',
    tourSteps: [
      {
        target: '.mission-control-header',
        title: 'Tableau de bord Mission Control',
        content: 'Votre centre de contrôle intelligent qui surveille et analyse toutes les activités de votre atelier.',
        placement: 'bottom'
      },
      {
        target: '.alert-cards-container',
        title: 'Alertes intelligentes',
        content: 'L\'IA détecte automatiquement les problèmes (retards, véhicules en attente, messages urgents) et vous propose des actions concrètes.',
        placement: 'top'
      }
    ]
  }
];
