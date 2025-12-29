import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Settings as SettingsIcon, User, Bell, Sliders, Users, Bot, FileText, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CompanyTab from '@/components/settings/CompanyTab';
import PreferencesTab from '@/components/settings/PreferencesTab';
import TeamTab from '@/components/settings/TeamTab';
import { TemplatesTab } from '@/components/settings/TemplatesTab';
import AppearanceTab from '@/components/settings/AppearanceTab';
import NotificationsTab from '@/components/settings/NotificationsTab';
import SubscriptionTab from '@/components/settings/SubscriptionTab';
import RelanceIATab from '@/components/settings/RelanceIATab';
import MobileSettingsMenu from '@/components/settings/MobileSettingsMenu';
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

  const handleBackToMenu = () => {
    setSearchParams({});
    setActiveTab("subscription");
  };

  const getCategoryTitle = (tab: string): string => {
    const titles: Record<string, string> = {
      account: 'Entreprise',
      preferences: 'Préférences',
      team: 'Équipe',
      templates: 'Templates',
      'relance-ia': 'Relance IA',
      subscription: 'Abonnement',
    };
    return titles[tab] || 'Paramètres';
  };

  const renderTabContent = (tab: string) => {
    switch (tab) {
      case 'account':
        return hasFullAccess ? <CompanyTab /> : null;
      case 'preferences':
        return hasFullAccess ? <PreferencesTab /> : null;
      case 'team':
        return hasFullAccess ? <TeamTab /> : null;
      case 'templates':
        return hasFullAccess ? <TemplatesTab /> : null;
      case 'appearance':
        return hasFullAccess ? <AppearanceTab /> : null;
      case 'notifications':
        return hasFullAccess ? <NotificationsTab /> : null;
      case 'relance-ia':
        return hasFullAccess ? <RelanceIATab /> : null;
      case 'subscription':
        return <SubscriptionTab />;
      default:
        return <SubscriptionTab />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mobile: Show menu or specific tab content
  if (isMobile) {
    // No tab selected - show menu
    if (!tabFromUrl) {
      return (
        <div className="min-h-screen bg-muted/30">
          <div className="p-4 border-b bg-background">
            <h1 className="text-xl font-bold text-foreground">Paramètres</h1>
            <p className="text-sm text-muted-foreground mt-1">Configurez votre compte et vos préférences</p>
            {!hasFullAccess && (
              <div className="mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                ⚠️ Accès limité - Seuls les paramètres d'abonnement sont disponibles.
              </div>
            )}
          </div>
          <MobileSettingsMenu 
            onSelectCategory={handleTabChange} 
            hasFullAccess={hasFullAccess} 
          />
        </div>
      );
    }

    // Tab selected - show content with back button
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="sticky top-0 z-10 bg-background border-b">
          <button
            onClick={handleBackToMenu}
            className="flex items-center gap-2 p-4 text-primary hover:bg-muted/50 transition-colors w-full"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="font-medium">Paramètres</span>
          </button>
          <div className="px-4 pb-3">
            <h1 className="text-xl font-bold text-foreground">{getCategoryTitle(tabFromUrl)}</h1>
          </div>
        </div>
        <div className="p-4">
          {renderTabContent(tabFromUrl)}
        </div>
      </div>
    );
  }

  // Desktop/Tablet: Original tabs interface
  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Paramètres</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Configurez votre compte et vos préférences.</p>
        </div>
        {!hasFullAccess && (
          <div className="mt-2 text-xs sm:text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-2 sm:px-3 py-2">
            ⚠️ Accès limité - Seuls les paramètres d'abonnement sont disponibles.
          </div>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-4 sm:mb-6">
          {hasFullAccess && (
            <>
              <TabsTrigger value="account">
                <User className="h-4 w-4 mr-2" />
                <span>Entreprise</span>
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Sliders className="h-4 w-4 mr-2" />
                <span>Préférences</span>
              </TabsTrigger>
              <TabsTrigger value="team">
                <Users className="h-4 w-4 mr-2" />
                <span>Équipe</span>
              </TabsTrigger>
              <TabsTrigger value="templates">
                <FileText className="h-4 w-4 mr-2" />
                <span>Templates</span>
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
                <span>Relance IA</span>
              </TabsTrigger>
            </>
          )}
          <TabsTrigger value="subscription">
            <CreditCard className="h-4 w-4 mr-2" />
            <span>Abonnement</span>
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
