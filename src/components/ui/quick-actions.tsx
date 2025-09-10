import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface QuickAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  title,
  className
}) => {
  return (
    <Card className={className}>
      {title && (
        <CardContent className="pb-2 pt-4">
          <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
        </CardContent>
      )}
      <CardContent className={title ? "pt-2" : "pt-4"}>
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={action.onClick}
              disabled={action.disabled}
              className="flex items-center gap-2"
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};