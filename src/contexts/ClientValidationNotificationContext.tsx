import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ValidationNotification {
  clientId: string;
  clientName: string;
  reportId: string;
  companyId: string;
  validationResults: {
    missing: { missingFields: string[]; missingCount: number; isComplete: boolean };
    validation: { errors: string[]; warnings: string[]; isValid: boolean };
  };
  timestamp: Date;
}

interface ClientValidationNotificationContextType {
  notification: ValidationNotification | null;
  setNotification: (notification: ValidationNotification | null) => void;
  clearNotification: () => void;
}

const ClientValidationNotificationContext = createContext<ClientValidationNotificationContextType | undefined>(undefined);

export function ClientValidationNotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<ValidationNotification | null>(null);
  
  const clearNotification = () => setNotification(null);
  
  return (
    <ClientValidationNotificationContext.Provider 
      value={{ notification, setNotification, clearNotification }}
    >
      {children}
    </ClientValidationNotificationContext.Provider>
  );
}

export const useClientValidationNotification = () => {
  const context = useContext(ClientValidationNotificationContext);
  if (!context) {
    throw new Error('useClientValidationNotification must be used within ClientValidationNotificationProvider');
  }
  return context;
};
