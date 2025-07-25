import { supabase } from '@/integrations/supabase/client';
import { InterventionSheet, NewInterventionSheet, UpdateInterventionSheet, ReportItem } from './types';
import { getCurrentUserCompanyId } from '../auth-company';

export const interventionSheetsService = {
  async getAll(): Promise<InterventionSheet[]> {
    const { data, error } = await supabase
      .from('intervention_sheets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      carrosserie_reports: (item.carrosserie_reports as unknown) as ReportItem[],
      mecanique_reports: (item.mecanique_reports as unknown) as ReportItem[],
      electrique_reports: (item.electrique_reports as unknown) as ReportItem[],
    }));
  },

  async getByClientId(clientId: string): Promise<InterventionSheet[]> {
    const { data, error } = await supabase
      .from('intervention_sheets')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      carrosserie_reports: (item.carrosserie_reports as unknown) as ReportItem[],
      mecanique_reports: (item.mecanique_reports as unknown) as ReportItem[],
      electrique_reports: (item.electrique_reports as unknown) as ReportItem[],
    }));
  },

  async getById(id: string): Promise<InterventionSheet | null> {
    const { data, error } = await supabase
      .from('intervention_sheets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;
    
    return {
      ...data,
      carrosserie_reports: (data.carrosserie_reports as unknown) as ReportItem[],
      mecanique_reports: (data.mecanique_reports as unknown) as ReportItem[],
      electrique_reports: (data.electrique_reports as unknown) as ReportItem[],
    };
  },

  async create(sheet: NewInterventionSheet): Promise<InterventionSheet> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const companyId = await getCurrentUserCompanyId();

    const { data, error } = await supabase
      .from('intervention_sheets')
      .insert({
        company_id: companyId,
        client_id: sheet.client_id,
        vehicle_id: sheet.vehicle_id,
        carrosserie_reports: sheet.carrosserie_reports as any,
        mecanique_reports: sheet.mecanique_reports as any,
        electrique_reports: sheet.electrique_reports as any,
        is_approved: sheet.is_approved,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      carrosserie_reports: (data.carrosserie_reports as unknown) as ReportItem[],
      mecanique_reports: (data.mecanique_reports as unknown) as ReportItem[],
      electrique_reports: (data.electrique_reports as unknown) as ReportItem[],
    };
  },

  async update(id: string, sheet: UpdateInterventionSheet): Promise<InterventionSheet> {
    const updateData: any = {};
    if (sheet.carrosserie_reports) updateData.carrosserie_reports = sheet.carrosserie_reports;
    if (sheet.mecanique_reports) updateData.mecanique_reports = sheet.mecanique_reports;
    if (sheet.electrique_reports) updateData.electrique_reports = sheet.electrique_reports;
    if (sheet.is_approved !== undefined) updateData.is_approved = sheet.is_approved;

    const { data, error } = await supabase
      .from('intervention_sheets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      carrosserie_reports: (data.carrosserie_reports as unknown) as ReportItem[],
      mecanique_reports: (data.mecanique_reports as unknown) as ReportItem[],
      electrique_reports: (data.electrique_reports as unknown) as ReportItem[],
    };
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('intervention_sheets')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },
};