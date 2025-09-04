import { STATIC_COMPANY, mockApiDelay } from '@/data/staticData';

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

// Variable pour stocker les données de l'entreprise modifiées
let companyData = { ...STATIC_COMPANY };

export const companyService = {
  async getCompanyInfo(userId?: string): Promise<CompanyInfo | null> {
    console.log('Chargement des données entreprise...');
    await mockApiDelay(200);
    
    // Handle impersonation
    const impersonationData = localStorage.getItem('admin_impersonation');
    let targetCompanyId = 'demo-company-123';
    
    if (impersonationData) {
      try {
        const data = JSON.parse(impersonationData);
        targetCompanyId = data.company_id;
      } catch (error) {
        console.error('Error parsing impersonation data:', error);
      }
    }
    
    console.log('Company ID effective (avec impersonation):', targetCompanyId);

    if (targetCompanyId !== companyData.id) {
      console.log('Aucune donnée trouvée pour cette entreprise');
      return null;
    }

    console.log('Données chargées depuis les données statiques:', companyData);
    
    // Transform the data to match our interface
    const transformedData = {
      ...companyData,
      zipcode: companyData.postal_code || '',
      oodrive_recipient_id: null,
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    } as CompanyInfo;

    console.log('Données transformées:', transformedData);
    return transformedData;
  },

  async updateCompanyInfo(userId?: string, updateData: Partial<CompanyInfo> = {}): Promise<CompanyInfo> {
    console.log('Sauvegarde des données entreprise:', updateData);
    await mockApiDelay(500);

    // Update the company data
    companyData = {
      ...companyData,
      name: updateData.name || companyData.name,
      email: updateData.email || companyData.email,
      address: updateData.address || companyData.address,
      postal_code: updateData.zipcode || companyData.postal_code,
      city: updateData.city || companyData.city,
      phone: updateData.phone || companyData.phone,
      siret: updateData.siret || companyData.siret,
      updated_at: new Date().toISOString()
    };

    console.log('Données sauvegardées avec succès:', companyData);

    // Transform the data to match our interface
    return {
      ...companyData,
      zipcode: companyData.postal_code || '',
      siren: companyData.siret?.substring(0, 9) || '',
      tva: `FR${companyData.siret?.substring(2, 4) || '00'}${companyData.siret?.substring(0, 9) || ''}`,
      oodrive_recipient_id: null,
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    } as CompanyInfo;
  },

  async deleteCompanyInfo(userId?: string): Promise<void> {
    console.log('Suppression des données entreprise');
    await mockApiDelay(300);
    
    // Pour la démo, on ne supprime pas vraiment les données
    console.log('Données entreprise supprimées (simulation)');
  }
};
