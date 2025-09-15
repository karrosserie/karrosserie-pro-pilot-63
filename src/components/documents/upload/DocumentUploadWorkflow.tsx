import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import DocumentUploadStep from "./DocumentUploadStep";
import WhatsAppConsentStep from "./WhatsAppConsentStep";

const ALL_DOCUMENT_STEPS = [
  {
    title: "Permis de conduire (recto)",
    description: "Veuillez photographier le recto de votre permis de conduire",
    documentType: "driver-license",
    key: "driver_license_front"
  },
  {
    title: "Permis de conduire (verso)",
    description: "Veuillez photographier le verso de votre permis de conduire",
    documentType: "driver-license",
    key: "driver_license_back"
  },
  {
    title: "Carte grise (recto)",
    description: "Veuillez photographier le recto de votre carte grise",
    documentType: "vehicle-registration",
    key: "registration_front"
  },
  {
    title: "Carte grise (verso)",
    description: "Veuillez photographier le verso de votre carte grise",
    documentType: "vehicle-registration",
    key: "registration_back"
  }
];

interface DocumentUploadWorkflowProps {
  onBack: () => void;
  onComplete: (documents: { [key: string]: File }, whatsappConsent: boolean) => void;
  missingDocuments: string[];
  tokenData: {
    client_id: string | null;
    vehicule_id: string | null;
  } | null;
}

export default function DocumentUploadWorkflow({ 
  onBack, 
  onComplete, 
  missingDocuments, 
  tokenData 
}: DocumentUploadWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [documents, setDocuments] = useState<{ [key: string]: File }>({});
  const [whatsappConsent, setWhatsappConsent] = useState<boolean | null>(null);

  // Filtrer les étapes selon les documents manquants
  const documentSteps = useMemo(() => {
    return ALL_DOCUMENT_STEPS.filter(step => missingDocuments.includes(step.key));
  }, [missingDocuments]);

  // Calculer le nombre total d'étapes (documents + WhatsApp)
  const totalSteps = documentSteps.length + 1;

  // Si aucun document n'est manquant, afficher directement l'étape WhatsApp
  if (documentSteps.length === 0) {
    return (
      <WhatsAppConsentStep
        step={1}
        totalSteps={1}
        onNext={(consent) => onComplete({}, consent)}
        onBack={onBack}
      />
    );
  }

  const handleNext = (file: File) => {
    const stepKey = documentSteps[currentStep].key;
    const updatedDocuments = { ...documents, [stepKey]: file };
    setDocuments(updatedDocuments);

    if (currentStep < documentSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tous les documents sont uploadés, passer à l'étape WhatsApp
      setCurrentStep(currentStep + 1);
    }
  };

  const handleWhatsAppConsent = (consent: boolean) => {
    setWhatsappConsent(consent);
    onComplete(documents, consent);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleImageUpload = (file: File) => {
    // Handle immediate image upload if needed
    console.log("Image uploaded:", file.name);
  };

  // Vérifier si nous sommes à l'étape WhatsApp (après tous les documents)
  if (currentStep >= documentSteps.length) {
    return (
      <WhatsAppConsentStep
        step={currentStep + 1}
        totalSteps={totalSteps}
        onNext={handleWhatsAppConsent}
        onBack={handleBack}
      />
    );
  }

  return (
    <DocumentUploadStep
      key={currentStep}
      step={currentStep + 1}
      totalSteps={totalSteps}
      title={documentSteps[currentStep].title}
      description={documentSteps[currentStep].description}
      documentType={documentSteps[currentStep].documentType}
      onNext={handleNext}
      onBack={handleBack}
      onImageUpload={handleImageUpload}
    />
  );
}