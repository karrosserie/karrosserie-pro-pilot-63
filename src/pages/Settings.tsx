
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CreditCard, Settings as SettingsIcon, User, Bell, Sliders, Users, Bot, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CompanyTab from '@/components/settings/CompanyTab';
import PreferencesTab from '@/components/settings/PreferencesTab';
import TeamTab from '@/components/settings/TeamTab';
import AppearanceTab from '@/components/settings/AppearanceTab';
import NotificationsTab from '@/components/settings/NotificationsTab';
import SubscriptionTab from '@/components/settings/SubscriptionTab';
import RelanceIATab from '@/components/settings/RelanceIATab';
import { useCompany } from '@/hooks/use-company';
import { useSubscription } from '@/hooks/use-subscription';
import { useSearchParams } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const { isLoading } = useCompany();
  const { hasFullAccess } = useSubscription();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || "subscription");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
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
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Paramètres</h1>
            <p className="text-gray-600 mt-1">Configurez votre compte et vos préférences.</p>
          </div>
          {hasFullAccess && (
            <Button 
              onClick={() => navigate('/gestion-templates')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Gestion des templates
            </Button>
          )}
        </div>
        {!hasFullAccess && (
          <div className="mt-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            ⚠️ Accès limité - Seuls les paramètres d'abonnement sont disponibles.
          </div>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-6">
          {hasFullAccess && (
            <>
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
              <TabsTrigger value="appearance" className="hidden">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Apparence
              </TabsTrigger>
              <TabsTrigger value="notifications" className="hidden">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="relance-ia">
                <Bot className="h-4 w-4 mr-2" />
                Relance IA
              </TabsTrigger>
            </>
          )}
          <TabsTrigger value="subscription">
            <CreditCard className="h-4 w-4 mr-2" />
            Abonnement
          </TabsTrigger>
        </TabsList>
        
        {hasFullAccess && (
          <>
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
            
            <TabsContent value="relance-ia">
              <RelanceIATab />
            </TabsContent>
          </>
        )}
        
        <TabsContent value="subscription">
          <SubscriptionTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
