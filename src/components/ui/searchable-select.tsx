
"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchableSelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  searchPlaceholder?: string;
  allowFreeText?: boolean;
  onFreeTextChange?: (text: string) => void;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Sélectionner...",
  disabled = false,
  className,
  searchPlaceholder = "Rechercher ou saisir...",
  allowFreeText = false,
  onFreeTextChange
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Find the selected option
  const selectedOption = options.find(option => option.value === value);

  // Filter options based on input
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
    if (selectedOption && !allowFreeText) {
      setInputValue(selectedOption.label);
    } else if (allowFreeText && value && !selectedOption) {
      setInputValue(value);
    }
  }, [selectedOption, value, allowFreeText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (allowFreeText && onFreeTextChange) {
      onFreeTextChange(newValue);
    }
    
    if (!open) {
      setOpen(true);
    }
  };

  const handleSelectOption = (optionValue: string) => {
    const selectedOpt = options.find(opt => opt.value === optionValue);
    if (selectedOpt) {
      setInputValue(selectedOpt.label);
      onValueChange(optionValue);
    }
    setOpen(false);
  };

  const handleInputBlur = () => {
    // Si allowFreeText est activé et qu'il n'y a pas d'option correspondante exacte
    if (allowFreeText && inputValue && !options.find(opt => opt.label === inputValue)) {
      onValueChange(inputValue);
    }
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder={allowFreeText ? "Saisir ou sélectionner un client..." : placeholder}
              disabled={disabled}
              className={cn("pr-8", className)}
              onFocus={() => setOpen(true)}
            />
            <ChevronDown 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50 cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-[120] bg-background border rounded-md shadow-md" align="start" sideOffset={4}>
          <Command>
            <CommandList className="max-h-[200px] overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <CommandEmpty>
                  {allowFreeText 
                    ? "Aucun client trouvé. Vous pouvez saisir un nouveau nom." 
                    : "Aucun résultat trouvé."
                  }
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelectOption(option.value)}
                      className="cursor-pointer"
                    >
                      {option.label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
