import { useOnboardingImportWatcher } from '@/hooks/onboarding/useOnboardingImportWatcher';

/**
 * Composant qui surveille les imports pour l'onboarding
 * Ne rend rien visuellement, mais exécute le hook en arrière-plan
 */
export function OnboardingWatcher() {
  useOnboardingImportWatcher();
  return null;
}
