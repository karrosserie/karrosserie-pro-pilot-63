
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NotificationsTabProps {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  onSwitchChange: (key: string) => void;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ notifications, onSwitchChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de notification</CardTitle>
        <CardDescription>
          Configurez comment vous souhaitez être notifié.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotif">Notifications par email</Label>
              <p className="text-sm text-gray-500">
                Recevoir des notifications par email.
              </p>
            </div>
            <Switch 
              id="emailNotif" 
              checked={notifications.email}
              onCheckedChange={() => onSwitchChange('email')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="pushNotif">Notifications push</Label>
              <p className="text-sm text-gray-500">
                Recevoir des notifications push dans le navigateur.
              </p>
            </div>
            <Switch 
              id="pushNotif" 
              checked={notifications.push}
              onCheckedChange={() => onSwitchChange('push')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="smsNotif">Notifications par SMS</Label>
              <p className="text-sm text-gray-500">
                Recevoir des notifications par SMS.
              </p>
            </div>
            <Switch 
              id="smsNotif" 
              checked={notifications.sms}
              onCheckedChange={() => onSwitchChange('sms')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
