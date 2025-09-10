import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FloatingNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number; // in milliseconds, 0 for persistent
  onDismiss?: () => void;
}

interface FloatingNotificationsProps {
  notifications: FloatingNotification[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const FloatingNotifications: React.FC<FloatingNotificationsProps> = ({
  notifications,
  onDismiss,
  position = 'top-right'
}) => {
  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          onDismiss(notification.id);
        }, notification.duration);
        
        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onDismiss]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      default: return 'top-4 right-4';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className={cn(
      'fixed z-50 space-y-2 max-w-sm',
      getPositionClasses()
    )}>
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={cn(
            'shadow-lg animate-in slide-in-from-right-full',
            notification.type === 'error' && 'border-red-200',
            notification.type === 'warning' && 'border-yellow-200',
            notification.type === 'success' && 'border-green-200'
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {getIcon(notification.type)}
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{notification.title}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismiss(notification.id)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};