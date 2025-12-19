// Ce hook est maintenant un wrapper autour du contexte centralisé
// pour assurer la compatibilité avec le code existant
import { useMessageriesContext } from "@/contexts/MessageriesContext";

// Réexporter les types pour la compatibilité
export type { Client, MessagerieReply, Messagerie } from "@/contexts/MessageriesContext";

export function useMessageries() {
  return useMessageriesContext();
}
