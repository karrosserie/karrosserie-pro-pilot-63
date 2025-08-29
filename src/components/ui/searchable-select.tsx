
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
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
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Sélectionner...",
  disabled = false,
  className,
  searchPlaceholder = "Rechercher..."
}) => {
  const [open, setOpen] = useState(false);
  
  // Find the selected option
  const selectedOption = options.find(option => option.value === value);

  console.log('SearchableSelect - Render with:');
  console.log('  - options count:', options.length);
  console.log('  - value:', value);
  console.log('  - selectedOption:', selectedOption);
  console.log('  - disabled:', disabled);

  const handleSelect = (selectedValue: string) => {
    console.log('SearchableSelect - handleSelect called with selectedValue:', selectedValue);
    console.log('SearchableSelect - current value:', value);
    console.log('SearchableSelect - onValueChange function:', typeof onValueChange);
    
    setOpen(false);
    
    if (selectedValue !== value) {
      console.log('SearchableSelect - Calling onValueChange with:', selectedValue);
      onValueChange(selectedValue);
    } else {
      console.log('SearchableSelect - Same value selected, no change needed');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-[100] bg-background shadow-lg border rounded-md min-w-[var(--radix-popover-trigger-width)]" align="start" sideOffset={4}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                console.log('SearchableSelect - Rendering option:', option);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      console.log('SearchableSelect - CommandItem onSelect triggered for:', option);
                      handleSelect(option.value);
                    }}
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
