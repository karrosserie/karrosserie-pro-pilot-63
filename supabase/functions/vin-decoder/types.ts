
// Type definitions for VIN decoder
export interface VinInfo {
  brand?: string;
  model?: string;
  year?: number;
}

export interface VinResponse {
  success: boolean;
  vin: string;
  data: VinInfo;
  decoded_at: string;
}

export interface VinErrorResponse {
  error: string;
  message: string;
}
