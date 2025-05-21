
import { format, parseISO, isValid } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Formate une date selon le format spécifié
 * @param date Date à formater (string, Date ou null)
 * @param formatStr Format de date souhaité (default: dd/MM/yyyy)
 * @returns Date formatée ou chaîne vide si la date est invalide
 */
export function formatDate(
  date: string | Date | null | undefined,
  formatStr: string = "dd/MM/yyyy"
): string {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    
    if (!isValid(dateObj)) return "";
    
    return format(dateObj, formatStr, { locale: fr });
  } catch (error) {
    console.error("Erreur de formatage de date:", error);
    return "";
  }
}

/**
 * Formate une date au format monétaire français
 * @param amount Montant à formater
 * @returns Montant formaté (ex: 1 234,56 €)
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "";
  
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/**
 * Convertit une chaîne de date au format yyyy-MM-dd pour les inputs HTML
 * @param date Date à convertir
 * @returns Date au format yyyy-MM-dd ou chaîne vide
 */
export function toInputDateFormat(date: string | Date | null | undefined): string {
  if (!date) return "";
  
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    
    if (!isValid(dateObj)) return "";
    
    return format(dateObj, "yyyy-MM-dd");
  } catch (error) {
    console.error("Erreur de conversion de date:", error);
    return "";
  }
}
