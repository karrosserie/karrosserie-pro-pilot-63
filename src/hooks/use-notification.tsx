import { useToast } from '@/hooks/use-toast';

export interface NotificationOptions {
  title?: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

export function useNotification() {
  const { toast } = useToast();

  const notify = (options: NotificationOptions) => {
    toast({
      title: options.title,
      description: options.description,
      variant: options.variant === 'success' ? 'default' : options.variant,
    });
  };

  const success = (description: string, title?: string) => {
    notify({
      title: title || 'Succès',
      description,
      variant: 'success',
    });
  };

  const error = (description: string, title?: string) => {
    notify({
      title: title || 'Erreur',
      description,
      variant: 'destructive',
    });
  };

  const warning = (description: string, title?: string) => {
    notify({
      title: title || 'Attention',
      description,
      variant: 'default',
    });
  };

  const info = (description: string, title?: string) => {
    notify({
      title: title || 'Information',
      description,
      variant: 'default',
    });
  };

  return {
    notify,
    success,
    error,
    warning,
    info,
  };
}