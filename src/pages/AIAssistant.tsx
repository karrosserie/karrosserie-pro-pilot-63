
import React from 'react';
import { Bot, Zap, BarChart3, Clock, Target, TrendingUp } from 'lucide-react';
import AIHero from '@/components/ai-assistant/AIHero';
import AIAutomationCards from '@/components/ai-assistant/AIAutomationCards';
import AIActionCenter from '@/components/ai-assistant/AIActionCenter';
import AIDashboard from '@/components/ai-assistant/AIDashboard';

const AIAssistant = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <div className="page-container space-y-8">
        {/* Hero Section */}
        <AIHero />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Automations & Actions */}
          <div className="xl:col-span-2 space-y-6">
            <AIAutomationCards />
            <AIActionCenter />
          </div>
          
          {/* Right Column - Dashboard & Insights */}
          <div className="space-y-6">
            <AIDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
