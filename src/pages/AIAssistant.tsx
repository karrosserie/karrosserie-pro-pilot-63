
import React, { useState } from 'react';
import IAStatusHeader from '@/components/ai-assistant/IAStatusHeader';
import IAChannelsBanner from '@/components/ai-assistant/IAChannelsBanner';
import IAPaymentTracking from '@/components/ai-assistant/IAPaymentTracking';
import GlobalSearch from '@/components/shared/GlobalSearch';
import AIContextualPanel from '@/components/shared/AIContextualPanel';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

const AIAssistant = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIPanelMinimized, setIsAIPanelMinimized] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(true);

  // Configurer les raccourcis clavier
  useKeyboardShortcuts([
    {
      key: 'k',
      metaKey: true,
      action: () => setIsSearchOpen(true)
    },
    {
      key: 'k',
      ctrlKey: true,
      action: () => setIsSearchOpen(true)
    },
    {
      key: '1',
      metaKey: true,
      action: () => console.log('Quick action 1: Call client')
    },
    {
      key: '2',
      metaKey: true,
      action: () => console.log('Quick action 2: Send email')
    },
    {
      key: '3',
      metaKey: true,
      action: () => console.log('Quick action 3: Send SMS')
    },
    {
      key: '4',
      metaKey: true,
      action: () => console.log('Quick action 4: New quote')
    },
    {
      key: '5',
      metaKey: true,
      action: () => console.log('Quick action 5: Add vehicle')
    },
    {
      key: '6',
      metaKey: true,
      action: () => console.log('Quick action 6: New client')
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 relative">
      <div className="page-container space-y-3 sm:space-y-4 lg:space-y-6 p-3 sm:p-4 lg:p-6">
        {/* Header contextuel avec statut IA */}
        <IAStatusHeader />
        
        {/* Bandeau canaux multicanaux */}
        <IAChannelsBanner />
        
        {/* Tableau principal de suivi des impayés */}
        <IAPaymentTracking />

        {/* Indicateur de raccourcis en bas à droite pour mobile, bas à gauche pour desktop */}
        <div className="fixed bottom-3 right-3 sm:bottom-4 sm:left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-lg border z-40">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center">
              <kbd className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 rounded text-xs mr-1 sm:mr-2">⌘K</kbd>
              <span className="text-xs sm:text-sm">Recherche</span>
            </div>
            <div className="flex items-center">
              <kbd className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 rounded text-xs mr-1 sm:mr-2">⌘1-6</kbd>
              <span className="text-xs sm:text-sm">Actions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recherche globale */}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      {/* Panel IA contextuel */}
      {showAIPanel && (
        <AIContextualPanel
          isMinimized={isAIPanelMinimized}
          onToggleMinimize={() => setIsAIPanelMinimized(!isAIPanelMinimized)}
          onClose={() => setShowAIPanel(false)}
        />
      )}
    </div>
  );
};

export default AIAssistant;
