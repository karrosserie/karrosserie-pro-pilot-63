// Configuration des coûts en jetons pour chaque opération
export const TOKEN_COSTS = {
  // Relances
  RELANCE_PHONE: 3,           // Relance téléphonique
  RELANCE_VMS: 3,             // Relance VMS
  RELANCE_SMS: 1,             // Relance SMS
  RELANCE_REGISTERED_MAIL: 5, // Relance courrier recommandé
  RELANCE_EMAIL: 0,           // Relance mail (gratuit)
  RELANCE_WHATSAPP: 0,        // Relance WhatsApp (gratuit)
  
  // Autres opérations
  CESSION_CREANCE: 10,        // Cession de créance
} as const;

export type TokenOperation = keyof typeof TOKEN_COSTS;

// Labels français pour l'affichage
export const TOKEN_OPERATION_LABELS: Record<TokenOperation, string> = {
  RELANCE_PHONE: 'Relance téléphonique',
  RELANCE_VMS: 'Relance VMS',
  RELANCE_SMS: 'Relance SMS',
  RELANCE_REGISTERED_MAIL: 'Relance courrier recommandé',
  RELANCE_EMAIL: 'Relance email',
  RELANCE_WHATSAPP: 'Relance WhatsApp',
  CESSION_CREANCE: 'Cession de créance',
};

// Helper pour obtenir le coût d'une opération
export const getTokenCost = (operation: TokenOperation): number => {
  return TOKEN_COSTS[operation];
};

// Helper pour vérifier si une opération est gratuite
export const isFreeOperation = (operation: TokenOperation): boolean => {
  return TOKEN_COSTS[operation] === 0;
};

// Helper pour obtenir la description du coût
export const getTokenCostDescription = (operation: TokenOperation): string => {
  const cost = TOKEN_COSTS[operation];
  const label = TOKEN_OPERATION_LABELS[operation];
  
  if (cost === 0) {
    return `${label} (Gratuit)`;
  }
  
  return `${label} (${cost} jeton${cost > 1 ? 's' : ''})`;
};