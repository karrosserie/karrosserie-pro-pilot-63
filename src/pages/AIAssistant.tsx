
import React from 'react';
import IAStatusHeader from '@/components/ai-assistant/IAStatusHeader';
import IAChannelsBanner from '@/components/ai-assistant/IAChannelsBanner';
import IAPaymentTracking from '@/components/ai-assistant/IAPaymentTracking';
import IAAlerts from '@/components/ai-assistant/IAAlerts';

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
        
        {/* Alertes IA */}
        <IAAlerts />
      </div>
    </div>
  );
};

export default AIAssistant;
