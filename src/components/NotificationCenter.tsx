import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Check, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'nouvelle_tache' | 'urgence' | 'retard' | 'info';
  titre: string;
  message: string;
  timestamp: Date;
  lue: boolean;
  employeId?: string;
  vehiculeId?: number;
  tacheId?: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onDismiss
}) => {
  const unreadCount = notifications.filter(n => !n.lue).length;

  const getNotificationVariant = (type: string) => {
    switch (type) {
      case 'urgence': return 'destructive';
      case 'retard': return 'destructive';
      case 'nouvelle_tache': return 'default';
      default: return 'secondary';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgence': return '🚨';
      case 'retard': return '⏰';
      case 'nouvelle_tache': return '📋';
      default: return 'ℹ️';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              Aucune notification
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${
                  notification.lue ? 'bg-muted/50' : 'bg-background'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <Badge
                        variant={getNotificationVariant(notification.type)}
                        className="text-xs"
                      >
                        {notification.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <h4 className="font-medium text-sm">{notification.titre}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    
                    <div className="text-xs text-muted-foreground mt-2">
                      {notification.timestamp.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    {!notification.lue && onMarkAsRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onMarkAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    
                    {onDismiss && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDismiss(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};