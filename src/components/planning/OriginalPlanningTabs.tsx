import React from 'react';
import { Settings, Calendar, Clock, Users, Cog } from 'lucide-react';

interface PlanningTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const PlanningTabs: React.FC<PlanningTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'etapes', label: 'Étapes atelier', icon: Settings },
    { id: 'planning', label: 'Planning', icon: Calendar },
    { id: 'planning-employes', label: 'Planning Employés', icon: Clock },
    { id: 'employes', label: 'Employés', icon: Users },
    { id: 'process', label: 'Process', icon: Cog },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.id === 'etapes' && 'Étapes'}
                  {tab.id === 'planning' && 'Plan'}
                  {tab.id === 'planning-employes' && 'P.Emp'}
                  {tab.id === 'employes' && 'Emp'}
                  {tab.id === 'process' && 'Proc'}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default PlanningTabs;