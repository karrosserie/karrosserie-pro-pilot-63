import React from 'react';
import { cn } from '@/lib/utils';
import { User, Shield, AlertTriangle, Camera, FileSignature, Check } from 'lucide-react';
import { LoanFormData } from '../FleetLoanForm';

interface TabConfig {
  value: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

interface FleetLoanTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  formData: LoanFormData;
  isViewMode?: boolean;
}

const tabs: TabConfig[] = [
  { value: 'client-info', label: 'Informations client', shortLabel: 'Client', icon: User },
  { value: 'insurance', label: 'Assurance', shortLabel: 'Assurance', icon: Shield },
  { value: 'damages', label: 'Chocs & rayures', shortLabel: 'État', icon: AlertTriangle },
  { value: 'vehicle-details', label: 'Photos', shortLabel: 'Photos', icon: Camera },
  { value: 'attestation', label: 'Signature', shortLabel: 'Signature', icon: FileSignature }
];

const FleetLoanTabNavigation: React.FC<FleetLoanTabNavigationProps> = ({
  activeTab,
  onTabChange,
  formData,
  isViewMode = false
}) => {
  const currentTabIndex = tabs.findIndex(tab => tab.value === activeTab);

  // Validation simple par onglet
  const isTabComplete = (tabValue: string): boolean => {
    switch (tabValue) {
      case 'client-info':
        return !!(formData.clientId || formData.clientName) && 
               !!formData.driverLicenseFrontUrl && 
               !!formData.driverLicenseBackUrl;
      case 'insurance':
        if (!formData.clientInsurance) return true;
        return !!formData.insuranceCompanyName && !!formData.insuranceEmail;
      case 'damages':
        return true; // Toujours valide (optionnel)
      case 'vehicle-details':
        return formData.mileage > 0 && formData.vehicleImages.length > 0;
      case 'attestation':
        return !!formData.attestationAccepted && !!formData.clientSignature;
      default:
        return false;
    }
  };

  return (
    <div className="w-full py-4">
      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-between px-2">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          const isComplete = isTabComplete(tab.value);
          const isPast = index < currentTabIndex;

          return (
            <React.Fragment key={tab.value}>
              {/* Tab button */}
              <button
                type="button"
                onClick={() => onTabChange(tab.value)}
                className={cn(
                  "flex flex-col items-center gap-2 transition-all duration-200 group",
                  isActive ? "scale-105" : "hover:scale-102"
                )}
              >
                {/* Circle with icon/check */}
                <div className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-200 shadow-sm",
                  isActive 
                    ? "bg-primary border-primary text-primary-foreground shadow-md" 
                    : isComplete
                    ? "bg-green-100 border-green-500 text-green-600"
                    : isPast
                    ? "bg-muted border-muted-foreground/30 text-muted-foreground"
                    : "bg-background border-border text-muted-foreground group-hover:border-primary/50"
                )}>
                  {isComplete && !isActive ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                
                {/* Label */}
                <span className={cn(
                  "text-xs font-medium text-center max-w-[80px] leading-tight transition-colors",
                  isActive 
                    ? "text-primary" 
                    : isComplete
                    ? "text-green-600"
                    : "text-muted-foreground"
                )}>
                  {tab.shortLabel}
                </span>
              </button>

              {/* Connector line */}
              {index < tabs.length - 1 && (
                <div className="flex-1 mx-2 h-0.5 relative">
                  <div className="absolute inset-0 bg-border rounded-full" />
                  <div 
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full transition-all duration-300",
                      index < currentTabIndex 
                        ? "bg-green-500 w-full" 
                        : index === currentTabIndex
                        ? "bg-primary w-1/2"
                        : "bg-transparent w-0"
                    )} 
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        {/* Progress bar */}
        <div className="flex items-center gap-1 mb-3 px-2">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.value;
            const isComplete = isTabComplete(tab.value);
            const isPast = index < currentTabIndex;

            return (
              <div
                key={tab.value}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-200",
                  isActive 
                    ? "bg-primary" 
                    : isComplete || isPast
                    ? "bg-green-500"
                    : "bg-border"
                )}
              />
            );
          })}
        </div>

        {/* Icon buttons */}
        <div className="flex items-center justify-between px-1">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            const isComplete = isTabComplete(tab.value);

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onTabChange(tab.value)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                  isActive 
                    ? "bg-primary/10" 
                    : "hover:bg-muted"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all",
                  isActive 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : isComplete
                    ? "bg-green-100 border-green-500 text-green-600"
                    : "bg-background border-border text-muted-foreground"
                )}>
                  {isComplete && !isActive ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-medium",
                  isActive 
                    ? "text-primary" 
                    : isComplete
                    ? "text-green-600"
                    : "text-muted-foreground"
                )}>
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FleetLoanTabNavigation;
