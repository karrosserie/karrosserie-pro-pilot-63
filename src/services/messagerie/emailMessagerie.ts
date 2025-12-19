import { supabase } from '@/integrations/supabase/client';

export type DocumentType = 'invoice' | 'quote' | 'credit' | 'repair_order';

export interface EmailMessagerieData {
  clientId: string;
  documentType: DocumentType;
  documentReference: string;
  recipientEmail: string;
  subject: string;
  message: string;
  vehicleId?: string;
}

// Mapping des types de documents vers les catégories de messagerie
const documentCategoryMap: Record<DocumentType, 'facturation' | 'devis' | 'sinistre' | 'autre'> = {
  invoice: 'facturation',
  quote: 'devis',
  credit: 'facturation',
  repair_order: 'sinistre'
};

// Mapping des types de documents vers les libellés français
const documentLabelMap: Record<DocumentType, string> = {
  invoice: 'Facture',
  quote: 'Devis',
  credit: 'Avoir',
  repair_order: 'Ordre de réparation'
};

/**
 * Enregistre un envoi d'email dans le centre de messagerie
 * Cette fonction crée une entrée dans la table messageries et une réponse associée
 */
export const registerEmailInMessagerie = async (data: EmailMessagerieData): Promise<boolean> => {
  try {
    // Récupérer le company_id de l'utilisateur
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      console.error('Utilisateur non authentifié');
      return false;
    }

    const { data: companyData } = await supabase
      .from('user_companies')
      .select('company_id')
      .eq('user_id', userData.user.id)
      .single();

    if (!companyData) {
      console.error('Company not found for user');
      return false;
    }

    const category = documentCategoryMap[data.documentType];
    const documentLabel = documentLabelMap[data.documentType];
    const title = `Envoi ${documentLabel} n°${data.documentReference}`;
    const now = new Date().toISOString();
    const dateFormatted = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const timeFormatted = new Date().toTimeString().split(' ')[0]; // Format HH:MM:SS

    // Créer l'entrée dans messageries
    const { data: messagerie, error: messagerieError } = await supabase
      .from('messageries')
      .insert({
        company_id: companyData.company_id,
        client_id: data.clientId,
        title: title,
        channel: 'Mail',
        category: category,
        priority: 3, // Priorité normale pour les envois automatiques
        message: data.message,
        summary: `${documentLabel} envoyé(e) à ${data.recipientEmail}`,
        eta: '',
        time: timeFormatted,
        date: dateFormatted,
        actual_communication_date: now,
        is_inbound: false, // Message sortant (carrosserie → client)
        resolved: true, // Un envoi d'email est considéré comme traité
        archived: false,
        status: 'resolu',
        tags: ['envoi_automatique', data.documentType, 'email']
      })
      .select()
      .single();

    if (messagerieError) {
      console.error('Erreur lors de la création de la messagerie:', messagerieError);
      return false;
    }

    console.log(`[emailMessagerie] Email ${data.documentType} enregistré dans la messagerie:`, messagerie.id);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement dans la messagerie:', error);
    return false;
  }
};
