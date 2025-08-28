
import React, { useState } from 'react';
import MissionControlDashboard from '@/components/mission-control/MissionControlDashboard';
import GlobalSearch from '@/components/shared/GlobalSearch';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

const AIAssistant = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    }
  ]);

  return (
    <div className="min-h-screen">
      <MissionControlDashboard />

      {/* Recherche globale */}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </div>
  );
};

export default AIAssistant;
