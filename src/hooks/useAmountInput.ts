import { useState, useCallback, useRef } from 'react';

interface UseAmountInputProps {
  value: number | string;
  onChange: (value: number) => void;
  defaultValue?: number;
}

export const useAmountInput = ({ value, onChange, defaultValue = 0 }: UseAmountInputProps) => {
  const [displayValue, setDisplayValue] = useState<string>(String(value || defaultValue));
  const [isFocused, setIsFocused] = useState(false);
  
  // Use ref to avoid re-renders when onChange changes
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    const currentValue = e.target.value;
    const numericValue = parseFloat(currentValue);
    
    // Ne vider le champ QUE si la valeur est exactement 0 ou vide
    // Si la valeur est différente de 0, la conserver pour édition manuelle
    if (currentValue === '' || (numericValue === 0 && !isNaN(numericValue))) {
      setDisplayValue('');
    } else {
      setDisplayValue(currentValue);
    }
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    const currentValue = e.target.value;
    // Si le champ est vide, remettre la valeur par défaut
    if (currentValue === '' || currentValue === null || currentValue === undefined) {
      const finalValue = defaultValue;
      setDisplayValue(String(finalValue));
      onChangeRef.current(finalValue);
    } else {
      const numValue = parseFloat(currentValue) || 0;
      onChangeRef.current(numValue);
    }
  }, [defaultValue]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    
    // Mettre à jour la valeur immédiatement si elle est valide
    if (newValue !== '' && newValue !== null && newValue !== undefined) {
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue)) {
        onChangeRef.current(numValue);
      }
    }
  }, []);

  // Mettre à jour l'affichage quand la valeur externe change (mais pas pendant le focus)
  const updateDisplayValue = useCallback((newValue: number | string) => {
    if (!isFocused) {
      setDisplayValue(String(newValue || defaultValue));
    }
  }, [isFocused, defaultValue]);

  return {
    displayValue: isFocused ? displayValue : String(value || defaultValue),
    handleFocus,
    handleBlur,
    handleChange,
    updateDisplayValue
  };
};
