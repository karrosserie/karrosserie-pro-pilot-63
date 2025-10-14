export interface WelcomeFeature {
  id: string;
  title: string;
  description: string;
  icon: string; // Nom de l'icône Lucide
  route: string; // Route vers la fonctionnalité
  tourSteps: TourStep[]; // Étapes du tour pour cette fonctionnalité
}

export interface TourStep {
  target: string; // Sélecteur CSS de l'élément à cibler
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void; // Action optionnelle (ex: cliquer sur un bouton)
}

export interface WelcomeTourState {
  hasSeenWelcome: boolean;
  completedFeatures: string[]; // IDs des features visitées
  currentFeatureId?: string;
  currentStepIndex: number;
}
