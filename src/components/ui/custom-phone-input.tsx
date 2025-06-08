
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlagSvg } from './flag-svg';

// Liste des pays avec leurs drapeaux, noms et indicatifs
const countries = [
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'US', name: 'États-Unis', dialCode: '+1' },
  { code: 'GB', name: 'Royaume-Uni', dialCode: '+44' },
  { code: 'DE', name: 'Allemagne', dialCode: '+49' },
  { code: 'ES', name: 'Espagne', dialCode: '+34' },
  { code: 'IT', name: 'Italie', dialCode: '+39' },
  { code: 'BE', name: 'Belgique', dialCode: '+32' },
  { code: 'CH', name: 'Suisse', dialCode: '+41' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'AU', name: 'Australie', dialCode: '+61' },
];

interface CustomPhoneInputProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultCountry?: string;
}

export const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  value = '',
  onChange,
  placeholder = "Numéro de téléphone",
  disabled = false,
  className,
  defaultCountry = "FR"
}) => {
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find(country => country.code === defaultCountry) || countries[0]
  );
  const [phoneNumber, setPhoneNumber] = useState(value.replace(/^\+\d+/, '').trim());
  const [open, setOpen] = useState(false);

  const handleCountrySelect = (country: typeof countries[0]) => {
    setSelectedCountry(country);
    setOpen(false);
    // Mettre à jour la valeur complète
    const fullNumber = phoneNumber ? `${country.dialCode}${phoneNumber}` : country.dialCode;
    onChange(fullNumber);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value;
    setPhoneNumber(number);
    // Mettre à jour la valeur complète
    const fullNumber = number ? `${selectedCountry.dialCode}${number}` : selectedCountry.dialCode;
    onChange(fullNumber);
  };

  return (
    <div className={cn("flex", className)}>
      {/* Sélecteur de pays */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-auto justify-center rounded-r-none border-r-0 px-3"
            disabled={disabled}
          >
            <FlagSvg countryCode={selectedCountry.code} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Rechercher un pays..." />
            <CommandList>
              <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
              <CommandGroup>
                {countries.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={`${country.name} ${country.dialCode}`}
                    onSelect={() => handleCountrySelect(country)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <FlagSvg countryCode={country.code} />
                    <span className="flex-1">{country.name}</span>
                    <span className="text-muted-foreground text-sm">{country.dialCode}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedCountry.code === country.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Champ de saisie du numéro */}
      <div className="flex-1 relative">
        <Input
          type="tel"
          placeholder={placeholder}
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          disabled={disabled}
          className="rounded-l-none pl-16"
        />
        {/* Affichage de l'indicatif dans le champ */}
      </div>
    </div>
  );
};
