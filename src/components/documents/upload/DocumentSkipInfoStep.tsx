import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

interface DocumentSkipInfoStepProps {
  step: number;
  totalSteps: number;
  availableDocuments: string[];
  onNext: () => void;
  onBack: () => void;
}

export default function DocumentSkipInfoStep({
  step,
  totalSteps,
  availableDocuments,
  onNext,
  onBack
}: DocumentSkipInfoStepProps) {
  const hasDriverLicense = availableDocuments.includes('driver_license_front') && availableDocuments.includes('driver_license_back');
  const hasRegistration = availableDocuments.includes('registration_front') && availableDocuments.includes('registration_back');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Étape {step} sur {totalSteps}</span>
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < step ? 'bg-karrosserie-orange' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Documents déjà enregistrés
          </h1>
          <p className="text-muted-foreground">
            Certains de vos documents sont déjà dans notre système et seront automatiquement utilisés.
          </p>
        </div>

        {/* Available documents list */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Documents disponibles :
          </h3>
          <div className="space-y-3">
            {hasDriverLicense && (
              <div className="flex items-center gap-3 text-green-700">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Permis de conduire (recto et verso)</span>
              </div>
            )}
            {hasRegistration && (
              <div className="flex items-center gap-3 text-green-700">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Carte grise (recto et verso)</span>
              </div>
            )}
          </div>
          <p className="text-green-600 text-sm mt-4 font-medium">
            ✅ Ces documents seront automatiquement inclus dans votre dossier.
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            Retour
          </Button>

          <Button
            onClick={onNext}
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white flex items-center gap-2"
          >
            Continuer
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}