
import React from 'react';
import PhoneInput, { Country, CountryCode } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { cn } from '@/lib/utils';

interface PhoneInputFieldProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultCountry?: CountryCode;
}

export const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  value,
  onChange,
  placeholder = "Numéro de téléphone",
  disabled = false,
  className,
  defaultCountry = "FR" as CountryCode
}) => {
  return (
    <PhoneInput
      international
      defaultCountry={defaultCountry}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      style={{
        '--PhoneInputCountryFlag-aspectRatio': '1.5',
        '--PhoneInputCountryFlag-height': '1.2em',
        '--PhoneInputCountrySelectArrow-color': 'currentColor',
        '--PhoneInputCountrySelectArrow-opacity': '0.45',
        '--PhoneInputCountrySelect-borderColor': 'hsl(var(--border))',
        '--PhoneInputCountrySelect-borderRadius': '0.375rem',
        '--PhoneInputCountrySelect-backgroundColor': 'hsl(var(--background))',
        '--PhoneInputCountrySelect-boxShadow': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        '--PhoneInputCountrySelect-zIndex': '50'
      } as any}
    />
  );
};
