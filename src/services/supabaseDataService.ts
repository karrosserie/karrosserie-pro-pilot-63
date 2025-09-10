import { supabase } from '@/integrations/supabase/client';
import { UserDataComplete } from './postMessageService';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
}

interface UserCompany {
  company_id: string;
  role: string;
  active: boolean;
  company_info: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipcode: string;
    latitude: number | null;
    longitude: number | null;
    location_radius: number | null;
  };
}

interface UserCompanyWithQualifications extends UserCompany {
  qualifications: string[] | null;
}

export class SupabaseDataService {
  /**
   * Récupère les données complètes de l'utilisateur authentifié depuis Supabase
   */
  static async getCurrentUserData(): Promise<UserDataComplete | null> {
    try {
      // Vérifier l'authentification
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('🔐 SupabaseDataService: No authenticated user found');
        return null;
      }

      console.log('👤 SupabaseDataService: Fetching data for user:', user.id);

      // Récupérer le profil utilisateur
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('❌ SupabaseDataService: Error fetching profile:', profileError);
        return null;
      }

      // Récupérer les informations de l'entreprise et du rôle
      const { data: userCompanies, error: companyError } = await supabase
        .from('user_companies')
        .select(`
          company_id,
          role,
          active,
          qualifications,
          company_info:company_id (
            id,
            name,
            email,
            phone,
            address,
            city,
            zipcode,
            latitude,
            longitude,
            location_radius
          )
        `)
        .eq('user_id', user.id)
        .eq('active', true)
        .limit(1);

      if (companyError || !userCompanies || userCompanies.length === 0) {
        console.error('❌ SupabaseDataService: Error fetching company data:', companyError);
        return null;
      }

      const userCompany = userCompanies[0] as any;

      // Calculer les permissions basées sur le rôle et les qualifications
      const permissions = this.calculatePermissions(userCompany.role, userCompany.qualifications || []);

      // Formater les données selon l'interface UserDataComplete
      const userData: UserDataComplete = {
        type: 'USER_DATA_COMPLETE',
        timestamp: Date.now(),
        user: {
          id: user.id,
          email: user.email || '',
          profile: {
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            phoneNumber: profile.phone_number || ''
          }
        },
        company: {
          id: userCompany.company_info.id,
          name: userCompany.company_info.name,
          email: userCompany.company_info.email,
          phone: userCompany.company_info.phone,
          address: userCompany.company_info.address,
          city: userCompany.company_info.city,
          zipcode: userCompany.company_info.zipcode,
          siret: '', // Not stored in this table, could be added later
          siren: '', // Not stored in this table, could be added later
          tva: '', // Not stored in this table, could be added later
          logoUrl: '', // Not stored in this table, could be added later
          latitude: userCompany.company_info.latitude || undefined,
          longitude: userCompany.company_info.longitude || undefined,
          location_radius: userCompany.company_info.location_radius || 1000
        },
        role: {
          current: userCompany.role,
          permissions
        },
        impersonation: {
          isActive: false,
          originalUser: null,
          companyName: null
        },
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false
          }
        }
      };

      console.log('✅ SupabaseDataService: Successfully retrieved user data:', userData);
      
      // Log de diagnostic demandé par l'utilisateur
      const userName = userData.user.profile.firstName && userData.user.profile.lastName 
        ? `${userData.user.profile.firstName} ${userData.user.profile.lastName}` 
        : userData.user.email || 'Utilisateur inconnu';
      console.log(`🚨 ATTENTION voici l'utilisateur connecté: ${userName} et voici son rôle: ${userData.role.current}`);
      
      return userData;

    } catch (error) {
      console.error('❌ SupabaseDataService: Unexpected error:', error);
      return null;
    }
  }

  /**
   * Calcule les permissions automatiquement basées sur le rôle utilisateur
   */
  private static calculatePermissions(role: string, qualifications: string[] = []) {
    const basePermissions = {
      isOwner: false,
      isCarrossier: false,
      isResponsable: false,
      canManage: false,
      viewOnly: false,
      restrictedView: null as 'employee' | 'manager' | null
    };

    switch (role) {
      case 'Propriétaire':
        return {
          ...basePermissions,
          isOwner: true,
          canManage: true
        };

      case 'Responsable':
        return {
          ...basePermissions,
          isResponsable: true,
          canManage: true
        };

      case 'Gestionnaire d\'inventaire':
        return {
          ...basePermissions,
          viewOnly: true,
          restrictedView: 'employee' as const
        };

      case 'Carrossier':
        return {
          ...basePermissions,
          isCarrossier: true,
          viewOnly: true,
          restrictedView: 'employee' as const
        };

      case 'carrossier-vehicule de courtoisie':
        return {
          ...basePermissions,
          isCarrossier: true,
          viewOnly: true,
          restrictedView: 'employee' as const
        };

      case 'Employé':
      default:
        return {
          ...basePermissions,
          viewOnly: true,
          restrictedView: 'employee' as const
        };
    }
  }

  /**
   * Écoute les changements d'authentification Supabase
   */
  static onAuthStateChange(callback: (userData: UserDataComplete | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 SupabaseDataService: Auth state changed:', event);
      
      if (session?.user) {
        // Différer la récupération des données pour éviter les blocages
        setTimeout(async () => {
          const userData = await this.getCurrentUserData();
          callback(userData);
        }, 0);
      } else {
        callback(null);
      }
    });
  }

  /**
   * Vérifie si l'utilisateur est connecté à Supabase
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return !!user;
    } catch {
      return false;
    }
  }
}