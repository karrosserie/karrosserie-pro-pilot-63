
import { supabase } from '@/integrations/supabase/client';

export interface CompanyInfo {
  id: string;
  name: string;
  email: string;
  address: string;
  zipcode: string;
  city: string;
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
    
    // Get company through user_companies relationship
    const { data: userCompany, error: userCompanyError } = await supabase
      .from('user_companies')
      .select('company_id')
      .eq('user_id', userId)
      .eq('active', true)
      .single();

    console.log('Requête user_companies:', { userId, userCompany, userCompanyError });

    if (userCompanyError || !userCompany) {
      console.log('Aucune entreprise trouvée pour cet utilisateur');
      return null;
    }

    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .eq('id', userCompany.company_id)
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
      zipcode: data.zipcode || '', // Use only zipcode since that's what exists in DB
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
    
    // Get company through user_companies relationship
    const { data: userCompany, error: userCompanyError } = await supabase
      .from('user_companies')
      .select('company_id')
      .eq('user_id', userId)
      .eq('active', true)
      .single();

    if (userCompanyError || !userCompany) {
      throw new Error('Aucune entreprise trouvée pour cet utilisateur');
    }

    const dataToUpdate = {
      name: companyData.name || '',
      email: companyData.email || '',
      address: companyData.address || '',
      zipcode: companyData.zipcode || '', // Use zipcode to match our interface
      city: companyData.city || '',
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
      .update(dataToUpdate)
      .eq('id', userCompany.company_id)
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
      zipcode: data.zipcode || '', // Use only zipcode since that's what exists in DB
      notifications: data.notifications as {
        email: boolean;
        push: boolean;
        sms: boolean;
      }
    } as CompanyInfo;
  },

  async deleteCompanyInfo(userId: string): Promise<void> {
    // Get company through user_companies relationship
    const { data: userCompany, error: userCompanyError } = await supabase
      .from('user_companies')
      .select('company_id')
      .eq('user_id', userId)
      .eq('active', true)
      .single();

    if (userCompanyError || !userCompany) {
      throw new Error('Aucune entreprise trouvée pour cet utilisateur');
    }

    const { error } = await supabase
      .from('company_info')
      .delete()
      .eq('id', userCompany.company_id);

    if (error) {
      throw new Error(error.message);
    }
  }
};
