
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useCompany } from '@/hooks/use-company';

const NotificationsTab: React.FC = () => {
  const { companyData, isSaving, updateNotifications, saveCompanyData } = useCompany();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de notifications</CardTitle>
        <CardDescription>
          Configurez comment vous souhaitez recevoir les notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Notifications par email</Label>
              <p className="text-sm text-gray-500">
                Recevez les notifications importantes par email.
              </p>
            </div>
            <Switch 
              id="email-notifications"
              checked={companyData.notifications?.email || false}
              onCheckedChange={() => updateNotifications('email')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Notifications push</Label>
              <p className="text-sm text-gray-500">
                Recevez les notifications push dans votre navigateur.
              </p>
            </div>
            <Switch 
              id="push-notifications"
              checked={companyData.notifications?.push || false}
              onCheckedChange={() => updateNotifications('push')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications">Notifications SMS</Label>
              <p className="text-sm text-gray-500">
                Recevez les notifications urgentes par SMS.
              </p>
            </div>
            <Switch 
              id="sms-notifications"
              checked={companyData.notifications?.sms || false}
              onCheckedChange={() => updateNotifications('sms')}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
            onClick={saveCompanyData}
            disabled={isSaving}
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer les préférences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
