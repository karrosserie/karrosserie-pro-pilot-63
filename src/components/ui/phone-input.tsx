
import React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './phone-input-styles.css';
import { cn } from '@/lib/utils';

interface PhoneInputFieldProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultCountry?: string;
}

export const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  value,
  onChange,
  placeholder = "Numéro de téléphone",
  disabled = false,
  className,
  defaultCountry = "FR"
}) => {
  return (
    <PhoneInput
      international
      defaultCountry={defaultCountry as any}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      addInternationalOption={false}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      countrySelectProps={{
        className: "phone-country-select"
      }}
      countryOptionsOrder={['FR', 'US', 'GB', 'DE', 'ES', 'IT', '...']}
      labels={{
        'FR': 'France +33',
        'US': 'États-Unis +1', 
        'GB': 'Royaume-Uni +44',
        'DE': 'Allemagne +49',
        'ES': 'Espagne +34',
        'IT': 'Italie +39',
        'BE': 'Belgique +32',
        'CH': 'Suisse +41',
        'CA': 'Canada +1',
        'AU': 'Australie +61',
        'ZZ': 'International'
      }}
    />
  );
};
