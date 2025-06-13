
import { useState } from 'react';

export function useFleetVehicleFormNavigation() {
  const [activeTab, setActiveTab] = useState('vehicle-info');

  const handleNext = () => {
    if (activeTab === 'vehicle-info') {
      setActiveTab('documents');
    }
  };

  return {
    activeTab,
    setActiveTab,
    handleNext
  };
}
