import { supabase } from '@/integrations/supabase/client';

export type Import = {
  id: string;
  report_id: string;
  user_id: string;
  status: string;
  error: string | null;
  document: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  expertise_reports?: {
    id: string;
    report_number: string | null;
    document_url: string | null;
    status: string | null;
    clients?: {
      id: string;
      first_name: string;
      last_name: string;
    } | null;
    vehicles?: {
      id: string;
      license_plate: string;
      car_brands?: {
        name: string;
      } | null;
      car_models?: {
        name: string;
      } | null;
    } | null;
  } | null;
};

export const importsService = {
  getPendingImports: async (): Promise<Import[]> => {
    console.log('importsService.getPendingImports - Starting query');
    
    const { data, error } = await supabase
      .from('imports')
      .select(`
        *,
        expertise_reports (
          id,
          report_number,
          document_url,
          status,
          clients (
            id,
            first_name,
            last_name
          ),
          vehicles (
            id,
            license_plate,
            car_brands (
              name
            ),
            car_models (
              name
            )
          )
        )
      `)
      .in('status', ['En cours d\'analyse', 'En erreur'])
      .order('created_at', { ascending: false });

    console.log('importsService.getPendingImports - Query result:');
    console.log('  - data:', data);
    console.log('  - error:', error);

    if (error) {
      console.error('Error fetching pending imports:', error);
      throw new Error(error.message);
    }

    console.log('importsService.getPendingImports - Returning:', data || []);
    return data || [];
  }
};