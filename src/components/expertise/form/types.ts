
export interface RepairItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  discount: number;
  vat: number;
  total: number;
}

export interface PartItem {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  discount: number;
  vat: number;
  total: number;
}

export interface GlobalTotals {
  subTotal: number;
  totalVat: number;
  totalDiscount: number;
  total: number;
}
