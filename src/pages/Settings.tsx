
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Settings as SettingsIcon, User, Bell, Sliders, Users } from 'lucide-react';
import CompanyTab from '@/components/settings/CompanyTab';
import PreferencesTab from '@/components/settings/PreferencesTab';
import TeamTab from '@/components/settings/TeamTab';
import AppearanceTab from '@/components/settings/AppearanceTab';
import NotificationsTab from '@/components/settings/NotificationsTab';
import SubscriptionTab from '@/components/settings/SubscriptionTab';
import { useCompany } from '@/hooks/use-company';

const Settings = () => {
  const { isLoading } = useCompany();

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Paramètres</h1>
        <p className="text-gray-600 mt-1">Configurez votre compte et vos préférences.</p>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-6">
          <TabsTrigger value="account">
            <User className="h-4 w-4 mr-2" />
            Entreprise
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Sliders className="h-4 w-4 mr-2" />
            Préférences
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="h-4 w-4 mr-2" />
            Équipe
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
          <CompanyTab />
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-4">
          <PreferencesTab />
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4">
          <TeamTab />
        </TabsContent>
        
        <TabsContent value="appearance">
          <AppearanceTab />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
        
        <TabsContent value="subscription">
          <SubscriptionTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
