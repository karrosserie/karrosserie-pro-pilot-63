import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCompany } from '@/hooks/use-company';

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
  type: string;
  status: 'active' | 'draft' | 'inactive';
  usage: number;
  performance: {
    openRate?: number;
    responseRate?: number;
    paymentRate?: number;
    deliveryRate?: number;
    clickRate?: number;
    successRate?: number;
  };
  created_at?: string;
  updated_at?: string;
}

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { companyData } = useCompany();

  const fetchTemplates = async () => {
    if (!companyData?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('company_id', companyData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTemplates: Template[] = data.map(template => ({
        id: template.id,
        name: template.name,
        category: template.category,
        description: template.description || '',
        content: template.content,
        type: template.type,
        status: template.status as 'active' | 'draft' | 'inactive',
        usage: template.usage_count || 0,
        performance: (template.performance_data as any) || {},
        created_at: template.created_at,
        updated_at: template.updated_at
      }));

      setTemplates(formattedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les templates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async (template: Omit<Template, 'id' | 'created_at' | 'updated_at'>) => {
    if (!companyData?.id) return null;

    try {
      const { data, error } = await supabase
        .from('templates')
        .insert({
          company_id: companyData.id,
          name: template.name,
          category: template.category,
          description: template.description,
          content: template.content,
          type: template.type,
          status: template.status,
          usage_count: template.usage,
          performance_data: template.performance
        })
        .select()
        .single();

      if (error) throw error;

      const newTemplate: Template = {
        id: data.id,
        name: data.name,
        category: data.category,
        description: data.description || '',
        content: data.content,
        type: data.type,
        status: data.status as 'active' | 'draft' | 'inactive',
        usage: data.usage_count || 0,
        performance: (data.performance_data as any) || {},
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setTemplates(prev => [newTemplate, ...prev]);

      toast({
        title: "Succès",
        description: "Template créé avec succès",
      });

      return newTemplate;
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le template",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<Template>) => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .update({
          name: updates.name,
          category: updates.category,
          description: updates.description,
          content: updates.content,
          type: updates.type,
          status: updates.status,
          usage_count: updates.usage,
          performance_data: updates.performance
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedTemplate: Template = {
        id: data.id,
        name: data.name,
        category: data.category,
        description: data.description || '',
        content: data.content,
        type: data.type,
        status: data.status as 'active' | 'draft' | 'inactive',
        usage: data.usage_count || 0,
        performance: (data.performance_data as any) || {},
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t));

      toast({
        title: "Succès",
        description: "Template mis à jour avec succès",
      });

      return updatedTemplate;
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le template",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTemplates(prev => prev.filter(t => t.id !== id));

      toast({
        title: "Succès",
        description: "Template supprimé avec succès",
      });

      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le template",
        variant: "destructive",
      });
      return false;
    }
  };

  const toggleTemplateStatus = async (template: Template) => {
    const newStatus = template.status === 'active' ? 'inactive' : 'active';
    await updateTemplate(template.id, { status: newStatus });
  };

  useEffect(() => {
    fetchTemplates();
  }, [companyData?.id]);

  return {
    templates,
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    toggleTemplateStatus,
    refetch: fetchTemplates
  };
};