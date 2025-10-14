import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import DocumentUploadStep from "./DocumentUploadStep";
import WhatsAppConsentStep from "./WhatsAppConsentStep";
import DocumentSkipInfoStep from "./DocumentSkipInfoStep";

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
  availableDocuments: string[];
  tokenData: {
    client_id: string | null;
    vehicule_id: string | null;
  } | null;
}

export default function DocumentUploadWorkflow({
  onBack,
  onComplete,
  missingDocuments,
  availableDocuments,
  tokenData
}: DocumentUploadWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [documents, setDocuments] = useState<{ [key: string]: File }>({});
  const [documentBlobs, setDocumentBlobs] = useState<{ [key: string]: ArrayBuffer }>({});
  const [whatsappConsent, setWhatsappConsent] = useState<boolean | null>(null);

  // Filtrer les étapes selon les documents manquants
  const documentSteps = useMemo(() => {
    return ALL_DOCUMENT_STEPS.filter(step => missingDocuments.includes(step.key));
  }, [missingDocuments]);

  // Calculer le nombre total d'étapes (info skip + documents + WhatsApp)
  const hasSkippedDocuments = availableDocuments.length > 0;
  const totalSteps = documentSteps.length + 1 + (hasSkippedDocuments ? 1 : 0);

  // Si aucun document n'est manquant, mais qu'il y a des documents disponibles, afficher l'info puis WhatsApp
  if (documentSteps.length === 0 && hasSkippedDocuments) {
    if (currentStep === 0) {
      return (
        <DocumentSkipInfoStep
          step={1}
          totalSteps={2}
          availableDocuments={availableDocuments}
          onNext={() => setCurrentStep(1)}
          onBack={onBack}
        />
      );
    } else {
      return (
        <WhatsAppConsentStep
          step={2}
          totalSteps={2}
          onNext={(consent) => onComplete({}, consent)}
          onBack={() => setCurrentStep(0)}
        />
      );
    }
  }

  // Si aucun document n'est manquant et aucun document disponible, afficher directement l'étape WhatsApp
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

  const handleNext = async (file: File) => {
    const adjustedStep = hasSkippedDocuments ? currentStep - 1 : currentStep;
    const stepKey = documentSteps[adjustedStep].key;
    
    console.log(`[UPLOAD DEBUG] handleNext called for ${stepKey}`, {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileValid: file instanceof File,
      fileLastModified: file.lastModified
    });
    
    try {
      // Lire le fichier comme arrayBuffer pour garantir sa validité
      const arrayBuffer = await file.arrayBuffer();
      console.log(`[UPLOAD DEBUG] ArrayBuffer read for ${stepKey}:`, {
        bufferSize: arrayBuffer.byteLength
      });
      
      // Stocker l'arrayBuffer au lieu du Blob
      const updatedDocuments = { ...documents, [stepKey]: file };
      const updatedBlobs = { ...documentBlobs, [stepKey]: arrayBuffer };
      
      setDocuments(updatedDocuments);
      setDocumentBlobs(updatedBlobs);
      
      console.log(`[UPLOAD DEBUG] File saved for ${stepKey}:`, { 
        name: file.name, 
        size: file.size, 
        type: file.type,
        bufferSize: arrayBuffer.byteLength 
      });
    } catch (error) {
      console.error(`[UPLOAD DEBUG] Error reading file for ${stepKey}:`, error);
      alert(`Erreur lors de la lecture du fichier: ${error.message}`);
      return;
    }

    if (adjustedStep < documentSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tous les documents sont uploadés, passer à l'étape WhatsApp
      setCurrentStep(currentStep + 1);
    }
  };

  const handleWhatsAppConsent = (consent: boolean) => {
    setWhatsappConsent(consent);
    
    console.log('[UPLOAD DEBUG] handleWhatsAppConsent called', {
      consent,
      documentBlobsKeys: Object.keys(documentBlobs),
      documentsKeys: Object.keys(documents)
    });
    
    // Recréer les File objects à partir des ArrayBuffers pour garantir leur validité
    const validDocuments: { [key: string]: File } = {};
    Object.keys(documentBlobs).forEach(key => {
      const originalFile = documents[key];
      const arrayBuffer = documentBlobs[key];
      
      console.log(`[UPLOAD DEBUG] Recreating file for ${key}:`, {
        originalFileName: originalFile.name,
        originalFileType: originalFile.type,
        bufferSize: arrayBuffer.byteLength
      });
      
      validDocuments[key] = new File([arrayBuffer], originalFile.name, { 
        type: originalFile.type,
        lastModified: Date.now()
      });
      
      console.log(`[UPLOAD DEBUG] Recreated file for ${key}:`, {
        name: validDocuments[key].name,
        size: validDocuments[key].size,
        type: validDocuments[key].type
      });
    });
    
    console.log('[UPLOAD DEBUG] Final documents to upload:', {
      keys: Object.keys(validDocuments),
      sizes: Object.keys(validDocuments).map(key => ({ 
        key, 
        size: validDocuments[key].size 
      }))
    });
    
    onComplete(validDocuments, consent);
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

  // Étape d'information sur les documents sautés (première étape si il y en a)
  if (hasSkippedDocuments && currentStep === 0) {
    return (
      <DocumentSkipInfoStep
        step={1}
        totalSteps={totalSteps}
        availableDocuments={availableDocuments}
        onNext={() => setCurrentStep(1)}
        onBack={onBack}
      />
    );
  }

  // Calculer l'étape ajustée pour les documents
  const adjustedStep = hasSkippedDocuments ? currentStep - 1 : currentStep;

  // Vérifier si nous sommes à l'étape WhatsApp (après tous les documents)
  if (adjustedStep >= documentSteps.length) {
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
      title={documentSteps[adjustedStep].title}
      description={documentSteps[adjustedStep].description}
      documentType={documentSteps[adjustedStep].documentType}
      onNext={handleNext}
      onBack={handleBack}
      onImageUpload={handleImageUpload}
    />
  );
}