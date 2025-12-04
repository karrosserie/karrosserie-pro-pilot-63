/**
 * Validation et formatage des numéros de téléphone français
 */

/**
 * Vérifie si un numéro de téléphone français est valide
 * Formats acceptés :
 * - 06XXXXXXXX ou 07XXXXXXXX (mobile)
 * - +336XXXXXXXX ou +337XXXXXXXX (mobile international)
 * - 0033 6XXXXXXXX ou 0033 7XXXXXXXX (mobile international avec espace)
 */
export const isValidFrenchMobilePhone = (phone: string | null | undefined): boolean => {
  if (!phone) return false;

  // Nettoyer le numéro (supprimer espaces, points, tirets)
  const cleanPhone = phone.replace(/[\s.-]/g, '');

  // Vérifier les différents formats
  const patterns = [
    /^0[67]\d{8}$/, // 06XXXXXXXX ou 07XXXXXXXX (10 chiffres total)
    /^\+33[67]\d{8}$/, // +33650363126 ou +33750363126 (12 chiffres total)
    /^0033[67]\d{8}$/, // 0033650363126 ou 0033750363126
  ];

  return patterns.some(pattern => pattern.test(cleanPhone));
};

/**
 * Formate un numéro de téléphone français vers le format international +33
 */
export const formatToInternational = (phone: string): string => {
  if (!phone) return '';

  // Nettoyer le numéro
  const cleanPhone = phone.replace(/[\s.-]/g, '');

  // Si déjà au format +33
  if (cleanPhone.startsWith('+33')) {
    return cleanPhone;
  }

  // Si format 0033
  if (cleanPhone.startsWith('0033')) {
    return `+33${cleanPhone.substring(4)}`;
  }

  // Si format français 06 ou 07
  if (cleanPhone.match(/^0[67]\d{8}$/)) {
    return `+33${cleanPhone.substring(1)}`;
  }

  // Si aucun format reconnu, retourner tel quel
  return cleanPhone;
};

/**
 * Affiche un numéro de téléphone au format français lisible
 * Ex: 06 12 34 56 78
 */
export const formatForDisplay = (phone: string): string => {
  if (!phone) return '';

  const cleanPhone = phone.replace(/[\s.-]/g, '');

  // Convertir vers format français si international
  let frenchPhone = cleanPhone;
  if (cleanPhone.startsWith('+33')) {
    frenchPhone = `0${cleanPhone.substring(3)}`;
  } else if (cleanPhone.startsWith('0033')) {
    frenchPhone = `0${cleanPhone.substring(4)}`;
  }

  // Formatter avec espaces : 06 12 34 56 78
  if (frenchPhone.match(/^0[67]\d{8}$/)) {
    return `${frenchPhone.substring(0, 2)} ${frenchPhone.substring(2, 4)} ${frenchPhone.substring(4, 6)} ${frenchPhone.substring(6, 8)} ${frenchPhone.substring(8)}`;
  }

  return phone; // Retourner tel quel si format non reconnu
};

/**
 * Vérifie si un numéro est au format international strict +33[67]XXXXXXXX
 * Cette fonction doit être appelée APRÈS formatToInternational()
 */
export const isValidInternationalFormat = (phone: string | null | undefined): boolean => {
  if (!phone) return false;
  // Exactement : +33 suivi de 6 ou 7 puis 8 chiffres = 12 caractères total
  return /^\+33[67]\d{8}$/.test(phone);
};

/**
 * Valide et formate un numéro de téléphone pour les webhooks
 * Retourne le numéro formaté ou une erreur si invalide
 */
export const validateAndFormatForWebhook = (phone: string | null | undefined): { 
  valid: boolean; 
  formatted: string | null; 
  error?: string 
} => {
  if (!phone) {
    return { valid: false, formatted: null, error: 'Numéro de téléphone manquant' };
  }
  
  const formatted = formatToInternational(phone);
  
  if (!isValidInternationalFormat(formatted)) {
    return { 
      valid: false, 
      formatted: null, 
      error: `Le numéro "${phone}" n'est pas un numéro mobile français valide. Format attendu : 06/07 ou +336/+337 suivi de 8 chiffres.` 
    };
  }
  
  return { valid: true, formatted };
};