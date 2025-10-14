import { WelcomeTourState } from '@/types/welcomeTour';

const STORAGE_KEY = 'karrosserie_welcome_tour';

class WelcomeTourService {
  
  /**
   * Récupérer l'état du tour depuis localStorage
   */
  getTourState(): WelcomeTourState {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing tour state:', error);
      }
    }
    
    // État initial
    return {
      hasSeenWelcome: false,
      completedFeatures: [],
      currentStepIndex: 0
    };
  }

  /**
   * Sauvegarder l'état du tour
   */
  saveTourState(state: WelcomeTourState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    
    // Émettre un événement pour notifier les composants
    window.dispatchEvent(new CustomEvent('welcome-tour-updated', { 
      detail: state 
    }));
  }

  /**
   * Marquer la page de bienvenue comme vue
   */
  markWelcomeAsSeen(): void {
    const state = this.getTourState();
    state.hasSeenWelcome = true;
    this.saveTourState(state);
  }

  /**
   * Vérifier si l'utilisateur a déjà vu la page de bienvenue
   */
  hasSeenWelcome(): boolean {
    return this.getTourState().hasSeenWelcome;
  }

  /**
   * Marquer une fonctionnalité comme visitée
   */
  markFeatureCompleted(featureId: string): void {
    const state = this.getTourState();
    if (!state.completedFeatures.includes(featureId)) {
      state.completedFeatures.push(featureId);
      this.saveTourState(state);
    }
  }

  /**
   * Définir la fonctionnalité en cours de visite
   */
  setCurrentFeature(featureId: string, stepIndex: number = 0): void {
    const state = this.getTourState();
    state.currentFeatureId = featureId;
    state.currentStepIndex = stepIndex;
    this.saveTourState(state);
  }

  /**
   * Réinitialiser le tour (pour pouvoir le refaire)
   */
  resetTour(): void {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('welcome-tour-updated', { 
      detail: this.getTourState() 
    }));
  }
}

export const welcomeTourService = new WelcomeTourService();
