import { useState, useCallback } from 'react';

interface UseAmountInputProps {
  value: number | string;
  onChange: (value: number) => void;
  defaultValue?: number;
}

export const useAmountInput = ({ value, onChange, defaultValue = 0 }: UseAmountInputProps) => {
  const [displayValue, setDisplayValue] = useState<string>(String(value || defaultValue));
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    const currentValue = e.target.value;
    // Si la valeur est "0" ou vide, vider le champ
    if (currentValue === '0' || currentValue === '' || parseFloat(currentValue) === 0) {
      setDisplayValue('');
    }
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    const currentValue = e.target.value;
    // Si le champ est vide, remettre la valeur par défaut
    if (currentValue === '' || currentValue === null || currentValue === undefined) {
      const finalValue = defaultValue;
      setDisplayValue(String(finalValue));
      onChange(finalValue);
    } else {
      const numValue = parseFloat(currentValue) || 0;
      onChange(numValue);
    }
  }, [defaultValue, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    
    // Mettre à jour la valeur immédiatement si elle est valide
    if (newValue !== '' && newValue !== null && newValue !== undefined) {
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue)) {
        onChange(numValue);
      }
    }
  }, [onChange]);

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
