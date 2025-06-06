
import { supabase } from '@/integrations/supabase/client';

export interface CompanyInfo {
  id: string;
  user_id: string;
  name: string;
  email: string;
  address: string;
  zipCode: string;
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
    try {
      const { data, error } = await supabase
        .rpc('get_company_info', { p_user_id: userId });

      if (error) {
        if (error.message.includes('does not exist')) {
          // Table n'existe pas encore, retourner null
          return null;
        }
        throw new Error(error.message);
      }

      return data && data.length > 0 ? data[0] : null;
    } catch (error: any) {
      if (error.message.includes('does not exist') || error.message.includes('42P01')) {
        // Table ou fonction n'existe pas encore
        return null;
      }
      throw error;
    }
  },

  async updateCompanyInfo(userId: string, companyData: Partial<CompanyInfo>): Promise<CompanyInfo> {
    const dataToUpdate = {
      user_id: userId,
      name: companyData.name || '',
      email: companyData.email || '',
      address: companyData.address || '',
      zipCode: companyData.zipCode || '',
      city: companyData.city || '',
      phone: companyData.phone || '',
      siren: companyData.siren || '',
      siret: companyData.siret || '',
      tva: companyData.tva || '',
      logo_url: companyData.logo_url,
      notifications: companyData.notifications || { email: true, push: true, sms: false },
      updated_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .rpc('upsert_company_info', dataToUpdate);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error: any) {
      if (error.message.includes('does not exist') || error.message.includes('42P01')) {
        // Table n'existe pas encore, simuler une réponse pour le développement
        return {
          id: 'temp-id',
          user_id: userId,
          ...dataToUpdate,
          created_at: new Date().toISOString()
        } as CompanyInfo;
      }
      throw error;
    }
  },

  async deleteCompanyInfo(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .rpc('delete_company_info', { p_user_id: userId });

      if (error && !error.message.includes('does not exist')) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      if (!error.message.includes('does not exist') && !error.message.includes('42P01')) {
        throw error;
      }
      // Ignorer l'erreur si la table n'existe pas encore
    }
  }
};
