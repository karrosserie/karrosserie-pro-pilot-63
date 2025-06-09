
import { supabase } from '@/integrations/supabase/client';

export interface CompanyInfo {
  id: string;
  user_id: string;
  name: string;
  email: string;
  address: string;
  zipcode: string;
  postal_code: string;
  city: string;
  country: string;
  phone: string;
  siren: string;
  siret: string;
  tva: string;
  logo_url?: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  created_at: string;
  updated_at: string;
}

export const companyService = {
  async getCompanyInfo(userId: string): Promise<CompanyInfo | null> {
    console.log('Chargement des données entreprise pour userId:', userId);
    
    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.log('Erreur lors du chargement:', error);
      if (error.code === 'PGRST116') {
        // No rows found
        console.log('Aucune donnée trouvée pour cet utilisateur');
        return null;
      }
      throw new Error(error.message);
    }

    console.log('Données chargées depuis la DB:', data);
    
    // Transform the data to match our interface
    const transformedData = {
      ...data,
      zipcode: data.zipcode || '',
      postal_code: data.zipcode || '', // Map zipcode to postal_code for compatibility
      country: data.country || '',
      notifications: data.notifications as {
        email: boolean;
        push: boolean;
        sms: boolean;
      }
    } as CompanyInfo;

    console.log('Données transformées:', transformedData);
    return transformedData;
  },

  async updateCompanyInfo(userId: string, companyData: Partial<CompanyInfo>): Promise<CompanyInfo> {
    console.log('Sauvegarde des données entreprise:', { userId, companyData });
    
    const dataToUpdate = {
      user_id: userId,
      name: companyData.name || '',
      email: companyData.email || '',
      address: companyData.address || '',
      zipcode: companyData.postal_code || companyData.zipcode || '',
      city: companyData.city || '',
      country: companyData.country || '',
      phone: companyData.phone || '',
      siren: companyData.siren || '',
      siret: companyData.siret || '',
      tva: companyData.tva || '',
      logo_url: companyData.logo_url,
      notifications: companyData.notifications || { email: true, push: true, sms: false },
      updated_at: new Date().toISOString()
    };

    console.log('Données à sauvegarder:', dataToUpdate);

    const { data, error } = await supabase
      .from('company_info')
      .upsert(dataToUpdate, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw new Error(error.message);
    }

    console.log('Données sauvegardées avec succès:', data);

    // Transform the data to match our interface
    return {
      ...data,
      zipcode: data.zipcode || '',
      postal_code: data.zipcode || '',
      country: data.country || '',
      notifications: data.notifications as {
        email: boolean;
        push: boolean;
        sms: boolean;
      }
    } as CompanyInfo;
  },

  async deleteCompanyInfo(userId: string): Promise<void> {
    const { error } = await supabase
      .from('company_info')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }
  }
};
