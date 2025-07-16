import React from 'react';
import { Settings, Calendar, Clock, Users, Cog } from 'lucide-react';
import { usePlanning } from '@/contexts/PlanningContext';
import WorkshopSteps from './WorkshopSteps';
import PlanningStats from './PlanningStats';
import { AlertTriangle } from 'lucide-react';

const PlanningTabs: React.FC = () => {
  const { state, actions } = usePlanning();

  const tabs = [
    { id: 'workshop', label: 'Étapes atelier', icon: Settings, shortLabel: 'Étapes' },
    { id: 'planning', label: 'Planning', icon: Calendar, shortLabel: 'Plan' },
    { id: 'employees', label: 'Planning Employés', icon: Clock, shortLabel: 'P.Emp' },
    { id: 'staff', label: 'Employés', icon: Users, shortLabel: 'Emp' },
    { id: 'process', label: 'Process', icon: Cog, shortLabel: 'Proc' },
  ];

  return (
    <div className="bg-white">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = state.activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => actions.setActiveTab(tab.id as any)}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors
                  ${isActive 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {state.activeTab === 'workshop' && (
          <div className="space-y-6">
            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Étapes atelier</h1>
              <p className="text-gray-600">Parcours complet avec synchronisation planning automatique</p>
            </div>

            <PlanningStats />
            
            {/* Alert */}
            {state.alerts.map((alert, index) => (
              <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">{alert.message}</span>
                </div>
                <p className="text-sm text-orange-700 mt-1">
                  {alert.details}
                </p>
              </div>
            ))}

            <WorkshopSteps />
          </div>
        )}

        {state.activeTab === 'planning' && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Vue Planning</h3>
            <p className="text-gray-500">Interface de planning calendaire détaillée en cours de développement</p>
          </div>
        )}

        {state.activeTab === 'employees' && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Planning Employés</h3>
            <p className="text-gray-500">Gestion des plannings individuels des employés</p>
          </div>
        )}

        {state.activeTab === 'staff' && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Employés</h3>
            <p className="text-gray-500">Gestion des employés et de leurs compétences</p>
          </div>
        )}

        {state.activeTab === 'process' && (
          <div className="text-center py-12">
            <Cog className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Process</h3>
            <p className="text-gray-500">Configuration des processus d'atelier</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanningTabs;