
export interface Expense {
  id: string;
  user_id: string;
  vehicle_id: string;
  type: string;
  category: string;
  supplier: string;
  date: string;
  total_amount: number;
  vat_amount: number;
  proof_url: string;
  status: string;
  assign_to_vehicle: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewExpense {
  user_id: string;
  vehicle_id?: string;
  type: string;
  category: string;
  supplier: string;
  date: string;
  total_amount: number;
  vat_amount: number;
  proof_url?: string;
  status: string;
  assign_to_vehicle: boolean;
}

export interface UpdateExpense {
  vehicle_id?: string;
  type?: string;
  category?: string;
  supplier?: string;
  date?: string;
  total_amount?: number;
  vat_amount?: number;
  proof_url?: string;
  status?: string;
  assign_to_vehicle?: boolean;
}

export interface ExpenseWithRelations {
  id: string;
  user_id: string;
  vehicle_id: string;
  type: string;
  category: string;
  supplier: string;
  date: string;
  total_amount: number;
  vat_amount: number;
  proof_url: string;
  status: string;
  assign_to_vehicle: boolean;
  created_at: string;
  updated_at: string;
  vehicle: {
    id: string;
    license_plate: string;
    car_brands: { name: string; } | null;
    car_models: { name: string; } | null;
  } | null;
}
