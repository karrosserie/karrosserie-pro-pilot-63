export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  plate: string;
  client: string;
  price: number;
  duration: number;
  status: string;
  technician?: string;
  inProgress: boolean;
  urgency?: boolean;
  stepId: string;
}

export interface WorkshopStep {
  id: string;
  title: string;
  count: number;
  color: string;
  order: number;
  vehicles: Vehicle[];
}

export interface PlanningStats {
  vehicles: number;
  completed: number;
  waiting: number;
  revenue: number;
}

export interface PlanningAlert {
  type: 'warning' | 'error' | 'info';
  message: string;
  details: string;
}

export type ViewMode = 'manager' | 'employee';
export type TabMode = 'workshop' | 'planning' | 'employees' | 'staff' | 'process';

export interface PlanningState {
  viewMode: ViewMode;
  activeTab: TabMode;
  stats: PlanningStats;
  steps: WorkshopStep[];
  alerts: PlanningAlert[];
  selectedVehicle?: Vehicle;
  selectedVehicleDetail?: Vehicle;
  isScheduleModalOpen: boolean;
  isWaitingVehiclesModalOpen: boolean;
  isVehicleDetailModalOpen: boolean;
}

export interface PlanningActions {
  setViewMode: (mode: ViewMode) => void;
  setActiveTab: (tab: TabMode) => void;
  scheduleVehicle: (vehicleId: string) => void;
  updateVehicleStatus: (vehicleId: string, status: string) => void;
  assignTechnician: (vehicleId: string, technician: string) => void;
  markUrgent: (vehicleId: string) => void;
  openScheduleModal: (vehicle: Vehicle) => void;
  closeScheduleModal: () => void;
  openWaitingVehiclesModal: () => void;
  closeWaitingVehiclesModal: () => void;
  openVehicleDetailModal: (vehicle: Vehicle) => void;
  closeVehicleDetailModal: () => void;
}