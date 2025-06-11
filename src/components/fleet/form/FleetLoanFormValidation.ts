
import { LoanFormData } from '../FleetLoanForm';

export const useFleetLoanFormValidation = (formData: LoanFormData) => {
  const isFormValid = () => {
    // Validation des dates - seulement si une date de fin est fournie
    const isDateValid = () => {
      if (!formData.expectedReturnDate) return true; // Date de fin optionnelle
      if (!formData.startDate) return false;
      return new Date(formData.expectedReturnDate) > new Date(formData.startDate);
    };

    const basicValid = formData.clientId && 
                      formData.startDate && 
                      isDateValid() &&
                      formData.driverLicenseFrontUrl &&
                      formData.driverLicenseBackUrl &&
                      formData.licenseNumber &&
                      formData.licenseIssueDate &&
                      formData.prefecture &&
                      formData.holderInfo &&
                      formData.dateOfBirth &&
                      formData.placeOfBirth &&
                      formData.attestationAccepted &&
                      formData.clientSignature && 
                      formData.clientSignature.trim() !== '';

    const insuranceValid = !formData.clientInsurance || (
      formData.insuranceCompanyName &&
      formData.insurancePhone &&
      formData.insuranceEmail &&
      formData.insuranceContractNumber &&
      formData.insuranceAddress &&
      formData.insuranceCity &&
      formData.insurancePostalCode
    );

    return basicValid && insuranceValid;
  };

  return { isFormValid };
};
