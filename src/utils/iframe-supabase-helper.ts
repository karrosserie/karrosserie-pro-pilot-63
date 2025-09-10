import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface IframeSupabaseConfig {
  url: string;
  anonKey: string;
  authToken: string;
}

export interface IframeUserContext {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
  };
  company: {
    id: string;
    name: string;
    email: string;
    address: string;
    city: string;
    zipcode: string;
    phone: string;
    siret: string;
    siren: string;
    tva: string;
    logo_url?: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  role: string;
}

export interface IframeSupabaseResponse {
  success: boolean;
  supabaseConfig?: IframeSupabaseConfig;
  userContext?: IframeUserContext;
  error?: string;
}

/**
 * Classe helper pour faciliter l'utilisation de Supabase dans l'iframe
 */
export class IframeSupabaseHelper {
  private supabaseClient: SupabaseClient | null = null;
  private userContext: IframeUserContext | null = null;
  private iframeToken: string | null = null;

  constructor(private baseUrl: string = 'https://jukdsypvuehnniskgpfd.supabase.co') {}

  /**
   * Initialise le client Supabase avec le token d'iframe
   */
  async initialize(iframeToken: string): Promise<boolean> {
    try {
      this.iframeToken = iframeToken;

      const response = await fetch(`${this.baseUrl}/functions/v1/iframe-supabase-direct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: iframeToken })
      });

      const data: IframeSupabaseResponse = await response.json();

      if (!data.success || !data.supabaseConfig || !data.userContext) {
        throw new Error(data.error || 'Failed to initialize Supabase');
      }

      // Créer le client Supabase avec le token d'authentification
      this.supabaseClient = createClient(
        data.supabaseConfig.url,
        data.supabaseConfig.anonKey,
        {
          global: {
            headers: {
              Authorization: `Bearer ${data.supabaseConfig.authToken}`
            }
          }
        }
      );

      this.userContext = data.userContext;

      console.log('IframeSupabaseHelper: Initialized successfully for user:', this.userContext.user.id);
      return true;

    } catch (error) {
      console.error('IframeSupabaseHelper: Initialization failed:', error);
      return false;
    }
  }

  /**
   * Retourne le client Supabase initialisé
   */
  getClient(): SupabaseClient {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized. Call initialize() first.');
    }
    return this.supabaseClient;
  }

  /**
   * Retourne le contexte utilisateur
   */
  getUserContext(): IframeUserContext {
    if (!this.userContext) {
      throw new Error('User context not available. Call initialize() first.');
    }
    return this.userContext;
  }

  /**
   * Vérifie si l'utilisateur a une permission spécifique
   */
  hasPermission(permission: 'isOwner' | 'canManage' | 'viewOnly'): boolean {
    if (!this.userContext) return false;

    const role = this.userContext.role;

    switch (permission) {
      case 'isOwner':
        return role === 'Propriétaire';
      case 'canManage':
        return ['Propriétaire', 'responsable', 'responsable administratif'].includes(role);
      case 'viewOnly':
        return ['carrossier', 'carrossier-vehicule de courtoisie'].includes(role);
      default:
        return false;
    }
  }

  /**
   * Effectue une requête sécurisée via le proxy Supabase
   */
  async proxyRequest(request: {
    action: 'select' | 'insert' | 'update' | 'delete' | 'rpc';
    table?: string;
    data?: any;
    filter?: any;
    select?: string;
    rpcName?: string;
    rpcParams?: any;
  }): Promise<any> {
    if (!this.iframeToken) {
      throw new Error('Not initialized');
    }

    const response = await fetch(`${this.baseUrl}/functions/v1/iframe-supabase-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: this.iframeToken,
        ...request
      })
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Proxy request failed');
    }

    return result.data;
  }
}

/**
 * Instance globale du helper (singleton)
 */
export const iframeSupabaseHelper = new IframeSupabaseHelper();