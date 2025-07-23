export interface ReportItem {
  id: string;
  text: string;
}

export interface InterventionSheet {
  id: string;
  user_id: string;
  client_id: string;
  vehicle_id: string;
  carrosserie_reports: ReportItem[];
  mecanique_reports: ReportItem[];
  electrique_reports: ReportItem[];
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewInterventionSheet {
  client_id: string;
  vehicle_id: string;
  carrosserie_reports: ReportItem[];
  mecanique_reports: ReportItem[];
  electrique_reports: ReportItem[];
  is_approved: boolean;
}

export interface UpdateInterventionSheet {
  carrosserie_reports?: ReportItem[];
  mecanique_reports?: ReportItem[];
  electrique_reports?: ReportItem[];
  is_approved?: boolean;
}