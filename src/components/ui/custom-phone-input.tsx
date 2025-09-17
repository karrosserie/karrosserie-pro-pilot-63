
import React, { useState, useEffect } from 'react';
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
  onValidationChange?: (isValid: boolean) => void;
}

export const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  value = '',
  onChange,
  placeholder = "Numéro de téléphone",
  disabled = false,
  className,
  defaultCountry = "FR",
  onValidationChange
}) => {
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find(country => country.code === defaultCountry) || countries[0]
  );
  const [phoneNumber, setPhoneNumber] = useState('');
  const [open, setOpen] = useState(false);

  // Validation française : 9 chiffres commençant par 6 ou 7
  const validateFrenchMobile = (phoneNumber: string, countryCode: string): boolean => {
    if (countryCode !== 'FR') return true; // Pas de validation pour les autres pays
    if (!phoneNumber) return true; // Champ vide accepté
    
    // Nettoyer le numéro (enlever espaces, points, tirets)
    const cleanNumber = phoneNumber.replace(/[\s.-]/g, '');
    
    // Vérifier : exactement 9 chiffres et commence par 6 ou 7
    const frenchMobileRegex = /^[67]\d{8}$/;
    return frenchMobileRegex.test(cleanNumber);
  };

  // Effet pour analyser la valeur initiale
  useEffect(() => {
    if (value) {
      // Trouver le pays correspondant à l'indicatif dans la valeur
      const matchingCountry = countries.find(country => value.startsWith(country.dialCode));
      if (matchingCountry) {
        setSelectedCountry(matchingCountry);
        const extractedNumber = value.substring(matchingCountry.dialCode.length);
        setPhoneNumber(extractedNumber);
        
        // Valider le numéro initial
        const isValid = validateFrenchMobile(extractedNumber, matchingCountry.code);
        onValidationChange?.(isValid);
      } else {
        // Si aucun indicatif trouvé, utiliser la valeur complète comme numéro
        setPhoneNumber(value);
        const isValid = validateFrenchMobile(value, selectedCountry.code);
        onValidationChange?.(isValid);
      }
    } else {
      setPhoneNumber('');
      onValidationChange?.(true); // Champ vide = valide
    }
  }, [value, onValidationChange]);

  const handleCountrySelect = (country: typeof countries[0]) => {
    setSelectedCountry(country);
    setOpen(false);
    // Mettre à jour la valeur complète
    const fullNumber = phoneNumber ? `${country.dialCode}${phoneNumber}` : country.dialCode;
    onChange(fullNumber);
    
    // Valider avec le nouveau pays
    const isValid = validateFrenchMobile(phoneNumber, country.code);
    onValidationChange?.(isValid);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value;
    setPhoneNumber(number);
    // Mettre à jour la valeur complète
    const fullNumber = number ? `${selectedCountry.dialCode}${number}` : selectedCountry.dialCode;
    onChange(fullNumber);
    
    // Valider le numéro français
    const isValid = validateFrenchMobile(number, selectedCountry.code);
    onValidationChange?.(isValid);
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
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
          {selectedCountry.dialCode}
        </div>
      </div>
    </div>
  );
};
