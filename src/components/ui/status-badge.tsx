import React from 'react';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showDot = true,
  children,
  className,
  ...props
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          variant: 'default' as const,
          dotColor: 'bg-green-500',
          label: 'Actif'
        };
      case 'inactive':
        return {
          variant: 'secondary' as const,
          dotColor: 'bg-gray-500',
          label: 'Inactif'
        };
      case 'pending':
        return {
          variant: 'outline' as const,
          dotColor: 'bg-yellow-500',
          label: 'En attente'
        };
      case 'completed':
        return {
          variant: 'secondary' as const,
          dotColor: 'bg-green-500',
          label: 'Terminé'
        };
      case 'error':
        return {
          variant: 'destructive' as const,
          dotColor: 'bg-red-500',
          label: 'Erreur'
        };
      case 'warning':
        return {
          variant: 'outline' as const,
          dotColor: 'bg-yellow-500',
          label: 'Attention'
        };
      default:
        return {
          variant: 'secondary' as const,
          dotColor: 'bg-gray-500',
          label: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant={config.variant}
      className={cn('flex items-center gap-1.5', className)}
      {...props}
    >
      {showDot && (
        <div className={cn('w-2 h-2 rounded-full', config.dotColor)} />
      )}
      {children || config.label}
    </Badge>
  );
};