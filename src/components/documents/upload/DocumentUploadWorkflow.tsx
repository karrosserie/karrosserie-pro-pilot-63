import { useState } from "react";
import DocumentUploadStep from "./DocumentUploadStep";

const DOCUMENT_STEPS = [
  {
    title: "Permis de conduire (recto)",
    description: "Veuillez photographier le recto de votre permis de conduire",
    documentType: "driver-license"
  },
  {
    title: "Permis de conduire (verso)",
    description: "Veuillez photographier le verso de votre permis de conduire",
    documentType: "driver-license"
  },
  {
    title: "Carte grise (recto)",
    description: "Veuillez photographier le recto de votre carte grise",
    documentType: "vehicle-registration"
  },
  {
    title: "Carte grise (verso)",
    description: "Veuillez photographier le verso de votre carte grise",
    documentType: "vehicle-registration"
  }
];

interface DocumentUploadWorkflowProps {
  onBack: () => void;
  onComplete: (documents: { [key: string]: File }) => void;
}

export default function DocumentUploadWorkflow({ onBack, onComplete }: DocumentUploadWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [documents, setDocuments] = useState<{ [key: string]: File }>({});

  const handleNext = (file: File) => {
    const stepKey = `step_${currentStep}`;
    const updatedDocuments = { ...documents, [stepKey]: file };
    setDocuments(updatedDocuments);

    if (currentStep < DOCUMENT_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(updatedDocuments);
    }
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

  return (
    <DocumentUploadStep
      key={currentStep}
      step={currentStep + 1}
      totalSteps={DOCUMENT_STEPS.length}
      title={DOCUMENT_STEPS[currentStep].title}
      description={DOCUMENT_STEPS[currentStep].description}
      documentType={DOCUMENT_STEPS[currentStep].documentType}
      onNext={handleNext}
      onBack={handleBack}
      onImageUpload={handleImageUpload}
    />
  );
}