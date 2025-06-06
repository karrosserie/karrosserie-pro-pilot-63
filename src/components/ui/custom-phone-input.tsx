
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Liste des pays avec leurs drapeaux, noms et indicatifs
const countries = [
  { code: 'FR', flag: '🇫🇷', name: 'France', dialCode: '+33' },
  { code: 'US', flag: '🇺🇸', name: 'États-Unis', dialCode: '+1' },
  { code: 'GB', flag: '🇬🇧', name: 'Royaume-Uni', dialCode: '+44' },
  { code: 'DE', flag: '🇩🇪', name: 'Allemagne', dialCode: '+49' },
  { code: 'ES', flag: '🇪🇸', name: 'Espagne', dialCode: '+34' },
  { code: 'IT', flag: '🇮🇹', name: 'Italie', dialCode: '+39' },
  { code: 'BE', flag: '🇧🇪', name: 'Belgique', dialCode: '+32' },
  { code: 'CH', flag: '🇨🇭', name: 'Suisse', dialCode: '+41' },
  { code: 'CA', flag: '🇨🇦', name: 'Canada', dialCode: '+1' },
  { code: 'AU', flag: '🇦🇺', name: 'Australie', dialCode: '+61' },
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
            <span 
              className="text-lg leading-none" 
              style={{ 
                fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, serif',
                fontSize: '18px'
              }}
            >
              {selectedCountry.flag}
            </span>
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
                    <span 
                      className="text-lg"
                      style={{ 
                        fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, serif',
                        fontSize: '18px'
                      }}
                    >
                      {country.flag}
                    </span>
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
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
          {selectedCountry.dialCode}
        </div>
      </div>
    </div>
  );
};
