import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface AutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  className?: string
  disabled?: boolean
  readOnly?: boolean
}

// Optimized AutocompleteInput with debounce and memoization
export const AutocompleteInput = React.memo(function AutocompleteInput({
  value,
  onChange,
  options,
  placeholder = "Saisir...",
  className,
  disabled = false,
  readOnly = false,
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const [localValue, setLocalValue] = React.useState(value)
  const [debouncedValue, setDebouncedValue] = React.useState(value)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Sync local value with prop value when it changes externally
  React.useEffect(() => {
    setLocalValue(value)
    setDebouncedValue(value)
  }, [value])

  // Debounce filtering - wait 150ms after typing stops
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(localValue)
    }, 150)
    return () => clearTimeout(timer)
  }, [localValue])

  // Memoized filtered options based on debounced value
  const filteredOptions = React.useMemo(() => {
    if (!debouncedValue.trim()) return options.slice(0, 10)
    const lowerValue = debouncedValue.toLowerCase()
    return options.filter((option) =>
      option.toLowerCase().includes(lowerValue)
    ).slice(0, 15)
  }, [debouncedValue, options])

  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange(newValue)
    setIsOpen(true)
    setHighlightedIndex(-1)
  }, [onChange])

  const handleSelect = React.useCallback((option: string) => {
    setLocalValue(option)
    onChange(option)
    setIsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }, [onChange])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredOptions.length === 0) {
      if (e.key === 'ArrowDown' && filteredOptions.length > 0) {
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
      case 'Tab':
        setIsOpen(false)
        break
    }
  }, [isOpen, filteredOptions, highlightedIndex, handleSelect])

  const handleFocus = React.useCallback(() => {
    setIsOpen(true)
  }, [])

  // Use a single click outside handler with container ref
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    
    // Only add listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Scroll vers l'élément surligné
  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement
      if (item) {
        item.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex])

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        readOnly={readOnly}
      />
      {isOpen && filteredOptions.length > 0 && !disabled && !readOnly && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border bg-popover shadow-lg"
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={cn(
                "px-3 py-2 cursor-pointer text-sm",
                index === highlightedIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted"
              )}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for React.memo - only re-render when these props change
  return (
    prevProps.value === nextProps.value &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.readOnly === nextProps.readOnly &&
    prevProps.className === nextProps.className &&
    prevProps.placeholder === nextProps.placeholder &&
    prevProps.options === nextProps.options
  )
})
