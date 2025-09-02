
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CreditCard, Settings as SettingsIcon, User, Bell, Sliders, Users, Bot, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CompanyTab from '@/components/settings/CompanyTab';
import PreferencesTab from '@/components/settings/PreferencesTab';
import TeamTab from '@/components/settings/TeamTab';
import { TemplatesTab } from '@/components/settings/TemplatesTab';
import AppearanceTab from '@/components/settings/AppearanceTab';
import NotificationsTab from '@/components/settings/NotificationsTab';
import SubscriptionTab from '@/components/settings/SubscriptionTab';
import RelanceIATab from '@/components/settings/RelanceIATab';
import { useCompany } from '@/hooks/use-company';
import { useSubscription } from '@/hooks/use-subscription';
import { useSearchParams } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Settings = () => {
  const navigate = useNavigate();
  const { isLoading } = useCompany();
  const { hasFullAccess } = useSubscription();
  const isMobile = useIsMobile();
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
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Paramètres</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Configurez votre compte et vos préférences.</p>
        </div>
        {!hasFullAccess && (
          <div className="mt-2 text-xs sm:text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-2 sm:px-3 py-2">
            ⚠️ Accès limité - Seuls les paramètres d'abonnement sont disponibles.
          </div>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className={`${isMobile ? "flex flex-wrap h-auto gap-1 p-1" : "grid grid-cols-2 md:grid-cols-6"} mb-4 sm:mb-6`}>
          {hasFullAccess && (
            <>
              <TabsTrigger value="account" className={isMobile ? "flex-1 min-w-fit" : ""}>
                <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Entreprise</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className={isMobile ? "flex-1 min-w-fit" : ""}>
                <Sliders className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Préférences</span>
              </TabsTrigger>
              <TabsTrigger value="team" className={isMobile ? "flex-1 min-w-fit" : ""}>
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Équipe</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className={isMobile ? "flex-1 min-w-fit" : ""}>
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Templates</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="hidden">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Apparence
              </TabsTrigger>
              <TabsTrigger value="notifications" className="hidden">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="relance-ia" className={isMobile ? "flex-1 min-w-fit" : ""}>
                <Bot className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Relance IA</span>
              </TabsTrigger>
            </>
          )}
          <TabsTrigger value="subscription" className={isMobile ? "flex-1 min-w-fit" : ""}>
            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Abonnement</span>
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
            
            <TabsContent value="templates" className="space-y-4">
              <TemplatesTab />
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
