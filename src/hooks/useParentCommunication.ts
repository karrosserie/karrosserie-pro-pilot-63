import { useState, useEffect, useMemo } from 'react';
import { SupabaseDataService } from '@/services/supabaseDataService';
import { supabase } from '@/integrations/supabase/client';

interface ParentState {
  isLoading: boolean;
  isAuthenticated: boolean;
  userData: any | null;
  companyData: any | null;
  roleData: any | null;
  permissions: any | null;
  // Nouvelles propriétés pour stocker TOUTES les données JWT
  fullJwtData?: any;
  user?: any;
  company?: any;
}

export const useParentCommunication = () => {
  const [parentState, setParentState] = useState<ParentState>(() => {
    // Try to restore from sessionStorage on init
    try {
      const stored = sessionStorage.getItem('parentCommunication');
      if (stored) {
        const parsedState = JSON.parse(stored);
        console.log('🔄 useParentCommunication: Restored from sessionStorage:', parsedState);
        return parsedState;
      }
    } catch (error) {
      console.warn('🔄 useParentCommunication: Failed to restore from sessionStorage:', error);
    }
    
    return {
      isLoading: true,
      isAuthenticated: false,
      userData: null,
      companyData: null,
      roleData: null,
      permissions: null,
    };
  });

  useEffect(() => {
    console.log('🔗 useParentCommunication: Initializing user context from parent app');
    console.log('🔍 URL actuelle complète:', window.location.href);
    console.log('🔍 Search params:', window.location.search);
    
    const initializeUserContext = async () => {
      try {
        // Récupérer les tokens depuis l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const jwtToken = urlParams.get('token');
        const supabaseToken = urlParams.get('supabase_token');
        console.log('🔍 JWT Token extrait des paramètres URL:', jwtToken ? `${jwtToken.substring(0, 20)}...` : 'null');
        console.log('🔍 Supabase Token extrait des paramètres URL:', supabaseToken ? `${supabaseToken.substring(0, 20)}...` : 'null');
        
        // Si des tokens sont présents dans l'URL, forcer le nettoyage du sessionStorage
        if (jwtToken || supabaseToken) {
          console.log('🔄 useParentCommunication: Tokens detected in URL, cleaning sessionStorage');
          sessionStorage.removeItem('parentCommunication');
          sessionStorage.removeItem('parentCommunication_token');
          sessionStorage.removeItem('parentCommunication_supabase_token');
        }
        
        // Initialiser la session Supabase si le token est fourni
        if (supabaseToken) {
          console.log('🔐 useParentCommunication: Initializing Supabase session with provided token');
          try {
            await supabase.auth.setSession({
              access_token: supabaseToken,
              refresh_token: supabaseToken // Pour l'instant, on utilise le même token
            });
            console.log('✅ useParentCommunication: Supabase session initialized successfully');
          } catch (sessionError) {
            console.error('❌ useParentCommunication: Failed to initialize Supabase session:', sessionError);
          }
        }
        
        if (!jwtToken) {
          console.log('🔓 useParentCommunication: No token found in URL - checking sessionStorage for existing data');
          
          // Check if we have valid data in sessionStorage before clearing
          try {
            const stored = sessionStorage.getItem('parentCommunication');
            const storedJwtToken = sessionStorage.getItem('parentCommunication_token');
            const storedSupabaseToken = sessionStorage.getItem('parentCommunication_supabase_token');
            
            if (stored && storedJwtToken) {
              const parsedState = JSON.parse(stored);
              console.log('💾 useParentCommunication: Found existing valid data in sessionStorage, using it');
              setParentState({
                ...parsedState,
                isLoading: false
              });
              return;
            }
          } catch (error) {
            console.warn('🔓 useParentCommunication: Error reading sessionStorage:', error);
          }
          
          // No valid sessionStorage data, use standalone mode
          console.log('🔓 useParentCommunication: No valid data found - standalone mode');
          const newState = {
            isLoading: false,
            isAuthenticated: false,
            userData: null,
            companyData: null,
            roleData: null,
            permissions: null,
          };
          setParentState(newState);
          return;
        }
        
        // Vérifier si c'est un nouveau token (changement d'utilisateur)
        const previousJwtToken = sessionStorage.getItem('parentCommunication_token');
        const previousSupabaseToken = sessionStorage.getItem('parentCommunication_supabase_token');
        if ((previousJwtToken && previousJwtToken !== jwtToken) || (previousSupabaseToken && previousSupabaseToken !== supabaseToken)) {
          console.log('👤 useParentCommunication: Token changed - new user detected, resetting state');
          sessionStorage.removeItem('parentCommunication');
          sessionStorage.removeItem('parentCommunication_supabase_token');
          setParentState({
            isLoading: true,
            isAuthenticated: false,
            userData: null,
            companyData: null,
            roleData: null,
            permissions: null,
          });
        }

        console.log('🔐 useParentCommunication: Token found, fetching user context');
        
        // Appeler la fonction edge via GET avec le token en paramètre (recommandation de l'application parent)
        const response = await fetch(`https://jukdsypvuehnniskgpfd.supabase.co/functions/v1/get-user-context?token=${encodeURIComponent(jwtToken)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('❌ useParentCommunication: HTTP error:', response.status, errorData);
          throw new Error(`HTTP error ${response.status}: ${errorData}`);
        }
        
        const userData = await response.json();
        
        console.log('✅ useParentCommunication: User context loaded successfully:', {
          userId: userData.user?.id,
          companyId: userData.company?.id,
          role: userData.role?.current,
          permissions: userData.role?.permissions
        });
        
        // Log de diagnostic complet de toutes les données reçues
        console.log('📊 TOUTES LES DONNÉES JWT REÇUES:', {
          user: userData.user,
          company: userData.company,
          role: userData.role,
          fullData: userData
        });
        
        // Log de diagnostic demandé par l'utilisateur
        const userName = userData.user?.first_name && userData.user?.last_name 
          ? `${userData.user.first_name} ${userData.user.last_name}` 
          : userData.user?.email || 'Utilisateur inconnu';
        console.log(`🚨 ATTENTION voici l'utilisateur connecté: ${userName} et voici son rôle: ${userData.role?.current || 'Aucun rôle'}`);
        
        // Stocker TOUTES les données JWT sans exception
        const newState = {
          isLoading: false,
          isAuthenticated: true,
          userData: userData,                    // Toutes les données complètes
          companyData: userData.company,         // Données entreprise complètes
          roleData: userData.role,               // Données rôle complètes
          permissions: userData.role?.permissions, // Permissions
          // Ajout de données spécifiques facilement accessibles
          fullJwtData: userData,                 // Copie complète des données JWT
          user: userData.user,                   // Données utilisateur directes
          company: userData.company,             // Données entreprise directes
        };
        
        setParentState(newState);
        
        // Persist TOUTES les données to sessionStorage avec logs détaillés
        try {
          const dataToStore = {
            ...newState,
            timestamp: Date.now(),
            tokenSource: 'jwt'
          };
          sessionStorage.setItem('parentCommunication', JSON.stringify(dataToStore));
          sessionStorage.setItem('parentCommunication_token', jwtToken);
          sessionStorage.setItem('parentCommunication_fullJwt', JSON.stringify(userData));
          if (supabaseToken) {
            sessionStorage.setItem('parentCommunication_supabase_token', supabaseToken);
          }
          console.log('💾 STOCKAGE COMPLET - Toutes les données JWT persistées:', {
            sessionStorageKeys: ['parentCommunication', 'parentCommunication_token', 'parentCommunication_fullJwt'],
            companyId: userData.company?.id,
            userId: userData.user?.id,
            role: userData.role?.current,
            dataSize: JSON.stringify(dataToStore).length + ' caractères'
          });
        } catch (storageError) {
          console.warn('💾 useParentCommunication: Failed to persist to sessionStorage:', storageError);
        }
        
        console.log('🔗 useParentCommunication: State updated with isAuthenticated=true');
        
        // Nettoyer les tokens de l'URL pour la sécurité
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('token');
        cleanUrl.searchParams.delete('supabase_token');
        window.history.replaceState({}, document.title, cleanUrl.toString());
        
      } catch (error) {
        console.error('❌ useParentCommunication: Error fetching user context:', error);
        console.log('🔗 useParentCommunication: Setting isAuthenticated=false due to error');
        const newState = {
          isLoading: false,
          isAuthenticated: false,
          userData: null,
          companyData: null,
          roleData: null,
          permissions: null,
        };
        setParentState(newState);
        // Clear sessionStorage on error
        sessionStorage.removeItem('parentCommunication');
      }
    };

    // Initialiser le contexte utilisateur
    initializeUserContext();
  }, []); // Empty dependency array to run only once

  // Valeurs dérivées mémorisées avec accès à TOUTES les données
  const derivedValues = useMemo(() => {
    const employeeId = parentState.userData?.user?.id || parentState.user?.id || null;
    const companyId = parentState.companyData?.id || parentState.company?.id || null;
    const userRole = parentState.roleData?.current || parentState.userData?.role?.current || 'user';
    const currentView = parentState.permissions?.restrictedView || null;
    const companyPosition = (parentState.companyData || parentState.company) && 
      (parentState.companyData?.latitude !== undefined || parentState.company?.latitude !== undefined) && 
      (parentState.companyData?.longitude !== undefined || parentState.company?.longitude !== undefined) ? {
      latitude: parentState.companyData?.latitude || parentState.company?.latitude,
      longitude: parentState.companyData?.longitude || parentState.company?.longitude,
      radius: (parentState.companyData?.location_radius || parentState.company?.location_radius) || 1000
    } : null;
    const canManage = parentState.permissions?.canManage || false;
    const isEmployeeRole = parentState.permissions?.viewOnly || false;

    // Log des valeurs dérivées pour debug
    console.log('🔧 VALEURS DÉRIVÉES CALCULÉES:', {
      employeeId,
      companyId,
      userRole,
      currentView,
      companyPosition,
      canManage,
      isEmployeeRole,
      sourceData: {
        companyData: parentState.companyData?.id,
        company: parentState.company?.id,
        userData: parentState.userData?.company?.id
      }
    });

    return {
      employeeId,
      companyId,
      userRole,
      currentView,
      companyPosition,
      canManage,
      isEmployeeRole
    };
  }, [parentState]);

  // Debug logs for troubleshooting
  console.log('🔧 useParentCommunication: Return values:', {
    isAuthenticated: parentState.isAuthenticated,
    isParentConnected: parentState.isAuthenticated,
    permissions: parentState.permissions,
    role: derivedValues.userRole
  });

  return {
    // État principal - TOUTES les données JWT
    isLoading: parentState.isLoading,
    isAuthenticated: parentState.isAuthenticated,
    userData: parentState.userData,
    companyData: parentState.companyData,
    roleData: parentState.roleData,
    permissions: parentState.permissions,
    
    // Accès direct aux données spécifiques
    user: parentState.user,
    company: parentState.company,
    fullJwtData: parentState.fullJwtData,
    
    // Valeurs dérivées
    ...derivedValues,
    
    // Méthodes helpers (gardées pour compatibilité)
    getEmployeeId: () => derivedValues.employeeId,
    getCompanyId: () => derivedValues.companyId,
    getUserRole: () => derivedValues.userRole,
    getCurrentView: () => derivedValues.currentView,
    getCompanyPosition: () => derivedValues.companyPosition,
    canManage: () => derivedValues.canManage,
    isEmployee: () => derivedValues.isEmployeeRole,
    
    // Nouvelles méthodes pour accéder à TOUTES les données JWT
    getAllJwtData: () => parentState.fullJwtData || parentState.userData,
    getCompanyFullData: () => parentState.company || parentState.companyData,
    getUserFullData: () => parentState.user || parentState.userData?.user,
    getRoleFullData: () => parentState.roleData,
    
    // États de connexion simplifiés (compatibilité)
    isParentConnected: parentState.isAuthenticated,
    isStandalone: () => !parentState.isAuthenticated,
    isConnecting: () => parentState.isLoading,
    isSupabaseMode: () => parentState.isAuthenticated,
    
    // Méthode vide pour compatibilité (plus de postMessage)
    notifyParent: (_type: string, _data: any) => {},
  };
};