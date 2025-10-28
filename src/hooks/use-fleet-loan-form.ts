
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { LoanFormData } from '@/components/fleet/FleetLoanForm';
import { useFleetLoanFormState } from './fleet-loan-form/use-form-state';
import { useFleetLoanFormHandlers } from './fleet-loan-form/use-form-handlers';

export const useFleetLoanForm = (vehicle: FleetVehicle, onSubmit: (loanData: LoanFormData) => void, defaultValues?: any) => {
  const formState = useFleetLoanFormState(vehicle, defaultValues);
  const handlers = useFleetLoanFormHandlers(formState, onSubmit, vehicle, defaultValues);

  return {
    ...formState,
    ...handlers
  };
};
