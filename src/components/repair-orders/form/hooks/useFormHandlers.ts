
export const useFormHandlers = (
  isReadOnly: boolean,
  setFormData: any,
  setClaimNumber: any,
  clearFieldError: any,
  errors: Record<string, string>
) => {
  const handleChange = (field: string, value: any) => {
    if (isReadOnly && field !== 'status') {
      return;
    }
    
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    clearFieldError(field, errors);
  };

  const handleClaimNumberChange = (value: string) => {
    if (!isReadOnly) {
      setClaimNumber(value);
      clearFieldError('claim_number', errors);
    }
  };

  return {
    handleChange,
    handleClaimNumberChange
  };
};
