import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { Notification } from '@/hooks/usePlanningManager';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarquerLue: (notificationId: string) => void;
  userRole: 'manager' | 'employe';
  currentEmployeId?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarquerLue,
  userRole,
  currentEmployeId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Filtrer les notifications selon le rôle
  const notificationsFiltrees = userRole === 'manager' 
    ? notifications 
    : notifications.filter(n => n.employeId === currentEmployeId);

  const notificationsNonLues = notificationsFiltrees.filter(n => !n.lue);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'nouvelle_tache':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'tache_terminee':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'vehicule_debloque':
        return <Info className="w-5 h-5 text-info" />;
      case 'probleme':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'nouvelle_tache':
        return 'border-success bg-success/5';
      case 'tache_terminee':
        return 'border-primary bg-primary/5';
      case 'vehicule_debloque':
        return 'border-info bg-info/5';
      case 'probleme':
        return 'border-destructive bg-destructive/5';
      default:
        return 'border-muted bg-muted/5';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.lue) {
      onMarquerLue(notification.id);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            {notificationsNonLues.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {notificationsNonLues.length}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] mx-4 my-4 w-[calc(100vw-32px)] sm:w-full sm:mx-8">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-lg sm:text-xl">Centre de Notifications</span>
              </div>
              {notificationsNonLues.length > 0 && (
                <Badge variant="destructive" className="self-start sm:self-center">{notificationsNonLues.length}</Badge>
              )}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {userRole === 'manager' ? 'Toutes les notifications' : 'Vos notifications personnelles'}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {notificationsFiltrees.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                notificationsFiltrees
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map((notification) => (
                    <Card 
                      key={notification.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        getNotificationColor(notification.type)
                      } ${!notification.lue ? 'ring-2 ring-primary/20' : 'opacity-70'}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">{notification.titre}</h4>
                              <div className="flex items-center gap-2">
                                {!notification.lue && (
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {notification.timestamp.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            {notification.employeId && userRole === 'manager' && (
                              <Badge variant="outline" className="mt-2 text-xs">
                                Employé ID: {notification.employeId}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </ScrollArea>

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-4 border-t gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                notificationsFiltrees.forEach(n => {
                  if (!n.lue) onMarquerLue(n.id);
                });
              }}
              disabled={notificationsNonLues.length === 0}
              className="w-full sm:w-auto"
            >
              Tout marquer comme lu
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} size="sm" className="w-full sm:w-auto">
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal détail notification */}
      {selectedNotification && (
        <Dialog 
          open={!!selectedNotification} 
          onOpenChange={() => setSelectedNotification(null)}
        >
          <DialogContent className="max-w-md mx-4 my-4 w-[calc(100vw-32px)] sm:w-full sm:mx-8">
            <DialogHeader className="pb-4">
              <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                {getNotificationIcon(selectedNotification.type)}
                <span className="break-words">{selectedNotification.titre}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <p>{selectedNotification.message}</p>
              
              <div className="bg-muted/50 p-3 rounded-lg text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Heure :</span>
                  <span>{selectedNotification.timestamp.toLocaleString()}</span>
                </div>
                {selectedNotification.vehiculeId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Véhicule :</span>
                    <span>ID {selectedNotification.vehiculeId}</span>
                  </div>
                )}
                {selectedNotification.employeId && userRole === 'manager' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employé :</span>
                    <span>ID {selectedNotification.employeId}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => setSelectedNotification(null)}
                  size="sm"
                >
                  OK
                </Button>
                {selectedNotification.vehiculeId && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // Ici on pourrait ouvrir le modal du véhicule
                      setSelectedNotification(null);
                    }}
                    size="sm"
                    className="flex-1 sm:flex-initial"
                  >
                    Voir le véhicule
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};