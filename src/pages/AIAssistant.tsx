
import React from 'react';
import IAStatusHeader from '@/components/ai-assistant/IAStatusHeader';
import IAChannelsBanner from '@/components/ai-assistant/IAChannelsBanner';
import IAPaymentTracking from '@/components/ai-assistant/IAPaymentTracking';
import AIAutomationCards from '@/components/ai-assistant/AIAutomationCards';
import AIDashboard from '@/components/ai-assistant/AIDashboard';

const AIAssistant = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <div className="page-container space-y-6">
        {/* Header contextuel avec statut IA */}
        <IAStatusHeader />
        
        {/* Bandeau canaux multicanaux */}
        <IAChannelsBanner />
        
        {/* Tableau principal de suivi des impayés */}
        <IAPaymentTracking />
        
        {/* Section des automatisations et dashboard */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <AIAutomationCards />
          </div>
          <div>
            <AIDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
