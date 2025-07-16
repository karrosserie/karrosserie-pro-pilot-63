import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { PlanningState, PlanningActions, Vehicle, WorkshopStep, ViewMode, TabMode } from '@/types/planning';

// État initial
const initialState: PlanningState = {
  viewMode: 'manager',
  activeTab: 'workshop',
  stats: {
    vehicles: 8,
    completed: 0,
    waiting: 5,
    revenue: 18700
  },
  steps: [
    {
      id: 'reception',
      title: 'Accueil & Préparation du dossier',
      count: 2,
      color: 'border-l-blue-500',
      order: 1,
      vehicles: [
        {
          id: 'v1',
          brand: 'Citroën',
          model: 'C4',
          plate: 'EZ-787-KL',
          client: 'M. Durand',
          price: 800,
          duration: 0.5,
          status: 'Devis en cours',
          technician: 'Martin Dubois',
          inProgress: true,
          stepId: 'reception'
        },
        {
          id: 'v2',
          brand: 'Mercedes',
          model: 'Classe C',
          plate: 'QR-345-ST',
          client: 'Mme Leclerc',
          price: 400,
          duration: 1,
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
      color: 'border-l-green-500',
      order: 2,
      vehicles: [
        {
          id: 'v3',
          brand: 'Audi',
          model: 'A4',
          plate: 'VS-901-AB',
          client: 'M. Bernard',
          price: 520,
          duration: 2,
          status: 'Débosselage portière',
          technician: 'Sophie Martin',
          inProgress: true,
          stepId: 'replacement'
        },
        {
          id: 'v4',
          brand: 'BMW',
          model: 'Série 1',
          plate: 'HT-556-GH',
          client: 'M. Rousseau',
          price: 950,
          duration: 3,
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
      color: 'border-l-yellow-500',
      order: 3,
      vehicles: [
        {
          id: 'v5',
          brand: 'Peugeot',
          model: '308',
          plate: 'AB-789-XY',
          client: 'Mme Moreau',
          price: 680,
          duration: 2.5,
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
      color: 'border-l-orange-500',
      order: 4,
      vehicles: [
        {
          id: 'v6',
          brand: 'Renault',
          model: 'Clio',
          plate: 'CD-123-ZW',
          client: 'M. Petit',
          price: 1200,
          duration: 4,
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
      color: 'border-l-purple-500',
      order: 5,
      vehicles: [
        {
          id: 'v7',
          brand: 'Volkswagen',
          model: 'Golf',
          plate: 'EF-456-UV',
          client: 'Mme Blanc',
          price: 350,
          duration: 1.5,
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
      color: 'border-l-red-500',
      order: 6,
      vehicles: [
        {
          id: 'v8',
          brand: 'Ford',
          model: 'Focus',
          plate: 'GH-789-ST',
          client: 'M. Roux',
          price: 80,
          duration: 0.5,
          status: 'Contrôle qualité',
          technician: 'Martin Dubois',
          inProgress: true,
          stepId: 'delivery'
        }
      ]
    }
  ],
  alerts: [
    {
      type: 'warning',
      message: '5 véhicules en attente',
      details: 'Pièces: 2 • Approbations: 1 • Techniciens: 1'
    }
  ],
  isScheduleModalOpen: false,
  isWaitingVehiclesModalOpen: false,
  isVehicleDetailModalOpen: false
};

// Types d'actions
type PlanningActionType =
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_ACTIVE_TAB'; payload: TabMode }
  | { type: 'SCHEDULE_VEHICLE'; payload: string }
  | { type: 'UPDATE_VEHICLE_STATUS'; payload: { vehicleId: string; status: string } }
  | { type: 'ASSIGN_TECHNICIAN'; payload: { vehicleId: string; technician: string } }
  | { type: 'MARK_URGENT'; payload: string }
  | { type: 'OPEN_SCHEDULE_MODAL'; payload: Vehicle }
  | { type: 'CLOSE_SCHEDULE_MODAL' }
  | { type: 'OPEN_WAITING_VEHICLES_MODAL' }
  | { type: 'CLOSE_WAITING_VEHICLES_MODAL' }
  | { type: 'OPEN_VEHICLE_DETAIL_MODAL'; payload: Vehicle }
  | { type: 'CLOSE_VEHICLE_DETAIL_MODAL' };

// Reducer
const planningReducer = (state: PlanningState, action: PlanningActionType): PlanningState => {
  switch (action.type) {
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    
    case 'SCHEDULE_VEHICLE':
      return {
        ...state,
        steps: state.steps.map(step => ({
          ...step,
          vehicles: step.vehicles.map(vehicle =>
            vehicle.id === action.payload
              ? { ...vehicle, inProgress: true, technician: 'À assigner' }
              : vehicle
          )
        }))
      };
    
    case 'UPDATE_VEHICLE_STATUS':
      return {
        ...state,
        steps: state.steps.map(step => ({
          ...step,
          vehicles: step.vehicles.map(vehicle =>
            vehicle.id === action.payload.vehicleId
              ? { ...vehicle, status: action.payload.status }
              : vehicle
          )
        }))
      };
    
    case 'ASSIGN_TECHNICIAN':
      return {
        ...state,
        steps: state.steps.map(step => ({
          ...step,
          vehicles: step.vehicles.map(vehicle =>
            vehicle.id === action.payload.vehicleId
              ? { ...vehicle, technician: action.payload.technician }
              : vehicle
          )
        }))
      };
    
    case 'MARK_URGENT':
      return {
        ...state,
        steps: state.steps.map(step => ({
          ...step,
          vehicles: step.vehicles.map(vehicle =>
            vehicle.id === action.payload
              ? { ...vehicle, urgency: !vehicle.urgency }
              : vehicle
          )
        }))
      };
    
    case 'OPEN_SCHEDULE_MODAL':
      return { ...state, selectedVehicle: action.payload, isScheduleModalOpen: true };
    
    case 'CLOSE_SCHEDULE_MODAL':
      return { ...state, selectedVehicle: undefined, isScheduleModalOpen: false };

    case 'OPEN_WAITING_VEHICLES_MODAL':
      return { ...state, isWaitingVehiclesModalOpen: true };
    
    case 'CLOSE_WAITING_VEHICLES_MODAL':
      return { ...state, isWaitingVehiclesModalOpen: false };

    case 'OPEN_VEHICLE_DETAIL_MODAL':
      return { ...state, selectedVehicleDetail: action.payload, isVehicleDetailModalOpen: true };
    
    case 'CLOSE_VEHICLE_DETAIL_MODAL':
      return { ...state, selectedVehicleDetail: undefined, isVehicleDetailModalOpen: false };
    
    default:
      return state;
  }
};

// Context
const PlanningContext = createContext<{
  state: PlanningState;
  actions: PlanningActions;
} | null>(null);

// Provider
export const PlanningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(planningReducer, initialState);

  const actions: PlanningActions = {
    setViewMode: (mode: ViewMode) => dispatch({ type: 'SET_VIEW_MODE', payload: mode }),
    setActiveTab: (tab: TabMode) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab }),
    scheduleVehicle: (vehicleId: string) => dispatch({ type: 'SCHEDULE_VEHICLE', payload: vehicleId }),
    updateVehicleStatus: (vehicleId: string, status: string) => 
      dispatch({ type: 'UPDATE_VEHICLE_STATUS', payload: { vehicleId, status } }),
    assignTechnician: (vehicleId: string, technician: string) => 
      dispatch({ type: 'ASSIGN_TECHNICIAN', payload: { vehicleId, technician } }),
    markUrgent: (vehicleId: string) => dispatch({ type: 'MARK_URGENT', payload: vehicleId }),
    openScheduleModal: (vehicle: Vehicle) => dispatch({ type: 'OPEN_SCHEDULE_MODAL', payload: vehicle }),
    closeScheduleModal: () => dispatch({ type: 'CLOSE_SCHEDULE_MODAL' }),
    openWaitingVehiclesModal: () => dispatch({ type: 'OPEN_WAITING_VEHICLES_MODAL' }),
    closeWaitingVehiclesModal: () => dispatch({ type: 'CLOSE_WAITING_VEHICLES_MODAL' }),
    openVehicleDetailModal: (vehicle: Vehicle) => dispatch({ type: 'OPEN_VEHICLE_DETAIL_MODAL', payload: vehicle }),
    closeVehicleDetailModal: () => dispatch({ type: 'CLOSE_VEHICLE_DETAIL_MODAL' })
  };

  return (
    <PlanningContext.Provider value={{ state, actions }}>
      {children}
    </PlanningContext.Provider>
  );
};

// Hook personnalisé
export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error('usePlanning must be used within a PlanningProvider');
  }
  return context;
};