import { supabase } from '@/integrations/supabase/client';

export const generateReference = async (): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Récupérer le dernier encaissement pour ce user
    const { data: lastReceipt, error } = await supabase
      .from('receipts')
      .select('reference')
      .eq('user_id', user.id)
      .order('reference', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching last receipt for reference generation:', error);
      // En cas d'erreur, retourner 1 par défaut
      return '1';
    }

    if (!lastReceipt || !lastReceipt.reference) {
      return '1';
    }

    // Extraire le numéro de la référence (on suppose que c'est un simple entier)
    const currentNumber = parseInt(lastReceipt.reference, 10);
    if (isNaN(currentNumber)) {
      return '1';
    }

    return (currentNumber + 1).toString();
  } catch (error) {
    console.error('Error generating receipt reference:', error);
    return '1';
  }
};