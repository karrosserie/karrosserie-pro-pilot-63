import { supabase } from '@/integrations/supabase/client';
import { Invoice } from '@/services/supabase/invoices';

export const prepareInvoiceData = async (invoice: Invoice) => {
  try {
    let clientData = null;
    let vehicleData = null;

    // Récupérer les données client
    if (invoice.client_id) {
      const { data: client } = await supabase
        .from('clients')
        .select('*')
        .eq('id', invoice.client_id)
        .single();
      
      if (client) {
        clientData = client;
      }
    }

    // Récupérer les données véhicule avec les informations de marque et modèle
    if (invoice.vehicle_id) {
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select(`
          *,
          car_brands(name),
          car_models(name)
        `)
        .eq('id', invoice.vehicle_id)
        .single();
      
      if (vehicle) {
        vehicleData = vehicle;
      }
    }

    return { clientData, vehicleData };
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return { clientData: null, vehicleData: null };
  }
};