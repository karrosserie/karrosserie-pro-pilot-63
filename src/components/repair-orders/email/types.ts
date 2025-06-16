
export interface RepairOrder {
  id: string;
  reference?: string;
  clients?: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
  };
  vehicles?: {
    id: string;
    license_plate?: string;
    car_brands?: {
      id: string;
      name: string;
    };
    car_models?: {
      id: string;
      name: string;
    };
  };
}

export interface RepairOrderEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repairOrder: RepairOrder | null;
}

export interface EmailFormData {
  recipient: string;
  subject: string;
  message: string;
}
