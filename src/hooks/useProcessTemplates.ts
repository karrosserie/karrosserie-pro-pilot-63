import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { processTemplatesService, workflowStepsService, ProcessTemplateWithSteps, ProcessTemplate, WorkflowStep } from '@/services/supabase/processTemplates';
import { toast } from 'sonner';

export const useProcessTemplates = () => {
  return useQuery({
    queryKey: ['process_templates'],
    queryFn: processTemplatesService.getAll,
  });
};

export const useProcessTemplate = (id: string) => {
  return useQuery({
    queryKey: ['process_template', id],
    queryFn: () => processTemplatesService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProcessTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: processTemplatesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['process_templates'] });
      toast.success('Processus créé avec succès');
    },
    onError: (error) => {
      console.error('Error creating process template:', error);
      toast.error('Erreur lors de la création du processus');
    },
  });
};

export const useUpdateProcessTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ProcessTemplate> }) =>
      processTemplatesService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['process_templates'] });
      toast.success('Processus mis à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating process template:', error);
      toast.error('Erreur lors de la mise à jour du processus');
    },
  });
};

export const useDeleteProcessTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: processTemplatesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['process_templates'] });
      toast.success('Processus supprimé avec succès');
    },
    onError: (error) => {
      console.error('Error deleting process template:', error);
      toast.error('Erreur lors de la suppression du processus');
    },
  });
};

export const useCreateWorkflowStep = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (step: Omit<WorkflowStep, 'id' | 'created_at' | 'updated_at'>) => {
      const createdStep = await workflowStepsService.create(step);
      await workflowStepsService.updateDuration(step.process_template_id);
      return createdStep;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['process_templates'] });
      toast.success('Étape créée avec succès');
    },
    onError: (error) => {
      console.error('Error creating workflow step:', error);
      toast.error('Erreur lors de la création de l\'étape');
    },
  });
};

export const useUpdateWorkflowStep = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates, processTemplateId }: { 
      id: string; 
      updates: Partial<WorkflowStep>; 
      processTemplateId: string; 
    }) => {
      const updatedStep = await workflowStepsService.update(id, updates);
      await workflowStepsService.updateDuration(processTemplateId);
      return updatedStep;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['process_templates'] });
      toast.success('Étape mise à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating workflow step:', error);
      toast.error('Erreur lors de la mise à jour de l\'étape');
    },
  });
};

export const useDeleteWorkflowStep = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, processTemplateId }: { id: string; processTemplateId: string }) => {
      await workflowStepsService.delete(id);
      await workflowStepsService.updateDuration(processTemplateId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['process_templates'] });
      toast.success('Étape supprimée avec succès');
    },
    onError: (error) => {
      console.error('Error deleting workflow step:', error);
      toast.error('Erreur lors de la suppression de l\'étape');
    },
  });
};