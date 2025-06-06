
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
    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      throw new Error(error.message);
    }

    return data;
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

    const { data, error } = await supabase
      .from('company_info')
      .upsert(dataToUpdate, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
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
