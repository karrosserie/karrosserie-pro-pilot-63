
export const useFormHandlers = (
  isReadOnly: boolean,
  setFormData: any,
  setDescription: any,
  setClaimNumber: any,
  setCurrentMileage: any,
  clearFieldError: any,
  errors: Record<string, string>
) => {
  const handleChange = (field: string, value: any) => {
    if (isReadOnly && field !== 'status') {
      return;
    }
    
    if (field === 'description') {
      setDescription(value);
    } else {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
      console.log(`Field ${field} changed to:`, value);
    }
    
    clearFieldError(field, errors);
  };

  const handleClaimNumberChange = (value: string) => {
    if (!isReadOnly) {
      setClaimNumber(value);
      console.log('Claim number changed to:', value);
      clearFieldError('claim_number', errors);
    }
  };

  const handleCurrentMileageChange = (value: string) => {
    if (!isReadOnly) {
      setCurrentMileage(value);
      console.log('Current mileage changed to:', value);
      clearFieldError('current_mileage', errors);
    }
  };

  return {
    handleChange,
    handleClaimNumberChange,
    handleCurrentMileageChange
  };
};
