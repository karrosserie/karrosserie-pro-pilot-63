/**
 * Utilitaire pour l'affichage du nom client selon le type
 */

/**
 * Retourne le nom d'affichage correct selon le type de client
 * - Entreprise : Raison sociale (company_name)
 * - Particulier : Prénom + Nom
 */
export const getClientDisplayName = (client: any): string => {
  if (!client) return '';
  
  // Si c'est une entreprise, utiliser la raison sociale
  if (client.client_type === 'entreprise' && client.company_name) {
    return client.company_name;
  }
  
  // Sinon, utiliser prénom + nom (particulier ou fallback)
  return `${client.first_name || ''} ${client.last_name || ''}`.trim();
};
