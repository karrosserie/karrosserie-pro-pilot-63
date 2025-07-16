import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  plate: string;
  client: string;
  price: number;
  duration: string;
  status: string;
  technician?: string;
  inProgress: boolean;
  stepId: string;
}

interface WorkshopStep {
  id: string;
  title: string;
  count: number;
  borderColor: string;
  vehicles: Vehicle[];
}

interface PlanningContextType {
  currentView: 'manager' | 'employee';
  setCurrentView: (view: 'manager' | 'employee') => void;
  steps: WorkshopStep[];
  showWaitingModal: boolean;
  setShowWaitingModal: (show: boolean) => void;
  showVehicleModal: boolean;
  setShowVehicleModal: (show: boolean) => void;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
}

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

export const usePlanningContext = () => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error('usePlanningContext must be used within a PlanningProvider');
  }
  return context;
};

export const PlanningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'manager' | 'employee'>('manager');
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const steps: WorkshopStep[] = [
    {
      id: 'reception',
      title: 'Accueil & Préparation du dossier',
      count: 2,
      borderColor: 'border-l-blue-500',
      vehicles: [
        {
          id: '1',
          brand: 'Citroën',
          model: 'C4',
          plate: 'EZ-787-KL',
          client: 'M. Durand',
          price: 800,
          duration: '0,5h',
          status: 'Devis en cours',
          technician: 'Martin Dubois',
          inProgress: true,
          stepId: 'reception'
        },
        {
          id: '2',
          brand: 'Mercedes',
          model: 'Classe C',
          plate: 'QR-345-ST',
          client: 'Mme Leclerc',
          price: 400,
          duration: '1h',
          status: 'Expertise assurance',
          inProgress: false,
          stepId: 'reception'
        }
      ]
    },
    {
      id: 'replacement',
      title: 'Remplacement ou débosselage',
      count: 2,
      borderColor: 'border-l-green-500',
      vehicles: [
        {
          id: '3',
          brand: 'Audi',
          model: 'A4',
          plate: 'VS-901-AB',
          client: 'M. Bernard',
          price: 520,
          duration: '2h',
          status: 'Débosselage portière',
          technician: 'Sophie Martin',
          inProgress: true,
          stepId: 'replacement'
        },
        {
          id: '4',
          brand: 'BMW',
          model: 'Série 1',
          plate: 'HT-556-GH',
          client: 'M. Rousseau',
          price: 950,
          duration: '3h',
          status: 'Remplacement pare-chocs',
          inProgress: false,
          stepId: 'replacement'
        }
      ]
    },
    {
      id: 'preparation',
      title: 'Préparation peinture',
      count: 1,
      borderColor: 'border-l-yellow-500',
      vehicles: [
        {
          id: '5',
          brand: 'Peugeot',
          model: '308',
          plate: 'AB-789-XY',
          client: 'Mme Moreau',
          price: 680,
          duration: '2,5h',
          status: 'Ponçage aile avant',
          technician: 'Sophie Martin',
          inProgress: true,
          stepId: 'preparation'
        }
      ]
    },
    {
      id: 'painting',
      title: 'Mise en peinture',
      count: 1,
      borderColor: 'border-l-orange-500',
      vehicles: [
        {
          id: '6',
          brand: 'Renault',
          model: 'Clio',
          plate: 'CD-123-ZW',
          client: 'M. Petit',
          price: 1200,
          duration: '4h',
          status: 'Application base',
          technician: 'Sophie Martin',
          inProgress: true,
          stepId: 'painting'
        }
      ]
    },
    {
      id: 'finishing',
      title: 'Finitions & remontage',
      count: 1,
      borderColor: 'border-l-purple-500',
      vehicles: [
        {
          id: '7',
          brand: 'Volkswagen',
          model: 'Golf',
          plate: 'EF-456-UV',
          client: 'Mme Blanc',
          price: 350,
          duration: '1,5h',
          status: 'Polissage final',
          technician: 'Martin Dubois',
          inProgress: true,
          stepId: 'finishing'
        }
      ]
    },
    {
      id: 'delivery',
      title: 'Clôture du dossier et livraison',
      count: 1,
      borderColor: 'border-l-red-500',
      vehicles: [
        {
          id: '8',
          brand: 'Ford',
          model: 'Focus',
          plate: 'GH-789-ST',
          client: 'M. Roux',
          price: 80,
          duration: '0,5h',
          status: 'Contrôle qualité',
          technician: 'Martin Dubois',
          inProgress: true,
          stepId: 'delivery'
        }
      ]
    }
  ];

  return (
    <PlanningContext.Provider value={{
      currentView,
      setCurrentView,
      steps,
      showWaitingModal,
      setShowWaitingModal,
      showVehicleModal,
      setShowVehicleModal,
      selectedVehicle,
      setSelectedVehicle
    }}>
      {children}
    </PlanningContext.Provider>
  );
};

export type { Vehicle, WorkshopStep };