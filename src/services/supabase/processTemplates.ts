import { supabase } from '@/integrations/supabase/client';

export interface ProcessTemplate {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  estimated_total_duration: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowStep {
  id: string;
  process_template_id: string;
  step_key: string;
  name: string;
  description: string | null;
  estimated_duration: number;
  required_qualifications: string[];
  is_required: boolean;
  can_run_in_parallel: boolean;
  dependencies: string[];
  color: string;
  step_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProcessTemplateWithSteps extends ProcessTemplate {
  workflow_steps: WorkflowStep[];
}

export const processTemplatesService = {
  async getAll(): Promise<ProcessTemplateWithSteps[]> {
    const { data, error } = await supabase
      .from('process_templates')
      .select(`
        *,
        workflow_steps (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(template => ({
      ...template,
      workflow_steps: (template.workflow_steps || []).sort((a: WorkflowStep, b: WorkflowStep) => a.step_order - b.step_order)
    }));
  },

  async getById(id: string): Promise<ProcessTemplateWithSteps | null> {
    const { data, error } = await supabase
      .from('process_templates')
      .select(`
        *,
        workflow_steps (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    if (!data) return null;

    return {
      ...data,
      workflow_steps: (data.workflow_steps || []).sort((a: WorkflowStep, b: WorkflowStep) => a.step_order - b.step_order)
    };
  },

  async create(template: Omit<ProcessTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<ProcessTemplate> {
    const { data, error } = await supabase
      .from('process_templates')
      .insert(template)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<ProcessTemplate>): Promise<ProcessTemplate> {
    const { data, error } = await supabase
      .from('process_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('process_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const workflowStepsService = {
  async create(step: Omit<WorkflowStep, 'id' | 'created_at' | 'updated_at'>): Promise<WorkflowStep> {
    const { data, error } = await supabase
      .from('workflow_steps')
      .insert(step)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<WorkflowStep>): Promise<WorkflowStep> {
    const { data, error } = await supabase
      .from('workflow_steps')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('workflow_steps')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateDuration(processTemplateId: string): Promise<void> {
    // Recalculer la durée totale du processus
    const { data: steps } = await supabase
      .from('workflow_steps')
      .select('estimated_duration')
      .eq('process_template_id', processTemplateId);

    if (steps) {
      const totalDuration = steps.reduce((sum, step) => sum + step.estimated_duration, 0);
      
      await supabase
        .from('process_templates')
        .update({ estimated_total_duration: totalDuration })
        .eq('id', processTemplateId);
    }
  }
};