
import { ReturnDamageItem } from '@/components/fleet/FleetReturnForm.types';

// Helper function to get current date/time for datetime-local input
export const getCurrentDateTime = (): string => {
  const now = new Date();
  // Adjust for local timezone
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().slice(0, 16);
};

// Helper function to safely parse damages from reservation
export const parseDamagesFromReservation = (damages: any): ReturnDamageItem[] => {
  if (!damages) return [];
  
  // If damages is already an array of the correct type
  if (Array.isArray(damages)) {
    return damages.filter(item => 
      item && 
      typeof item === 'object' && 
      'id' in item && 
      'name' in item && 
      'type' in item
    ) as ReturnDamageItem[];
  }
  
  return [];
};

// Helper function to safely convert JSON to string array
export const jsonToStringArray = (json: any): string[] => {
  if (!json) return [];
  if (Array.isArray(json)) {
    return json.filter(item => typeof item === 'string') as string[];
  }
  return [];
};
