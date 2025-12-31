
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

    // Nom de la compagnie toujours obligatoire
    const companyNameValid = !!formData.insuranceCompanyName;

    // Email conditionnel selon le switch assistance
    const emailValid = formData.hasAssistance 
      ? !!formData.assistanceEmail        // Si assistance → email assistance requis
      : !!formData.insuranceEmail;        // Sinon → email assurance requis

    const mandatoryInsuranceValid = companyNameValid && emailValid;

    // Champs obligatoires uniquement si clientInsurance = true
    const conditionalInsuranceValid = !formData.clientInsurance || (
      formData.insurancePhone &&
      formData.insuranceContractNumber &&
      formData.insuranceAddress &&
      formData.insuranceCity &&
      formData.insurancePostalCode
    );

    const insuranceValid = mandatoryInsuranceValid && conditionalInsuranceValid;

    return basicValid && insuranceValid;
  };

  return { isFormValid };
};
