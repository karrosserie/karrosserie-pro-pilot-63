import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import DocumentUploadStep from "./DocumentUploadStep";
import WhatsAppConsentStep from "./WhatsAppConsentStep";
import InsuranceRepresentationConsentStep from "./InsuranceRepresentationConsentStep";
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
  },
  {
    title: "Carte verte d'assurance",
    description: "Veuillez photographier votre carte verte d'assurance véhicule",
    documentType: "insurance",
    key: "insurance_card"
  },
  {
    title: "Constat amiable",
    description: "Veuillez photographier votre constat amiable d'accident",
    documentType: "constat",
    key: "constat"
  }
];

interface DocumentUploadWorkflowProps {
  onBack: () => void;
  onComplete: (
    documents: { [key: string]: File }, 
    whatsappConsent: boolean,
    insuranceRepresentationConsent: boolean
  ) => void;
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
  const [insuranceConsent, setInsuranceConsent] = useState<boolean | null>(null);

  // Filtrer les étapes selon les documents manquants
  const documentSteps = useMemo(() => {
    return ALL_DOCUMENT_STEPS.filter(step => missingDocuments.includes(step.key));
  }, [missingDocuments]);

  // Calculer le nombre total d'étapes (info skip + documents + WhatsApp + Insurance consent)
  const hasSkippedDocuments = availableDocuments.length > 0;
  // 2 étapes de consentement : WhatsApp + Insurance
  const totalSteps = documentSteps.length + 2 + (hasSkippedDocuments ? 1 : 0);

  // Si aucun document n'est manquant, mais qu'il y a des documents disponibles, afficher l'info puis les consentements
  if (documentSteps.length === 0 && hasSkippedDocuments) {
    if (currentStep === 0) {
      return (
        <DocumentSkipInfoStep
          step={1}
          totalSteps={3}
          availableDocuments={availableDocuments}
          onNext={() => setCurrentStep(1)}
          onBack={onBack}
        />
      );
    } else if (currentStep === 1) {
      return (
        <WhatsAppConsentStep
          step={2}
          totalSteps={3}
          onNext={(consent) => {
            setWhatsappConsent(consent);
            setCurrentStep(2);
          }}
          onBack={() => setCurrentStep(0)}
        />
      );
    } else {
      return (
        <InsuranceRepresentationConsentStep
          step={3}
          totalSteps={3}
          onNext={(consent) => onComplete({}, whatsappConsent ?? false, consent)}
          onBack={() => setCurrentStep(1)}
        />
      );
    }
  }

  // Si aucun document n'est manquant et aucun document disponible, afficher les étapes de consentement
  if (documentSteps.length === 0) {
    if (currentStep === 0) {
      return (
        <WhatsAppConsentStep
          step={1}
          totalSteps={2}
          onNext={(consent) => {
            setWhatsappConsent(consent);
            setCurrentStep(1);
          }}
          onBack={onBack}
        />
      );
    } else {
      return (
        <InsuranceRepresentationConsentStep
          step={2}
          totalSteps={2}
          onNext={(consent) => onComplete({}, whatsappConsent ?? false, consent)}
          onBack={() => setCurrentStep(0)}
        />
      );
    }
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
    // Passer à l'étape Insurance consent
    setCurrentStep(currentStep + 1);
  };

  const handleInsuranceConsent = (consent: boolean) => {
    setInsuranceConsent(consent);
    
    console.log('[UPLOAD DEBUG] handleInsuranceConsent called', {
      insuranceConsent: consent,
      whatsappConsent,
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
    
    onComplete(validDocuments, whatsappConsent ?? false, consent);
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
  if (adjustedStep === documentSteps.length) {
    return (
      <WhatsAppConsentStep
        step={currentStep + 1}
        totalSteps={totalSteps}
        onNext={handleWhatsAppConsent}
        onBack={handleBack}
      />
    );
  }

  // Vérifier si nous sommes à l'étape Insurance consent (après WhatsApp)
  if (adjustedStep === documentSteps.length + 1) {
    return (
      <InsuranceRepresentationConsentStep
        step={currentStep + 1}
        totalSteps={totalSteps}
        onNext={handleInsuranceConsent}
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
