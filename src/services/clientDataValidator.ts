import { supabase } from '@/integrations/supabase/client';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  details?: any;
  suggestion?: string;
  age?: number;
}

// Liste des domaines d'email jetables/temporaires
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'throwaway.email',
  'mailinator.com', 'trashmail.com', 'yopmail.com', 'temp-mail.org'
];

// Liste complète des préfectures françaises
const VALID_PREFECTURES = [
  // Métropole
  'Ain', 'Aisne', 'Allier', 'Alpes-de-Haute-Provence', 'Hautes-Alpes', 'Alpes-Maritimes',
  'Ardèche', 'Ardennes', 'Ariège', 'Aube', 'Aude', 'Aveyron',
  'Bouches-du-Rhône', 'Calvados', 'Cantal', 'Charente', 'Charente-Maritime', 'Cher',
  'Corrèze', 'Corse-du-Sud', 'Haute-Corse', 'Côte-d\'Or', 'Côtes-d\'Armor', 'Creuse',
  'Dordogne', 'Doubs', 'Drôme', 'Eure', 'Eure-et-Loir', 'Finistère',
  'Gard', 'Haute-Garonne', 'Gers', 'Gironde', 'Hérault', 'Ille-et-Vilaine',
  'Indre', 'Indre-et-Loire', 'Isère', 'Jura', 'Landes', 'Loir-et-Cher',
  'Loire', 'Haute-Loire', 'Loire-Atlantique', 'Loiret', 'Lot', 'Lot-et-Garonne',
  'Lozère', 'Maine-et-Loire', 'Manche', 'Marne', 'Haute-Marne', 'Mayenne',
  'Meurthe-et-Moselle', 'Meuse', 'Morbihan', 'Moselle', 'Nièvre', 'Nord',
  'Oise', 'Orne', 'Pas-de-Calais', 'Puy-de-Dôme', 'Pyrénées-Atlantiques',
  'Hautes-Pyrénées', 'Pyrénées-Orientales', 'Bas-Rhin', 'Haut-Rhin', 'Rhône',
  'Haute-Saône', 'Saône-et-Loire', 'Sarthe', 'Savoie', 'Haute-Savoie', 'Paris',
  'Seine-Maritime', 'Seine-et-Marne', 'Yvelines', 'Deux-Sèvres', 'Somme',
  'Tarn', 'Tarn-et-Garonne', 'Var', 'Vaucluse', 'Vendée', 'Vienne',
  'Haute-Vienne', 'Vosges', 'Yonne', 'Territoire de Belfort', 'Essonne',
  'Hauts-de-Seine', 'Seine-Saint-Denis', 'Val-de-Marne', 'Val-d\'Oise',
  // DOM-TOM
  'Guadeloupe', 'Martinique', 'Guyane', 'La Réunion', 'Mayotte'
];

export const clientDataValidator = {
  /**
   * Valider le format et la véracité d'un email
   */
  validateEmail(email: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Format email invalide' };
    }
    
    // Vérifier les domaines jetables
    const domain = email.split('@')[1].toLowerCase();
    if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
      return { isValid: false, error: 'Email temporaire non autorisé' };
    }
    
    return { isValid: true };
  },

  /**
   * Valider un numéro de téléphone français via l'API Numverify
   */
  async validatePhone(phone: string): Promise<ValidationResult> {
    // Validation format français basique
    const cleanPhone = phone.replace(/[\s.-]/g, '');
    const frenchMobileRegex = /^(?:\+33|0)[67]\d{8}$/;
    
    if (!frenchMobileRegex.test(cleanPhone)) {
      return { 
        isValid: false, 
        error: 'Format téléphone français invalide (doit commencer par 06 ou 07)' 
      };
    }
    
    // Appel à l'edge function de validation Numverify
    try {
      const { data, error } = await supabase.functions.invoke('validate-phone-number', {
        body: { phoneNumber: cleanPhone }
      });
      
      if (error) {
        console.warn('Phone validation API error:', error);
        // Ne pas bloquer si l'API est indisponible
        return { isValid: true, details: { apiUnavailable: true } };
      }
      
      if (!data?.valid) {
        return { 
          isValid: false, 
          error: 'Numéro de téléphone non valide (vérification API)',
          details: data?.details 
        };
      }
      
      return { isValid: true, details: data.details };
    } catch (err) {
      console.warn('Phone validation error:', err);
      // Ne pas bloquer en cas d'erreur API
      return { isValid: true, details: { apiError: true } };
    }
  },

  /**
   * Valider une date de naissance (âge cohérent)
   */
  validateDateOfBirth(dateOfBirth: string): ValidationResult {
    const dob = new Date(dateOfBirth);
    const now = new Date();
    
    // Vérifier que la date est valide
    if (isNaN(dob.getTime())) {
      return { isValid: false, error: 'Date de naissance invalide' };
    }
    
    // Vérifier que la date n'est pas dans le futur
    if (dob > now) {
      return { isValid: false, error: 'Date de naissance dans le futur' };
    }
    
    // Calculer l'âge
    const age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    const actualAge = (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) 
      ? age - 1 
      : age;
    
    // Vérifier l'âge minimum (18 ans pour louer un véhicule)
    if (actualAge < 18) {
      return { isValid: false, error: 'Le client doit avoir au moins 18 ans' };
    }
    
    // Vérifier l'âge maximum (120 ans pour détecter les erreurs)
    if (actualAge > 120) {
      return { isValid: false, error: 'Date de naissance incorrecte (âge supérieur à 120 ans)' };
    }
    
    return { isValid: true, age: actualAge };
  },

  /**
   * Valider le format d'un numéro de permis français
   */
  validateLicenseNumber(licenseNumber: string): ValidationResult {
    const cleanLicense = licenseNumber.replace(/\s/g, '');
    
    // Nouveau format (depuis 2013) : 12 chiffres
    const newFormatRegex = /^\d{12}$/;
    
    // Ancien format : 2 chiffres + 2 lettres + 5 chiffres
    const oldFormatRegex = /^\d{2}[A-Z]{2}\d{5}$/;
    
    if (!newFormatRegex.test(cleanLicense) && !oldFormatRegex.test(cleanLicense.toUpperCase())) {
      return { 
        isValid: false, 
        error: 'Format de numéro de permis français invalide (12 chiffres ou 2 chiffres + 2 lettres + 5 chiffres)' 
      };
    }
    
    return { isValid: true };
  },

  /**
   * Valider la cohérence de la date d'émission du permis
   */
  validateLicenseIssueDate(issueDate: string, dateOfBirth: string): ValidationResult {
    const issue = new Date(issueDate);
    const birth = new Date(dateOfBirth);
    const now = new Date();
    
    // Vérifier que les dates sont valides
    if (isNaN(issue.getTime()) || isNaN(birth.getTime())) {
      return { isValid: false, error: 'Date invalide' };
    }
    
    // Vérifier que la date n'est pas dans le futur
    if (issue > now) {
      return { isValid: false, error: 'Date d\'émission dans le futur' };
    }
    
    // Vérifier que la date est postérieure à la date de naissance + 18 ans
    const minIssueDate = new Date(birth);
    minIssueDate.setFullYear(minIssueDate.getFullYear() + 18);
    
    if (issue < minIssueDate) {
      return { 
        isValid: false, 
        error: 'Date d\'émission incohérente (le permis ne peut être délivré avant 18 ans)' 
      };
    }
    
    // Vérifier que le permis n'est pas trop vieux (max 80 ans pour détecter erreurs)
    const ageYears = (now.getTime() - issue.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (ageYears > 80) {
      return { 
        isValid: false, 
        error: 'Date d\'émission trop ancienne (plus de 80 ans)' 
      };
    }
    
    return { isValid: true };
  },

  /**
   * Valider une préfecture française
   */
  validatePrefecture(prefecture: string): ValidationResult {
    const normalized = prefecture.trim();
    
    if (!VALID_PREFECTURES.includes(normalized)) {
      return { 
        isValid: false, 
        error: 'Préfecture non reconnue',
        suggestion: 'Vérifier l\'orthographe ou le format'
      };
    }
    
    return { isValid: true };
  }
};
