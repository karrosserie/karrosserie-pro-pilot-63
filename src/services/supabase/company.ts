import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserCompanyId } from './auth-company';

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
  oodrive_recipient_id?: string | null;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  created_at: string;
  updated_at: string;
}

export const companyService = {
  async getCompanyInfo(userId?: string): Promise<CompanyInfo | null> {
    console.log('Chargement des données entreprise...');
    
    // Use getCurrentUserCompanyId to handle impersonation
    const companyId = await getCurrentUserCompanyId();
    console.log('Company ID effective (avec impersonation):', companyId);

    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .eq('id', companyId)
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
      oodrive_recipient_id: data.oodrive_recipient_id || null,
      notifications: data.notifications as {
        email: boolean;
        push: boolean;
        sms: boolean;
      }
    } as CompanyInfo;

    console.log('Données transformées:', transformedData);
    return transformedData;
  },

  async updateCompanyInfo(userId?: string, companyData: Partial<CompanyInfo> = {}): Promise<CompanyInfo> {
    console.log('Sauvegarde des données entreprise:', companyData);
    
    // Use getCurrentUserCompanyId to handle impersonation
    const companyId = await getCurrentUserCompanyId();
    console.log('Company ID effective (avec impersonation):', companyId);

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
      oodrive_recipient_id: companyData.oodrive_recipient_id,
      notifications: companyData.notifications || { email: true, push: true, sms: false },
      updated_at: new Date().toISOString()
    };

    console.log('Données à sauvegarder:', dataToUpdate);

    const { data, error } = await supabase
      .from('company_info')
      .update(dataToUpdate)
      .eq('id', companyId)
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
      oodrive_recipient_id: data.oodrive_recipient_id || null,
      notifications: data.notifications as {
        email: boolean;
        push: boolean;
        sms: boolean;
      }
    } as CompanyInfo;
  },

  async deleteCompanyInfo(userId?: string): Promise<void> {
    // Use getCurrentUserCompanyId to handle impersonation
    const companyId = await getCurrentUserCompanyId();
    console.log('Company ID effective (avec impersonation):', companyId);

    const { error } = await supabase
      .from('company_info')
      .delete()
      .eq('id', companyId);

    if (error) {
      throw new Error(error.message);
    }
  }
};
