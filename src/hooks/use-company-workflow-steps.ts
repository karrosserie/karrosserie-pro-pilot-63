import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WorkflowStep {
  id: string;
  name: string;
  step_key: string;
  step_order: number;
  color: string;
  estimated_duration: number;
  description: string;
  required_qualifications: string[];
  is_required: boolean;
}

export const useCompanyWorkflowSteps = (companyId: string | null) => {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkflowSteps = async () => {
      if (!companyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Fetching workflow steps for company:', companyId);

        // D'abord, chercher le template de processus spécifique à l'entreprise
        const { data: templates, error: templatesError } = await supabase
          .from('process_templates')
          .select('*')
          .eq('company_id', companyId);

        if (templatesError) {
          console.error('Error fetching process templates:', templatesError);
          setError('Erreur lors de la récupération des templates');
          return;
        }

        let templateId: string | null = null;

        // Si l'entreprise a son propre template, l'utiliser
        if (templates && templates.length > 0) {
          templateId = templates[0].id;
          console.log('✅ Company has specific template:', templateId);
        } else {
          // Sinon, utiliser le template par défaut
          const { data: defaultTemplate, error: defaultError } = await supabase
            .from('process_templates')
            .select('*')
            .eq('is_default', true)
            .single();

          if (defaultError || !defaultTemplate) {
            console.error('No default template found:', defaultError);
            setError('Aucun template par défaut trouvé');
            return;
          }

          templateId = defaultTemplate.id;
          console.log('⚠️ Using default template:', templateId);
        }

        // Récupérer les étapes pour ce template
        const { data: steps, error: stepsError } = await supabase
          .from('workflow_steps')
          .select('*')
          .eq('process_template_id', templateId)
          .order('step_order', { ascending: true });

        if (stepsError) {
          console.error('Error fetching workflow steps:', stepsError);
          setError('Erreur lors de la récupération des étapes');
          return;
        }

        console.log('✅ Workflow steps loaded:', {
          templateId,
          stepsCount: steps?.length || 0,
          steps: steps?.map(s => ({ name: s.name, step_key: s.step_key, step_order: s.step_order }))
        });

        setWorkflowSteps(steps || []);
      } catch (error) {
        console.error('Unexpected error:', error);
        setError('Erreur inattendue');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflowSteps();
  }, [companyId]);

  return {
    workflowSteps,
    loading,
    error,
  };
};