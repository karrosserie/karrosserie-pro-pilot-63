import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface EnhancedButtonProps extends ButtonProps {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  ...props
}) => {
  return (
    <Button
      disabled={disabled || loading}
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!loading && leftIcon && leftIcon}
      {children}
      {!loading && rightIcon && rightIcon}
    </Button>
  );
};