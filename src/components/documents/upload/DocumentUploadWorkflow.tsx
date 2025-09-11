import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import DocumentUploadStep from "./DocumentUploadStep";

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
  onComplete: (documents: { [key: string]: File }) => void;
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

  // Filtrer les étapes selon les documents manquants
  const documentSteps = useMemo(() => {
    return ALL_DOCUMENT_STEPS.filter(step => missingDocuments.includes(step.key));
  }, [missingDocuments]);

  // Si aucun document n'est manquant, retourner un message de confirmation
  if (documentSteps.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center space-y-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Tous vos documents sont déjà enregistrés
          </h1>
          <p className="text-muted-foreground">
            Nous avons déjà tous les documents nécessaires pour traiter votre dossier.
          </p>
          <Button 
            type="button"
            onClick={onBack}
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white px-6 py-2 rounded-md"
          >
            Retour
          </Button>
        </div>
      </div>
    );
  }

  const handleNext = (file: File) => {
    const stepKey = documentSteps[currentStep].key;
    const updatedDocuments = { ...documents, [stepKey]: file };
    setDocuments(updatedDocuments);

    if (currentStep < documentSteps.length - 1) {
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
      totalSteps={documentSteps.length}
      title={documentSteps[currentStep].title}
      description={documentSteps[currentStep].description}
      documentType={documentSteps[currentStep].documentType}
      onNext={handleNext}
      onBack={handleBack}
      onImageUpload={handleImageUpload}
    />
  );
}