import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, Settings as SettingsIcon, User, FileText, Bell } from 'lucide-react';

const Settings = () => {
  const [accountData, setAccountData] = useState({
    name: 'Carrosserie Dupont',
    email: 'contact@carrosseriedupont.fr',
    address: '123 Rue des Réparations',
    zipCode: '75001',
    city: 'Paris',
    phone: '01 23 45 67 89',
    siren: '123456789',
    siret: '12345678901234',
    tva: 'FR12345678901',
    logo: null,
    notifications: {
      email: true,
      push: true,
      sms: false,
    }
  });

  const handleSwitchChange = (key: string) => {
    setAccountData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Paramètres</h1>
        <p className="text-gray-600 mt-1">Configurez votre compte et vos préférences.</p>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="account">
            <User className="h-4 w-4 mr-2" />
            Entreprise
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Apparence
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <CreditCard className="h-4 w-4 mr-2" />
            Abonnement
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'entreprise</CardTitle>
              <CardDescription>
                Mettez à jour les informations de votre entreprise.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'entreprise</Label>
                  <Input 
                    id="name" 
                    value={accountData.name} 
                    onChange={(e) => setAccountData({...accountData, name: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={accountData.email} 
                    onChange={(e) => setAccountData({...accountData, email: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input 
                  id="address" 
                  value={accountData.address} 
                  onChange={(e) => setAccountData({...accountData, address: e.target.value})} 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Code postal</Label>
                  <Input 
                    id="zipCode" 
                    value={accountData.zipCode} 
                    onChange={(e) => setAccountData({...accountData, zipCode: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input 
                    id="city" 
                    value={accountData.city} 
                    onChange={(e) => setAccountData({...accountData, city: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  value={accountData.phone} 
                  onChange={(e) => setAccountData({...accountData, phone: e.target.value})} 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siren">SIREN</Label>
                  <Input 
                    id="siren" 
                    value={accountData.siren} 
                    onChange={(e) => setAccountData({...accountData, siren: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siret">SIRET</Label>
                  <Input 
                    id="siret" 
                    value={accountData.siret} 
                    onChange={(e) => setAccountData({...accountData, siret: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tva">Numéro de TVA</Label>
                <Input 
                  id="tva" 
                  value={accountData.tva} 
                  onChange={(e) => setAccountData({...accountData, tva: e.target.value})} 
                />
              </div>
              
              <div className="flex justify-end">
                <Button className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Logo de l'entreprise</CardTitle>
              <CardDescription>
                Ajoutez votre logo pour l'afficher sur vos documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  {accountData.logo ? (
                    <img src={accountData.logo} alt="Logo" className="max-w-full max-h-full" />
                  ) : (
                    <FileText className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <Input type="file" id="logo" className="w-full" />
                  <p className="text-xs text-gray-500">
                    Formats acceptés : PNG, JPG. Taille maximale : 2 MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Personnalisation de l'interface</CardTitle>
              <CardDescription>
                Personnalisez l'apparence et le comportement de l'application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode">Mode sombre</Label>
                    <p className="text-sm text-gray-500">
                      Activer le mode sombre pour réduire la fatigue oculaire.
                    </p>
                  </div>
                  <Switch id="darkMode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="animations">Animations</Label>
                    <p className="text-sm text-gray-500">
                      Activer les animations dans l'interface utilisateur.
                    </p>
                  </div>
                  <Switch id="animations" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="colorTheme">Couleur principale</Label>
                  <div className="grid grid-cols-6 gap-2">
                    <Button type="button" className="bg-orange-500 hover:bg-orange-600 h-8 w-8 p-0 rounded-full" />
                    <Button type="button" className="bg-blue-500 hover:bg-blue-600 h-8 w-8 p-0 rounded-full" />
                    <Button type="button" className="bg-green-500 hover:bg-green-600 h-8 w-8 p-0 rounded-full" />
                    <Button type="button" className="bg-purple-500 hover:bg-purple-600 h-8 w-8 p-0 rounded-full" />
                    <Button type="button" className="bg-red-500 hover:bg-red-600 h-8 w-8 p-0 rounded-full" />
                    <Button type="button" className="bg-gray-500 hover:bg-gray-600 h-8 w-8 p-0 rounded-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
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
                    checked={accountData.notifications.email}
                    onCheckedChange={() => handleSwitchChange('email')}
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
                    checked={accountData.notifications.push}
                    onCheckedChange={() => handleSwitchChange('push')}
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
                    checked={accountData.notifications.sms}
                    onCheckedChange={() => handleSwitchChange('sms')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Information d'abonnement</CardTitle>
              <CardDescription>
                Gérez votre abonnement à Karrosserie Pro.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Plan Professionnel</h3>
                      <p className="text-sm text-gray-500">49,99€ / mois</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Actif
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm">Prochain prélèvement: 15/06/2025</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold">Jetons disponibles</h3>
                  <div className="flex justify-between items-center mt-2">
                    <p>Signatures électroniques</p>
                    <span className="font-bold">25 / 50</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p>Lettres recommandées</p>
                    <span className="font-bold">10 / 20</span>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      Acheter des jetons supplémentaires
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline">Changer de plan</Button>
                  <Button variant="destructive">Annuler l'abonnement</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
