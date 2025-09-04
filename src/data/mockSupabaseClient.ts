// Mock du client Supabase pour utiliser des données statiques

import { 
  STATIC_CLIENTS, 
  STATIC_VEHICLES, 
  STATIC_INVOICES, 
  STATIC_QUOTES, 
  STATIC_REPAIR_ORDERS, 
  STATIC_EXPENSES, 
  STATIC_RECEIPTS, 
  STATIC_INSURANCE_COMPANIES,
  STATIC_CAR_BRANDS,
  STATIC_CAR_MODELS,
  STATIC_COMPANY,
  STATIC_AUTH,
  STATIC_PROFILES,
  STATIC_USER_COMPANIES,
  STATIC_SUBSCRIPTIONS,
  STATIC_TOKENS,
  mockApiDelay,
  filterByCompanyId
} from './staticData';

// Variables pour stocker les données modifiables
let clientsData = [...STATIC_CLIENTS];
let vehiclesData = [...STATIC_VEHICLES];
let invoicesData = [...STATIC_INVOICES];
let quotesData = [...STATIC_QUOTES];
let repairOrdersData = [...STATIC_REPAIR_ORDERS];
let expensesData = [...STATIC_EXPENSES];
let receiptsData = [...STATIC_RECEIPTS];
let insuranceCompaniesData = [...STATIC_INSURANCE_COMPANIES];
let carBrandsData = [...STATIC_CAR_BRANDS];
let carModelsData = [...STATIC_CAR_MODELS];
let profilesData = [...STATIC_PROFILES];
let userCompaniesData = [...STATIC_USER_COMPANIES];
let subscriptionsData = [...STATIC_SUBSCRIPTIONS];
let tokensData = [...STATIC_TOKENS];
const companyData = STATIC_COMPANY;

// Types pour les requêtes
interface QueryFilter {
  column: string;
  operator: string;
  value: any;
}

// Fonction pour obtenir les données selon la table
function getTableData(table: string) {
  switch (table) {
    case 'clients': return clientsData;
    case 'vehicles': return vehiclesData;
    case 'invoices': return invoicesData;
    case 'quotes': return quotesData;
    case 'repair_orders': return repairOrdersData;
    case 'expenses': return expensesData;
    case 'receipts': return receiptsData;
    case 'insurance_companies': return insuranceCompaniesData;
    case 'car_brands': return carBrandsData;
    case 'car_models': return carModelsData;
    case 'profiles': return profilesData;
    case 'user_companies': return userCompaniesData;
    case 'subscriptions': return subscriptionsData;
    case 'tokens': return tokensData;
    case 'companies': return [companyData];
    default: return [];
  }
}

// Fonction pour appliquer les filtres
function applyFilters(data: any[], filters: QueryFilter[]) {
  return data.filter(item => {
    return filters.every(filter => {
      const value = item[filter.column];
      switch (filter.operator) {
        case 'eq':
          return value === filter.value;
        case 'in':
          return Array.isArray(filter.value) && filter.value.includes(value);
        case 'neq':
          return value !== filter.value;
        case 'gt':
          return value > filter.value;
        case 'lt':
          return value < filter.value;
        case 'gte':
          return value >= filter.value;
        case 'lte':
          return value <= filter.value;
        case 'like':
          return typeof value === 'string' && value.toLowerCase().includes(filter.value.toLowerCase());
        case 'ilike':
          return typeof value === 'string' && value.toLowerCase().includes(filter.value.toLowerCase());
        default:
          return true;
      }
    });
  });
}

// Mock du client Supabase
export const mockSupabaseClient = {
  from: (table: string) => {
    return {
      select: (selectString: string = '*') => {
        const filters: QueryFilter[] = [];
        let order: { column: string; ascending: boolean } | undefined;
        let limit: number | undefined;
        let single = false;
        
        // Créer une fonction récursive qui permet un chaînage illimité
        const createFilterChain = (): any => ({
          eq: (column: string, value: any) => {
            filters.push({ column, operator: 'eq', value });
            return createFilterChain();
          },
          
          neq: (column: string, value: any) => {
            filters.push({ column, operator: 'neq', value });
            return createFilterChain();
          },
          
          in: (column: string, values: any[]) => {
            filters.push({ column, operator: 'in', value: values });
            return createFilterChain();
          },
          
          filter: (column: string, operator: string, value: any) => {
            filters.push({ column, operator, value });
            return createFilterChain();
          },
          
          order: (column: string, options: { ascending: boolean } = { ascending: true }) => {
            order = { column, ascending: options.ascending };
            return createFilterChain();
          },
          
          limit: (count: number) => {
            limit = count;
            return createFilterChain();
          },
          
          single: () => {
            single = true;
            return {
              then: async (resolve: (result: any) => void) => {
                await mockApiDelay(300);
                
                try {
                  let data = getTableData(table);
                  
                  // Gérer l'impersonation
                  const impersonationData = localStorage.getItem('admin_impersonation');
                  if (impersonationData) {
                    try {
                      const impersonation = JSON.parse(impersonationData);
                      data = filterByCompanyId(data, impersonation.company_id);
                    } catch (error) {
                      console.error('Error parsing impersonation data:', error);
                      data = filterByCompanyId(data, 'demo-company-123');
                    }
                  } else {
                    data = filterByCompanyId(data, 'demo-company-123');
                  }
                  
                  // Appliquer les filtres
                  data = applyFilters(data, filters);
                  
                  // Retourner single
                  const result = data.length > 0 ? data[0] : null;
                  resolve({ 
                    data: result, 
                    error: result ? null : { code: 'PGRST116', message: 'No rows found' }
                  });
                  
                } catch (error) {
                  resolve({ data: null, error });
                }
              }
            };
          },
          
          then: async (resolve: (result: any) => void) => {
            await mockApiDelay(300);
            
            try {
              let data = getTableData(table);
              
              // Gérer l'impersonation
              const impersonationData = localStorage.getItem('admin_impersonation');
              if (impersonationData) {
                try {
                  const impersonation = JSON.parse(impersonationData);
                  data = filterByCompanyId(data, impersonation.company_id);
                } catch (error) {
                  console.error('Error parsing impersonation data:', error);
                  data = filterByCompanyId(data, 'demo-company-123');
                }
              } else {
                data = filterByCompanyId(data, 'demo-company-123');
              }
              
              // Appliquer les filtres
              data = applyFilters(data, filters);
              
              // Appliquer l'ordre
              if (order) {
                data = data.sort((a, b) => {
                  const aVal = a[order!.column];
                  const bVal = b[order!.column];
                  const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                  return order!.ascending ? comparison : -comparison;
                });
              }
              
              // Appliquer la limite
              if (limit) {
                data = data.slice(0, limit);
              }
              
              resolve({ data, error: null });
              
            } catch (error) {
              resolve({ data: null, error });
            }
          }
        });
        
        return createFilterChain();
      },
      
      insert: (values: any[]) => {
        return {
          select: () => ({
            single: () => ({
              then: async (resolve: (result: any) => void) => {
                await mockApiDelay(500);
                
                const newItem = {
                  ...values[0],
                  id: `${table}-${Date.now()}`,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  company_id: values[0].company_id || 'demo-company-123'
                };
                
                // Ajouter à la bonne table
                const data = getTableData(table);
                data.push(newItem);
                
                resolve({ data: newItem, error: null });
              }
            })
          })
        };
      },
      
      update: (values: any) => {
        return {
          eq: (column: string, value: any) => ({
            select: () => ({
              single: () => ({
                then: async (resolve: (result: any) => void) => {
                  await mockApiDelay(500);
                  
                  const data = getTableData(table);
                  const itemIndex = data.findIndex(item => item[column] === value);
                  
                  if (itemIndex === -1) {
                    resolve({ data: null, error: { message: 'Item not found' } });
                    return;
                  }
                  
                  const updatedItem = {
                    ...data[itemIndex],
                    ...values,
                    updated_at: new Date().toISOString()
                  };
                  
                  data[itemIndex] = updatedItem;
                  
                  resolve({ data: updatedItem, error: null });
                }
              })
            })
          })
        };
      },
      
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: async (resolve: (result: any) => void) => {
            await mockApiDelay(300);
            
            const data = getTableData(table);
            const itemIndex = data.findIndex(item => item[column] === value);
            
            if (itemIndex === -1) {
              resolve({ data: null, error: { message: 'Item not found' } });
              return;
            }
            
            data.splice(itemIndex, 1);
            
            resolve({ data: null, error: null });
          }
        })
      })
    };
  },
  
  // Mock pour l'authentification
  auth: {
    getSession: async () => {
      await mockApiDelay(200);
      return { data: { session: STATIC_AUTH.session }, error: null };
    },
    
    getUser: async () => {
      await mockApiDelay(200);
      return { data: { user: STATIC_AUTH.session.user }, error: null };
    },
    
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      await mockApiDelay(800);
      return { 
        data: { 
          user: STATIC_AUTH.session.user, 
          session: STATIC_AUTH.session 
        }, 
        error: null 
      };
    },
    
    signUp: async (data: any) => {
      await mockApiDelay(1000);
      const user = {
        ...STATIC_AUTH.session.user,
        email: data.email,
        user_metadata: data.options?.data || {}
      };
      
      return { 
        data: { 
          user, 
          session: { ...STATIC_AUTH.session, user } 
        }, 
        error: null 
      };
    },
    
    signOut: async () => {
      await mockApiDelay(300);
      return { error: null };
    },
    
    onAuthStateChange: (callback: Function) => {
      // Simuler immédiatement un utilisateur connecté
      setTimeout(() => {
        callback('SIGNED_IN', STATIC_AUTH.session);
      }, 100);
      
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },
    
    resend: async () => {
      await mockApiDelay(500);
      return { error: null };
    },
    
    resetPasswordForEmail: async () => {
      await mockApiDelay(500);
      return { error: null };
    },
    
    updateUser: async () => {
      await mockApiDelay(500);
      return { error: null };
    }
  },
  
  // Mock pour les RPC (fonctions PostgreSQL)
  rpc: async (functionName: string, params?: any) => {
    await mockApiDelay(200);
    
    console.log(`Mock RPC call: ${functionName}`, params);
    
    // Mock responses for different RPC functions
    switch (functionName) {
      case 'set_config':
        return { data: null, error: null };
        
      case 'current_setting':
        // Retourner une valeur mock pour les settings
        const impersonationData = localStorage.getItem('admin_impersonation');
        if (impersonationData && params?.setting_name === 'app.impersonation_company_id') {
          try {
            const data = JSON.parse(impersonationData);
            return { data: data.company_id, error: null };
          } catch (error) {
            return { data: null, error: null };
          }
        }
        return { data: null, error: null };
        
      case 'get_user_context':
        // Mock user context
        return { 
          data: { 
            user_id: 'demo-user-123',
            company_id: 'demo-company-123',
            is_admin: true 
          }, 
          error: null 
        };
        
      default:
        console.warn(`Unhandled RPC function: ${functionName}`);
        return { data: null, error: null };
    }
  },
  
  // Mock pour les fonctions Edge
  functions: {
    invoke: async (functionName: string, options?: any) => {
      await mockApiDelay(1000);
      
      console.log(`Mock Edge Function call: ${functionName}`, options);
      
      // Simuler le succès pour toutes les fonctions Edge
      return {
        data: { success: true, message: `Mock ${functionName} executed successfully` },
        error: null
      };
    }
  }
};