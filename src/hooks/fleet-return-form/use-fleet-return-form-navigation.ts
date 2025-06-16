
import { useState } from 'react';

export const useFleetReturnFormNavigation = () => {
  const [activeTab, setActiveTab] = useState('damages');

  return {
    activeTab,
    setActiveTab
  };
};
