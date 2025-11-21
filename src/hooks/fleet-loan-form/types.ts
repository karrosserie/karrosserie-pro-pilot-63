
import { LoanFormData, DamageItem } from '@/components/fleet/FleetLoanForm';

export interface FleetLoanFormHandlers {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClientSelect: (clientId: string) => void;
  handleQuoteSelect: (quoteId: string) => void;
  handleFreeTextClientChange: (text: string) => void;
  handleMileageChange: (mileage: number) => void;
  handleFuelLevelChange: (fuelLevel: number) => void;
  handleImageAdd: (url: string) => void;
  handleImageRemove: (index: number) => void;
  handleImageUpdate: (index: number, url: string) => void;
  handleDamageUpdate: (damages: DamageItem[]) => void;
  handleDriverLicenseFrontUpload: (url: string) => void;
  handleDriverLicenseBackUpload: (url: string) => void;
  handleInsuranceSwitchChange: (checked: boolean) => void;
  handleInsurancePhoneChange: (value: string | undefined) => void;
  handleSignatureChange: (field: string, value: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export interface FleetLoanFormState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: LoanFormData;
  setFormData: React.Dispatch<React.SetStateAction<LoanFormData>>;
}
