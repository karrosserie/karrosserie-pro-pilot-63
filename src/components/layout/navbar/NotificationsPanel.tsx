
import React from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationsPanelProps {
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  notifications: Array<{
    id: number;
    title: string;
    description: string;
    time: string;
    read: boolean;
  }>;
}

const NotificationsPanel = ({
  showNotifications,
  setShowNotifications,
  notifications
}: NotificationsPanelProps) => {
  return (
    <>
      <Button 
        variant="ghost" 
        size="icon"
        className="text-gray-600 relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="h-5 w-5 hidden md:block" />
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </Button>
      
      {showNotifications && (
        <div className="absolute top-16 right-16 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowNotifications(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map(notification => (
              <div key={notification.id} className={`p-3 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                <div className="flex justify-between">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
              </div>
            ))}
          </div>
          <div className="p-2 text-center border-t">
            <Button variant="link" size="sm" className="text-karrosserie-orange">
              Voir toutes les notifications
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationsPanel;
