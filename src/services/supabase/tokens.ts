import { STATIC_TOKENS, mockApiDelay, filterByCompanyId } from '@/data/staticData';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Token = Tables<'tokens'>;
export type TokenInsert = TablesInsert<'tokens'>;

// Variable pour stocker les tokens modifiés
let tokensData = [...STATIC_TOKENS];

export const tokensService = {
  async createToken(tokenData: Omit<TokenInsert, 'id' | 'created_at' | 'updated_at'>) {
    console.log('Creating token with data:', tokenData);
    await mockApiDelay(500);

    const companyId = tokenData.company_id;

    if (!companyId) throw new Error('Company ID is required');

    const newToken = {
      ...tokenData,
      id: `token-${Date.now()}`,
      company_id: companyId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    tokensData.push(newToken as any);

    console.log('Token créé avec succès:', newToken);

    // Simuler l'envoi d'email
    console.log('Email de demande de justificatifs envoyé avec succès (simulation)');

    return newToken;
  },

  async getTokens() {
    console.log('Getting tokens...');
    await mockApiDelay(200);
    
    // Handle impersonation
    const impersonationData = localStorage.getItem('admin_impersonation');
    let companyId = 'demo-company-123';
    
    if (impersonationData) {
      try {
        const data = JSON.parse(impersonationData);
        companyId = data.company_id;
      } catch (error) {
        console.error('Error parsing impersonation data:', error);
      }
    }

    const filteredTokens = filterByCompanyId(tokensData, companyId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    console.log('Tokens retrieved:', filteredTokens);
    return filteredTokens;
  },

  async deleteToken(id: string) {
    console.log('Deleting token:', id);
    await mockApiDelay(300);
    
    const tokenIndex = tokensData.findIndex(t => t.id === id);
    
    if (tokenIndex === -1) {
      throw new Error(`Token with id ${id} not found`);
    }
    
    tokensData.splice(tokenIndex, 1);
    
    console.log('Token deleted successfully');
  }
};