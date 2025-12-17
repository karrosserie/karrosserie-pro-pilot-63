import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ComboboxProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
}

export function Combobox({
  value,
  onChange,
  options,
  placeholder = "Sélectionner une option...",
  emptyMessage = "Aucune option trouvée.",
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value)
  const [debouncedInputValue, setDebouncedInputValue] = React.useState(value)
  const onChangeRef = React.useRef(onChange)
  onChangeRef.current = onChange

  React.useEffect(() => {
    // Empêcher la mise à jour si les valeurs sont identiques (évite boucle infinie)
    if (inputValue !== value) {
      setInputValue(value)
    }
    if (debouncedInputValue !== value) {
      setDebouncedInputValue(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // Debounce filtering for performance
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInputValue(inputValue)
    }, 150)
    return () => clearTimeout(timer)
  }, [inputValue])

  const handleSelect = React.useCallback((selectedValue: string) => {
    onChangeRef.current(selectedValue)
    setInputValue(selectedValue)
    setDebouncedInputValue(selectedValue)
    setOpen(false)
  }, [])

  const handleInputChange = React.useCallback((newValue: string) => {
    setInputValue(newValue)
    onChangeRef.current(newValue)
    // Ouvrir automatiquement le popover quand l'utilisateur tape
    if (newValue.length > 0) {
      setOpen(true)
    }
  }, [])

  const filteredOptions = React.useMemo(() => 
    options.filter((option) =>
      option.toLowerCase().includes(debouncedInputValue.toLowerCase())
    ),
    [options, debouncedInputValue]
  )

  const showOptions = filteredOptions.length > 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !inputValue && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              // Ouvrir le popover au focus si il y a des options
              if (options.length > 0) {
                setOpen(true)
              }
            }}
            onKeyDown={(e) => {
              // Empêcher l'espace de déclencher le bouton parent (click natif)
              if (e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                // Insérer manuellement l'espace dans l'input
                const input = e.currentTarget;
                const start = input.selectionStart || 0;
                const end = input.selectionEnd || 0;
                const newValue = inputValue.slice(0, start) + ' ' + inputValue.slice(end);
                handleInputChange(newValue);
                // Repositionner le curseur après l'espace
                setTimeout(() => {
                  input.setSelectionRange(start + 1, start + 1);
                }, 0);
              }
              // Fermer avec Escape
              if (e.key === 'Escape') {
                setOpen(false);
              }
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-0 outline-none text-left"
            disabled={disabled}
          />
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <ScrollArea className="max-h-80">
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              {showOptions && (
                <CommandGroup>
                  {filteredOptions.slice(0, 20).map((option) => (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={() => handleSelect(option)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          inputValue === option ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option}
                    </CommandItem>
                  ))}
                  {filteredOptions.length > 20 && (
                    <div className="px-2 py-1.5 text-xs text-muted-foreground text-center">
                      +{filteredOptions.length - 20} autres résultats...
                    </div>
                  )}
                </CommandGroup>
              )}
            </CommandList>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
