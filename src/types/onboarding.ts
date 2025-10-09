// Types pour le système d'onboarding
export interface OnboardingStepBase {
  completed: boolean;
  completedAt?: string;
}

// Tunnel 1: Complétion profil carrossier
export interface ProfileCompletedStep extends OnboardingStepBase {
  userId?: string;
}

export interface CompanySirenStep extends OnboardingStepBase {
  siren?: string;
}

export interface AddressValidatedStep extends OnboardingStepBase {
  address?: string;
}

export interface LogoAddedStep extends OnboardingStepBase {
  logoUrl?: string;
}

export interface EmployeesAddedStep extends OnboardingStepBase {
  employeesCount: number;
}

export interface Tunnel1Steps {
  profileCompleted: ProfileCompletedStep;
  companySirenCompleted: CompanySirenStep;
  addressValidated: AddressValidatedStep;
  logoAdded: LogoAddedStep;
  employeesAdded: EmployeesAddedStep;
}

// Tunnel 2: Workflow métier principal automatisé
export interface ReportImportedStep extends OnboardingStepBase {
  reportId?: string;
}

export interface AutomaticDigitizationStep extends OnboardingStepBase {
  reportId?: string;
  clientId?: string;
  vehicleId?: string;
  quoteId?: string;
}

export interface QuoteToRepairOrderStep extends OnboardingStepBase {
  orderId?: string;
}

export interface SentForSignatureStep extends OnboardingStepBase {
  orderId?: string;
}

export interface OrderToInvoiceStep extends OnboardingStepBase {
  invoiceId?: string;
}

export interface AddedToPlanningStep extends OnboardingStepBase {
  vehicleId?: string;
}

export interface AssignmentOfClaimsStep extends OnboardingStepBase {
  assignmentId?: string;
}

export interface PaintWeighingStep extends OnboardingStepBase {
  weighingId?: string;
}

export interface Tunnel2Steps {
  reportImported: ReportImportedStep;
  automaticDigitization: AutomaticDigitizationStep;
  quoteToRepairOrder: QuoteToRepairOrderStep;
  sentForSignature: SentForSignatureStep;
  orderToInvoice: OrderToInvoiceStep;
  addedToPlanning: AddedToPlanningStep;
  assignmentOfClaimsCreated: AssignmentOfClaimsStep;
  paintWeighingDone: PaintWeighingStep;
}

// Tunnel 3: Prêt de véhicules
export interface FleetVehicleAddedStep extends OnboardingStepBase {
  vehicleId?: string;
}

export interface VehicleLoanStep extends OnboardingStepBase {
  reservationId?: string;
}

export interface VehicleReturnStep extends OnboardingStepBase {
  returnId?: string;
}

export interface ViolationAddedStep extends OnboardingStepBase {
  violationId?: string;
}

export interface AntaiDenunciationStep extends OnboardingStepBase {
  denunciationId?: string;
}

export interface Tunnel3Steps {
  fleetVehicleAdded: FleetVehicleAddedStep;
  vehicleLoanCreated: VehicleLoanStep;
  vehicleReturnCompleted: VehicleReturnStep;
  violationAdded: ViolationAddedStep;
  antaiDenunciationGenerated: AntaiDenunciationStep;
}

// État global d'onboarding
export interface OnboardingState {
  version: string;
  userId?: string;
  companyId?: string;
  startedAt: string;
  lastUpdatedAt: string;
  tunnel1: Tunnel1Steps;
  tunnel2: Tunnel2Steps;
  tunnel3: Tunnel3Steps;
}

// Progression d'un tunnel
export interface TunnelProgress {
  completed: number;
  total: number;
  percentage: number;
}

// Type pour les tunnels
export type TunnelKey = 'tunnel1' | 'tunnel2' | 'tunnel3';
export type Tunnel1StepKey = keyof Tunnel1Steps;
export type Tunnel2StepKey = keyof Tunnel2Steps;
export type Tunnel3StepKey = keyof Tunnel3Steps;
export type StepKey = Tunnel1StepKey | Tunnel2StepKey | Tunnel3StepKey;
